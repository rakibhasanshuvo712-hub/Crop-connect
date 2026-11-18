/**
 * CropConnect Automated QA Test Suite: Orders & Inventory Lifecycle
 */
import { placeOrder, updateOrderStatus, cancelOrder } from '../src/lib/actions/orders'
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../src/lib/seed-data'

export async function runOrderTests(): Promise<{ name: string; passed: boolean; error?: string }[]> {
  const results: { name: string; passed: boolean; error?: string }[] = []

  const targetProduct = INITIAL_PRODUCTS[0]
  const initialStock = targetProduct.quantity

  // Test 1: Negative Quantity Validation
  try {
    const res = await placeOrder({
      productId: targetProduct.id,
      quantity: -5,
      deliveryAddress: 'Dhaka Wholesale Market, Kawran Bazar'
    })
    if (res.success || !res.error?.includes('greater than zero')) {
      throw new Error(`Negative quantity should be rejected: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'Order Validation: Negative quantity rejected', passed: true })
  } catch (err: any) {
    results.push({ name: 'Order Validation: Negative quantity rejected', passed: false, error: err.message })
  }

  // Test 2: Zero Quantity Validation
  try {
    const res = await placeOrder({
      productId: targetProduct.id,
      quantity: 0,
      deliveryAddress: 'Dhaka Wholesale Market, Kawran Bazar'
    })
    if (res.success || !res.error?.includes('greater than zero')) {
      throw new Error(`Zero quantity should be rejected: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'Order Validation: Zero quantity rejected', passed: true })
  } catch (err: any) {
    results.push({ name: 'Order Validation: Zero quantity rejected', passed: false, error: err.message })
  }

  // Test 3: Missing Delivery Address Validation
  try {
    const res = await placeOrder({
      productId: targetProduct.id,
      quantity: 5,
      deliveryAddress: '   '
    })
    if (res.success || !res.error?.toLowerCase().includes('delivery address')) {
      throw new Error(`Missing delivery address should be rejected: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'Order Validation: Missing delivery address rejected', passed: true })
  } catch (err: any) {
    results.push({ name: 'Order Validation: Missing delivery address rejected', passed: false, error: err.message })
  }

  // Test 4: Overselling Prevention (requested quantity > available stock)
  try {
    const res = await placeOrder({
      productId: targetProduct.id,
      quantity: initialStock + 50000,
      deliveryAddress: 'Dhaka Wholesale Market, Kawran Bazar'
    })
    if (res.success || !res.error?.toLowerCase().includes('insufficient')) {
      throw new Error(`Overselling was not blocked: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'Order Inventory: Overselling prevention check', passed: true })
  } catch (err: any) {
    results.push({ name: 'Order Inventory: Overselling prevention check', passed: false, error: err.message })
  }

  // Test 5: Successful Order Placement & Stock Deduction
  try {
    const orderQty = 10
    const res = await placeOrder({
      productId: targetProduct.id,
      quantity: orderQty,
      deliveryAddress: 'Gulshan 2, Dhaka, Road 71',
      buyerNote: 'Urgent delivery needed by tomorrow'
    })
    if (!res.success || !res.orderId || res.total !== orderQty * targetProduct.price_per_unit) {
      throw new Error(`Failed to place valid order: ${JSON.stringify(res)}`)
    }
    if (targetProduct.quantity !== initialStock - orderQty) {
      throw new Error(`Stock deduction failed! Expected ${initialStock - orderQty}, got ${targetProduct.quantity}`)
    }
    results.push({ name: 'Order Placement: Successful order & atomic stock reduction', passed: true })
  } catch (err: any) {
    results.push({ name: 'Order Placement: Successful order & atomic stock reduction', passed: false, error: err.message })
  }

  // Test 6: Order Status Transitions
  try {
    const testOrderId = INITIAL_ORDERS[0]?.id || 'ord-1'
    const resAccepted = await updateOrderStatus(testOrderId, 'accepted', 'Confirmed dispatch timeline')
    if (!resAccepted.success || resAccepted.status !== 'accepted') {
      throw new Error(`Status update to accepted failed: ${JSON.stringify(resAccepted)}`)
    }

    const resPreparing = await updateOrderStatus(testOrderId, 'preparing')
    if (!resPreparing.success || resPreparing.status !== 'preparing') {
      throw new Error(`Status update to preparing failed: ${JSON.stringify(resPreparing)}`)
    }

    const resReady = await updateOrderStatus(testOrderId, 'ready_for_delivery')
    if (!resReady.success || resReady.status !== 'ready_for_delivery') {
      throw new Error(`Status update to ready_for_delivery failed: ${JSON.stringify(resReady)}`)
    }

    const resDelivered = await updateOrderStatus(testOrderId, 'delivered')
    if (!resDelivered.success || resDelivered.status !== 'delivered') {
      throw new Error(`Status update to delivered failed: ${JSON.stringify(resDelivered)}`)
    }

    results.push({ name: 'Order Lifecycle: Valid status transition chain (accepted -> preparing -> ready -> delivered)', passed: true })
  } catch (err: any) {
    results.push({ name: 'Order Lifecycle: Valid status transition chain (accepted -> preparing -> ready -> delivered)', passed: false, error: err.message })
  }

  // Test 7: Invalid Order Status Rejection
  try {
    const testOrderId = INITIAL_ORDERS[0]?.id || 'ord-1'
    const res = await updateOrderStatus(testOrderId, 'random_bogus_status' as any)
    if (res.success) {
      throw new Error(`Invalid status was erroneously accepted: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'Order Lifecycle: Invalid status rejection guardrail', passed: true })
  } catch (err: any) {
    results.push({ name: 'Order Lifecycle: Invalid status rejection guardrail', passed: false, error: err.message })
  }

  return results
}
