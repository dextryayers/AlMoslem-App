'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SurahCard from './SurahCard';
import { Surah } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';

gsap.registerPlugin(ScrollTrigger);

interface SurahListProps {
  surahs: Surah[];
  revelationOrderMap?: Record<number, number>;
}

export default function SurahList({ surahs, revelationOrderMap }: SurahListProps) {
  const { t, autoTrackAudio } = useSettings();
  const { isPlaying, currentAudioSrc, activeId, playAudio, pauseAudio, setPlaylist, selectedQari } = useAudio();
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const audioActions = useMemo(() => ({
    playAudio,
    pauseAudio,
    setPlaylist,
    selectedQari
  }), [playAudio, pauseAudio, setPlaylist, selectedQari]);

  // Reset visible count when surahs change
  useEffect(() => {
    setVisibleCount(12);
  }, [surahs]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 12, surahs.length));
        }
      },
      { rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [surahs.length, visibleCount]); // Add visibleCount dependency to ensure it updates correctly if needed, though mostly length matters for limit

  useEffect(() => {
    // Refresh ScrollTrigger when visible items change
    ScrollTrigger.refresh();
  }, [visibleCount]);

  if (surahs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-[#a2a8d3] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <p className="text-xl font-medium">{t('surahNotFound')}</p>
        <p className="text-sm mt-2">{t('tryAnotherKeyword')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surahs.slice(0, visibleCount).map((surah, index) => (
          <SurahCard 
            key={surah.nomor} 
            surah={surah} 
            index={index} 
            revelationOrder={revelationOrderMap ? revelationOrderMap[surah.nomor] : undefined}
            t={t}
            autoTrackAudio={autoTrackAudio}
            isActive={activeId === surah.nomor.toString()}
            isPlaying={isPlaying}
            currentAudioSrc={currentAudioSrc}
            audioActions={audioActions}
          />
        ))}
      </div>

      {/* Load More Trigger */}
      {visibleCount < surahs.length && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
