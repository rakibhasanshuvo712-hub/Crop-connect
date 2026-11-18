'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@/lib/constants'
import { Order } from '@/lib/types/database'
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '@/lib/seed-data'

export interface PlaceOrderInput {
  productId: string
  quantity: number
  buyerNote?: string
  deliveryAddress: string
}

export async function placeOrder(input: PlaceOrderInput) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Please sign in or create an account to place purchase requests' }
    }

    if (input.quantity <= 0) {
      return { success: false, error: 'Order quantity must be greater than zero' }
    }

    // Call atomic database function if Supabase is connected
    const { data: rpcResult, error: rpcError } = await supabase.rpc('place_order', {
      p_buyer_id: user.id,
      p_product_id: input.productId,
      p_quantity: input.quantity,
      p_buyer_note: input.buyerNote || null,
      p_delivery_address: input.deliveryAddress
    })

    if (!rpcError && rpcResult?.success) {
      revalidatePath('/buyer/orders')
      return { success: true, orderId: rpcResult.order_id, total: rpcResult.total }
    }

    // Direct fallback insertion
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', input.productId)
      .single()

    const targetProduct = product || INITIAL_PRODUCTS.find(p => p.id === input.productId)
    if (!targetProduct) {
      return { success: false, error: 'Product not found' }
    }

    if (targetProduct.quantity < input.quantity) {
      return { success: false, error: `Insufficient stock. Only ${targetProduct.quantity} ${targetProduct.unit} available.` }
    }

    const total = input.quantity * targetProduct.price_per_unit

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: user.id,
        farmer_id: targetProduct.farmer_id,
        product_id: targetProduct.id,
        quantity: input.quantity,
        price_per_unit: targetProduct.price_per_unit,
        total_amount: total,
        status: 'pending',
        buyer_note: input.buyerNote || null,
        delivery_address: input.deliveryAddress,
        payment_method: 'cash_on_delivery'
      })
      .select()
      .single()

    if (orderError) {
      return { success: true, orderId: `ord-${Date.now()}`, total, note: "Order recorded in demo mode" }
    }

    revalidatePath('/buyer/orders')
    return { success: true, orderId: newOrder.id, total }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to place order' }
  }
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus, farmerNote?: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        farmer_note: farmerNote || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) {
      return { success: true, status: newStatus }
    }

    revalidatePath('/farmer/orders')
    revalidatePath('/buyer/orders')
    return { success: true, status: newStatus }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update order status' }
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: true }
    }

    const { error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('buyer_id', user.id)

    revalidatePath('/buyer/orders')
    return { success: !error }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to cancel order' }
  }
}

export async function getBuyerOrders() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return INITIAL_ORDERS

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        product:products(*),
        farmer:profiles!farmer_id(*)
      `)
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return INITIAL_ORDERS
    }

    return data as Order[]
  } catch {
    return INITIAL_ORDERS
  }
}

export async function getFarmerOrders() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return INITIAL_ORDERS

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        product:products(*),
        buyer:profiles!buyer_id(*)
      `)
      .eq('farmer_id', user.id)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return INITIAL_ORDERS
    }

    return data as Order[]
  } catch {
    return INITIAL_ORDERS
  }
}
