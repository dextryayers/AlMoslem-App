'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import SurahCard from './SurahCard';
import { Surah } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';

interface JuzSurahItem {
  surah: Surah;
  startAyat: number;
  endAyat: number;
}

interface JuzSurahListProps {
  items: JuzSurahItem[];
  revelationOrderMap: Record<number, number>;
}

export default function JuzSurahList({ items, revelationOrderMap }: JuzSurahListProps) {
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

  // Reset visible count when items change
  useEffect(() => {
    setVisibleCount(12);
  }, [items]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 12, items.length));
        }
      },
      { rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [items.length, visibleCount]);

  return (
    <div className="container mx-auto px-6 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.slice(0, visibleCount).map(({ surah, startAyat, endAyat }, index) => (
          <SurahCard 
            key={surah.nomor} 
            surah={surah} 
            index={index} 
            revelationOrder={revelationOrderMap[surah.nomor]}
            startAyat={startAyat}
            endAyat={endAyat}
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
      {visibleCount < items.length && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
