'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  AppState,
  AssessmentAnswers,
  FeatureId,
  FeatureStatus,
  ChatbotConfig,
  AutomationConfig,
  SegmentType,
  ProgressEvent,
  FeatureRecommendation,
  Business,
  AnalyticsData,
} from '@/types';
import {
  DEMO_BUSINESS,
  INITIAL_ANALYTICS,
  FEATURE_RECOMMENDATIONS,
  ASSESSMENT_FEATURE_MAP,
} from '@/data/mock-data';

const STORAGE_KEY = 'cheerio-growth-guide-state';

const DEFAULT_STATE: AppState = {
  business: DEMO_BUSINESS,
  assessment: {
    goal: null,
    pain: null,
    existingFeatures: [],
  },
  assessmentCompleted: false,
  recommendedFeature: null,
  featureStatuses: {
    chatbot: 'not-started',
    automation: 'not-started',
    crm: 'not-started',
  },
  chatbotConfig: null,
  automationConfig: null,
  crmSegment: null,
  analytics: INITIAL_ANALYTICS,
  demoEvents: [],
  lastUpdated: new Date().toISOString(),
};

export interface AppContextValue {
  state: AppState;
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
  isHydrated: boolean;

  // Actions
  setAssessmentAnswers: (answers: AssessmentAnswers) => void;
  setRecommendedFeature: (featureId: FeatureId) => void;
  updateFeatureStatus: (featureId: FeatureId, status: FeatureStatus) => void;
  saveChatbotConfig: (config: ChatbotConfig) => void;
  saveAutomationConfig: (config: AutomationConfig) => void;
  setCrmSegment: (segment: SegmentType) => void;
  addDemoEvent: (event: Omit<ProgressEvent, 'id' | 'timestamp' | 'isSessionEvent'>) => void;
  resetDemo: () => void;
  getRecommendation: () => FeatureRecommendation;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppState;
        // Merge with DEFAULT_STATE to guarantee backwards compatibility
        setState({
          ...DEFAULT_STATE,
          ...parsed,
          business: parsed.business || DEFAULT_STATE.business,
          analytics: parsed.analytics || DEFAULT_STATE.analytics,
          featureStatuses: {
            ...DEFAULT_STATE.featureStatuses,
            ...(parsed.featureStatuses || {}),
          },
        });
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save state to localStorage on state changes once hydrated
  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state, isHydrated]);

  // Actions
  const setAssessmentAnswers = (answers: AssessmentAnswers) => {
    setState((prev) => {
      // Determine recommended feature from goal if available
      let recommended: FeatureId = prev.recommendedFeature || 'chatbot';
      if (answers.goal && ASSESSMENT_FEATURE_MAP[answers.goal]) {
        recommended = ASSESSMENT_FEATURE_MAP[answers.goal];
      }

      return {
        ...prev,
        assessment: answers,
        assessmentCompleted: true,
        recommendedFeature: recommended,
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const setRecommendedFeature = (featureId: FeatureId) => {
    setState((prev) => ({
      ...prev,
      recommendedFeature: featureId,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateFeatureStatus = (featureId: FeatureId, status: FeatureStatus) => {
    setState((prev) => ({
      ...prev,
      featureStatuses: {
        ...prev.featureStatuses,
        [featureId]: status,
      },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const saveChatbotConfig = (config: ChatbotConfig) => {
    setState((prev) => ({
      ...prev,
      chatbotConfig: config,
      featureStatuses: {
        ...prev.featureStatuses,
        chatbot: prev.featureStatuses.chatbot === 'not-started' ? 'in-progress' : prev.featureStatuses.chatbot,
      },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const saveAutomationConfig = (config: AutomationConfig) => {
    setState((prev) => ({
      ...prev,
      automationConfig: config,
      featureStatuses: {
        ...prev.featureStatuses,
        automation: prev.featureStatuses.automation === 'not-started' ? 'in-progress' : prev.featureStatuses.automation,
      },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const setCrmSegment = (segment: SegmentType) => {
    setState((prev) => ({
      ...prev,
      crmSegment: segment,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addDemoEvent = (eventData: Omit<ProgressEvent, 'id' | 'timestamp' | 'isSessionEvent'>) => {
    const newEvent: ProgressEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      isSessionEvent: true,
    };

    setState((prev) => {
      const prevAnalytics = prev.analytics;
      const updatedAnalytics: AnalyticsData = {
        ...prevAnalytics,
        recommendationImpressions:
          eventData.type === 'impression'
            ? prevAnalytics.recommendationImpressions + 1
            : prevAnalytics.recommendationImpressions,
        recommendationEngagement:
          eventData.type === 'engagement'
            ? prevAnalytics.recommendationEngagement + 1
            : prevAnalytics.recommendationEngagement,
        featureActivations:
          eventData.type === 'activation'
            ? prevAnalytics.featureActivations + 1
            : prevAnalytics.featureActivations,
        meaningfulUseEvents:
          eventData.type === 'meaningful-use'
            ? prevAnalytics.meaningfulUseEvents + 1
            : prevAnalytics.meaningfulUseEvents,
        progressTimeline: [newEvent, ...(prevAnalytics.progressTimeline || [])],
      };

      return {
        ...prev,
        demoEvents: [newEvent, ...prev.demoEvents],
        analytics: updatedAnalytics,
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const resetDemo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
    setState({
      ...DEFAULT_STATE,
      lastUpdated: new Date().toISOString(),
    });
  };

  const getRecommendation = useCallback((): FeatureRecommendation => {
    let targetFeatureId: FeatureId = 'chatbot';

    if (state.recommendedFeature) {
      targetFeatureId = state.recommendedFeature;
    } else if (state.assessment.goal && ASSESSMENT_FEATURE_MAP[state.assessment.goal]) {
      targetFeatureId = ASSESSMENT_FEATURE_MAP[state.assessment.goal];
    }

    const matched = FEATURE_RECOMMENDATIONS.find((rec) => rec.id === targetFeatureId);
    return matched || FEATURE_RECOMMENDATIONS[0];
  }, [state.recommendedFeature, state.assessment.goal]);

  const contextValue: AppContextValue = useMemo(
    () => ({
      state,
      business: state.business,
      assessment: state.assessment,
      assessmentCompleted: state.assessmentCompleted,
      recommendedFeature: state.recommendedFeature,
      featureStatuses: state.featureStatuses,
      chatbotConfig: state.chatbotConfig,
      automationConfig: state.automationConfig,
      crmSegment: state.crmSegment,
      analytics: state.analytics,
      demoEvents: state.demoEvents,
      lastUpdated: state.lastUpdated,
      isHydrated,
      setAssessmentAnswers,
      setRecommendedFeature,
      updateFeatureStatus,
      saveChatbotConfig,
      saveAutomationConfig,
      setCrmSegment,
      addDemoEvent,
      resetDemo,
      getRecommendation,
    }),
    [state, isHydrated, getRecommendation]
  );

  return React.createElement(AppContext.Provider, { value: contextValue }, children);
}

export function useAppState(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
