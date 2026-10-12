// ============================================================================
// Cheerio Growth Guide — Type Definitions
// ============================================================================

// ---------- Business & User ----------
export interface Business {
  id: string;
  name: string;
  industry: string;
  owner: string;
  plan: string;
  createdAt: string;
}

// ---------- Campaign & Metrics ----------
export interface CampaignMetrics {
  totalSent: number;
  delivered: number;
  read: number;
  clicked: number;
  replied: number;
}

export interface DashboardMetrics {
  totalCustomers: number;
  activeCustomers: number;
  campaignsSent: number;
  campaignMetrics: CampaignMetrics;
  avgResponseTime: string;
  customerSatisfaction: number;
  monthlyGrowth: number;
}

export interface RecentActivity {
  id: string;
  type: 'campaign' | 'reply' | 'signup' | 'automation' | 'chatbot';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

// ---------- Assessment ----------
export type GoalOption =
  | 'answer-questions'
  | 'follow-up'
  | 'segment-customers';

export type PainOption =
  | 'repeating-answers'
  | 'manual-followup'
  | 'finding-audience';

export type ExistingFeature =
  | 'campaigns'
  | 'chatbots'
  | 'automations'
  | 'crm';

export interface AssessmentAnswers {
  goal: GoalOption | null;
  pain: PainOption | null;
  existingFeatures: ExistingFeature[];
}

// ---------- Feature Recommendations ----------
export type FeatureId = 'chatbot' | 'automation' | 'crm';

export type FeatureStatus = 'not-started' | 'in-progress' | 'active' | 'completed';

export interface FeatureRecommendation {
  id: FeatureId;
  title: string;
  subtitle: string;
  description: string;
  problemItSolves: string;
  whyRecommended: string;
  benefits: string[];
  setupDuration: string;
  setupSteps: string[];
  requirements: string[];
  planNote: string;
  icon: string;
  color: string;
  priority: number;
}

// ---------- FAQ Chatbot ----------
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export type ChatbotUseCase =
  | 'product-faqs'
  | 'delivery'
  | 'returns'
  | 'order-status';

export interface ChatbotConfig {
  useCases: ChatbotUseCase[];
  faqs: FAQItem[];
  fallbackMessage: string;
  humanHandoff: boolean;
  lowConfidenceThreshold: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  matched?: boolean;
}

// ---------- Automation ----------
export type AutomationTrigger =
  | 'campaign-click'
  | 'cart-abandon'
  | 'no-reply'
  | 'new-signup';

export type AutomationAudience =
  | 'all-customers'
  | 'engaged-users'
  | 'inactive-users'
  | 'new-customers';

export type AutomationDelay = '1h' | '4h' | '24h' | '48h' | '72h';

export interface AutomationConfig {
  trigger: AutomationTrigger | null;
  audience: AutomationAudience | null;
  delay: AutomationDelay | null;
  messageTemplate: string;
  name: string;
}

// ---------- CRM / Segmentation ----------
export type SegmentType =
  | 'high-engagement'
  | 'purchase-intent'
  | 'new-customers'
  | 'at-risk';

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: SegmentType;
  lastActive: string;
  totalOrders: number;
  engagementScore: number;
}

export interface SegmentInfo {
  id: SegmentType;
  name: string;
  description: string;
  count: number;
  suggestedAction: string;
  color: string;
}

// ---------- Analytics ----------
export interface AnalyticsData {
  recommendationImpressions: number;
  recommendationEngagement: number;
  featureActivations: number;
  meaningfulUseEvents: number;
  weeklyTrend: WeeklyDataPoint[];
  featureBreakdown: FeatureBreakdownItem[];
  progressTimeline: ProgressEvent[];
}

export interface WeeklyDataPoint {
  week: string;
  impressions: number;
  engagements: number;
  activations: number;
}

export interface FeatureBreakdownItem {
  feature: string;
  activated: number;
  meaningfulUse: number;
  color: string;
}

export interface ProgressEvent {
  id: string;
  type: 'impression' | 'engagement' | 'activation' | 'meaningful-use';
  feature: FeatureId;
  description: string;
  timestamp: string;
  isSessionEvent: boolean;
}

// ---------- App State ----------
export interface AppState {
  business: Business;
  assessment: AssessmentAnswers;
  assessmentCompleted: boolean;
  recommendedFeature: FeatureId | null;
  featureStatuses: Record<FeatureId, FeatureStatus>;
  chatbotConfig: ChatbotConfig | null;
  automationConfig: AutomationConfig | null;
  crmSegment: SegmentType | null;
  analytics: AnalyticsData;
  demoEvents: ProgressEvent[];
  lastUpdated: string;
}
