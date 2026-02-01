'use client';

import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Search } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const { t } = useSettings();
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const searchRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
    .from(searchRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.5');
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="pt-32 pb-12 px-6 text-center relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-100/50 dark:bg-[#38598b]/20 blur-[100px] rounded-full -z-10" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      
      <div className="relative z-10">
        <div ref={titleRef} className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-[#38598b]/20 text-emerald-700 dark:text-[#a2a8d3] text-sm font-medium mb-6 border border-emerald-100 dark:border-[#a2a8d3]/30 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#38598b] animate-pulse"></span>
            {t('heroTagline')}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-[#e7eaf6] mb-6 tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-[#38598b] dark:to-[#a2a8d3]">
              {t('heroTitle')}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-[#a2a8d3] max-w-2xl mx-auto leading-relaxed">
            {t('heroHadith')}
            <br />
            <span className="text-sm text-gray-500 dark:text-[#a2a8d3]/80 font-medium mt-2 block bg-white/50 dark:bg-[#222831]/50 w-fit mx-auto px-4 py-1 rounded-full backdrop-blur-sm border border-gray-100 dark:border-[#a2a8d3]/30">{t('heroSource')}</span>
          </p>
        </div>

        <div ref={searchRef} className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-[#a2a8d3] group-focus-within:text-emerald-600 dark:group-focus-within:text-[#e7eaf6] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-[#222831]/80 border border-gray-200 dark:border-[#a2a8d3]/30 rounded-2xl shadow-sm text-gray-900 dark:text-[#e7eaf6] placeholder-gray-400 dark:placeholder-[#a2a8d3]/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-[#38598b]/50 focus:border-emerald-500 dark:focus:border-[#38598b] transition-all text-lg backdrop-blur-sm"
            placeholder={t('searchPlaceholder')}
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="absolute inset-0 -z-10 bg-emerald-500/5 dark:bg-[#38598b]/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </section>
  );
}
