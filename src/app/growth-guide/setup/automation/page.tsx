'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  Input,
  Textarea,
  Select,
  Checkbox,
  Stepper,
  Modal,
  SectionHeader,
  DemoBanner,
} from '@/components/ui';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppState } from '@/lib/store';
import { AUTOMATION_TEMPLATES } from '@/data/mock-data';
import {
  AutomationTrigger,
  AutomationAudience,
  AutomationDelay,
  AutomationConfig,
} from '@/types';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  Users,
  Sparkles,
  AlertCircle,
  MousePointerClick,
  ShoppingCart,
  MessageCircleOff,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  CheckCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STEP_LABELS = ['Trigger', 'Audience', 'Message', 'Review', 'Complete'];

const TRIGGER_OPTIONS: {
  value: AutomationTrigger;
  label: string;
  description: string;
  badge: string;
}[] = [
  {
    value: 'campaign-click',
    label: 'Campaign Link Click',
    description: 'Send a follow-up when a customer clicks a link in your campaign',
    badge: 'High Intent',
  },
  {
    value: 'cart-abandon',
    label: 'Cart Abandonment',
    description: 'Re-engage customers who left items in their cart',
    badge: 'High Conversion',
  },
  {
    value: 'no-reply',
    label: 'No Reply Follow-Up',
    description: "Reach out to customers who haven't responded",
    badge: 'Re-engagement',
  },
  {
    value: 'new-signup',
    label: 'New Customer Welcome',
    description: 'Automatically welcome new customers',
    badge: 'Onboarding',
  },
];

const AUDIENCE_OPTIONS: {
  value: AutomationAudience;
  label: string;
  description: string;
  count: string;
}[] = [
  {
    value: 'all-customers',
    label: 'All Customers',
    description: 'Target your entire contact database',
    count: '2,450 contacts',
  },
  {
    value: 'engaged-users',
    label: 'Engaged Users',
    description: 'Customers who opened recent campaigns',
    count: '720 contacts',
  },
  {
    value: 'inactive-users',
    label: 'Inactive Users',
    description: 'Customers with no activity in 30 days',
    count: '520 contacts',
  },
  {
    value: 'new-customers',
    label: 'New Customers',
    description: 'Joined in the last 14 days',
    count: '630 contacts',
  },
];

const DELAY_OPTIONS: { value: AutomationDelay; label: string; desc: string }[] = [
  { value: '1h', label: '1 Hour', desc: 'Fastest nudge while purchase intent is fresh' },
  { value: '4h', label: '4 Hours', desc: 'Balanced interval after initial browsing' },
  { value: '24h', label: '24 Hours', desc: 'Standard next-day gentle reminder' },
  { value: '48h', label: '2 Days (48 Hours)', desc: 'Extended consideration window' },
  { value: '72h', label: '3 Days (72 Hours)', desc: 'Final re-engagement touchpoint' },
];

const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  'campaign-click': 'Campaign Link Click',
  'cart-abandon': 'Cart Abandonment',
  'no-reply': 'No Reply Follow-Up',
  'new-signup': 'New Customer Welcome',
};

const AUDIENCE_LABELS: Record<AutomationAudience, string> = {
  'all-customers': 'All Customers',
  'engaged-users': 'Engaged Users',
  'inactive-users': 'Inactive Users',
  'new-customers': 'New Customers',
};

