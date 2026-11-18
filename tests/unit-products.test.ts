/**
 * CropConnect Automated QA Test Suite: Products & Marketplace Filtering
 */
import { getProducts, getProductById } from '../src/lib/actions/products'
import { INITIAL_PRODUCTS } from '../src/lib/seed-data'

export async function runProductTests(): Promise<{ name: string; passed: boolean; error?: string }[]> {
  const results: { name: string; passed: boolean; error?: string }[] = []

  // Test 1: Category Filtering (Rice)
  try {
    const res = await getProducts({ category: 'rice' })
    if (res.products.length === 0 || res.products.some(p => p.category !== 'rice')) {
      throw new Error(`Category filter returned invalid products: ${JSON.stringify(res.products.map(p => p.category))}`)
    }
    results.push({ name: 'Product Filtering: Category filter (Rice)', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Filtering: Category filter (Rice)', passed: false, error: err.message })
  }

  // Test 2: Category Filtering (Potato)
  try {
    const res = await getProducts({ category: 'potato' })
    if (res.products.length === 0 || res.products.some(p => p.category !== 'potato')) {
      throw new Error(`Category filter returned invalid products: ${JSON.stringify(res.products.map(p => p.category))}`)
    }
    results.push({ name: 'Product Filtering: Category filter (Potato)', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Filtering: Category filter (Potato)', passed: false, error: err.message })
  }

  // Test 3: Division Filtering (Rangpur)
  try {
    const res = await getProducts({ division: 'Rangpur' })
    if (res.products.length === 0 || res.products.some(p => p.division !== 'Rangpur')) {
      throw new Error(`Division filter failed: ${JSON.stringify(res.products.map(p => p.division))}`)
    }
    results.push({ name: 'Product Filtering: Division filter (Rangpur)', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Filtering: Division filter (Rangpur)', passed: false, error: err.message })
  }

  // Test 4: District Filtering (Dinajpur)
  try {
    const res = await getProducts({ district: 'Dinajpur' })
    if (res.products.length === 0 || res.products.some(p => p.district !== 'Dinajpur')) {
      throw new Error(`District filter failed: ${JSON.stringify(res.products.map(p => p.district))}`)
    }
    results.push({ name: 'Product Filtering: District filter (Dinajpur)', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Filtering: District filter (Dinajpur)', passed: false, error: err.message })
  }

  // Test 5: Price Range Filtering (minPrice = 30, maxPrice = 60)
  try {
    const res = await getProducts({ minPrice: 30, maxPrice: 60 })
    if (res.products.some(p => p.price_per_unit < 30 || p.price_per_unit > 60)) {
      throw new Error(`Price boundary violated: ${JSON.stringify(res.products.map(p => p.price_per_unit))}`)
    }
    results.push({ name: 'Product Filtering: Price Range boundaries (30 - 60 BDT)', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Filtering: Price Range boundaries (30 - 60 BDT)', passed: false, error: err.message })
  }

  // Test 6: Search Query (Keyword "Miniket")
  try {
    const res = await getProducts({ search: 'Miniket' })
    if (res.products.length === 0 || !res.products.some(p => p.name.includes('Miniket'))) {
      throw new Error('Search failed to find Miniket rice')
    }
    results.push({ name: 'Product Search: Keyword search matching', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Search: Keyword search matching', passed: false, error: err.message })
  }

  // Test 7: Sorting by Price Ascending
  try {
    const res = await getProducts({ sortBy: 'price_asc' })
    for (let i = 0; i < res.products.length - 1; i++) {
      if (res.products[i].price_per_unit > res.products[i + 1].price_per_unit) {
        throw new Error(`Price ascending sort violated at index ${i}: ${res.products[i].price_per_unit} > ${res.products[i + 1].price_per_unit}`)
      }
    }
    results.push({ name: 'Product Sorting: Price ascending order', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Sorting: Price ascending order', passed: false, error: err.message })
  }

  // Test 8: Sorting by Price Descending
  try {
    const res = await getProducts({ sortBy: 'price_desc' })
    for (let i = 0; i < res.products.length - 1; i++) {
      if (res.products[i].price_per_unit < res.products[i + 1].price_per_unit) {
        throw new Error(`Price descending sort violated at index ${i}: ${res.products[i].price_per_unit} < ${res.products[i + 1].price_per_unit}`)
      }
    }
    results.push({ name: 'Product Sorting: Price descending order', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Sorting: Price descending order', passed: false, error: err.message })
  }

  // Test 9: Get Single Product by Valid ID
  try {
    const p1 = INITIAL_PRODUCTS[0]
    const fetched = await getProductById(p1.id)
    if (!fetched || fetched.id !== p1.id) {
      throw new Error(`Failed to fetch product by ID: ${p1.id}`)
    }
    results.push({ name: 'Product Details: Retrieve product by valid UUID/ID', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Details: Retrieve product by valid UUID/ID', passed: false, error: err.message })
  }

  // Test 10: Get Product by Non-Existent ID
  try {
    const notFound = await getProductById('non-existent-id-999999')
    if (notFound !== null) {
      throw new Error(`Expected null for invalid ID, got: ${JSON.stringify(notFound)}`)
    }
    results.push({ name: 'Product Details: Non-existent ID returns null gracefully', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Details: Non-existent ID returns null gracefully', passed: false, error: err.message })
  }

  // Test 11: Product Expiry Filtering
  try {
    // Add a mock expired product to INITIAL_PRODUCTS
    const expiredProdId = 'test-expired-prod-qa'
    INITIAL_PRODUCTS.push({
      id: expiredProdId,
      farmer_id: 'farmer-1',
      name: 'Expired Paddy Crop',
      category: 'rice',
      description: 'Expired crop test',
      quantity: 100,
      unit: 'kg',
      price_per_unit: 40,
      harvest_date: '2020-01-01',
      availability_date: '2020-01-10',
      expiry_date: '2020-01-15', // Past date!
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Dhamrai',
      status: 'active',
      is_featured: false,
      view_count: 5,
      created_at: new Date(2020, 0, 1).toISOString(),
      updated_at: new Date(2020, 0, 1).toISOString()
    })

    const catalog = await getProducts()
    const foundExpired = catalog.products.some(p => p.id === expiredProdId)

    // Clean up
    const idx = INITIAL_PRODUCTS.findIndex(p => p.id === expiredProdId)
    if (idx !== -1) INITIAL_PRODUCTS.splice(idx, 1)

    if (foundExpired) {
      throw new Error('Expired product was incorrectly included in active marketplace catalog!')
    }
    results.push({ name: 'Product Expiry: Expired listing filtered out from public marketplace', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Expiry: Expired listing filtered out from public marketplace', passed: false, error: err.message })
  }

  // Test 12: Removed Status Filtering
  try {
    const removedProdId = 'test-removed-prod-qa'
    INITIAL_PRODUCTS.push({
      id: removedProdId,
      farmer_id: 'farmer-1',
      name: 'Removed Tomato Crop',
      category: 'tomato',
      description: 'Removed crop test',
      quantity: 50,
      unit: 'kg',
      price_per_unit: 30,
      harvest_date: '2026-11-01',
      availability_date: '2026-11-20',
      expiry_date: '2027-12-31',
      division: 'Rajshahi',
      district: 'Bogura',
      upazila: 'Sadar',
      status: 'removed', // Removed!
      is_featured: false,
      view_count: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    const catalog = await getProducts()
    const foundRemoved = catalog.products.some(p => p.id === removedProdId)

    // Clean up
    const idx = INITIAL_PRODUCTS.findIndex(p => p.id === removedProdId)
    if (idx !== -1) INITIAL_PRODUCTS.splice(idx, 1)

    if (foundRemoved) {
      throw new Error('Removed product was incorrectly visible in active marketplace catalog!')
    }
    results.push({ name: 'Product Removal: Deleted/removed listing excluded from public marketplace', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Removal: Deleted/removed listing excluded from public marketplace', passed: false, error: err.message })
  }

  return results
}
