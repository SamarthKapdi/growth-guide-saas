'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Send,
  Clock,
  Sparkles,
  Bot,
  Zap,
  MessageSquare,
  Megaphone,
  UserPlus,
  ArrowRight,
  TrendingUp,
  BarChart2,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Card,
  CardHeader,
  CardContent,
  StatCard,
  ProgressBar,
  Badge,
} from '@/components/ui';
import { useAppState } from '@/lib/store';
import {
  DASHBOARD_METRICS,
  RECENT_ACTIVITIES,
} from '@/data/mock-data';
import { formatNumber, getRelativeTime, getStatusLabel } from '@/lib/utils';
import { FeatureId, FeatureStatus } from '@/types';

// Activity icon renderer
function ActivityIcon({ iconName }: { iconName: string }) {
  switch (iconName) {
    case 'Megaphone':
      return <Megaphone className="w-4 h-4 text-teal-600" />;
    case 'MessageSquare':
      return <MessageSquare className="w-4 h-4 text-blue-600" />;
    case 'UserPlus':
      return <UserPlus className="w-4 h-4 text-emerald-600" />;
    case 'Zap':
      return <Zap className="w-4 h-4 text-amber-600" />;
    case 'Bot':
      return <Bot className="w-4 h-4 text-purple-600" />;
    case 'Clock':
      return <Clock className="w-4 h-4 text-indigo-600" />;
    default:
      return <Sparkles className="w-4 h-4 text-gray-500" />;
  }
}

function getBadgeVariant(status: FeatureStatus | 'active'): 'success' | 'warning' | 'default' {
  if (status === 'active' || status === 'completed') return 'success';
  if (status === 'in-progress') return 'warning';
  return 'default';
}

