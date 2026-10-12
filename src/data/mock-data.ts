import {
  Business,
  DashboardMetrics,
  RecentActivity,
  FeatureRecommendation,
  FAQItem,
  CustomerRecord,
  SegmentInfo,
  AnalyticsData,
  AutomationTrigger,
  GoalOption,
  FeatureId,
} from '@/types';

// ============================================================================
// 1. DEMO_BUSINESS
// ============================================================================
export const DEMO_BUSINESS: Business = {
  id: 'biz-glow-theory',
  name: 'Glow Theory',
  industry: 'Beauty & Skincare',
  owner: 'Priya Sharma',
  plan: 'Growth',
  createdAt: '2025-08-15T09:00:00.000Z',
};

// ============================================================================
// 2. DASHBOARD_METRICS
// ============================================================================
export const DASHBOARD_METRICS: DashboardMetrics = {
  totalCustomers: 2450,
  activeCustomers: 1820,
  campaignsSent: 24,
  campaignMetrics: {
    totalSent: 12400,
    delivered: 11780,
    read: 8940,
    clicked: 2130,
    replied: 890,
  },
  avgResponseTime: '2.4 hrs',
  customerSatisfaction: 4.2,
  monthlyGrowth: 12.3,
};

// ============================================================================
// 3. RECENT_ACTIVITIES
// ============================================================================
export const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act-1',
    type: 'campaign',
    title: 'Monsoon Glow Flash Sale campaign sent',
    description: 'Broadcasted to 1,420 high-engagement & purchase-intent contacts with 94.2% delivery rate.',
    timestamp: '15 mins ago',
    icon: 'Megaphone',
  },
  {
    id: 'act-2',
    type: 'reply',
    title: 'New customer reply received',
    description: 'Aanya Mehta asked: "Is the Vitamin C Serum suitable for acne-prone skin?"',
    timestamp: '42 mins ago',
    icon: 'MessageSquare',
  },
  {
    id: 'act-3',
    type: 'signup',
    title: 'New VIP subscriber registered',
    description: 'Rohan Kapoor joined via WhatsApp QR code at Mumbai pop-up kiosk.',
    timestamp: '2 hours ago',
    icon: 'UserPlus',
  },
  {
    id: 'act-4',
    type: 'automation',
    title: 'Abandoned cart nudge triggered',
    description: 'Automatic follow-up delivered to 14 customers who viewed Kumkumadi Tailam.',
    timestamp: '3.5 hours ago',
    icon: 'Zap',
  },
  {
    id: 'act-5',
    type: 'chatbot',
    title: 'Automated order status resolution',
    description: 'Bot instantly resolved order tracking query for order #GT-8842 without agent intervention.',
    timestamp: '5 hours ago',
    icon: 'Bot',
  },
  {
    id: 'act-6',
    type: 'reply',
    title: 'Restock confirmation inquiry',
    description: 'Sneha Patel replied requesting an alert for Ceramides Barrier Repair Cream.',
    timestamp: '7 hours ago',
    icon: 'Clock',
  },
];

