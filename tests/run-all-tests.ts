/**
 * CropConnect Master QA Automated Test Runner
 */
process.env.NODE_ENV = 'test'

import { runAiTests } from './unit-ai.test'
import { runProductTests } from './unit-products.test'
import { runOrderTests } from './unit-orders.test'
import { runReportTests } from './unit-reports.test'
import { runAuthRbacTests } from './unit-auth-rbac.test'
import { runSecurityAndLocationTests } from './unit-security-location.test'

async function runTestSuite() {
  console.log('\n============================================================')
  console.log('   CropConnect AI Agricultural Marketplace QA Test Suite')
  console.log('============================================================\n')

  const startTime = Date.now()
  let totalTests = 0
  let passedTests = 0
  let failedTests = 0

  const suites = [
    { title: '1. AI & Intelligent Services Suite', runner: runAiTests },
    { title: '2. Agricultural Products & Catalog Search Suite', runner: runProductTests },
    { title: '3. Order Lifecycle & Atomic Inventory Suite', runner: runOrderTests },
    { title: '4. Dispute & Complaint Resolution Suite', runner: runReportTests },
    { title: '5. Authentication & RBAC Policy Suite', runner: runAuthRbacTests },
    { title: '6. Security, Injection Defense & Geography Suite', runner: runSecurityAndLocationTests },
  ]

  for (const suite of suites) {
    console.log(`\n--- Running ${suite.title} ---`)
    const results = await suite.runner()
    for (const test of results) {
      totalTests++
      if (test.passed) {
        passedTests++
        console.log(`  [PASS] ${test.name}`)
      } else {
        failedTests++
        console.error(`  [FAIL] ${test.name}`)
        console.error(`         Reason: ${test.error}`)
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  console.log('\n============================================================')
  console.log('                 QA TEST EXECUTION SUMMARY')
  console.log('============================================================')
  console.log(`  Total Tests Executed : ${totalTests}`)
  console.log(`  Passed               : ${passedTests} (✓)`)
  console.log(`  Failed               : ${failedTests} (✗)`)
  console.log(`  Execution Time       : ${duration}s`)
  console.log('============================================================\n')

  if (failedTests > 0) {
    console.error(`❌ QA Test Run Failed with ${failedTests} failure(s).\n`)
    process.exit(1)
  } else {
    console.log('✅ ALL QA TESTS PASSED CLEANLY (100% SUCCESS RATE)!\n')
    process.exit(0)
  }
}

runTestSuite()
