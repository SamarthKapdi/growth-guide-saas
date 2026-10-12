'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Compass,
  CheckCircle2,
  Award,
  Eye,
  Clock,
  Info,
  Layers,
  Activity,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Card,
  CardHeader,
  CardContent,
  StatCard,
  ProgressBar,
  Badge,
  Button,
} from '@/components/ui';
import { useAppState } from '@/lib/store';
import { formatNumber, getRelativeTime } from '@/lib/utils';
import { ProgressEvent } from '@/types';

export default function AnalyticsPage() {
  const { analytics, featureStatuses, demoEvents } = useAppState();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate North Star Metric
  // Percentage of prototype features activated by business (out of 3 core features: chatbot, automation, crm)
  const activeFeaturesCount = Object.values(featureStatuses).filter(
    (status) => status === 'active' || status === 'completed'
  ).length;

  // Formula as specified: (featureActivations / 3 * 100, capped at 100)
  // Using activeFeaturesCount to reflect real session state progress alongside demo metric
  const northStarSimulatedRate = Math.min(
    100,
    Math.round((activeFeaturesCount / 3) * 100)
  );

  // Supporting rates
  const recToActivationRate =
    analytics.recommendationEngagement > 0
      ? Math.round(
          (analytics.featureActivations / analytics.recommendationEngagement) *
            100
        )
      : 0;

  const meaningfulUseRate =
    analytics.featureActivations > 0
      ? Math.round(
          (analytics.meaningfulUseEvents / analytics.featureActivations) * 100
        )
      : 0;

  // Combined timeline deduplicated & sorted
  const allTimelineEvents = useMemo(() => {
    const map = new Map<string, ProgressEvent>();
    demoEvents.forEach((e) => map.set(e.id, e));
    (analytics.progressTimeline || []).forEach((e) => {
      if (!map.has(e.id)) {
        map.set(e.id, e);
      }
    });
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [demoEvents, analytics.progressTimeline]);

  const sessionEvents = allTimelineEvents.filter((e) => e.isSessionEvent);
  const seedEvents = allTimelineEvents.filter((e) => !e.isSessionEvent);

  // Event icon helper
  const getEventIcon = (type: ProgressEvent['type']) => {
    switch (type) {
      case 'impression':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'engagement':
        return <Compass className="w-4 h-4 text-purple-600" />;
      case 'activation':
        return <CheckCircle2 className="w-4 h-4 text-teal-600" />;
      case 'meaningful-use':
        return <Award className="w-4 h-4 text-emerald-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventBg = (type: ProgressEvent['type']) => {
    switch (type) {
      case 'impression':
        return 'bg-blue-50 border-blue-200';
      case 'engagement':
        return 'bg-purple-50 border-purple-200';
      case 'activation':
        return 'bg-teal-50 border-teal-200';
      case 'meaningful-use':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Screen 8 · Impact & Measurement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Growth Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Track your feature discovery and activation progress
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/growth-guide">
              <Button variant="outline" size="sm" icon={<Compass className="w-4 h-4" />}>
                Growth Guide
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 2: North Star Metric Card (Prominent) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/20 rounded-lg text-teal-300">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-xs uppercase tracking-widest font-semibold text-teal-400">
                  North Star Metric
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Illustrative · Not experimentally validated
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Feature Activation & Meaningful Use Rate
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Percentage of monthly active businesses that activate and meaningfully use at least one previously unused feature within 30 days.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span>Target: <strong className="text-white">+10 percentage points within 3 months</strong> (hypothesis)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>2-week baseline measurement period</span>
                  </div>
                </div>
              </div>

              {/* Metric display box */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 text-center flex flex-col justify-center items-center">
                <span className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                  Current Simulated Value
                </span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-teal-300">
                    {northStarSimulatedRate}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {activeFeaturesCount} of 3 guide features currently active in demo
                </p>
                <div className="w-full mt-3">
                  <ProgressBar
                    value={northStarSimulatedRate}
                    max={100}
                    color="bg-teal-400"
                    size="sm"
                    showPercentage={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Supporting Metrics Grid (3 cards) */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            Supporting Funnel Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <Card className="hover:border-teal-300 transition-all">
              <CardContent className="space-y-2 pt-5">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold uppercase tracking-wider">Conversion</span>
                  <Badge variant="teal">Calculated</Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Recommendation-to-Activation Rate
                </h3>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-bold text-gray-900">
                    {recToActivationRate}%
                  </span>
                  <span className="text-xs text-gray-500">
                    ({analytics.featureActivations} / {analytics.recommendationEngagement} engaged)
                  </span>
                </div>
                <p className="text-xs text-gray-500 pt-1 leading-relaxed">
                  Measures how effectively recommended cards persuade users to initiate setup wizard.
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="hover:border-emerald-300 transition-all">
              <CardContent className="space-y-2 pt-5">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold uppercase tracking-wider">Depth of Use</span>
                  <Badge variant="success">Calculated</Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Meaningful Use within 7 Days
                </h3>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-bold text-emerald-700">
                    {meaningfulUseRate}%
                  </span>
                  <span className="text-xs text-gray-500">
                    ({analytics.meaningfulUseEvents} / {analytics.featureActivations} activated)
                  </span>
                </div>
                <p className="text-xs text-gray-500 pt-1 leading-relaxed">
                  Validates real workflow adoption (e.g. 10 bot replies, 1 scheduled automation).
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="hover:border-slate-300 transition-all bg-slate-50/50">
              <CardContent className="space-y-2 pt-5">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold uppercase tracking-wider">Long-Term Impact</span>
                  <Badge variant="default">Pending</Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  30-Day Cohort Retention
                </h3>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-bold text-gray-600">
                    Baseline pending
                  </span>
                </div>
                <p className="text-xs text-gray-500 pt-1 leading-relaxed">
                  Awaiting completion of the 2-week baseline cohort cycle to evaluate churn reduction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 4: Stats Row (4 StatCards) */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            Funnel Event Volumes
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Recommendation Impressions"
              value={formatNumber(analytics.recommendationImpressions)}
              subtitle="Guide banner & card views"
              icon={<Eye className="w-5 h-5" />}
            />
            <StatCard
              label="Engagements"
              value={formatNumber(analytics.recommendationEngagement)}
              subtitle="Clicks & setup wizard opens"
              icon={<Compass className="w-5 h-5" />}
            />
            <StatCard
              label="Feature Activations"
              value={formatNumber(analytics.featureActivations)}
              subtitle="Completed configuration flows"
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
            <StatCard
              label="Meaningful Use Events"
              value={formatNumber(analytics.meaningfulUseEvents)}
              subtitle="High-impact actions triggered"
              icon={<Award className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Section 5: Trend Chart (Recharts) */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <h3 className="font-semibold text-gray-900 text-base">
                  Weekly Engagement Trend
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Historical progression across impressions, clicks, and activations over 6 weeks.
              </p>
            </div>
            <span className="inline-flex items-center text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
              Seeded demo data · Not measured outcomes
            </span>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="w-full h-72 sm:h-80">
              {isMounted && analytics.weeklyTrend && analytics.weeklyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics.weeklyTrend}
                    margin={{ top: 10, right: 25, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="week"
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      axisLine={{ stroke: '#E2E8F0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      axisLine={{ stroke: '#E2E8F0' }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{ color: '#FFFFFF' }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ fontSize: '12px', color: '#475569' }}
                    />
                    <Line
                      type="monotone"
                      name="Impressions"
                      dataKey="impressions"
                      stroke="#0D9488"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#0D9488' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      name="Engagements"
                      dataKey="engagements"
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#6366F1' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      name="Activations"
                      dataKey="activations"
                      stroke="#059669"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#059669' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  Loading trend visualization...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Feature Adoption Breakdown */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">
                  Feature Adoption Breakdown
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Proportion of activated businesses reaching meaningful depth of use
                </p>
              </div>
              <Badge variant="teal">3 Features Tracked</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {analytics.featureBreakdown.map((item, idx) => {
              const conversion =
                item.activated > 0
                  ? Math.round((item.meaningfulUse / item.activated) * 100)
                  : 0;

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-gray-900">
                        {item.feature}
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-4 text-xs">
                      <span className="text-gray-500">
                        <strong className="text-gray-800">{item.activated}</strong> activated
                      </span>
                      <span className="text-gray-500">
                        <strong className="text-emerald-700">{item.meaningfulUse}</strong> meaningful
                      </span>
                      <span className="font-bold text-teal-700 min-w-[36px]">
                        {conversion}%
                      </span>
                    </div>
                  </div>

                  {/* Dual layered visual bar */}
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="h-full transition-all duration-500 rounded-l-full"
                      style={{
                        width: `${Math.min(100, (item.activated / 50) * 100)}%`,
                        backgroundColor: item.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Section 7: Progress Timeline */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <h3 className="font-semibold text-gray-900 text-base">
                  Activity Timeline
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Audit trail of recommendation impressions, user clicks, activations, and meaningful milestones.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {sessionEvents.length > 0 && (
                <Badge variant="teal" dot>
                  {sessionEvents.length} session action{sessionEvents.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            {/* Session Events (if any) */}
            {sessionEvents.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Current Session Actions ({sessionEvents.length})
                  </h4>
                </div>
                <div className="space-y-3">
                  {sessionEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/80 flex items-start gap-3 transition-all"
                    >
                      <div
                        className={`p-2 rounded-lg border ${getEventBg(
                          evt.type
                        )} shrink-0 mt-0.5`}
                      >
                        {getEventIcon(evt.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {evt.description}
                          </p>
                          <Badge variant="teal" className="text-[10px] shrink-0 font-semibold">
                            Session event
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="capitalize font-medium text-teal-700">
                            {evt.type.replace('-', ' ')}
                          </span>
                          <span>·</span>
                          <span>{getRelativeTime(evt.timestamp)}</span>
                          <span>·</span>
                          <span className="uppercase text-[10px] font-semibold text-gray-400">
                            {evt.feature}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seeded Events Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pre-Seeded Historical Log ({seedEvents.length})
                </h4>
              </div>
              <div className="space-y-3">
                {seedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl bg-white border border-gray-200 flex items-start gap-3 hover:border-gray-300 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-lg border ${getEventBg(
                        evt.type
                      )} shrink-0 mt-0.5`}
                    >
                      {getEventIcon(evt.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-gray-800 font-medium">
                          {evt.description}
                        </p>
                        <span className="text-xs text-gray-400 shrink-0">
                          {getRelativeTime(evt.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="capitalize font-medium text-gray-600">
                          {evt.type.replace('-', ' ')}
                        </span>
                        <span>·</span>
                        <span className="uppercase text-[10px] font-semibold text-gray-400">
                          {evt.feature}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Metric Definitions Card at bottom */}
        <Card className="border-slate-200 bg-slate-50/70">
          <CardHeader className="pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-700" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Framework & Metric Definitions
              </h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 text-xs text-slate-600 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-lg bg-white border border-slate-200">
                <span className="font-bold text-slate-900 block">
                  North Star vs Supporting Metrics
                </span>
                <p>
                  The North Star metric synthesizes both <em>activation</em> and <em>meaningful depth of use</em> into a single health index. Supporting funnel metrics isolate where friction happens along the discovery-to-habit pipeline.
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-white border border-slate-200">
                <span className="font-bold text-slate-900 block">
                  Proposed Metrics · Not Proven Outcomes
                </span>
                <p>
                  These numbers are model hypotheses generated for product discovery testing. Live production measurement requires instrumented cohort telemetry over continuous 30-day windows.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Part of the Cheerio AI Product Intern Assignment · Prototype Screen 8.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