// ============================================================================
// 4. FEATURE_RECOMMENDATIONS
// ============================================================================
export const FEATURE_RECOMMENDATIONS: FeatureRecommendation[] = [
  {
    id: 'chatbot',
    title: 'AI FAQ Chatbot',
    subtitle: 'Automate repetitive inquiries 24/7 on WhatsApp',
    description:
      'Deploy an intelligent virtual concierge trained on your catalog to answer ingredient safety, shipment tracking, and return questions in under 3 seconds.',
    problemItSolves:
      '68% of your customer messages are repetitive questions about products, delivery, and returns',
    whyRecommended:
      'Your average response time is currently 2.4 hrs. By delegating frequent queries to the AI bot, your team saves 18+ hours weekly while elevating instant customer satisfaction.',
    benefits: [
      'Instant 24/7 automated answers for product suitability and ingredients',
      'Cuts human support queue volume by up to 68%',
      'Graceful live-agent handoff for complex or high-intent consultations',
      'Supports bilingual conversational cues for Indian urban consumers',
    ],
    setupDuration: '~15 min',
    setupSteps: [
      'Review pre-loaded skincare FAQ templates',
      'Select active support use cases (Orders, Delivery, Product tips)',
      'Customize fallback response and escalation triggers',
      'Test conversations in simulated sandbox mode',
      'Publish to WhatsApp Business channel',
    ],
    requirements: [
      'Active WhatsApp Business API number',
      'Standard return and shipping policy docs',
    ],
    planNote: 'Included on Growth & Enterprise plans. Plan eligibility needs verification.',
    icon: 'Bot',
    color: 'teal',
    priority: 1,
  },
  {
    id: 'automation',
    title: 'Follow-Up Automation',
    subtitle: 'Nurture campaign clicks and recover drop-offs effortlessly',
    description:
      'Set trigger-based conversational sequences that reactivate warm prospects who engaged with broadcasts but hesitated before checkout.',
    problemItSolves:
      'You are missing re-engagement opportunities with customers who clicked but did not purchase',
    whyRecommended:
      'Out of 2,130 clicks on your recent campaigns, only 890 initiated replies. Automated timely reminders bridge the conversion gap without manual outreach.',
    benefits: [
      'Recovers up to 22% of abandoned interest within 24 hours',
      'Personalized tone with dynamic subscriber tags and tailored discount codes',
      'Automated delay controls prevent message fatigue and spam complaints',
      'Real-time conversion attribution back to original campaign broadcasts',
    ],
    setupDuration: '~10 min',
    setupSteps: [
      'Choose behavioral trigger (Link Click or Incomplete Checkout)',
      'Define target audience segment and exclusion parameters',
      'Configure delay window (recommended: 4 to 24 hours)',
      'Activate automated dispatch rules',
    ],
    requirements: [
      'At least 1 active broadcast campaign with trackable CTA links',
      'Pre-approved WhatsApp message template',
    ],
    planNote: 'Available on Growth tiers and above. Plan eligibility needs verification.',
    icon: 'Zap',
    color: 'emerald',
    priority: 2,
  },
  {
    id: 'crm',
    title: 'Smart Segmentation',
    subtitle: 'Group shoppers dynamically by intent, spend, and recency',
    description:
      'Leverage behavioral heuristics to bucket contacts into targeted cohorts so you never send one-size-fits-all broadcasts that risk high unsubscribes.',
    problemItSolves:
      'You are sending the same campaign to all customers regardless of their engagement level or purchase history',
    whyRecommended:
      'Segmented WhatsApp messages generate 3.4x higher click-through rates. Treating VIP repeat buyers differently from dormant leads protects your sender reputation.',
    benefits: [
      'Boosts read-to-purchase conversion by tailoring incentives per persona',
      'Protects WhatsApp quality score by reducing block & opt-out rates',
      'Automatic segment re-evaluation based on recent purchase and click events',
      'Actionable filters for repeat order frequency and engagement index',
    ],
    setupDuration: '~8 min',
    setupSteps: [
      'Select segment criteria (Engagement Score, Lifetime Orders, Recency)',
      'Review populated customer cohorts and distribution graphs',
      'Tag audiences for targeted broadcast scheduling',
    ],
    requirements: [
      'Minimum of 500 contacts in customer ledger',
      'Order history sync or purchase event tagging enabled',
    ],
    planNote: 'Standard feature on Growth tier. Plan eligibility needs verification.',
    icon: 'Users',
    color: 'indigo',
    priority: 3,
  },
];

// ============================================================================
// 5. DEFAULT_FAQS
// ============================================================================
export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Are Glow Theory skincare formulations safe for acne-prone or sensitive skin?',
    answer:
      'Yes, all Glow Theory formulations are dermatologically tested, non-comedogenic, and 100% fragrance-free. If you have active cystic acne or rosacea, we recommend starting with our Cica Barrier Gel and patch testing 24 hours prior to full application.',
    category: 'product-faqs',
  },
  {
    id: 'faq-2',
    question: 'What are your delivery timeframes across metro and non-metro cities?',
    answer:
      'Orders placed before 2 PM IST are dispatched on the same business day. Delivery takes 2-3 business days for tier-1 metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad) and 4-6 business days for the rest of India.',
    category: 'delivery',
  },
  {
    id: 'faq-3',
    question: 'What is your return and refund policy for opened bottles or jars?',
    answer:
      'We offer an unconditional 14-day Glow Guarantee. If an item causes irritation or fails to meet your expectations, contact us via WhatsApp with your order number for a hassle-free store credit or replacement.',
    category: 'returns',
  },
  {
    id: 'faq-4',
    question: 'How do I track my active shipment status?',
    answer:
      'Once dispatched, a live tracking link is shared here on WhatsApp and via SMS. You can also reply "TRACK" accompanied by your 6-digit order number (e.g., TRACK GT-8842) for instantaneous live transit updates.',
    category: 'order-status',
  },
  {
    id: 'faq-5',
    question: 'Can you recommend a daily skincare routine for dullness and dark spots?',
    answer:
      'For radiant tone correction, we suggest our 3-step Glow Protocol: 1) Gentle Rice Water Cleanser, 2) 10% Vitamin C + Ferulic Acid Glow Drops in the morning, followed by 3) Ceramide Barrier SPF 50. Reply "ROUTINE" to receive personalized advice from our skincare consultants.',
    category: 'product-faqs',
  },
];

