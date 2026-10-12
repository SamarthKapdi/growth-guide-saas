# Product Specification — Cheerio Growth Guide

## Executive Summary

**Cheerio Growth Guide** is a contextual feature recommendation system designed to increase feature discovery, activation, and retention among Cheerio's business users.

### Problem Statement

Businesses sign up for Cheerio, send a few WhatsApp campaigns, but fail to discover other valuable features (chatbots, automations, CRM segmentation). This leads to underutilization and eventually churn.

### Product Concept

A guided experience that:
1. Understands a user's business objective and current feature usage
2. Recommends a relevant, previously unused feature
3. Explains why the feature matters with expected outcomes
4. Guides the user through a short setup wizard
5. Lets the user preview and test the configuration
6. Simulates activation
7. Shows progress and recommends subsequent actions

### Tagline
> "Your next best growth move."

---

## Target Persona

**Primary Persona:** Non-technical D2C brand owner (e.g., skincare, fashion, wellness)

**Characteristics:**
- Already sends WhatsApp campaigns via Cheerio
- Has not configured chatbots, follow-up automations, or CRM segmentation
- Limited time — needs clear guidance on which feature to try next
- Values practical outcomes over feature exploration

**Demo Persona:** Priya Sharma, owner of Glow Theory (fictional D2C skincare brand)

---

## Feature Prioritization

### Tier 1: AI FAQ Chatbot
- **Problem:** 68% of customer messages are repetitive questions
- **Solution:** Automated FAQ responses with human handoff
- **Setup effort:** ~15 minutes (illustrative)
- **Expected impact:** Reduce repetitive inquiries, faster response times

### Tier 2: Follow-Up Automation
- **Problem:** Missing re-engagement with interested customers
- **Solution:** Triggered follow-up messages based on customer actions
- **Setup effort:** ~10 minutes (illustrative)
- **Expected impact:** Improve conversion from interest to purchase

### Tier 3: Smart Segmentation (CRM)
- **Problem:** Same campaign sent to all customers regardless of engagement
- **Solution:** Segment-based targeting for relevant messaging
- **Setup effort:** ~8 minutes (illustrative)
- **Expected impact:** Improve campaign relevance and engagement rates

---

## North Star Metric

### Definition

**"Percentage of monthly active businesses that activate and meaningfully use at least one previously unused Cheerio feature within 30 days."**

### Key Terms

- **Monthly active business:** A business account that has logged in and performed at least one action in the past 30 days
- **Activate:** Complete the setup flow and turn on a feature
- **Meaningfully use:** Perform a qualifying action beyond initial setup (e.g., the chatbot handles at least 10 customer conversations, or an automation triggers at least 5 follow-ups)
- **Previously unused feature:** A Cheerio feature that the business had not configured before the Growth Guide recommendation

### Target

- **Goal:** Improve the metric by **10 percentage points** within three months of launch
- **Status:** This is a **hypothesis**, not a proven outcome
- **Baseline:** Proposed two-week measurement period to establish the current rate before the experiment begins

### Supporting Metrics

| # | Metric | Definition | Purpose |
|---|--------|-----------|---------|
| 1 | Recommendation-to-Activation Rate | % of businesses that activate a recommended feature after viewing the recommendation | Measures recommendation quality and setup UX |
| 2 | 7-Day Meaningful Use Rate | % of businesses with meaningful use within 7 days of activation | Measures early feature stickiness |
| 3 | 30-Day Retention | % of eligible businesses still active 30 days after first feature activation | Measures long-term impact on retention |

### Metric Hierarchy

The North Star metric sits above the supporting metrics:

```
North Star: Feature Activation & Meaningful Use Rate
├── Supporting 1: Recommendation → Activation conversion
├── Supporting 2: Activation → Meaningful use (7 days)
└── Supporting 3: Activation → Retention (30 days)
```

---

## User Journey

```
Demo Entry → Dashboard → Growth Guide Assessment → Recommendation →
Setup Wizard → Preview & Test → Activation → Progress/Analytics
```

### Detailed Flow

1. **Entry:** User sees welcome screen, clicks "Explore Demo"
2. **Dashboard:** Overview of business performance, feature status, and Growth Guide CTA
3. **Assessment:** Three questions to understand goal, pain point, and current usage
4. **Recommendation:** Personalized feature suggestion with rationale
5. **Detail:** Deep dive into why this feature fits, with setup information
6. **Setup:** Multi-step wizard tailored to the feature
7. **Preview:** Test the configuration before activation
8. **Activation:** Confirm and simulate feature deployment
9. **Progress:** See updated metrics and next recommendation

---

## Recommendation Logic

### Assessment Questions

1. **Goal:** What is your main business goal?
   - Answer customer questions faster → Chatbot
   - Follow up with interested customers → Automation
   - Understand and segment customers → CRM

2. **Pain Point:** What takes too much time?
   - Repeating same answers → Chatbot
   - Manual follow-ups → Automation
   - Finding right audience → CRM

3. **Current Features:** Which do you already use?
   - Used to filter out already-adopted features

### Mapping Logic

```
goal = 'answer-questions' → recommend: chatbot
goal = 'follow-up'        → recommend: automation
goal = 'segment-customers' → recommend: crm
```

The logic is deterministic and rule-based. A production version could use ML-based scoring.

---

## Scope Boundaries

### In Scope (Prototype)
- Interactive demo with simulated data
- Full setup wizards for three features
- FAQ chatbot testing with pattern matching
- Local state persistence
- Analytics dashboard with seeded data

### Out of Scope (Prototype)
- Real authentication or authorization
- Actual message sending (WhatsApp, SMS, email)
- Real AI/ML-based recommendations
- Production deployment pipeline
- Integration with Cheerio's actual API
- Multi-language support
- Real customer data
- A/B testing infrastructure

---

## Success Criteria (Prototype)

The prototype is successful if a reviewer can:

1. ✅ Enter the demo without any setup friction
2. ✅ Understand the product concept within 30 seconds
3. ✅ Complete the assessment and receive a recommendation
4. ✅ Complete the full chatbot setup wizard
5. ✅ Test the chatbot with sample questions
6. ✅ See the activation reflected in feature status
7. ✅ Explore automation and CRM features
8. ✅ View analytics and progress metrics
9. ✅ Reset the demo and start over
