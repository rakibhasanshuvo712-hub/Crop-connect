/**
 * CropConnect Automated QA Test Suite: Security, Input Sanitization & Administrative Geography
 */
import { DIVISIONS, DISTRICTS, ProductCategory, Division } from '../src/lib/constants'
import { getProducts } from '../src/lib/actions/products'
import { createProduct } from '../src/lib/actions/products'

export async function runSecurityAndLocationTests(): Promise<{ name: string; passed: boolean; error?: string }[]> {
  const results: { name: string; passed: boolean; error?: string }[] = []

  // Test 1: Bangladesh Administrative Geography - All 8 Divisions Present
  try {
    const requiredDivisions = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh']
    for (const div of requiredDivisions) {
      if (!DIVISIONS.includes(div as any)) {
        throw new Error(`Missing administrative division: ${div}`)
      }
      if (!DISTRICTS[div as Division] || DISTRICTS[div as Division].length === 0) {
        throw new Error(`Division ${div} has no mapped districts`)
      }
    }
    results.push({ name: 'Geography: Complete 8 Administrative Divisions & District Hierarchy', passed: true })
  } catch (err: any) {
    results.push({ name: 'Geography: Complete 8 Administrative Divisions & District Hierarchy', passed: false, error: err.message })
  }

  // Test 2: Security & SQL Injection Resilience on Catalog Search
  try {
    const maliciousPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE products; --",
      "\" OR 1=1 --",
      "<script>alert('xss')</script>",
      "%00",
      "UNION SELECT username, password FROM profiles--"
    ]

    for (const payload of maliciousPayloads) {
      const res = await getProducts({ search: payload })
      if (!Array.isArray(res.products)) {
        throw new Error(`Search crashed or returned non-array for SQLi payload: ${payload}`)
      }
    }
    results.push({ name: 'Security: SQL Injection & XSS payload resilience in product search', passed: true })
  } catch (err: any) {
    results.push({ name: 'Security: SQL Injection & XSS payload resilience in product search', passed: false, error: err.message })
  }

  // Test 3: Product Creation Negative Boundary - Empty Name
  try {
    const res = await createProduct({
      name: '',
      category: 'rice',
      quantity: 100,
      unit: 'kg',
      price_per_unit: 70
    })
    if (res.success || !res.error?.includes('at least 2 characters')) {
      throw new Error(`Empty product name should be rejected: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'Product Validation: Empty product name rejected', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Validation: Empty product name rejected', passed: false, error: err.message })
  }

  // Test 4: Product Creation Negative Boundary - Zero or Negative Price
  try {
    const res = await createProduct({
      name: 'Organic Wheat',
      category: 'wheat',
      quantity: 50,
      unit: 'kg',
      price_per_unit: -10
    })
    if (res.success || !res.error?.includes('positive number')) {
      throw new Error(`Negative price should be rejected: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'Product Validation: Negative price rejected', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Validation: Negative price rejected', passed: false, error: err.message })
  }

  // Test 5: Product Creation Negative Boundary - Zero Quantity
  try {
    const res = await createProduct({
      name: 'Organic Wheat',
      category: 'wheat',
      quantity: 0,
      unit: 'kg',
      price_per_unit: 50
    })
    if (res.success || !res.error?.includes('positive number')) {
      throw new Error(`Zero quantity should be rejected: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'Product Validation: Zero quantity rejected', passed: true })
  } catch (err: any) {
    results.push({ name: 'Product Validation: Zero quantity rejected', passed: false, error: err.message })
  }

  return results
}