// ============================================================================
// 6. DEMO_CUSTOMERS
// ============================================================================
export const DEMO_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@example.com',
    phone: '+91 98201 44521',
    segment: 'high-engagement',
    lastActive: '2026-10-12T09:15:00.000Z',
    totalOrders: 11,
    engagementScore: 94,
  },
  {
    id: 'cust-2',
    name: 'Kabir Singhania',
    email: 'kabir.singhania@example.com',
    phone: '+91 98110 32189',
    segment: 'purchase-intent',
    lastActive: '2026-10-12T08:30:00.000Z',
    totalOrders: 4,
    engagementScore: 82,
  },
  {
    id: 'cust-3',
    name: 'Mira Nambiar',
    email: 'mira.nambiar@example.com',
    phone: '+91 97405 66712',
    segment: 'new-customers',
    lastActive: '2026-10-11T16:45:00.000Z',
    totalOrders: 1,
    engagementScore: 68,
  },
  {
    id: 'cust-4',
    name: 'Tanvi Iyer',
    email: 'tanvi.iyer@example.com',
    phone: '+91 98450 78234',
    segment: 'high-engagement',
    lastActive: '2026-10-12T06:10:00.000Z',
    totalOrders: 9,
    engagementScore: 91,
  },
  {
    id: 'cust-5',
    name: 'Devansh Verma',
    email: 'devansh.verma@example.com',
    phone: '+91 99203 12908',
    segment: 'purchase-intent',
    lastActive: '2026-10-11T12:20:00.000Z',
    totalOrders: 3,
    engagementScore: 76,
  },
  {
    id: 'cust-6',
    name: 'Isha Merchant',
    email: 'isha.merchant@example.com',
    phone: '+91 98922 45019',
    segment: 'at-risk',
    lastActive: '2026-09-14T11:00:00.000Z',
    totalOrders: 2,
    engagementScore: 28,
  },
  {
    id: 'cust-7',
    name: 'Arjun Somani',
    email: 'arjun.somani@example.com',
    phone: '+91 97118 90341',
    segment: 'new-customers',
    lastActive: '2026-10-10T14:10:00.000Z',
    totalOrders: 0,
    engagementScore: 54,
  },
  {
    id: 'cust-8',
    name: 'Rhea Sengupta',
    email: 'rhea.sengupta@example.com',
    phone: '+91 98300 67125',
    segment: 'at-risk',
    lastActive: '2026-08-28T10:15:00.000Z',
    totalOrders: 5,
    engagementScore: 22,
  },
];

// ============================================================================
// 7. SEGMENT_INFO
// ============================================================================
export const SEGMENT_INFO: SegmentInfo[] = [
  {
    id: 'high-engagement',
    name: 'High Engagement VIPs',
    description: 'Customers with >80 engagement score, multiple purchases, and consistent message read rates.',
    count: 720,
    suggestedAction: 'Offer exclusive early access to product launches and secret loyalty rewards.',
    color: 'teal',
  },
  {
    id: 'purchase-intent',
    name: 'High Purchase Intent',
    description: 'Interacted with recent broadcast links or added products to cart without checking out.',
    count: 580,
    suggestedAction: 'Send targeted limited-time incentives or customer reviews to accelerate conversion.',
    color: 'emerald',
  },
  {
    id: 'new-customers',
    name: 'New Customers & Subscribers',
    description: 'Joined in the last 30 days with 0-1 purchases, currently exploring your brand catalog.',
    count: 630,
    suggestedAction: 'Deliver welcoming skincare onboarding guides and routine discovery quizzes.',
    color: 'blue',
  },
  {
    id: 'at-risk',
    name: 'At-Risk & Inactive',
    description: 'Previously regular shoppers who have not opened broadcasts or purchased in over 45 days.',
    count: 520,
    suggestedAction: 'Trigger a warm "We Miss You" reactivation campaign with a personalized comeback offer.',
    color: 'amber',
  },
];

