/**
 * Cheerio Growth Guide — Automated Test Suite
 * Validates recommendation engine, FAQ matching, data integrity, and metrics.
 */

import { ASSESSMENT_FEATURE_MAP, FEATURE_RECOMMENDATIONS, DEFAULT_FAQS, DEMO_CUSTOMERS } from '../src/data/mock-data';
import { matchFAQ, formatNumber, formatPercentage } from '../src/lib/utils';
import { GoalOption, FeatureId } from '../src/types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

console.log('\n========================================');
console.log('🧪 RUNNING CHEERIO GROWTH GUIDE TEST SUITE');
console.log('========================================\n');

// 1. Recommendation Engine Tests
console.log('--- 1. Recommendation Engine Mapping ---');
const testCases: { goal: GoalOption; expected: FeatureId }[] = [
  { goal: 'answer-questions', expected: 'chatbot' },
  { goal: 'follow-up', expected: 'automation' },
  { goal: 'segment-customers', expected: 'crm' },
];

for (const tc of testCases) {
  const mapped = ASSESSMENT_FEATURE_MAP[tc.goal];
  assert(mapped === tc.expected, `Goal '${tc.goal}' maps to '${tc.expected}'`);
}

// Check that all recommended features exist in catalog
for (const fid of ['chatbot', 'automation', 'crm'] as FeatureId[]) {
  const found = FEATURE_RECOMMENDATIONS.find((f) => f.id === fid);
  assert(!!found, `Feature '${fid}' exists in catalog with full metadata`);
  if (found) {
    assert(found.benefits.length >= 3, `Feature '${fid}' has at least 3 benefits defined`);
    assert(found.setupSteps.length >= 3, `Feature '${fid}' has at least 3 setup steps defined`);
  }
}

// 2. FAQ Matching Algorithm Tests
console.log('\n--- 2. FAQ Matching Engine ---');
// Match on ingredient query
const match1 = matchFAQ('Do your skincare products contain parabens or harmful sulfates?', DEFAULT_FAQS);
assert(match1 !== null, 'Ingredient question matches product safety FAQ');
assert(match1?.category === 'product-faqs', 'Ingredient match category is product-faqs');

// Match on delivery query
const match2 = matchFAQ('How long does standard delivery take to arrive?', DEFAULT_FAQS);
assert(match2 !== null, 'Delivery duration query matches delivery FAQ');
assert(match2?.category === 'delivery', 'Delivery match category is delivery');

// Match on returns query
const match3 = matchFAQ('What is your refund and return policy for opened bottles?', DEFAULT_FAQS);
assert(match3 !== null, 'Return question matches return FAQ');
assert(match3?.category === 'returns', 'Return match category is returns');

// Fallback on unrelated query (less than 2 words overlap)
const fallbackMatch = matchFAQ('Can I fly a rocket to Mars with Cheerio?', DEFAULT_FAQS);
assert(fallbackMatch === null, 'Unrelated query triggers fallback (null match)');

// Empty or single word query
const shortMatch = matchFAQ('hello', DEFAULT_FAQS);
assert(shortMatch === null, 'Single word generic greeting returns null for fallback routing');

// 3. Customer & CRM Segmentation Data Integrity
console.log('\n--- 3. CRM Segmentation Data Integrity ---');
assert(DEMO_CUSTOMERS.length >= 8, 'Demo customer dataset contains at least 8 profiles');

const validSegments = ['high-engagement', 'purchase-intent', 'new-customers', 'at-risk'];
const allSegmentsValid = DEMO_CUSTOMERS.every((c) => validSegments.includes(c.segment));
assert(allSegmentsValid, 'All demo customers belong to valid segmented cohorts');

const validScores = DEMO_CUSTOMERS.every((c) => c.engagementScore >= 0 && c.engagementScore <= 100);
assert(validScores, 'All customer engagement scores are between 0 and 100');

// 4. Utility Functions
console.log('\n--- 4. Formatting Utilities ---');
assert(formatNumber(12400) === '12,400', 'formatNumber formats thousands with commas');
assert(formatPercentage(8940, 12400) === '72%', 'formatPercentage calculates correct whole %');
assert(formatPercentage(0, 100) === '0%', 'formatPercentage handles 0%');

// Summary
console.log('\n========================================');
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
