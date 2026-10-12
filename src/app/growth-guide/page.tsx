'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Zap,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Compass,
  Target,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Bot,
  BarChart3,
  RotateCcw,
  Check,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  ProgressBar,
  RadioGroup,
  Stepper,
  SectionHeader,
  Checkbox,
} from '@/components/ui';
import { useAppState } from '@/lib/store';
import { FEATURE_RECOMMENDATIONS, ASSESSMENT_FEATURE_MAP } from '@/data/mock-data';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  GoalOption,
  PainOption,
  ExistingFeature,
  FeatureId,
  FeatureRecommendation,
  FeatureStatus,
} from '@/types';
import toast from 'react-hot-toast';

export default function GrowthGuidePage() {
  const router = useRouter();
  const {
    assessment,
    assessmentCompleted,
    featureStatuses,
    setAssessmentAnswers,
    setRecommendedFeature,
    getRecommendation,
    addDemoEvent,
    isHydrated,
  } = useAppState();

  // Local state for assessment flow
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(assessment.goal || null);
  const [selectedPain, setSelectedPain] = useState<PainOption | null>(assessment.pain || null);
  const [selectedFeatures, setSelectedFeatures] = useState<ExistingFeature[]>(
    assessment.existingFeatures.length > 0 ? assessment.existingFeatures : ['campaigns']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);

  // Stepper labels
  const steps = ['Your Goal', 'Pain Points', 'Current Features'];

  // Handle Feature Checkbox toggle
  const toggleFeature = (feature: ExistingFeature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  // Assessment Step Validation
  const canProceed = useMemo(() => {
    if (currentStep === 0) return Boolean(selectedGoal);
    if (currentStep === 1) return Boolean(selectedPain);
    if (currentStep === 2) return selectedFeatures.length > 0;
    return false;
  }, [currentStep, selectedGoal, selectedPain, selectedFeatures]);

  // Complete assessment
  const handleFinishAssessment = () => {
    if (!selectedGoal || !selectedPain) return;

    setIsSubmitting(true);
    const answers = {
      goal: selectedGoal,
      pain: selectedPain,
      existingFeatures: selectedFeatures,
    };

    const targetRecId: FeatureId = ASSESSMENT_FEATURE_MAP[selectedGoal] || 'chatbot';

    // Update store
    setAssessmentAnswers(answers);
    setRecommendedFeature(targetRecId);

    // Record impression demo event
    const recDetails = FEATURE_RECOMMENDATIONS.find((f) => f.id === targetRecId);
    addDemoEvent({
      type: 'impression',
      feature: targetRecId,
      description: `Growth Guide recommended ${recDetails?.title || 'feature'} based on assessment answers.`,
    });

    toast.success('Assessment complete! Your personalized roadmap is ready.');
    setIsSubmitting(false);
    setIsRetaking(false);
  };

  // Retake Assessment handler
  const handleRetakeAssessment = () => {
    setIsRetaking(true);
    setCurrentStep(0);
    // Keep or prefill existing selections so user can quickly adjust
    setSelectedGoal(assessment.goal || 'answer-questions');
    setSelectedPain(assessment.pain || 'repeating-answers');
    setSelectedFeatures(
      assessment.existingFeatures.length > 0 ? assessment.existingFeatures : ['campaigns']
    );
  };

  // Determine active recommended feature
  const activeRecommendation: FeatureRecommendation = useMemo(() => {
    return getRecommendation();
  }, [getRecommendation]);

  // Other features (excluding recommended)
  const otherFeatures = useMemo(() => {
    return FEATURE_RECOMMENDATIONS.filter((rec) => rec.id !== activeRecommendation.id);
  }, [activeRecommendation.id]);

  // Calculate activation progress
  const activatedCount = useMemo(() => {
    const statuses = Object.values(featureStatuses);
    return statuses.filter((s) => s === 'active' || s === 'completed').length;
  }, [featureStatuses]);

  // Icon resolver
  const getFeatureIcon = (featureId: FeatureId, className: string = 'w-6 h-6') => {
    switch (featureId) {
      case 'chatbot':
        return <Bot className={className} />;
      case 'automation':
        return <Zap className={className} />;
      case 'crm':
        return <Users className={className} />;
      default:
        return <Compass className={className} />;
    }
  };

  // Color style resolver
  const getColorStyles = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          badge: 'success' as const,
          accent: 'emerald',
          gradientBorder: 'from-emerald-500/30 via-emerald-500/10 to-transparent',
          buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          badge: 'info' as const,
          accent: 'indigo',
          gradientBorder: 'from-indigo-500/30 via-indigo-500/10 to-transparent',
          buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        };
      case 'teal':
      default:
        return {
          bg: 'bg-teal-50',
          text: 'text-teal-700',
          border: 'border-teal-200',
          badge: 'teal' as const,
          accent: 'teal',
          gradientBorder: 'from-teal-500/30 via-teal-500/10 to-transparent',
          buttonClass: 'bg-teal-600 hover:bg-teal-700 text-white',
        };
    }
  };

  // Status badge formatter
  const renderStatusBadge = (status: FeatureStatus) => {
    switch (status) {
      case 'active':
      case 'completed':
        return (
          <Badge variant="success" dot>
            Active
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="warning" dot>
            In Progress
          </Badge>
        );
      case 'not-started':
      default:
        return <Badge variant="default">Not Started</Badge>;
    }
  };

  // Wait for client hydration if needed
  if (!isHydrated) {
    return (
      <AppLayout>
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-500">Loading Growth Guide...</p>
        </div>
      </AppLayout>
    );
  }

  // Show Assessment Mode if not completed or user explicitly clicked retake
  const showAssessment = !assessmentCompleted || isRetaking;

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* ============================================================== */}
        {/* MODE 1: ASSESSMENT FLOW                                        */}
        {/* ============================================================== */}
        {showAssessment ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <Badge variant="teal" className="mb-2">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Guided Growth Assessment
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Find Your Next Best Growth Move
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto">
                Answer 3 quick questions about Glow Theory to get high-impact, personalized feature
                recommendations tailored to your current scale.
              </p>
            </div>

            {/* Stepper Progress */}
            <Card className="p-4 sm:p-6 shadow-sm border-gray-200">
              <Stepper steps={steps} currentStep={currentStep} className="mb-8" />

              {/* Step 0: Main Goal */}
              {currentStep === 0 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      What is your main business goal right now?
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose the top priority you want to optimize on WhatsApp this month.
                    </p>
                  </div>

                  <RadioGroup
                    name="goal-options"
                    value={selectedGoal || ''}
                    onChange={(val) => setSelectedGoal(val as GoalOption)}
                    options={[
                      {
                        value: 'answer-questions',
                        label: 'Answer customer questions faster',
                        description:
                          'Resolve repetitive inquiries regarding ingredients, order transit, and return guidelines 24/7.',
                        icon: <MessageSquare className="w-5 h-5 text-teal-600 shrink-0" />,
                      },
                      {
                        value: 'follow-up',
                        label: 'Follow up with interested customers',
                        description:
                          'Re-engage prospects who clicked promo links or viewed skincare rituals but hesitated at checkout.',
                        icon: <Zap className="w-5 h-5 text-emerald-600 shrink-0" />,
                      },
                      {
                        value: 'segment-customers',
                        label: 'Understand and segment my customers',
                        description:
                          'Cohort shoppers by purchase frequency and engagement score to prevent spamming unengaged contacts.',
                        icon: <Users className="w-5 h-5 text-indigo-600 shrink-0" />,
                      },
                    ]}
                  />
                </div>
              )}

              {/* Step 1: Pain Points */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Which activities currently take too much of your time?
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Pinpoint the operational bottleneck draining your team&apos;s bandwidth.
                    </p>
                  </div>

                  <RadioGroup
                    name="pain-options"
                    value={selectedPain || ''}
                    onChange={(val) => setSelectedPain(val as PainOption)}
                    options={[
                      {
                        value: 'repeating-answers',
                        label: 'Repeating the same answers to common questions',
                        description:
                          'Constantly retyping product FAQs, skin safety advisories, and delivery transit times.',
                      },
                      {
                        value: 'manual-followup',
                        label: 'Manually following up with prospects',
                        description:
                          'Chasing warm broadcast replies one-by-one and losing track of interested buyers.',
                      },
                      {
                        value: 'finding-audience',
                        label: 'Finding the right audience for campaigns',
                        description:
                          'Struggling to filter contacts manually and risking high opt-out rates from generic broadcasts.',
                      },
                    ]}
                  />
                </div>
              )}

              {/* Step 2: Existing Features */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Which Cheerio features do you already use?
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Check all capabilities your team currently operates (multi-select):
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div
                      onClick={() => toggleFeature('campaigns')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedFeatures.includes('campaigns')
                          ? 'border-teal-500 bg-teal-50/40'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        label="WhatsApp Campaigns"
                        description="Broadcasting promotional flash sales and routine announcements (Pre-configured for Glow Theory)"
                        checked={selectedFeatures.includes('campaigns')}
                        onChange={() => toggleFeature('campaigns')}
                      />
                    </div>

                    <div
                      onClick={() => toggleFeature('chatbots')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedFeatures.includes('chatbots')
                          ? 'border-teal-500 bg-teal-50/40'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        label="AI FAQ Chatbots"
                        description="Automated virtual assistants answering product, ingredient, and order tracking inquiries."
                        checked={selectedFeatures.includes('chatbots')}
                        onChange={() => toggleFeature('chatbots')}
                      />
                    </div>

                    <div
                      onClick={() => toggleFeature('automations')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedFeatures.includes('automations')
                          ? 'border-teal-500 bg-teal-50/40'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        label="Follow-Up Automations"
                        description="Triggered conversational nudges that reactivate abandoned carts and broadcast clicks."
                        checked={selectedFeatures.includes('automations')}
                        onChange={() => toggleFeature('automations')}
                      />
                    </div>

                    <div
                      onClick={() => toggleFeature('crm')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedFeatures.includes('crm')
                          ? 'border-teal-500 bg-teal-50/40'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        label="CRM & Smart Segmentation"
                        description="Dynamic customer cohorts classifying VIPs, high intent, and at-risk contacts automatically."
                        checked={selectedFeatures.includes('crm')}
                        onChange={() => toggleFeature('crm')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                {currentStep > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 2 ? (
                  <Button
                    variant="primary"
                    disabled={!canProceed}
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    disabled={!canProceed || isSubmitting}
                    loading={isSubmitting}
                    onClick={handleFinishAssessment}
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    See My Recommendation
                  </Button>
                )}
              </div>
            </Card>

            {/* Cancel Retake if in retake mode */}
            {isRetaking && assessmentCompleted && (
              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={() => setIsRetaking(false)}>
                  Cancel and view existing recommendations
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* ============================================================== */
          /* MODE 2: RECOMMENDATIONS DISPLAY                                */
          /* ============================================================== */
          <div className="space-y-8 animate-fade-in">
            {/* Top Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="teal">
                    <Compass className="w-3.5 h-3.5 mr-1" />
                    Growth Guide
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Updated based on Glow Theory&apos;s WhatsApp profile
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Your Next Best Growth Move
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Personalized recommendations based on your business goals and current feature adoption.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetakeAssessment}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  Retake Assessment
                </Button>
              </div>
            </div>

            {/* Growth Journey Progress Card */}
            <Card className="bg-gradient-to-r from-teal-50/60 via-white to-emerald-50/40 border-teal-100/80">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-teal-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        Growth Journey Activation
                      </span>
                      <Badge variant={activatedCount > 0 ? 'success' : 'default'}>
                        {activatedCount} of 3 Features Active
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {activatedCount === 0
                        ? 'Activate your first recommended feature to unlock automated revenue growth.'
                        : activatedCount === 1
                        ? 'Great progress! Connect your next growth pillar to amplify WhatsApp retention.'
                        : activatedCount === 2
                        ? 'Almost complete! Finish the full flywheel for end-to-end automation.'
                        : 'Full growth stack activated! Review analytics to track meaningful customer ROI.'}
                    </p>
                  </div>

                  <div className="w-full sm:w-64">
                    <ProgressBar
                      value={activatedCount}
                      max={3}
                      label="Feature Adoption"
                      size="md"
                      color="bg-teal-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PRIMARY HERO: RECOMMENDED FEATURE CARD */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-gray-500">
                    Highest Impact Recommendation
                  </span>
                </div>
                {renderStatusBadge(featureStatuses[activeRecommendation.id])}
              </div>

              {(() => {
                const colors = getColorStyles(activeRecommendation.color);
                const setupUrl = `/growth-guide/setup/${activeRecommendation.id}`;
                const detailUrl = `/growth-guide/recommend/${activeRecommendation.id}`;

                return (
                  <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 shadow-md">
                    <Card className="rounded-[14px] border-0 overflow-hidden bg-white">
                      {/* Top banner / highlight header */}
                      <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
                              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Recommended for You
                            </span>
                            <span className="text-xs text-teal-100 hidden sm:inline">
                              Priority #1 for Glow Theory
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-teal-100 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {activeRecommendation.setupDuration} setup
                            </span>
                            <span>•</span>
                            <span>{activeRecommendation.setupSteps.length} quick steps</span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6 sm:p-8 space-y-6">
                        {/* Title & Icon Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3.5 rounded-2xl ${colors.bg} ${colors.text} ${colors.border} border shrink-0`}
                            >
                              {getFeatureIcon(activeRecommendation.id, 'w-8 h-8')}
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900">
                                {activeRecommendation.title}
                              </h2>
                              <p className="text-base text-gray-600 mt-0.5">
                                {activeRecommendation.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <Button
                              variant="primary"
                              size="lg"
                              className={colors.buttonClass}
                              onClick={() => router.push(setupUrl)}
                              icon={<ArrowRight className="w-4 h-4" />}
                            >
                              Set Up {activeRecommendation.title}
                            </Button>
                          </div>
                        </div>

                        {/* Problem It Solves & Why Recommended Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                            <div className="flex items-start gap-2.5">
                              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                                  The Problem It Solves
                                </p>
                                <p className="text-sm text-amber-900 font-medium mt-1">
                                  {activeRecommendation.problemItSolves}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80">
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                                  Why Recommended For Glow Theory
                                </p>
                                <p className="text-sm text-teal-900 font-medium mt-1">
                                  {activeRecommendation.whyRecommended}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description & Benefits */}
                        <div className="space-y-4 pt-2 border-t border-gray-100">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Expected Benefits</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {activeRecommendation.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </div>
                                  <span>{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Action Footer */}
                        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <p className="text-xs text-gray-500">
                            {activeRecommendation.planNote}
                          </p>
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              size="md"
                              className="w-full sm:w-auto"
                              onClick={() => router.push(detailUrl)}
                            >
                              Learn More
                            </Button>
                            <Button
                              variant="primary"
                              size="md"
                              className={`w-full sm:w-auto ${colors.buttonClass}`}
                              onClick={() => router.push(setupUrl)}
                              icon={<ArrowRight className="w-4 h-4" />}
                            >
                              Set Up Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </div>

            {/* SECONDARY FEATURES SECTION */}
            <div className="space-y-4 pt-4">
              <SectionHeader
                title="Explore Other Features"
                description="Complement your growth strategy with additional automation capabilities built for WhatsApp commerce."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherFeatures.map((feature) => {
                  const colors = getColorStyles(feature.color);
                  const setupUrl = `/growth-guide/setup/${feature.id}`;
                  const detailUrl = `/growth-guide/recommend/${feature.id}`;
                  const status = featureStatuses[feature.id];

                  return (
                    <Card
                      key={feature.id}
                      hover
                      className="flex flex-col justify-between border-gray-200 transition-all hover:border-gray-300"
                    >
                      <CardContent className="p-6 space-y-4 flex-1">
                        {/* Header with Icon and Status Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2.5 rounded-xl ${colors.bg} ${colors.text} ${colors.border} border shrink-0`}
                            >
                              {getFeatureIcon(feature.id, 'w-6 h-6')}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg leading-snug">
                                {feature.title}
                              </h3>
                              <p className="text-xs text-gray-500">{feature.subtitle}</p>
                            </div>
                          </div>
                          <div>{renderStatusBadge(status)}</div>
                        </div>

                        {/* Problem It Solves */}
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-700">
                          <strong className="text-gray-900 font-semibold block mb-0.5">
                            Solves:
                          </strong>
                          {feature.problemItSolves}
                        </div>

                        {/* Setup Time & Summary */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            Setup: {feature.setupDuration}
                          </span>
                          <span>{feature.setupSteps.length} configuration steps</span>
                        </div>
                      </CardContent>

                      {/* Card Footer Actions */}
                      <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(detailUrl)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Learn more
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(setupUrl)}
                          icon={<ChevronRight className="w-3.5 h-3.5" />}
                        >
                          Set up
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Assistance Card */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Need help deciding your sequencing?
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Glow Theory can test chatbot responses and follow-up templates in sandbox mode
                    before publishing live.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/analytics')}
                icon={<BarChart3 className="w-4 h-4" />}
              >
                View Analytics & Impact
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