// ============================================================================
// 8. INITIAL_ANALYTICS
// ============================================================================
export const INITIAL_ANALYTICS: AnalyticsData = {
  recommendationImpressions: 342,
  recommendationEngagement: 156,
  featureActivations: 89,
  meaningfulUseEvents: 52,
  weeklyTrend: [
    { week: 'Week 1', impressions: 32, engagements: 14, activations: 6 },
    { week: 'Week 2', impressions: 45, engagements: 21, activations: 11 },
    { week: 'Week 3', impressions: 54, engagements: 26, activations: 15 },
    { week: 'Week 4', impressions: 62, engagements: 29, activations: 18 },
    { week: 'Week 5', impressions: 71, engagements: 33, activations: 19 },
    { week: 'Week 6', impressions: 78, engagements: 33, activations: 20 },
  ],
  featureBreakdown: [
    { feature: 'AI FAQ Chatbot', activated: 38, meaningfulUse: 24, color: '#0D9488' },
    { feature: 'Follow-Up Automation', activated: 31, meaningfulUse: 18, color: '#059669' },
    { feature: 'Smart Segmentation', activated: 20, meaningfulUse: 10, color: '#4F46E5' },
  ],
  progressTimeline: [
    {
      id: 'evt-1',
      type: 'impression',
      feature: 'chatbot',
      description: 'Growth Guide recommended AI FAQ Chatbot based on high support response latency.',
      timestamp: '2026-10-06T10:00:00.000Z',
      isSessionEvent: false,
    },
    {
      id: 'evt-2',
      type: 'engagement',
      feature: 'chatbot',
      description: 'Priya explored Chatbot configuration sandbox and tested sample ingredient inquiries.',
      timestamp: '2026-10-07T14:30:00.000Z',
      isSessionEvent: false,
    },
    {
      id: 'evt-3',
      type: 'activation',
      feature: 'chatbot',
      description: 'AI FAQ Chatbot deployed to WhatsApp live channel with 5 active verified answers.',
      timestamp: '2026-10-08T11:15:00.000Z',
      isSessionEvent: false,
    },
    {
      id: 'evt-4',
      type: 'meaningful-use',
      feature: 'chatbot',
      description: 'AI Chatbot resolved 25th customer inquiry autonomously without human handoff.',
      timestamp: '2026-10-10T16:40:00.000Z',
      isSessionEvent: false,
    },
    {
      id: 'evt-5',
      type: 'impression',
      feature: 'automation',
      description: 'Growth Guide flagged follow-up opportunities for unpurchased campaign click-throughs.',
      timestamp: '2026-10-11T09:20:00.000Z',
      isSessionEvent: false,
    },
  ],
};

// ============================================================================
// 9. AUTOMATION_TEMPLATES
// ============================================================================
export const AUTOMATION_TEMPLATES: Record<AutomationTrigger, string> = {
  'campaign-click':
    'Hi {{name}}! ✨ We saw you checking out our Glow Theory skincare range earlier. Still wondering if it fits your daily routine? Reply to this message and our skincare specialists will help you pick the perfect match!',
  'cart-abandon':
    'Hey {{name}}, your radiant skin ritual is waiting for you! 🌿 You left your favorite items in the bag, and we saved them for a little while. Tap here to complete your order and enjoy a complimentary trial-size serum with today\'s checkout.',
  'no-reply':
    'Hello {{name}}! Just checking in to see if you needed any guidance choosing the right routine for your skin goals. We are always here to answer questions about ingredients, suitability, or order dispatch. Hope you have a wonderful day!',
  'new-signup':
    'Welcome to the Glow Theory family, {{name}}! 🎉 We craft clean, science-backed skincare designed for everyday healthy glow. Use code GLOWWELCOME for 15% off your first ritual order—reach out anytime if you want personalized routine advice!',
};

// ============================================================================
// 10. ASSESSMENT_FEATURE_MAP
// ============================================================================
export const ASSESSMENT_FEATURE_MAP: Record<GoalOption, FeatureId> = {
  'answer-questions': 'chatbot',
  'follow-up': 'automation',
  'segment-customers': 'crm',
};
