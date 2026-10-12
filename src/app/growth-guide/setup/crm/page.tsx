'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Filter,
  Layers,
  Send,
  Check,
  Award,
  Zap,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  ProgressBar,
  Modal,
  DemoBanner,
} from '@/components/ui';
import { useAppState } from '@/lib/store';
import { DEMO_CUSTOMERS, SEGMENT_INFO } from '@/data/mock-data';
import { formatNumber, getRelativeTime } from '@/lib/utils';
import { SegmentType } from '@/types';
import toast from 'react-hot-toast';

// Segment criteria filters mapping
const SEGMENT_CRITERIA: Record<SegmentType, string[]> = {
  'high-engagement': [
    'Engagement Score > 80',
    'Total Orders ≥ 4',
    'Active in last 7 days',
    'Broadcast Read Rate > 90%',
  ],
  'purchase-intent': [
    'Abandoned Cart < 48 hrs',
    'Broadcast Link Click-through',
    'Active in last 3 days',
    'Catalog Views ≥ 2x',
  ],
  'new-customers': [
    'Subscribed < 30 days',
    '0 to 1 Lifetime Orders',
    'Opted-in via WhatsApp',
    'Browsing First Routine',
  ],
  'at-risk': [
    'No Activity > 45 days',
    'Past Orders ≥ 1',
    'Unopened Broadcasts ≥ 3',
    'Engagement Score < 40',
  ],
};

// Campaign suggestions per segment
const CAMPAIGN_SUGGESTIONS: Record<
  SegmentType,
  {
    title: string;
    description: string;
    expectedLift: string;
    suggestedTiming: string;
    sampleMessage: string;
  }
> = {
  'high-engagement': {
    title: 'VIP Early Access & Secret Reward',
    description:
      'Reward your top skincare enthusiasts with early VIP access to the new Barrier Glow Gel and an exclusive 20% loyalty discount code before public announcement.',
    expectedLift: '+38% conversion vs standard broadcast',
    suggestedTiming: 'Friday evening 6:00 PM',
    sampleMessage:
      '🌟 Exclusive VIP Access, {{name}}! As one of our top Glow Theory patrons, you get 24-hour early access to our limited-batch Barrier Glow Cream + 20% off with VIPGLOW. Tap here to reserve yours!',
  },
  'purchase-intent': {
    title: 'Cart Recovery & Personalized Nudge',
    description:
      'Send an instant warm follow-up to shoppers who browsed or left serums in their bag, answering formula questions with a limited 10% checkout perk.',
    expectedLift: '+24% recovery rate within 24h',
    suggestedTiming: 'Within 2 hours of cart addition',
    sampleMessage:
      'Hey {{name}} 🌿 We noticed you left the Glow Theory Vitamin C Drops in your bag! Still wondering how it layers with your routine? Reply to chat with our skincare advisor or use code CART10 to finalize today.',
  },
  'new-customers': {
    title: 'Welcome Routine Discovery & Guide',
    description:
      'Deliver a high-touch 3-step routine onboarding guide with an introductory code to turn initial curiosity into their very first complete order.',
    expectedLift: '+31% second-week activation',
    suggestedTiming: 'Day 2 after opt-in',
    sampleMessage:
      'Welcome to Glow Theory, {{name}}! ✨ Unsure where to start your clear skin journey? Reply "SKIN" for a quick 60-second routine recommendation + take 15% off your first ritual with code GLOWWELCOME.',
  },
  'at-risk': {
    title: '"We Miss You" Reactivation Special',
    description:
      'Re-engage dormant patrons with a warm check-in, highlighting what has changed in our formulations plus a ₹300 reactivation store credit.',
    expectedLift: '+18% reactivation of dormant contacts',
    suggestedTiming: 'Saturday morning 10:30 AM',
    sampleMessage:
      'Hi {{name}}, it has been a while! 💕 We have upgraded our formulation with clean fermented rice water. We would love to welcome you back with a ₹300 credit on orders over ₹999. Use MISSYOU300 at checkout.',
  },
};

const BORDER_COLOR_MAP: Record<string, string> = {
  teal: 'border-l-teal-500',
  emerald: 'border-l-emerald-500',
  blue: 'border-l-blue-500',
  amber: 'border-l-amber-500',
};

