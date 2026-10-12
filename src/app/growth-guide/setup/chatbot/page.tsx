'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Textarea,
  Toggle,
  Checkbox,
  Stepper,
  Modal,
  SectionHeader,
  DemoBanner,
} from '@/components/ui';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Bot,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit3,
  ShoppingBag,
  Truck,
  RotateCcw,
  Package,
} from 'lucide-react';
import { useAppState } from '@/lib/store';
import { DEFAULT_FAQS } from '@/data/mock-data';
import { matchFAQ, generateId } from '@/lib/utils';
import { AppLayout } from '@/components/layout/AppLayout';
import { FAQItem, ChatMessage, ChatbotUseCase } from '@/types';
import toast from 'react-hot-toast';

const STEP_LABELS = ['Use Cases', 'FAQ Setup', 'Fallback', 'Preview', 'Review', 'Complete'];

interface UseCaseOption {
  id: ChatbotUseCase;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const USE_CASE_OPTIONS: UseCaseOption[] = [
  {
    id: 'product-faqs',
    title: 'Product FAQs',
    description: 'Answer questions about ingredients, suitability, and usage',
    icon: ShoppingBag,
  },
  {
    id: 'delivery',
    title: 'Delivery Questions',
    description: 'Handle shipping, tracking, and delivery time queries',
    icon: Truck,
  },
  {
    id: 'returns',
    title: 'Returns & Refunds',
    description: 'Manage return policies and refund inquiries',
    icon: RotateCcw,
  },
  {
    id: 'order-status',
    title: 'Order Status',
    description: 'Help customers check their order status',
    icon: Package,
  },
];

const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'init-bot-msg',
  role: 'bot',
  content: "Hi! I'm the Glow Theory chatbot. Ask me anything about our products, delivery, returns, or orders.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function ChatbotSetupPage() {
  const router = useRouter();
  const {
    saveChatbotConfig,
    updateFeatureStatus,
    addDemoEvent,
    chatbotConfig,
  } = useAppState();

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);

  // Step 0: Use Cases
  const [selectedUseCases, setSelectedUseCases] = useState<ChatbotUseCase[]>(
    chatbotConfig?.useCases && chatbotConfig.useCases.length > 0
      ? chatbotConfig.useCases
      : ['product-faqs', 'delivery']
  );

  // Step 1: FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>(
    chatbotConfig?.faqs && chatbotConfig.faqs.length > 0
      ? chatbotConfig.faqs
      : DEFAULT_FAQS
  );
  const [faqErrors, setFaqErrors] = useState<Record<string, { question?: string; answer?: string }>>({});

  // Step 2: Fallback
  const [fallbackMessage, setFallbackMessage] = useState<string>(
    chatbotConfig?.fallbackMessage ||
      "I'm sorry, I couldn't find an answer to your question. Let me connect you with a team member who can help."
  );
  const [humanHandoff, setHumanHandoff] = useState<boolean>(
    chatbotConfig?.humanHandoff !== undefined ? chatbotConfig.humanHandoff : true
  );
  const [fallbackError, setFallbackError] = useState<string>('');

  // Step 3: Preview & Test
  const [testMessages, setTestMessages] = useState<ChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [testInput, setTestInput] = useState<string>('');

  // Step 4: Review
  const [reviewConfirmed, setReviewConfirmed] = useState<boolean>(false);

  // Step 5: Activation
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [activated, setActivated] = useState<boolean>(false);

  // Toggle Use Case
  const handleToggleUseCase = (id: ChatbotUseCase) => {
    setSelectedUseCases((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // FAQ management
  const handleUpdateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );

    // Clear error if resolved
    if (value.trim()) {
      setFaqErrors((prev) => {
        if (!prev[id]) return prev;
        const currentItemErrors = { ...prev[id] };
        delete currentItemErrors[field];
        if (Object.keys(currentItemErrors).length === 0) {
          const next = { ...prev };
          delete next[id];
          return next;
        }
        return { ...prev, [id]: currentItemErrors };
      });
    }
  };

  const handleAddFAQ = () => {
    const defaultCat = selectedUseCases[0] || 'product-faqs';
    const newFaq: FAQItem = {
      id: `faq-${generateId()}`,
      question: '',
      answer: '',
      category: defaultCat,
    };
    setFaqs((prev) => [...prev, newFaq]);
    toast.success('New question template added');
  };

  const handleDeleteFAQ = (id: string) => {
    if (faqs.length <= 1) {
      toast.error('You must keep at least one FAQ item');
      return;
    }
    setFaqs((prev) => prev.filter((item) => item.id !== id));
    setFaqErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    toast.success('Question removed');
  };

  // Chatbot simulator
  const handleSendMessage = useCallback(() => {
    const trimmed = testInput.trim();
    if (!trimmed) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: timeString,
    };

    const matched = matchFAQ(trimmed, faqs);

    let botResponseContent = '';
    let isMatched = false;

    if (matched) {
      botResponseContent = matched.answer;
      isMatched = true;
    } else {
      botResponseContent = fallbackMessage;
      if (humanHandoff) {
        botResponseContent += '\n\n🔔 A team member will be available shortly (simulated).';
      }
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      role: 'bot',
      content: botResponseContent,
      timestamp: timeString,
      matched: isMatched,
    };

    setTestMessages((prev) => [...prev, userMsg, botMsg]);
    setTestInput('');
  }, [testInput, faqs, fallbackMessage, humanHandoff]);

  const handleResetChat = () => {
    setTestMessages([INITIAL_BOT_MESSAGE]);
    toast.success('Chat test history reset');
  };

  // Step Validation & Forward Progression
  const handleNext = () => {
    if (currentStep === 0) {
      if (selectedUseCases.length === 0) {
        toast.error('Please select at least one use case to proceed');
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (faqs.length === 0) {
        toast.error('Please configure at least one FAQ question');
        return;
      }

      const errors: Record<string, { question?: string; answer?: string }> = {};
      let hasError = false;

      faqs.forEach((item) => {
        const itemError: { question?: string; answer?: string } = {};
        if (!item.question.trim()) {
          itemError.question = 'Question cannot be blank';
          hasError = true;
        }
        if (!item.answer.trim()) {
          itemError.answer = 'Answer cannot be blank';
          hasError = true;
        }
        if (itemError.question || itemError.answer) {
          errors[item.id] = itemError;
        }
      });

      if (hasError) {
        setFaqErrors(errors);
        toast.error('Please fill in all question and answer fields before proceeding');
        return;
      }

      setFaqErrors({});
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!fallbackMessage.trim()) {
        setFallbackError('Fallback message cannot be empty');
        toast.error('Please enter a fallback message');
        return;
      }
      setFallbackError('');
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!reviewConfirmed) {
        toast.error('Please check the confirmation box to activate');
        return;
      }
      // Move to activation step
      triggerActivation();
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.push('/growth-guide');
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const triggerActivation = () => {
    setCurrentStep(5);
    setIsActivating(true);

    const fullConfig = {
      useCases: selectedUseCases,
      faqs,
      fallbackMessage,
      humanHandoff,
      lowConfidenceThreshold: 0.6,
    };

    setTimeout(() => {
      saveChatbotConfig(fullConfig);
      updateFeatureStatus('chatbot', 'active');
      addDemoEvent({
        type: 'activation',
        feature: 'chatbot',
        description: `AI FAQ Chatbot activated with ${faqs.length} verified answers and fallback handoff enabled.`,
      });
      addDemoEvent({
        type: 'meaningful-use',
        feature: 'chatbot',
        description: 'First automated customer FAQ query handled successfully in demo channel.',
      });
      setIsActivating(false);
      setActivated(true);
      toast.success('FAQ Chatbot activated in demo!');
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => {
                if (currentStep < 5) {
                  setCancelModalOpen(true);
                } else {
                  router.push('/growth-guide');
                }
              }}
            >
              Back to Guide
            </Button>
            <div className="h-4 w-px bg-gray-200" />
            <Badge variant="teal">AI Concierge Setup</Badge>
          </div>
          {currentStep < 5 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel Setup
            </Button>
          )}
        </div>

        {/* Stepper Navigation */}
        <Card>
          <CardContent className="py-5">
            <Stepper steps={STEP_LABELS} currentStep={currentStep} />
          </CardContent>
        </Card>

        {/* Demo banner */}
        <DemoBanner />

        {/* ========================================================================= */}
        {/* STEP 0: SELECT USE CASES */}
        {/* ========================================================================= */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <SectionHeader
              title="What should your chatbot help with?"
              description="Select one or more use cases to configure. You can refine and add more anytime."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {USE_CASE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedUseCases.includes(option.id);

                return (
                  <div
                    key={option.id}
                    onClick={() => handleToggleUseCase(option.id)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/60 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 text-base">{option.title}</h4>
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-teal-600 border-teal-600 text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedUseCases.length === 0 && (
              <p className="text-sm text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Please select at least one use case to proceed.
              </p>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleBack}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={selectedUseCases.length === 0}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to FAQs
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: CONFIGURE FAQS */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <SectionHeader
                title="Set up your frequently asked questions"
                description="These are the questions your chatbot will answer. Edit, add, or remove as needed."
              />
              <Badge variant="teal" className="self-start sm:self-auto py-1 px-3">
                {faqs.length} {faqs.length === 1 ? 'question' : 'questions'} configured
              </Badge>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const itemErr = faqErrors[faq.id];
                const matchingUseCase = USE_CASE_OPTIONS.find((u) => u.id === faq.category);
                const categoryLabel = matchingUseCase ? matchingUseCase.title : faq.category;

                return (
                  <Card key={faq.id} className="relative transition-all hover:border-gray-300">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <Badge variant="default" className="text-xs capitalize">
                            {categoryLabel}
                          </Badge>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFAQ(faq.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                          title="Delete question"
                          aria-label={`Delete question ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <Input
                          label="Customer Question"
                          placeholder="e.g. What is your return window?"
                          value={faq.question}
                          onChange={(e) => handleUpdateFAQ(faq.id, 'question', e.target.value)}
                          error={itemErr?.question}
                        />

                        <Textarea
                          label="Automated AI Answer"
                          placeholder="Provide the accurate answer that the bot should reply with..."
                          rows={3}
                          value={faq.answer}
                          onChange={(e) => handleUpdateFAQ(faq.id, 'answer', e.target.value)}
                          error={itemErr?.answer}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={handleAddFAQ}
                icon={<Plus className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Add Another Question
              </Button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleBack}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Use Cases
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Fallback
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: CONFIGURE FALLBACK */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <SectionHeader
              title="What happens when your chatbot can't answer?"
              description="Configure the fallback behavior for unrecognized or complex questions"
            />

            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Textarea
                    label="Default Fallback Message"
                    helperText="This message is sent when the AI confidence is below the matching threshold."
                    rows={4}
                    value={fallbackMessage}
                    onChange={(e) => {
                      setFallbackMessage(e.target.value);
                      if (e.target.value.trim()) setFallbackError('');
                    }}
                    error={fallbackError}
                    placeholder="Enter your fallback message..."
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Toggle
                    label="Enable Live Agent Escalation (Human Handoff)"
                    description="When enabled, customers can be transferred to a human agent queue if the bot cannot resolve their issue."
                    checked={humanHandoff}
                    onChange={(checked) => setHumanHandoff(checked)}
                  />
                </div>

                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-teal-900 leading-relaxed">
                    <strong>Note:</strong> In this interactive demo, human handoff is simulated in the sandbox. In production, this connects smoothly with your Cheerio live agent inbox routing.
                  </p>
                </div>

                {/* Preview bubble */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Live Fallback Preview
                  </p>
                  <div className="bg-gray-100 p-4 rounded-2xl max-w-md">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Bot className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-xs font-medium text-gray-700">Glow Theory Bot</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {fallbackMessage || 'Fallback message is currently empty.'}
                    </p>
                    {humanHandoff && (
                      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-teal-700 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        A team member will be available shortly (simulated)
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleBack}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to FAQs
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Preview & Test
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: PREVIEW & TEST */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <SectionHeader
                title="Test your chatbot"
                description="Try asking questions to see how your chatbot responds in real-time"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  icon={<Edit3 className="w-3.5 h-3.5" />}
                >
                  Edit Answers
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetChat}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Clear Chat
                </Button>
              </div>
            </div>

            {/* Simulated Chat Interface */}
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
              <div className="bg-slate-900 px-4 py-3 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                    <Bot className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Glow Theory Bot</h4>
                    <p className="text-xs text-teal-300/80 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      Online • WhatsApp Sandbox
                    </p>
                  </div>
                </div>
                <Badge variant="teal" className="text-xs">
                  Sandbox Active
                </Badge>
              </div>

              {/* Chat messages */}
              <div className="h-96 overflow-y-auto p-4 bg-[#F8FAFC] space-y-4">
                {testMessages.map((msg) => {
                  const isBot = msg.role === 'bot';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                    >
                      <span className="text-[11px] font-medium text-gray-500 mb-1 px-1">
                        {isBot ? 'Glow Theory Bot' : 'You'} • {msg.timestamp}
                      </span>
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap ${
                          isBot
                            ? 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                            : 'bg-teal-600 text-white rounded-tr-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                      {isBot && msg.matched && (
                        <span className="mt-1 text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                          <Check className="w-3 h-3 text-teal-600" /> Matched verified FAQ
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sample Quick Questions Pill Bar */}
              <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-gray-400 font-medium shrink-0">Try asking:</span>
                {faqs.slice(0, 3).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTestInput(f.question)}
                    className="shrink-0 bg-white border border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-700 px-2.5 py-1 rounded-full transition-colors text-xs truncate max-w-xs"
                  >
                    &ldquo;{f.question.slice(0, 35)}...&rdquo;
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-white border-t border-gray-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Type a message to test (e.g. Do you ship to Bangalore?)..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-teal-500 focus:outline-none text-sm text-gray-900"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!testInput.trim()}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send
                  </Button>
                </form>
              </div>
            </Card>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleBack}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Fallback
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Review
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: REVIEW */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <SectionHeader
              title="Review your chatbot configuration"
              description="Verify your selected use cases, answers, and fallback settings before going live."
            />

            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Use cases */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Active Use Cases
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUseCases.map((id) => {
                      const opt = USE_CASE_OPTIONS.find((u) => u.id === id);
                      return (
                        <Badge key={id} variant="teal" className="py-1 px-3 text-sm">
                          {opt ? opt.title : id}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* FAQ List summary */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Configured FAQs ({faqs.length})
                    </h4>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Edit FAQs
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {faqs.map((f, i) => (
                      <div
                        key={f.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-start gap-2.5 text-sm"
                      >
                        <span className="font-semibold text-gray-400 shrink-0 text-xs mt-0.5">
                          {i + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{f.question}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{f.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Fallback & Handoff */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Fallback Message
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 line-clamp-3">
                      {fallbackMessage}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Human Agent Handoff
                    </h4>
                    <div className="pt-2">
                      <Badge variant={humanHandoff ? 'success' : 'default'} dot>
                        {humanHandoff ? 'Enabled (Simulated Agent Routing)' : 'Disabled'}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-2">
                        {humanHandoff
                          ? 'Unmatched questions route seamlessly to WhatsApp human live inbox.'
                          : 'Chatbot will reply with fallback message only.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Confirmation Checkbox */}
                <div className="pt-2 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                  <Checkbox
                    label="I have reviewed the configuration and am ready to activate"
                    description="This deploys the AI FAQ Chatbot to your WhatsApp channel in demo mode."
                    checked={reviewConfirmed}
                    onChange={(checked) => setReviewConfirmed(checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleBack}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Preview
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!reviewConfirmed}
                icon={<Check className="w-4 h-4" />}
              >
                Activate Chatbot
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: ACTIVATION & SUCCESS */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="py-8">
            {isActivating ? (
              <Card>
                <CardContent className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto animate-spin">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Activating AI FAQ Chatbot...</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Indexing {faqs.length} question templates, initializing fallback routing, and testing WhatsApp webhook listeners.
                  </p>
                </CardContent>
              </Card>
            ) : activated ? (
              <Card className="border-teal-200 shadow-md">
                <CardContent className="p-8 sm:p-10 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-teal-50 text-teal-600 border-2 border-teal-200 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-teal-600" />
                  </div>

                  <div className="space-y-2">
                    <div className="inline-block">
                      <Badge variant="teal" dot className="mb-2">
                        Active in demo
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Chatbot Activated Successfully!
                    </h2>
                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                      Your AI FAQ Chatbot is now live in demo mode with {faqs.length} verified answers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto py-3">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <p className="text-xl font-bold text-teal-700">{faqs.length}</p>
                      <p className="text-xs text-gray-500 font-medium">FAQs Configured</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <p className="text-xl font-bold text-teal-700">{selectedUseCases.length}</p>
                      <p className="text-xs text-gray-500 font-medium">Use Cases Active</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <p className="text-xl font-bold text-teal-700">
                        {humanHandoff ? 'Enabled' : 'Disabled'}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">Agent Handoff</p>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 max-w-md mx-auto text-left flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Demo Activation:</strong> In production, this chatbot attaches to your verified WhatsApp Business phone number and responds immediately to inbound messages.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => router.push('/growth-guide')}
                      icon={<ArrowRight className="w-4 h-4" />}
                      className="w-full sm:w-auto"
                    >
                      Back to Growth Guide
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => router.push('/growth-guide')}
                      className="w-full sm:w-auto"
                    >
                      Explore Next Recommendation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}

        {/* ========================================================================= */}
        {/* CANCEL MODAL */}
        {/* ========================================================================= */}
        <Modal
          open={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="Cancel Setup?"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setCancelModalOpen(false)}>
                Continue Setup
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setCancelModalOpen(false);
                  router.push('/growth-guide');
                }}
              >
                Discard & Exit
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel? Your progress will not be saved.
            </p>
            <p className="text-xs text-gray-400">
              You can return to the Growth Guide to re-initiate this setup wizard whenever you are ready.
            </p>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
