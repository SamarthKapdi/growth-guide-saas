'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  Info,
  Compass,
  Bot,
  Zap,
  Users,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Badge, Modal, SectionHeader } from '@/components/ui';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppState } from '@/lib/store';
import { getStatusLabel } from '@/lib/utils';
import toast from 'react-hot-toast';
import { FeatureId } from '@/types';

const featureIcons: Record<FeatureId, React.ReactNode> = {
  chatbot: <Bot className="w-4 h-4" />,
  automation: <Zap className="w-4 h-4" />,
  crm: <Users className="w-4 h-4" />,
};

const featureNames: Record<FeatureId, string> = {
  chatbot: 'AI FAQ Chatbot',
  automation: 'Follow-Up Automation',
  crm: 'Smart Segmentation',
};

export default function SettingsPage() {
  const router = useRouter();
  const { featureStatuses, assessmentCompleted, resetDemo, demoEvents, analytics } = useAppState();
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    setResetting(true);
    setTimeout(() => {
      resetDemo();
      toast.success('Demo data has been reset');
      setResetting(false);
      setShowResetModal(false);
      router.push('/');
    }, 1000);
  };

  const activatedCount = Object.values(featureStatuses).filter(
    (s) => s === 'active' || s === 'completed'
  ).length;

  const sessionEventCount = demoEvents.filter((e) => e.isSessionEvent).length;

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings & Demo Controls</h1>
          <p className="text-gray-500 mt-1">
            Manage your demo session and explore prototype configuration
          </p>
        </div>

        {/* Demo Status */}
        <Card>
          <CardHeader>
            <SectionHeader
              title="Demo Session Status"
              description="Overview of your current demo state"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Assessment</p>
                <Badge variant={assessmentCompleted ? 'success' : 'default'} dot>
                  {assessmentCompleted ? 'Completed' : 'Not started'}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Features Activated</p>
                <p className="text-lg font-semibold text-gray-900">{activatedCount} / 3</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Session Events</p>
                <p className="text-lg font-semibold text-gray-900">{sessionEventCount}</p>
              </div>
            </div>

            {/* Feature Status List */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Feature Activation Status</p>
              <div className="space-y-2">
                {(Object.keys(featureStatuses) as FeatureId[]).map((fId) => (
                  <div
                    key={fId}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{featureIcons[fId]}</span>
                      <span className="text-sm font-medium text-gray-900">{featureNames[fId]}</span>
                    </div>
                    <Badge
                      variant={
                        featureStatuses[fId] === 'active' || featureStatuses[fId] === 'completed'
                          ? 'success'
                          : featureStatuses[fId] === 'in-progress'
                          ? 'warning'
                          : 'default'
                      }
                      dot
                    >
                      {getStatusLabel(featureStatuses[fId])}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <SectionHeader title="Quick Actions" />
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Return to Demo Entry</p>
                  <p className="text-xs text-gray-500">Go back to the welcome screen</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => router.push('/growth-guide')}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Compass className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Open Growth Guide</p>
                  <p className="text-xs text-gray-500">Start or continue the feature discovery journey</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Analytics Summary */}
        <Card>
          <CardHeader>
            <SectionHeader
              title="Demo Analytics Summary"
              description="Aggregate counts from this demo session and seed data"
            />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3">
                <p className="text-2xl font-bold text-gray-900">{analytics.recommendationImpressions}</p>
                <p className="text-xs text-gray-500 mt-1">Impressions</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold text-gray-900">{analytics.recommendationEngagement}</p>
                <p className="text-xs text-gray-500 mt-1">Engagements</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold text-gray-900">{analytics.featureActivations}</p>
                <p className="text-xs text-gray-500 mt-1">Activations</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold text-gray-900">{analytics.meaningfulUseEvents}</p>
                <p className="text-xs text-gray-500 mt-1">Meaningful Use</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Includes both seed data (illustrative) and session-generated demo events
            </p>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <SectionHeader title="About This Prototype" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>Cheerio Growth Guide</strong> is an interactive prototype built for the
                  Cheerio AI Product Intern take-home assignment (Assignment B).
                </p>
                <p>
                  All data is illustrative. No real messages are sent, no customer data is accessed,
                  and no AI models are called. Recommendation logic uses deterministic rules and
                  seeded mock data.
                </p>
                <p>
                  Authentication is simulated. The demo business &quot;Glow Theory&quot; is fictional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset Section */}
        <Card className="border-red-200">
          <CardHeader>
            <SectionHeader
              title="Reset Demo Data"
              description="Clear all demo state and start fresh"
            />
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                This will clear all assessment answers, feature configurations, activation states,
                and session events. You will be returned to the demo entry screen.
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => setShowResetModal(true)}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Reset All Demo Data
            </Button>
          </CardContent>
        </Card>

        {/* Reset Confirmation Modal */}
        <Modal
          open={showResetModal}
          onClose={() => setShowResetModal(false)}
          title="Reset Demo Data?"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowResetModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleReset} loading={resetting}>
                Yes, Reset Everything
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This action will:
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Clear your assessment answers
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Remove all feature configurations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Reset feature activation statuses
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Clear session events and analytics
              </li>
            </ul>
            <p className="text-sm text-gray-500 italic">
              Seed data will be restored to its default state.
            </p>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
