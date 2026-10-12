'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleExploreDemo = () => {
    setLoading(true);
    // Simulate brief loading for realism
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Cheerio</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white leading-tight mb-6">
              Discover your next best
              <span className="text-teal-400"> growth move</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Growth Guide analyzes your business goals and usage patterns to recommend the right features at the right time.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Smart Recommendations</p>
              <p className="text-slate-400 text-sm">Contextual suggestions based on your goals and usage</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Guided Setup</p>
              <p className="text-slate-400 text-sm">Step-by-step wizards to configure each feature</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Track Progress</p>
              <p className="text-slate-400 text-sm">See your feature adoption journey and results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Demo entry */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Cheerio</span>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Growth Guide</h2>
              <p className="text-gray-500">
                Explore a guided product experience designed to help businesses discover and activate the right features.
              </p>
            </div>

            {/* Demo context card */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  GT
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Glow Theory</p>
                  <p className="text-xs text-gray-500">D2C Skincare Brand · Demo Business</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                You will explore Cheerio as Priya Sharma, owner of Glow Theory — a skincare brand that uses WhatsApp campaigns but has not yet configured chatbots, automations, or CRM segmentation.
              </p>
            </div>

            {/* Demo notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <p className="text-xs text-amber-800">
                <strong>Prototype notice:</strong> This is an interactive demo. No real authentication is required, no actual messages are sent, and all data is illustrative.
              </p>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              fullWidth
              onClick={handleExploreDemo}
              loading={loading}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Explore Demo
            </Button>

            <p className="text-center text-xs text-gray-400">
              Built for the Cheerio AI Product Intern Assignment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
