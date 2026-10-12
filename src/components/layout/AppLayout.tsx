'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  BarChart3,
  Settings,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { DemoBanner } from '@/components/ui';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/growth-guide', label: 'Growth Guide', icon: Compass },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get breadcrumb from pathname
  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((s) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">Cheerio</span>
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">Cheerio</h1>
                <p className="text-[10px] text-gray-400 leading-none">Growth Guide</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Business Switcher */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                GT
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Glow Theory</p>
                <p className="text-xs text-gray-500">Skincare · Growth Plan</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Growth Guide CTA */}
          <div className="px-3 pb-3">
            <Link
              href="/growth-guide"
              className="block p-3 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 hover:border-teal-200 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-teal-700">Growth Guide</span>
              </div>
              <p className="text-xs text-teal-600/80">Discover your next best growth move</p>
            </Link>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium">
                PS
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Priya Sharma</p>
                <p className="text-xs text-gray-500">Owner</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          {/* Top bar */}
          <div className="sticky top-0 z-30 bg-[#FAFBFC]/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-3 hidden lg:block">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {getBreadcrumb().map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
                    <span className={i === getBreadcrumb().length - 1 ? 'text-gray-900 font-medium' : ''}>
                      {crumb}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <DemoBanner />
            </div>
          </div>

          {/* Page content */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="lg:hidden mb-4">
              <DemoBanner />
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