export default function AutomationSetupPage() {
  const router = useRouter();
  const {
    saveAutomationConfig,
    updateFeatureStatus,
    addDemoEvent,
    automationConfig,
    business,
  } = useAppState();

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);

  // Step 0: Trigger
  const [selectedTrigger, setSelectedTrigger] = useState<AutomationTrigger | null>(
    automationConfig?.trigger || 'campaign-click'
  );
  const [triggerError, setTriggerError] = useState<string>('');

  // Step 1: Audience & Delay
  const [selectedAudience, setSelectedAudience] = useState<AutomationAudience | null>(
    automationConfig?.audience || 'engaged-users'
  );
  const [selectedDelay, setSelectedDelay] = useState<AutomationDelay | null>(
    automationConfig?.delay || '24h'
  );
  const [audienceError, setAudienceError] = useState<string>('');
  const [delayError, setDelayError] = useState<string>('');

  // Step 2: Message & Name
  const [automationName, setAutomationName] = useState<string>(
    automationConfig?.name || 'Follow-Up: Campaign Link Click'
  );
  const [messageTemplate, setMessageTemplate] = useState<string>(
    automationConfig?.messageTemplate ||
      AUTOMATION_TEMPLATES['campaign-click'] ||
      ''
  );
  const [nameError, setNameError] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');
  const [userEditedName, setUserEditedName] = useState<boolean>(
    Boolean(automationConfig?.name)
  );

  // Step 3: Review
  const [reviewConfirmed, setReviewConfirmed] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string>('');

  // Step 4: Complete & Activation State
  const [isActivating, setIsActivating] = useState<boolean>(false);

  // Sync template & default name when trigger changes if user hasn't explicitly customized
  const handleSelectTrigger = (trigger: string) => {
    const trig = trigger as AutomationTrigger;
    setSelectedTrigger(trig);
    setTriggerError('');

    if (!userEditedName) {
      setAutomationName(`Follow-Up: ${TRIGGER_LABELS[trig]}`);
    }

    if (AUTOMATION_TEMPLATES[trig]) {
      setMessageTemplate(AUTOMATION_TEMPLATES[trig]);
    }
  };

  // Step Navigation Validation
  const validateStep = (step: number): boolean => {
    if (step === 0) {
      if (!selectedTrigger) {
        setTriggerError('Please select a trigger event to proceed.');
        return false;
      }
      setTriggerError('');
      return true;
    }

    if (step === 1) {
      let valid = true;
      if (!selectedAudience) {
        setAudienceError('Please select a target audience.');
        valid = false;
      } else {
        setAudienceError('');
      }

      if (!selectedDelay) {
        setDelayError('Please select a follow-up delay interval.');
        valid = false;
      } else {
        setDelayError('');
      }
      return valid;
    }

    if (step === 2) {
      let valid = true;
      if (!automationName.trim()) {
        setNameError('Automation name is required.');
        valid = false;
      } else {
        setNameError('');
      }

      if (!messageTemplate.trim()) {
        setMessageError('Follow-up message template cannot be empty.');
        valid = false;
      } else {
        setMessageError('');
      }
      return valid;
    }

    if (step === 3) {
      if (!reviewConfirmed) {
        setReviewError('Please confirm you have reviewed this automation configuration.');
        return false;
      }
      setReviewError('');
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        handleActivate();
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0 && currentStep < 4) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Final Activation Trigger
  const handleActivate = () => {
    if (!validateStep(3)) return;

    setIsActivating(true);
    setCurrentStep(4);

    setTimeout(() => {
      const fullConfig: AutomationConfig = {
        trigger: selectedTrigger,
        audience: selectedAudience,
        delay: selectedDelay,
        messageTemplate,
        name: automationName.trim(),
      };

      saveAutomationConfig(fullConfig);
      updateFeatureStatus('automation', 'active');
      addDemoEvent({
        type: 'activation',
        feature: 'automation',
        description: `Follow-Up Automation "${automationName.trim()}" activated for ${
          selectedAudience ? AUDIENCE_LABELS[selectedAudience] : 'audience'
        } with ${selectedDelay || '24h'} trigger delay.`,
      });

      setIsActivating(false);
      toast.success('Follow-Up Automation activated successfully!');
    }, 1500);
  };

  // WhatsApp formatted preview text with sample variable substitution
  const renderedMessagePreview = messageTemplate
    .replace(/\{\{name\}\}/g, 'Ananya')
    .replace(/\{\{business\}\}/g, business?.name || 'Glow Theory');

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                Feature Setup Wizard
              </span>
              <Badge variant="teal">Screen 6</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-teal-600" />
              Follow-Up Automation
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Configure intelligent automated WhatsApp reminders to re-engage prospective buyers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 4 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelModalOpen(true)}
              >
                Cancel Setup
              </Button>
            )}
          </div>
        </div>

        {/* Demo Mode Notice */}
        <DemoBanner />

        {/* Stepper Indicator */}
        <Card className="p-4 sm:p-6 bg-white border-gray-200 shadow-sm">
          <Stepper steps={STEP_LABELS} currentStep={currentStep} />
        </Card>

        {/* Step 0: Trigger Selection */}
        {currentStep === 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <SectionHeader
                title="Select a trigger for your automation"
                description="Choose when this follow-up should be sent based on customer actions"
              />
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {triggerError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{triggerError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRIGGER_OPTIONS.map((opt) => {
                  const isSelected = selectedTrigger === opt.value;
                  const getIcon = () => {
                    switch (opt.value) {
                      case 'campaign-click':
                        return <MousePointerClick className="w-5 h-5 text-teal-600" />;
                      case 'cart-abandon':
                        return <ShoppingCart className="w-5 h-5 text-amber-600" />;
                      case 'no-reply':
                        return <MessageCircleOff className="w-5 h-5 text-indigo-600" />;
                      case 'new-signup':
                        return <UserPlus className="w-5 h-5 text-emerald-600" />;
                    }
                  };

                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelectTrigger(opt.value)}
                      className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/40 shadow-sm ring-1 ring-teal-500'
                          : 'border-gray-200 bg-white hover:border-teal-200 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="p-2.5 rounded-lg bg-white border border-gray-100 shadow-xs">
                          {getIcon()}
                        </div>
                        <Badge
                          variant={
                            opt.value === 'campaign-click'
                              ? 'teal'
                              : opt.value === 'cart-abandon'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {opt.badge}
                        </Badge>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="trigger-selection"
                            checked={isSelected}
                            onChange={() => handleSelectTrigger(opt.value)}
                            className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                          />
                          <h3 className="font-semibold text-gray-900 text-base">
                            {opt.label}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed pl-6">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs text-teal-900 leading-relaxed">
                  <strong>Recommendation tip:</strong> For skincare and e-commerce campaigns,{' '}
                  <span className="font-semibold text-teal-700">Campaign Link Click</span> yields up to 34% higher reactivation response because customers have already demonstrated interest.
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Audience & Delay */}
        {currentStep === 1 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <SectionHeader
                title="Choose your audience and timing"
                description="Target the most relevant customer cohort and define the optimal follow-up interval"
              />
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Audience Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    Target Audience <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-500">Select one group</span>
                </div>

                {audienceError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {audienceError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AUDIENCE_OPTIONS.map((aud) => {
                    const isSelected = selectedAudience === aud.value;
                    return (
                      <div
                        key={aud.value}
                        onClick={() => {
                          setSelectedAudience(aud.value);
                          setAudienceError('');
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="audience-selection"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedAudience(aud.value);
                                setAudienceError('');
                              }}
                              className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                            />
                            <span className="text-sm font-semibold text-gray-900">
                              {aud.label}
                            </span>
                          </div>
                          <Badge variant="default" className="text-[11px]">
                            {aud.count}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 pl-6">
                          {aud.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delay Section */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    Follow-Up Delay Interval <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-500">Wait time after trigger</span>
                </div>

                <Select
                  options={DELAY_OPTIONS.map((d) => ({
                    value: d.value,
                    label: `${d.label} — ${d.desc}`,
                  }))}
                  value={selectedDelay || ''}
                  onChange={(val) => {
                    setSelectedDelay(val as AutomationDelay);
                    setDelayError('');
                  }}
                  placeholder="Select delay duration..."
                  error={delayError}
                />

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {DELAY_OPTIONS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => {
                        setSelectedDelay(d.value);
                        setDelayError('');
                      }}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                        selectedDelay === d.value
                          ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {d.label.split(' ')[0]} {d.label.split(' ')[1] || ''}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Message Preview */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Configuration Inputs */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50/50">
                  <SectionHeader
                    title="Customize your follow-up message"
                    description="Tailor the copy and placeholders for your automated WhatsApp template"
                  />
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {/* Automation Name */}
                  <Input
                    label="Automation Name"
                    value={automationName}
                    onChange={(e) => {
                      setAutomationName(e.target.value);
                      setUserEditedName(true);
                      setNameError('');
                    }}
                    placeholder="e.g. Follow-Up: Campaign Link Click"
                    error={nameError}
                    helperText="Internal identifier displayed on your growth dashboard"
                  />

                  {/* Message Template Textarea */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        WhatsApp Message Template <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedTrigger && AUTOMATION_TEMPLATES[selectedTrigger]) {
                            setMessageTemplate(AUTOMATION_TEMPLATES[selectedTrigger]);
                            toast('Reset to default trigger template', { icon: '🔄' });
                          }
                        }}
                        className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Reset Template
                      </button>
                    </div>

                    <Textarea
                      rows={6}
                      value={messageTemplate}
                      onChange={(e) => {
                        setMessageTemplate(e.target.value);
                        setMessageError('');
                      }}
                      placeholder="Type your WhatsApp message template here..."
                      error={messageError}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-gray-500">
                      <span>Available tokens: <code className="bg-gray-100 text-teal-700 px-1 py-0.5 rounded font-mono">{'{{name}}'}</code>, <code className="bg-gray-100 text-teal-700 px-1 py-0.5 rounded font-mono">{'{{business}}'}</code></span>
                      <span>{messageTemplate.length} characters</span>
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-100 text-xs text-blue-800 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Info note:</strong> Messages are for demo purposes only. No real messages will be sent to WhatsApp recipients.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Live WhatsApp Style Preview */}
            <div className="lg:col-span-5">
              <Card className="border-gray-200 shadow-sm sticky top-6 overflow-hidden">
                <CardHeader className="bg-teal-700 text-white px-4 py-3 border-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-800 border border-teal-500 flex items-center justify-center font-bold text-white text-sm">
                        GT
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-sm leading-none text-white">
                            {business?.name || 'Glow Theory'}
                          </h4>
                          <span className="w-3.5 h-3.5 bg-emerald-400 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                            ✓
                          </span>
                        </div>
                        <p className="text-[11px] text-teal-200 mt-0.5">
                          Official WhatsApp Business
                        </p>
                      </div>
                    </div>
                    <Badge variant="teal" className="bg-teal-800 text-teal-100 text-[10px]">
                      Live Preview
                    </Badge>
                  </div>
                </CardHeader>

                <div
                  className="p-4 min-h-[320px] flex flex-col justify-end"
                  style={{
                    backgroundColor: '#EFEAE2',
                    backgroundImage: 'radial-gradient(#d1c7bd 0.75px, transparent 0.75px)',
                    backgroundSize: '12px 12px',
                  }}
                >
                  {/* Date badge */}
                  <div className="flex justify-center mb-4">
                    <span className="bg-white/90 text-gray-600 text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-2xs">
                      TODAY
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div className="max-w-[88%] self-start bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm border border-black/5 text-gray-800">
                    <p className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                      {renderedMessagePreview || (
                        <span className="text-gray-400 italic">
                          Message preview will appear here as you type...
                        </span>
                      )}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-gray-400">
                      <span>10:42 AM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>

                  {/* Simulated Action Button */}
                  <div className="mt-2 self-start max-w-[88%] w-full">
                    <div className="bg-white/95 rounded-lg py-2 px-3 text-center text-xs font-semibold text-teal-700 shadow-2xs border border-teal-100 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white">
                      <span>Reply to specialist</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                  <span>Recipient: Ananya Deshmukh</span>
                  <span className="text-teal-700 font-medium">Demo Simulator</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <SectionHeader
                title="Review your automation configuration"
                description="Verify all parameters before deploying your automated follow-up sequence"
              />
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {reviewError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{reviewError}</span>
                </div>
              )}

              {/* Review Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Trigger Item */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Trigger Event
                    </span>
                    <Badge variant="teal">Step 1</Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {selectedTrigger ? TRIGGER_LABELS[selectedTrigger] : 'Not selected'}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Fires when prospect clicks campaign links or triggers event.
                  </p>
                </div>

                {/* Audience Item */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Target Audience
                    </span>
                    <Badge variant="default">Step 2</Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {selectedAudience ? AUDIENCE_LABELS[selectedAudience] : 'Not selected'}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Evaluates customer segment eligibility before sending.
                  </p>
                </div>

                {/* Delay Item */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Delay Window
                    </span>
                    <Badge variant="warning">Step 2</Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {selectedDelay || '24h'}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Waits {selectedDelay || '24h'} after trigger event prior to dispatch.
                  </p>
                </div>
              </div>

              {/* Automation Title & Template Summary */}
              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Automation Name</span>
                    <h4 className="font-bold text-gray-900 text-base">{automationName}</h4>
                  </div>
                  <Badge variant="success" dot>Ready to Activate</Badge>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">WhatsApp Message Payload</span>
                  <div className="mt-1.5 p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-700 whitespace-pre-wrap font-mono">
                    {messageTemplate}
                  </div>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="pt-2 border-t border-gray-100">
                <Checkbox
                  label="I have reviewed this automation configuration"
                  description="Confirm that trigger rules, audience scope, and message copy align with your follow-up engagement strategy."
                  checked={reviewConfirmed}
                  onChange={(val) => {
                    setReviewConfirmed(val);
                    setReviewError('');
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Complete State */}
        {currentStep === 4 && (
          <Card className="border-gray-200 shadow-sm text-center py-10 px-6 sm:px-12">
            {isActivating ? (
              <div className="py-12 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto rounded-full bg-teal-50 border-4 border-teal-200 border-t-teal-600 animate-spin flex items-center justify-center" />
                <h3 className="text-lg font-bold text-gray-900">
                  Activating Follow-Up Automation...
                </h3>
                <p className="text-sm text-gray-500">
                  Registering trigger webhook, setting up {selectedDelay} delay queue, and binding WhatsApp message template to demo runtime.
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active in demo
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Follow-Up Automation Activated!
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    &ldquo;{automationName}&rdquo; is now active in your demo environment. Whenever a simulated customer triggers this rule, follow-up events will record to your analytics ledger.
                  </p>
                </div>

                {/* Configuration Summary Pill Box */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Trigger:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedTrigger ? TRIGGER_LABELS[selectedTrigger] : 'Campaign Click'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Audience:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedAudience ? AUDIENCE_LABELS[selectedAudience] : 'Engaged Users'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Delay:</span>
                    <span className="font-semibold text-gray-900">{selectedDelay || '24h'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-semibold text-emerald-700">Live Simulation</span>
                  </div>
                </div>

                {/* Demo Notice */}
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Demo Simulation Note:</strong> Simulated customer interactions will be reflected on your Growth Guide progress tracker and Analytics tab without sending real SMS or WhatsApp messages.
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => router.push('/growth-guide')}
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back to Growth Guide
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push('/growth-guide/setup/chatbot')}
                  >
                    Set up another feature
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Wizard Footer Navigation Controls (Steps 0 to 3) */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {currentStep > 0 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setCancelModalOpen(true)}
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 hidden sm:inline">
                Step {currentStep + 1} of {STEP_LABELS.length}
              </span>
              <Button
                variant="primary"
                onClick={handleNext}
                icon={
                  currentStep === 3 ? (
                    <Zap className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )
                }
              >
                {currentStep === 3 ? 'Activate Automation' : 'Next Step'}
              </Button>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <Modal
          open={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="Discard Automation Setup?"
          footer={
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCancelModalOpen(false)}
              >
                Continue Setup
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => router.push('/growth-guide')}
              >
                Discard & Leave
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Are you sure you want to exit the Follow-Up Automation wizard? Your current progress in this configuration session will not be activated.
            </p>
            <p className="text-xs text-gray-500">
              You can return to the Growth Guide anytime to restart or finish setup.
            </p>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
