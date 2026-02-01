'use client';

import { useState, useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Hero from './Hero';
import SurahList from './SurahList';
import JuzCard from './JuzCard';
import { Surah } from '../types';
import { REVELATION_ORDER, JUZ_DATA } from '../lib/quran-data';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, BookOpen, Layers, Scroll } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { useSettings } from '../context/SettingsContext';
import { surahMeanings } from '../lib/surahMeanings';

interface HomeContentProps {
  initialSurahs: Surah[];
}

type TabType = 'surah' | 'juz' | 'revelation';
type SortOrder = 'asc' | 'desc';
type LocationFilter = 'all' | 'Mekah' | 'Madinah';

export default function HomeContent({ initialSurahs }: HomeContentProps) {
  const { t, language } = useSettings();
  const controlsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('surah');

  useGSAP(() => {
    gsap.from(controlsRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out'
    });
  }, { scope: controlsRef });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('all');

  // Create a map for quick lookup of revelation order
  const revelationOrderMap = useMemo(() => {
    const map: Record<number, number> = {};
    REVELATION_ORDER.forEach((surahId, index) => {
      map[surahId] = index + 1;
    });
    return map;
  }, []);

  // Filter and Sort Logic
  const filteredContent = useMemo(() => {
    let result = [...initialSurahs];

    // 1. Search Filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(surah => {
        const meaning = surahMeanings[surah.nomor]?.[language]?.toLowerCase() || '';
        const originalMeaning = surah.arti.toLowerCase();
        
        return (
          surah.namaLatin.toLowerCase().includes(lowerQuery) ||
          originalMeaning.includes(lowerQuery) ||
          meaning.includes(lowerQuery)
        );
      });
    }

    // 2. Location Filter (Mekah/Madinah) - only for Surah and Revelation tabs
    if (activeTab !== 'juz' && locationFilter !== 'all') {
      result = result.filter(surah => surah.tempatTurun === locationFilter);
    }

    // 3. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (activeTab === 'revelation') {
        const orderA = revelationOrderMap[a.nomor] || 999;
        const orderB = revelationOrderMap[b.nomor] || 999;
        comparison = orderA - orderB;
      } else {
        // Default: Sort by Surah Number
        comparison = a.nomor - b.nomor;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [initialSurahs, searchQuery, activeTab, sortOrder, locationFilter, revelationOrderMap]);

  const tabs = [
    { id: 'surah', label: t('surah'), icon: BookOpen },
    { id: 'juz', label: t('juz'), icon: Layers },
    { id: 'revelation', label: t('revelationOrder'), icon: Scroll },
  ] as const;

  return (
    <>
      <Hero onSearch={setSearchQuery} />
      
      <div ref={controlsRef} className="container mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 dark:border-[#a2a8d3]/20 pb-4 bg-white/50 dark:bg-[#222831]/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-[#38598b]/20 p-1.5 rounded-xl backdrop-blur-sm">
            {tabs.map((tab) => {
              if (tab.id === 'revelation') {
                return (
                   <Link
                    key={tab.id}
                    href="/urutan-wahyu"
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 text-gray-500 dark:text-[#a2a8d3] hover:text-gray-700 dark:hover:text-[#e7eaf6] hover:bg-white/50 dark:hover:bg-[#38598b]/40"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </Link>
                );
              }
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-white dark:bg-[#38598b] text-emerald-600 dark:text-[#e7eaf6] shadow-sm shadow-gray-200/50 dark:shadow-none"
                      : "text-gray-500 dark:text-[#a2a8d3] hover:text-gray-700 dark:hover:text-[#e7eaf6] hover:bg-white/50 dark:hover:bg-[#38598b]/40"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Filters & Sort (Hidden for Juz Tab) */}
          {activeTab !== 'juz' && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Location Filter Buttons */}
              <div className="flex items-center bg-gray-100/80 dark:bg-[#38598b]/20 p-1.5 rounded-xl backdrop-blur-sm">
                <button
                  onClick={() => setLocationFilter('all')}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                    locationFilter === 'all'
                      ? "bg-white dark:bg-[#38598b] text-emerald-600 dark:text-white shadow-sm shadow-gray-200/50 dark:shadow-none"
                      : "text-gray-500 dark:text-[#a2a8d3] hover:text-gray-700 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#38598b]/40"
                  )}
                >
                  {t('all')}
                </button>
                <Link
                  href="/place/makkiyyah"
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all text-gray-500 dark:text-[#a2a8d3] hover:text-gray-700 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#38598b]/40"
                  )}
                >
                  {t('makkah')}
                </Link>
                <Link
                  href="/place/madaniyyah"
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all text-gray-500 dark:text-[#a2a8d3] hover:text-gray-700 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#38598b]/40"
                  )}
                >
                  {t('madinah')}
                </Link>
              </div>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50/80 dark:bg-[#38598b]/20 hover:bg-gray-100 dark:hover:bg-[#38598b]/30 border border-gray-100 dark:border-[#a2a8d3]/20 rounded-xl text-sm font-medium text-gray-700 dark:text-[#e7eaf6] transition-all backdrop-blur-sm"
              >
                {sortOrder === 'asc' ? (
                  <>
                    <ArrowUpNarrowWide className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('ascending')}</span>
                  </>
                ) : (
                  <>
                    <ArrowDownWideNarrow className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('descending')}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'juz' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto px-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {JUZ_DATA.map((juz) => {
            // Find surah name for display
            const surah = initialSurahs.find(s => s.nomor === juz.startSurah);
            return (
              <JuzCard 
                key={juz.id} 
                juz={juz} 
                surahName={surah?.namaLatin}
                t={t}
              />
            );
          })}
        </div>
      ) : (
        <SurahList 
          surahs={filteredContent} 
          revelationOrderMap={activeTab === 'revelation' ? revelationOrderMap : undefined}
        />
      )}
    </>
  );
}
