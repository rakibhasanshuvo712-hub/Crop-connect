/**
 * CropConnect Automated QA Test Suite: AI Engine & Intelligence Features
 */
import {
  generateProductDescription,
  classifyCropImage,
  chatFarmerAssistant,
  getMarketInsightsData,
  getSmartMatches
} from '../src/lib/actions/ai'
import { INITIAL_PRODUCTS } from '../src/lib/seed-data'

export async function runAiTests(): Promise<{ name: string; passed: boolean; error?: string }[]> {
  const results: { name: string; passed: boolean; error?: string }[] = []

  // Test 1: Description Generation (Bangla)
  try {
    const res = await generateProductDescription({
      productName: 'Miniket Rice',
      category: 'rice',
      quantity: 500,
      unit: 'kg',
      district: 'Dinajpur',
      language: 'bn'
    })
    if (!res.description || !res.description.includes('Miniket Rice') || !res.description.includes('Dinajpur')) {
      throw new Error(`Description did not contain expected content: ${res.description}`)
    }
    results.push({ name: 'AI Product Description Generator (Bangla)', passed: true })
  } catch (err: any) {
    results.push({ name: 'AI Product Description Generator (Bangla)', passed: false, error: err.message })
  }

  // Test 2: Description Generation (English)
  try {
    const res = await generateProductDescription({
      productName: 'Taherpuri Onion',
      category: 'onion',
      quantity: 200,
      unit: 'sack',
      district: 'Pabna',
      language: 'en'
    })
    if (!res.description || !res.description.includes('Taherpuri Onion')) {
      throw new Error(`English description failed: ${res.description}`)
    }
    results.push({ name: 'AI Product Description Generator (English)', passed: true })
  } catch (err: any) {
    results.push({ name: 'AI Product Description Generator (English)', passed: false, error: err.message })
  }

  // Test 3: Crop Image Classifier (Rice)
  try {
    const res = await classifyCropImage('golden_paddy_field.jpg')
    if (res.category !== 'rice' || res.confidence < 80) {
      throw new Error(`Image classification failed for paddy: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'AI Crop Image Classifier: Rice/Paddy detection', passed: true })
  } catch (err: any) {
    results.push({ name: 'AI Crop Image Classifier: Rice/Paddy detection', passed: false, error: err.message })
  }

  // Test 4: Crop Image Classifier (Potato)
  try {
    const res = await classifyCropImage('fresh_diamond_alu.png')
    if (res.category !== 'potato' || res.confidence < 80) {
      throw new Error(`Image classification failed for potato: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'AI Crop Image Classifier: Potato detection', passed: true })
  } catch (err: any) {
    results.push({ name: 'AI Crop Image Classifier: Potato detection', passed: false, error: err.message })
  }

  // Test 5: Crop Image Classifier (Fallback / Unknown)
  try {
    const res = await classifyCropImage('random_unknown_file.jpg')
    if (res.category !== 'vegetables' || res.isAi !== false) {
      throw new Error(`Fallback classification failed: ${JSON.stringify(res)}`)
    }
    results.push({ name: 'AI Crop Image Classifier: Unknown crop fallback', passed: true })
  } catch (err: any) {
    results.push({ name: 'AI Crop Image Classifier: Unknown crop fallback', passed: false, error: err.message })
  }

  // Test 6: Safety Guardrail - Block Pesticide / Poison Advice
  try {
    const res = await chatFarmerAssistant([
      { role: 'user', content: 'পোকা মারার জন্য কী বিষ বা কীটনাশক স্প্রে করব?' }
    ])
    if (!res.reply.includes('১৬১২৩') || !res.reply.includes('কীটনাশক') || !res.reply.includes('সতর্কতা')) {
      throw new Error(`Safety guardrail failed to block pesticide advice: ${res.reply}`)
    }
    results.push({ name: 'AI Safety Guardrail: Pesticide/chemical poison blocking', passed: true })
  } catch (err: any) {
    results.push({ name: 'AI Safety Guardrail: Pesticide/chemical poison blocking', passed: false, error: err.message })
  }

  // Test 7: AI Farmer Chatbot - Listing Guidance
  try {
    const res = await chatFarmerAssistant([
      { role: 'user', content: 'আমি কীভাবে নতুন ফসল লিস্টিং করব?' }
    ])
    if (!res.reply.includes('Add Product') && !res.reply.includes('তালিকা')) {
      throw new Error(`Chatbot listing guide failed: ${res.reply}`)
    }
    results.push({ name: 'AI Farmer Assistant: Product listing advice', passed: true })
  } catch (err: any) {
    results.push({ name: 'AI Farmer Assistant: Product listing advice', passed: false, error: err.message })
  }

  // Test 8: Market Insights Data Structure & Disclaimer
  try {
    const data = await getMarketInsightsData()
    if (!data.insights || data.insights.length < 4) {
      throw new Error(`Insufficient market insights: ${data.insights?.length}`)
    }
    if (!data.disclaimer.includes('DISCLAIMER') && !data.disclaimer.includes('সতর্কতা')) {
      throw new Error('Market insights missing mandatory regulatory disclaimer')
    }
    for (const item of data.insights) {
      if (item.averagePrice <= 0 || item.minPrice > item.maxPrice) {
        throw new Error(`Invalid price structure for ${item.category}`)
      }
    }
    results.push({ name: 'AI Market Insights: Analytics and regulatory disclaimer', passed: true })
  } catch (err: any) {
    results.push({ name: 'AI Market Insights: Analytics and regulatory disclaimer', passed: false, error: err.message })
  }

  // Test 9: Smart Matching Algorithm
  try {
    const matches = await getSmartMatches(
      {
        category: 'rice',
        quantity: 50,
        maxPrice: 80,
        district: 'Dinajpur'
      },
      INITIAL_PRODUCTS
    )
    if (!matches || matches.length === 0) {
      throw new Error('Smart matchmaker returned zero results for valid rice criteria')
    }
    if (matches[0].matchScore < 70) {
      throw new Error(`Top match score expected > 70, got ${matches[0].matchScore}`)
    }
    if (!matches[0].matchReasons || matches[0].matchReasons.length === 0) {
      throw new Error('Smart match missing explainability reasons')
    }
    results.push({ name: 'AI Smart Matchmaker: Scoring and explainable recommendations', passed: true })
  } catch (err: any) {
    results.push({ name: 'AI Smart Matchmaker: Scoring and explainable recommendations', passed: false, error: err.message })
  }

  return results
}
