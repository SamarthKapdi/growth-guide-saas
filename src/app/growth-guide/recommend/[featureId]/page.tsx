'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Bot,
  Zap,
  Users,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Shield,
  Target,
  Check,
  Layers,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  SectionHeader,
} from '@/components/ui';
import { useAppState } from '@/lib/store';
import { FEATURE_RECOMMENDATIONS } from '@/data/mock-data';
import { AppLayout } from '@/components/layout/AppLayout';
import { FeatureId, FeatureStatus } from '@/types';
import { getStatusLabel } from '@/lib/utils';

export default function RecommendationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const featureId = params?.featureId as FeatureId;

  const {
    recommendedFeature,
    featureStatuses,
    getRecommendation,
    addDemoEvent,
    business,
  } = useAppState();

  // Look up feature by ID
  const feature = useMemo(() => {
    return FEATURE_RECOMMENDATIONS.find((f) => f.id === featureId);
  }, [featureId]);

  // Determine if this is the active recommended feature for the user
  const isRecommended = useMemo(() => {
    const activeRec = getRecommendation();
    return recommendedFeature === featureId || activeRec.id === featureId;
  }, [recommendedFeature, featureId, getRecommendation]);

  // Feature status in current state
  const status: FeatureStatus = (feature && featureStatuses[feature.id]) || 'not-started';

  // Record engagement event once when viewed
  useEffect(() => {
    if (feature) {
      addDemoEvent({
        type: 'engagement',
        feature: feature.id,
        description: `Viewed detailed recommendation specs for ${feature.title}.`,
      });
    }
  }, [feature?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // If feature not found, display a fallback view
  if (!feature) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in text-center">
          <Card className="p-8 space-y-5">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Recommendation Not Found</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn&apos;t locate the requested feature recommendation. It may have been moved or updated.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => router.push('/growth-guide')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Growth Guide
              </Button>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Feature visual theme configurations
  const getFeatureTheme = (id: FeatureId) => {
    switch (id) {
      case 'chatbot':
        return {
          icon: <Bot className="w-8 h-8 text-teal-600" />,
          iconBg: 'bg-teal-50 border-teal-200 text-teal-600',
          accentBorder: 'border-l-teal-600',
          accentText: 'text-teal-700',
          badgeVariant: 'teal' as const,
        };
      case 'automation':
        return {
          icon: <Zap className="w-8 h-8 text-emerald-600" />,
          iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
          accentBorder: 'border-l-emerald-600',
          accentText: 'text-emerald-700',
          badgeVariant: 'success' as const,
        };
      case 'crm':
        return {
          icon: <Users className="w-8 h-8 text-blue-600" />,
          iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
          accentBorder: 'border-l-blue-600',
          accentText: 'text-blue-700',
          badgeVariant: 'info' as const,
        };
      default:
        return {
          icon: <Sparkles className="w-8 h-8 text-teal-600" />,
          iconBg: 'bg-teal-50 border-teal-200 text-teal-600',
          accentBorder: 'border-l-teal-600',
          accentText: 'text-teal-700',
          badgeVariant: 'teal' as const,
        };
    }
  };

  const theme = getFeatureTheme(feature.id);

  // Status badge styling
  const getStatusBadgeVariant = (st: FeatureStatus) => {
    switch (st) {
      case 'completed':
      case 'active':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const setupUrl = `/growth-guide/setup/${feature.id}`;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in pb-16">
        
        {/* 1. BACK NAVIGATION & BREADCRUMBS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/growth-guide')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Growth Guide
            </Button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
              <span>Growth Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Recommendations</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-medium text-gray-700">{feature.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRecommended && (
              <Badge variant="teal" dot className="font-semibold px-3 py-1 text-xs">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-600" />
                Recommended for You
              </Badge>
            )}
            <Badge variant={getStatusBadgeVariant(status)} className="px-3 py-1 text-xs capitalize">
              Status: {getStatusLabel(status)}
            </Badge>
          </div>
        </div>

        {/* 2. HERO SECTION */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-teal-50/60 pointer-events-none blur-2xl" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Feature Icon in colored circle */}
            <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm ${theme.iconBg}`}>
              {theme.icon}
            </div>

            {/* Feature Title & Subtitle */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {feature.title}
                </h1>
                {isRecommended && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    Top Match
                  </span>
                )}
              </div>
              <p className="text-base sm:text-lg text-gray-600 font-medium">
                {feature.subtitle}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed max-w-3xl pt-1">
                {feature.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50/70 rounded-xl p-3 border border-gray-100">
              <span className="text-xs text-gray-400 font-medium block">Setup Time</span>
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                {feature.setupDuration}
              </span>
            </div>
            <div className="bg-gray-50/70 rounded-xl p-3 border border-gray-100">
              <span className="text-xs text-gray-400 font-medium block">Configuration</span>
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                {feature.setupSteps.length} Quick Steps
              </span>
            </div>
            <div className="bg-gray-50/70 rounded-xl p-3 border border-gray-100">
              <span className="text-xs text-gray-400 font-medium block">Target Account</span>
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                {business.name}
              </span>
            </div>
            <div className="bg-gray-50/70 rounded-xl p-3 border border-gray-100">
              <span className="text-xs text-gray-400 font-medium block">Tier Included</span>
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                Growth Plan
              </span>
            </div>
          </div>
        </div>

        {/* 3 & 4. PROBLEM STATEMENT & SOLUTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem Statement Card */}
          <Card className="border-l-4 border-l-amber-500 bg-amber-50/20 shadow-sm relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">The Problem</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                {feature.problemItSolves}
              </p>
              <p className="text-xs text-gray-500 leading-normal border-t border-amber-100 pt-3">
                Identified from your store activity and recent WhatsApp broadcast engagement patterns.
              </p>
            </CardContent>
          </Card>

          {/* Solution Card */}
          <Card className="border-l-4 border-l-teal-600 bg-teal-50/20 shadow-sm relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">Recommended Solution</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                  {feature.title}
                </span>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  {feature.whyRecommended}
                </p>
              </div>
              <p className="text-xs text-gray-500 leading-normal border-t border-teal-100 pt-3">
                Tailored heuristic recommendation designed to maximize repeat orders and save staff hours.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 5. BENEFITS SECTION */}
        <div className="space-y-4">
          <SectionHeader
            title="What You Will Get"
            description="Measurable outcomes and compounding capabilities unlocked once this feature is configured."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feature.benefits.map((benefit, index) => (
              <Card
                key={index}
                className="hover:border-teal-200 transition-all shadow-sm bg-white border border-gray-200"
              >
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">
                      {benefit}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Designed for WhatsApp high-conversion customer conversations
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 6. SETUP INFO CARD (TWO COLUMNS) */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Setup & Prerequisites</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Everything you need to know before initiating setup.
                </p>
              </div>
              <Badge variant="teal" className="text-xs font-semibold">
                Guided Flow Available
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              {/* Left Column: Duration & Step Count */}
              <div className="space-y-6 md:pr-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                    Setup Duration
                  </h3>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="p-2.5 bg-teal-100 text-teal-700 rounded-lg">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          {feature.setupDuration}
                        </span>
                        <span className="text-xs text-gray-500 font-medium bg-white px-2 py-0.5 rounded border border-gray-200">
                          Estimated · Illustrative
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Zero custom code required. Pre-built templates ready for quick deployment.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Implementation Scope
                  </h3>
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                    <span className="text-gray-600 font-medium">Guided Setup Steps</span>
                    <span className="font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      {feature.setupSteps.length} simple steps
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Requirements */}
              <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  What You Will Need
                </h3>
                <div className="space-y-3">
                  {feature.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="p-1 bg-teal-50 text-teal-600 rounded mt-0.5 shrink-0">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {req}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 italic pt-1">
                  All requirements are verified automatically during the guided activation process.
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* 7. SETUP STEPS PREVIEW */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Setup Steps Preview</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Follow this guided milestone checklist inside our interactive setup flow.
                </p>
              </div>
              <Badge variant="default" className="text-xs font-medium">
                Step-by-step
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {feature.setupSteps.map((step, idx) => {
                const stepNum = idx + 1;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-teal-200 hover:bg-teal-50/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {stepNum}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {step}
                        </p>
                        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                          Step {stepNum} of {feature.setupSteps.length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {idx === 0 && 'Select and configure tailored options based on your store profile.'}
                        {idx === 1 && 'Align behavioral triggers with your marketing calendar.'}
                        {idx === 2 && 'Preview real-time simulation before activating live responses.'}
                        {idx >= 3 && 'Publish changes and initiate analytics tracking.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 8. PLAN ELIGIBILITY NOTICE */}
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold text-blue-900">Plan Eligibility Notice</h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              {feature.planNote}
            </p>
            <p className="text-xs text-blue-600 pt-1">
              Currently on the <strong>{business.plan} Plan</strong>. You can preview all configurations in demo mode without changing billing tiers.
            </p>
          </div>
        </div>

        {/* 9. CTA SECTION */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900">
              Ready to launch {feature.title}?
            </h3>
            <p className="text-sm text-gray-500">
              Setup takes approximately {feature.setupDuration}. All simulation steps are non-destructive.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => router.push('/growth-guide')}
            >
              Choose Another Feature
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-md"
              onClick={() => router.push(setupUrl)}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Set Up {feature.title}
            </Button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
