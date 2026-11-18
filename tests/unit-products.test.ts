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

  return results
}