export default function DashboardPage() {
  const { business, featureStatuses } = useAppState();
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const ownerFirstName = business?.owner ? business.owner.split(' ')[0] : 'Priya';
  const businessName = business?.name || 'Glow Theory';

  // Count active/completed features out of 3 core growth features
  const activatedFeaturesCount = Object.values(featureStatuses).filter(
    (status) => status === 'active' || status === 'completed'
  ).length;

  // Funnel calculations
  const totalSent = DASHBOARD_METRICS.campaignMetrics.totalSent;
  const delivered = DASHBOARD_METRICS.campaignMetrics.delivered;
  const read = DASHBOARD_METRICS.campaignMetrics.read;
  const clicked = DASHBOARD_METRICS.campaignMetrics.clicked;
  const replied = DASHBOARD_METRICS.campaignMetrics.replied;

  const funnelItems = [
    {
      label: 'Sent',
      count: totalSent,
      rate: '100%',
      pctValue: 100,
      color: 'bg-teal-600',
      description: 'Broadcast attempts initiated',
    },
    {
      label: 'Delivered',
      count: delivered,
      rate: `${Math.round((delivered / totalSent) * 100)}%`,
      pctValue: Math.round((delivered / totalSent) * 100),
      color: 'bg-teal-500',
      description: 'Successfully reached subscriber inboxes',
    },
    {
      label: 'Read',
      count: read,
      rate: `${Math.round((read / totalSent) * 100)}%`,
      pctValue: Math.round((read / totalSent) * 100),
      color: 'bg-emerald-500',
      description: 'Opened & viewed on WhatsApp',
    },
    {
      label: 'Clicked',
      count: clicked,
      rate: `${Math.round((clicked / totalSent) * 100)}%`,
      pctValue: Math.round((clicked / totalSent) * 100),
      color: 'bg-amber-500',
      description: 'CTA catalog & product links tapped',
    },
    {
      label: 'Replied',
      count: replied,
      rate: `${Math.round((replied / totalSent) * 100)}%`,
      pctValue: Math.round((replied / totalSent) * 100),
      color: 'bg-purple-500',
      description: 'Direct conversational inquiries',
    },
  ];

  // Feature status list items
  const featuresList = [
    {
      id: 'whatsapp-campaigns',
      name: 'WhatsApp Campaigns',
      description: 'Broadcast promotional messages & updates',
      status: 'active' as const,
      statusLabel: 'Active',
      icon: Megaphone,
      badgeVariant: 'success' as const,
      actionText: 'View',
      actionHref: '/dashboard#funnel',
    },
    {
      id: 'chatbot' as FeatureId,
      name: 'AI FAQ Chatbot',
      description: 'Instant answers to product & shipping questions',
      status: featureStatuses.chatbot,
      statusLabel: getStatusLabel(featureStatuses.chatbot),
      icon: Bot,
      badgeVariant: getBadgeVariant(featureStatuses.chatbot),
      actionText: featureStatuses.chatbot === 'not-started' ? 'Set up' : 'View',
      actionHref: '/growth-guide',
    },
    {
      id: 'automation' as FeatureId,
      name: 'Follow-Up Automation',
      description: 'Nurture campaign clicks & recover drop-offs',
      status: featureStatuses.automation,
      statusLabel: getStatusLabel(featureStatuses.automation),
      icon: Zap,
      badgeVariant: getBadgeVariant(featureStatuses.automation),
      actionText: featureStatuses.automation === 'not-started' ? 'Set up' : 'View',
      actionHref: '/growth-guide',
    },
    {
      id: 'crm' as FeatureId,
      name: 'CRM Segmentation',
      description: 'Target VIP, inactive & high-intent buyers',
      status: featureStatuses.crm,
      statusLabel: getStatusLabel(featureStatuses.crm),
      icon: Users,
      badgeVariant: getBadgeVariant(featureStatuses.crm),
      actionText: featureStatuses.crm === 'not-started' ? 'Set up' : 'View',
      actionHref: '/growth-guide',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {greeting}, {ownerFirstName}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Here is how <span className="font-medium text-gray-700">{businessName}</span> is performing
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Last 30 days
            </span>
          </div>
        </div>

        {/* 2. Stats Grid (4 cards in responsive grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            label="Total Customers"
            value={formatNumber(DASHBOARD_METRICS.totalCustomers)}
            change="+12.3% this month"
            changeType="positive"
            icon={<Users className="w-5 h-5 text-teal-600" />}
          />
          <StatCard
            label="Active Customers"
            value={formatNumber(DASHBOARD_METRICS.activeCustomers)}
            subtitle="74% of total"
            icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            label="Campaigns Sent"
            value={DASHBOARD_METRICS.campaignsSent}
            change="+3 this week"
            changeType="positive"
            icon={<Send className="w-5 h-5 text-teal-600" />}
          />
          <StatCard
            label="Avg Response Time"
            value={DASHBOARD_METRICS.avgResponseTime}
            change="-15% improved"
            changeType="positive"
            icon={<Clock className="w-5 h-5 text-teal-600" />}
          />
        </div>

        {/* 3. Campaign Performance Funnel Card */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-50/50">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-teal-600" />
                <h2 className="text-base font-semibold text-gray-900">Campaign Funnel Performance</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Conversion metrics across all broadcasts in the last 30 days
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="teal">WhatsApp Broadcasts</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {funnelItems.map((item) => (
                <div key={item.label} className="group">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{item.label}</span>
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        — {item.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500">
                        {item.rate}
                      </span>
                      <span className="font-bold text-gray-900 min-w-[70px] text-right">
                        {formatNumber(item.count)}
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    value={item.pctValue}
                    max={100}
                    color={item.color}
                    size="md"
                    showPercentage={false}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5 text-teal-700 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                Highest drop-off observed between Clicked (17%) and Replied (7%)
              </div>
              <div className="text-gray-400">
                Delivery rate: 95.0% · Read rate: 72.1%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Growth Guide Recommendation Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-6 sm:p-7 text-white shadow-lg">
          {/* Subtle background decorative shapes */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-teal-900/20 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-teal-50 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                Growth Opportunity Detected
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Your Growth Guide has a recommendation
              </h2>

              <p className="text-sm sm:text-base text-teal-50/90 leading-relaxed">
                Based on your usage, we have identified features that could significantly improve customer engagement and shorten your 2.4-hour average response time.
              </p>

              {/* 3 feature category badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-xs font-medium text-white border border-white/15">
                  <Bot className="w-3.5 h-3.5 text-teal-200" />
                  <span>AI FAQ Chatbot</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-xs font-medium text-white border border-white/15">
                  <Zap className="w-3.5 h-3.5 text-amber-200" />
                  <span>Follow-Up Automation</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-xs font-medium text-white border border-white/15">
                  <Users className="w-3.5 h-3.5 text-emerald-200" />
                  <span>CRM Segmentation</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex sm:items-center">
              <Link
                href="/growth-guide"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white text-teal-900 hover:bg-teal-50 active:bg-gray-100 shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                <span>Find my next growth opportunity</span>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </Link>
            </div>
          </div>
        </div>

        {/* 5. Two-Column Layout (3+2 split) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column (3 cols): Feature Usage Status */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Feature Status</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Activation and operational state of growth modules
                  </p>
                </div>
                <Link
                  href="/growth-guide"
                  className="text-xs font-medium text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                >
                  Manage all
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100 p-0">
                {featuresList.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-4 sm:px-6 hover:bg-gray-50/70 transition-colors"
                    >
                      <div className="flex items-start gap-3.5 min-w-0 pr-4">
                        <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600 shrink-0 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {feature.name}
                            </h4>
                            <Badge variant={feature.badgeVariant} dot>
                              {feature.statusLabel}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Link
                          href={feature.actionHref}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            feature.actionText === 'Set up'
                              ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {feature.actionText}
                          {feature.actionText === 'Set up' ? (
                            <ArrowRight className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3 text-gray-500" />
                          )}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column (2 cols): Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Latest actions across all channels</p>
                </div>
                <span className="text-xs font-medium text-gray-400">Real-time</span>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flow-root">
                  <ul className="-mb-6 space-y-4">
                    {RECENT_ACTIVITIES.slice(0, 5).map((activity, index) => (
                      <li key={activity.id} className="relative flex gap-3 pb-4">
                        {/* Connecting line */}
                        {index < 4 && (
                          <span
                            className="absolute left-4 top-8 -bottom-4 w-0.5 bg-gray-100"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 border border-gray-100">
                          <ActivityIcon iconName={activity.icon} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {activity.title}
                            </p>
                            <span className="shrink-0 text-[11px] text-gray-400">
                              {getRelativeTime(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {activity.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 6. Growth Journey Progress Section (Compact at bottom) */}
        <Card className="border-teal-100 bg-gradient-to-br from-white via-white to-teal-50/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-semibold text-gray-900">Your Growth Journey</h3>
                </div>
                <p className="text-xs text-gray-500">
                  Activate Cheerio’s high-impact growth features to unlock higher conversion and automation
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:min-w-[340px]">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-gray-700">
                      {activatedFeaturesCount} of 3 features activated
                    </span>
                    <span className="font-semibold text-teal-700">
                      {Math.round((activatedFeaturesCount / 3) * 100)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={activatedFeaturesCount}
                    max={3}
                    size="sm"
                    color="bg-teal-500"
                    showPercentage={false}
                  />
                </div>

                <Link
                  href="/growth-guide"
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
