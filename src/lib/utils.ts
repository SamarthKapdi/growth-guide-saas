import { FeatureId, FeatureStatus, FAQItem } from '@/types';

/**
 * Class name merger that filters out falsy values.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generates a unique pseudo-random string ID.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

/**
 * Formats a number with comma separators (e.g. 1234 -> '1,234').
 */
export function formatNumber(n: number): string {
  if (isNaN(n)) return '0';
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * Calculates and formats a percentage given a numerator and denominator.
 * (e.g. 25, 100 -> '25%')
 */
export function formatPercentage(n: number, d: number): string {
  if (!d || d === 0 || isNaN(n) || isNaN(d)) return '0%';
  const pct = (n / d) * 100;
  return `${Math.round(pct)}%`;
}

/**
 * Converts a timestamp or date string into a relative time description.
 * If the string is already a relative string (e.g. '15 mins ago'), returns as-is.
 */
export function getRelativeTime(timestamp: string): string {
  if (!timestamp) return '';

  // If already relative formatted
  if (
    timestamp.includes('ago') ||
    timestamp.includes('yesterday') ||
    timestamp.includes('just now')
  ) {
    return timestamp;
  }

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return timestamp;
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) return 'just now';
  if (diffInSeconds < 60) return 'just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Tokenizes a string into lowercased clean words.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 2);
}

/**
 * FAQ matching:
 * Matches query against FAQ questions, answers, and domain keywords with token scoring.
 * Returns the best match or null if confidence/score is below threshold.
 */
export function matchFAQ(query: string, faqs: FAQItem[]): FAQItem | null {
  if (!query || !faqs || faqs.length === 0) return null;

  const queryLower = query.toLowerCase();
  const queryTokensList = tokenize(query);
  const queryTokens = new Set(queryTokensList);
  if (queryTokensList.length === 0) return null;

  // Domain keyword clusters for e-commerce skincare inquiries
  const keywordMap: Record<string, string[]> = {
    delivery: ['delivery', 'deliver', 'shipping', 'ship', 'timeframe', 'transit', 'dispatch'],
    returns: ['return', 'returns', 'refund', 'refunds', 'exchange', 'guarantee', 'policy'],
    'order-status': ['track', 'tracking', 'status', 'shipment', 'order', 'where'],
    'product-faqs': ['ingredient', 'ingredients', 'safe', 'safety', 'acne', 'routine', 'sensitive', 'skin', 'formula', 'suitability'],
  };

  let bestMatch: FAQItem | null = null;
  let maxScore = 0;

  for (const faq of faqs) {
    const questionTokens = tokenize(faq.question);
    const answerTokens = tokenize(faq.answer);
    let score = 0;

    // Exact word overlap in question (highest confidence)
    for (const token of questionTokens) {
      if (queryTokens.has(token)) {
        score += 2;
      }
    }

    // Stem match for words of length >= 4 (e.g. deliver -> delivery)
    for (const qToken of queryTokensList) {
      for (const fToken of questionTokens) {
        if (qToken.length >= 4 && fToken.length >= 4) {
          if (qToken.startsWith(fToken.slice(0, 4)) || fToken.startsWith(qToken.slice(0, 4))) {
            score += 1;
          }
        }
      }
    }

    // Category / domain keyword alignment
    const keywords = keywordMap[faq.category] || [];
    for (const kw of keywords) {
      if (queryLower.includes(kw)) {
        score += 1.5;
        break;
      }
    }

    // Contextual answer tokens match
    for (const token of answerTokens) {
      if (queryTokens.has(token) && token.length > 3) {
        score += 0.5;
      }
    }

    if (score >= 2.5 && score > maxScore) {
      maxScore = score;
      bestMatch = faq;
    }
  }

  return bestMatch;
}

/**
 * Returns the Lucide icon name string for a given FeatureId.
 */
export function getFeatureIcon(featureId: FeatureId): string {
  switch (featureId) {
    case 'chatbot':
      return 'Bot';
    case 'automation':
      return 'Zap';
    case 'crm':
      return 'Users';
    default:
      return 'Sparkles';
  }
}

/**
 * Returns Tailwind CSS color classes for a FeatureStatus badge/indicator.
 */
export function getStatusColor(status: FeatureStatus): string {
  switch (status) {
    case 'not-started':
      return 'text-slate-600 bg-slate-100 border-slate-200';
    case 'in-progress':
      return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'active':
      return 'text-teal-700 bg-teal-50 border-teal-200';
    case 'completed':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    default:
      return 'text-slate-600 bg-slate-100 border-slate-200';
  }
}

/**
 * Returns a human-readable display label for a FeatureStatus.
 */
export function getStatusLabel(status: FeatureStatus): string {
  switch (status) {
    case 'not-started':
      return 'Not Started';
    case 'in-progress':
      return 'In Progress';
    case 'active':
      return 'Active';
    case 'completed':
      return 'Completed';
    default:
      return 'Not Started';
  }
}