export default function CrmSetupPage() {
  const {
    crmSegment,
    setCrmSegment,
    updateFeatureStatus,
    addDemoEvent,
    featureStatuses,
  } = useAppState();

  const [selectedSegmentId, setSelectedSegmentId] = useState<SegmentType>(
    crmSegment || 'high-engagement'
  );
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  // Calculate totals
  const totalCustomerCount = SEGMENT_INFO.reduce((sum, s) => sum + s.count, 0);
  const currentSegment =
    SEGMENT_INFO.find((s) => s.id === selectedSegmentId) || SEGMENT_INFO[0];
  const segmentPercentage = Math.round(
    (currentSegment.count / totalCustomerCount) * 100
  );

  // Filtered customer records
  const filteredCustomers = DEMO_CUSTOMERS.filter(
    (c) => c.segment === selectedSegmentId
  );

  const isAlreadyActive = featureStatuses.crm === 'active';

  // Handle segment activation
  const handleActivateSegmentation = () => {
    setIsActivating(true);
    setTimeout(() => {
      setCrmSegment(selectedSegmentId);
      updateFeatureStatus('crm', 'active');
      addDemoEvent({
        type: 'activation',
        feature: 'crm',
        description: `Activated Smart Customer Segmentation for ${currentSegment.name}`,
      });
      setIsActivating(false);
      toast.success(
        `Smart Segmentation activated! "${currentSegment.name}" cohort is ready for campaigns.`
      );
    }, 400);
  };

  // Handle simulated campaign creation
  const handleCreateCampaign = () => {
    setIsCampaignModalOpen(false);
    addDemoEvent({
      type: 'meaningful-use',
      feature: 'crm',
      description: `Created targeted campaign: "${CAMPAIGN_SUGGESTIONS[selectedSegmentId].title}" for ${currentSegment.name}`,
    });
    toast.success(
      `Demo campaign scheduled for ${currentSegment.count.toLocaleString()} customers in ${currentSegment.name}!`
    );
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header Breadcrumb & Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Step 3 of 3 · Growth Setup</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Smart Customer Segmentation
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Group your customers by engagement, purchase intent, and behavior to deliver high-relevance messaging.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAlreadyActive ? (
              <Badge variant="success" className="px-3 py-1.5 text-xs font-semibold" dot>
                Active in demo
              </Badge>
            ) : (
              <Badge variant="warning" className="px-3 py-1.5 text-xs font-semibold">
                Setup in progress
              </Badge>
            )}
            <Button
              variant="primary"
              size="sm"
              icon={<Check className="w-4 h-4" />}
              onClick={handleActivateSegmentation}
              loading={isActivating}
            >
              {isAlreadyActive ? 'Update Segmentation' : 'Activate Segmentation'}
            </Button>
          </div>
        </div>

        {/* Informative Banner */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-100 rounded-lg text-teal-700 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                Interactive Segmentation Preview
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Click any of the four customer cohorts below to inspect criteria filters, review demo customer ledgers, and trigger targeted broadcasts.
              </p>
            </div>
          </div>
          <Badge variant="teal" className="shrink-0 text-xs font-semibold">
            {formatNumber(totalCustomerCount)} Total Tracked Contacts
          </Badge>
        </div>

        {/* Section 2: Segment Selection Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                1. Select a Customer Cohort
              </h2>
              <p className="text-xs text-gray-500">
                Click a card below to inspect members and prepare targeted follow-ups.
              </p>
            </div>
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">
              4 segments auto-detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SEGMENT_INFO.map((segment) => {
              const isSelected = selectedSegmentId === segment.id;
              const borderLeftClass = BORDER_COLOR_MAP[segment.color] || 'border-l-teal-500';

              return (
                <div
                  key={segment.id}
                  onClick={() => setSelectedSegmentId(segment.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedSegmentId(segment.id);
                    }
                  }}
                  className={`relative text-left p-5 rounded-xl bg-white border-2 transition-all cursor-pointer border-l-4 ${borderLeftClass} ${
                    isSelected
                      ? 'border-teal-500 shadow-md ring-2 ring-teal-500/20 bg-teal-50/10'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-semibold text-base text-gray-900">
                          {segment.name}
                        </span>
                        {isSelected && (
                          <Badge variant="teal" className="text-[11px] py-0 px-2 font-medium">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">
                        {segment.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xl font-bold text-gray-900 block leading-tight">
                        {formatNumber(segment.count)}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {Math.round((segment.count / totalCustomerCount) * 100)}% of base
                      </span>
                    </div>
                  </div>

                  {/* Suggested Action Bar inside Card */}
                  <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate font-medium text-gray-700">
                        {segment.suggestedAction}
                      </span>
                    </div>
                    <ArrowRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isSelected ? 'text-teal-600 translate-x-1' : 'text-gray-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3 & 5: Segment Detail Panel & Suggested Campaign Action */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Segment Detail Panel (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-teal-100/80 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/60 pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">
                      {currentSegment.name} Cohort Overview
                    </h3>
                    <p className="text-xs text-gray-500">
                      Detailed segment metrics & active dynamic filters
                    </p>
                  </div>
                </div>
                <Badge variant="teal" className="text-xs">
                  {segmentPercentage}% of audience
                </Badge>
              </CardHeader>

              <CardContent className="space-y-5 pt-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentSegment.description}
                </p>

                {/* Progress bar of segment size */}
                <div className="bg-white p-3.5 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1.5">
                    <span>Cohort Size: {formatNumber(currentSegment.count)} users</span>
                    <span>Total Database: {formatNumber(totalCustomerCount)} users</span>
                  </div>
                  <ProgressBar
                    value={currentSegment.count}
                    max={totalCustomerCount}
                    color="bg-teal-600"
                    size="md"
                    showPercentage={false}
                  />
                </div>

                {/* Filter Badges criteria */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Automated Segmentation Rules
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {SEGMENT_CRITERIA[selectedSegmentId].map((criterion, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                        {criterion}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Action Bar */}
                <div className="p-3.5 rounded-lg bg-teal-50/50 border border-teal-200/60 flex items-start gap-3">
                  <Award className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-teal-900">
                      Recommended Next Step
                    </p>
                    <p className="text-xs text-teal-800 mt-0.5">
                      {currentSegment.suggestedAction}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Customer Table */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-base">
                      Sample Customers in this Segment
                    </h3>
                    <Badge variant="default" className="text-xs">
                      {filteredCustomers.length} shown
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Live sample records evaluated against the current filter set.
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 italic">
                  Showing fictitious demo data. No real customer information is displayed.
                </span>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600 border-collapse">
                    <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold text-gray-700">
                      <tr>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Last Active</th>
                        <th className="py-3 px-4 text-center">Orders</th>
                        <th className="py-3 px-4 text-right">Engagement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">
                            No customers currently assigned to this cohort.
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((cust) => {
                          const score = cust.engagementScore;
                          const scoreColorClass =
                            score > 70
                              ? 'bg-emerald-500'
                              : score >= 40
                              ? 'bg-amber-500'
                              : 'bg-red-500';
                          const textColorClass =
                            score > 70
                              ? 'text-emerald-700'
                              : score >= 40
                              ? 'text-amber-700'
                              : 'text-red-700';

                          return (
                            <tr
                              key={cust.id}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="py-3.5 px-4 font-medium text-gray-900">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                                    {cust.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </div>
                                  <span>{cust.name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-gray-500">
                                <div className="truncate max-w-[150px] sm:max-w-[200px]">
                                  {cust.email}
                                </div>
                                <div className="text-[11px] text-gray-400">{cust.phone}</div>
                              </td>
                              <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                                {getRelativeTime(cust.lastActive)}
                              </td>
                              <td className="py-3.5 px-4 text-center font-medium text-gray-800">
                                {cust.totalOrders}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${scoreColorClass}`}
                                      style={{ width: `${score}%` }}
                                    />
                                  </div>
                                  <span
                                    className={`font-semibold text-xs min-w-[28px] ${textColorClass}`}
                                  >
                                    {score}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                  <span>
                    Fictitious demo records for Glow Theory skincare brand testing.
                  </span>
                  <span className="font-medium text-teal-700">
                    Live auto-sync enabled
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Suggested Campaign Action Card & How Segmentation Helps */}
          <div className="space-y-6">
            {/* Section 5: Suggested Follow-Up Action Card */}
            <Card className="border-teal-200 bg-gradient-to-b from-white to-teal-50/20 shadow-sm">
              <CardHeader className="pb-3 border-b border-teal-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-teal-100 text-teal-700 rounded-md">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Suggested Targeted Action
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Pre-composed for {currentSegment.name}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {CAMPAIGN_SUGGESTIONS[selectedSegmentId].title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {CAMPAIGN_SUGGESTIONS[selectedSegmentId].description}
                  </p>
                </div>

                <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200/80 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-400">Est. Audience:</span>
                    <span className="font-semibold text-gray-900">
                      {formatNumber(currentSegment.count)} users
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-400">Expected Lift:</span>
                    <span className="font-semibold text-emerald-700">
                      {CAMPAIGN_SUGGESTIONS[selectedSegmentId].expectedLift}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-400">Recommended Time:</span>
                    <span className="font-medium text-gray-700">
                      {CAMPAIGN_SUGGESTIONS[selectedSegmentId].suggestedTiming}
                    </span>
                  </div>
                </div>

                {/* Sample WhatsApp message snippet */}
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    WhatsApp Message Preview
                  </span>
                  <div className="p-3 bg-[#E7F8E8] rounded-lg border border-emerald-200 text-xs text-gray-800 font-sans leading-relaxed shadow-inner">
                    {CAMPAIGN_SUGGESTIONS[selectedSegmentId].sampleMessage}
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  icon={<Send className="w-4 h-4" />}
                  onClick={() => setIsCampaignModalOpen(true)}
                >
                  Create Campaign (Demo)
                </Button>
              </CardContent>
            </Card>

            {/* Section 6: How Segmentation Helps */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Why Segmentation Works Better
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs text-gray-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-0.5">
                      3.2x Higher Click-Through Rates
                    </strong>
                    Segmented broadcasts match current buying stage rather than blasting generic product links to all users.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-0.5">
                      Protects WhatsApp Health Score
                    </strong>
                    Irrelevant mass blasts drive blocks and reports. Segmented outreach keeps opt-out rates below 0.3%.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-0.5">
                      Automated Cohort Rebalancing
                    </strong>
                    Customers migrate between segments automatically as they place orders, open messages, or browse products.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 8: Footer Navigation CTAs */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/growth-guide">
            <Button
              variant="outline"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Growth Guide
            </Button>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link href="/growth-guide/setup/chatbot">
              <Button variant="secondary" size="md">
                Set up another feature
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              icon={<Check className="w-4 h-4" />}
              onClick={handleActivateSegmentation}
              loading={isActivating}
            >
              {isAlreadyActive ? 'Save & Keep Active' : 'Activate Segmentation'}
            </Button>
          </div>
        </div>
      </div>

      {/* Campaign Simulation Modal */}
      <Modal
        open={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        title={`Schedule Demo Campaign: ${CAMPAIGN_SUGGESTIONS[selectedSegmentId].title}`}
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCampaignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Send className="w-4 h-4" />}
              onClick={handleCreateCampaign}
            >
              Dispatch Demo Campaign
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-sm">
          <DemoBanner />
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Target Audience
            </label>
            <p className="text-gray-900 font-medium">
              {currentSegment.name} ({formatNumber(currentSegment.count)} verified contacts)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Scheduled Broadcast Time
            </label>
            <p className="text-gray-800">
              {CAMPAIGN_SUGGESTIONS[selectedSegmentId].suggestedTiming} (Optimal window)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              WhatsApp Broadcast Content
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
              {CAMPAIGN_SUGGESTIONS[selectedSegmentId].sampleMessage}
            </div>
          </div>

          <div className="p-3 bg-teal-50 rounded-lg border border-teal-100 text-xs text-teal-800">
            <strong>Simulation Note:</strong> In live production, dispatching this campaign will automatically track click-through conversions and log reply rates into your Analytics dashboard.
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
