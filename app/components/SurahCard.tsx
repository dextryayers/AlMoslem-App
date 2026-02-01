'use client';

import { useRef, useState, memo, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, BookOpen, Share2, MapPin, Star } from 'lucide-react';
import { Surah } from '../types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getSurahDetail } from '../lib/api';
import { useSettings } from '../context/SettingsContext';
import { surahMeanings } from '../lib/surahMeanings';

gsap.registerPlugin(ScrollTrigger);

interface SurahCardProps {
  surah: Surah;
  index: number;
  revelationOrder?: number;
  startAyat?: number;
  endAyat?: number;
  t: (key: any) => string;
  isActive: boolean;
  isPlaying: boolean;
  currentAudioSrc: string | null;
  autoTrackAudio?: boolean;
  audioActions: {
    playAudio: (src: string, id: string) => void;
    pauseAudio: () => void;
    setPlaylist: (urls: string[]) => void;
    selectedQari: string;
  };
}

const SurahCard = memo(function SurahCard({ 
  surah, index, revelationOrder, startAyat, endAyat, 
  t, isActive, isPlaying, currentAudioSrc, audioActions, autoTrackAudio = true
}: SurahCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { language } = useSettings();
  const { playAudio, pauseAudio, setPlaylist, selectedQari } = audioActions;
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Determine target URL (partial or full)
  // If startAyat and endAyat are provided (from Juz view), ALWAYS use the range URL format
  // This satisfies the requirement: "khusus kategori juz itu URL nya semua menjadi /1/1-7"
  const href = startAyat && endAyat
    ? `/${surah.nomor}/${startAyat}-${endAyat}`
    : `/surah/${surah.nomor}`;

  const isPartial = (startAyat && startAyat > 1) || (endAyat && endAyat < surah.jumlahAyat);
  const componentId = isPartial 
    ? `surah-${surah.nomor}-partial-${startAyat}-${endAyat}` 
    : `surah-${surah.nomor}-full`;

  // Determine audio URL (fallback to 01 if selected not available)
  const QARI_PATHS: Record<string, string> = {
    '01': 'Abdullah-Al-Juhany',
    '02': 'Abdul-Muhsin-Al-Qasim',
    '03': 'Abdurrahman-as-Sudais',
    '04': 'Ibrahim-Al-Dossari',
    '05': 'Misyari-Rasyid-Al-Afasi',
    '06': 'Yasser-Al-Dosari',
  };
  const qariPath = QARI_PATHS[selectedQari] || 'Misyari-Rasyid-Al-Afasi';
  const pad3 = (num: number) => num.toString().padStart(3, '0');
  const audioUrl = `https://cdn.equran.id/audio-full/${qariPath}/${pad3(surah.nomor)}.mp3`;
  
  // Check if playing
  const isCurrentSurahPlaying = isPlaying;

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPartial) {
      // Logic for playing partial range
      // If we are currently fetching, do nothing
      if (isLoadingAudio) return;

      if (isCurrentSurahPlaying) {
        pauseAudio();
        return;
      }

      // Resume if this card is active but paused
      if (isActive && currentAudioSrc) {
        playAudio(currentAudioSrc, componentId);
        return;
      }

      try {
        setIsLoadingAudio(true);
        const detail = await getSurahDetail(surah.nomor);
        
        if (detail && detail.ayat && startAyat && endAyat) {
          const rangeAyat = detail.ayat.filter(a => a.nomorAyat >= startAyat && a.nomorAyat <= endAyat);
          const playlist = rangeAyat.map(a => {
            return `https://cdn.equran.id/audio-partial/${qariPath}/${pad3(surah.nomor)}${pad3(a.nomorAyat)}.mp3`;
          });
          
          if (playlist.length > 0) {
             setPlaylist(playlist);
             playAudio(playlist[0], componentId);
          }
        }
      } catch (error) {
        console.error("Failed to play partial audio:", error);
      } finally {
        setIsLoadingAudio(false);
      }
    } else {
      // Logic for playing full surah
      if (isCurrentSurahPlaying) {
        pauseAudio();
      } else if (audioUrl) {
        // Resume if active but paused
        if (isActive && currentAudioSrc) {
           playAudio(currentAudioSrc, componentId);
        } else {
           playAudio(audioUrl, componentId);
        }
      }
    }
  };

  // Auto scroll when active
  useEffect(() => {
    if (isActive && autoTrackAudio && cardRef.current) {
      const timer = setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isActive, autoTrackAudio]);

  useGSAP(() => {
    gsap.fromTo(cardRef.current, 
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.2)',
        delay: (index % 4) * 0.05, // Much faster stagger, limited to row
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom-=50',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  }, { scope: cardRef, dependencies: [index] });

  return (
    <Link href={href} className="block h-full">
      <div 
        ref={cardRef}
        className="group relative h-full bg-white dark:bg-[#222831]/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 dark:border-[#a2a8d3]/10 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-[#38598b]/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '200px'
        }}
      >
        {/* Gradient Background on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 dark:from-[#38598b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Decorative Circle */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-100/50 dark:bg-[#38598b]/10 rounded-full blur-2xl group-hover:bg-emerald-200/50 dark:group-hover:bg-[#38598b]/20 transition-colors duration-500" />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-[#38598b]/20 text-emerald-700 dark:text-[#e7eaf6] font-bold rounded-xl group-hover:bg-emerald-600 dark:group-hover:bg-[#38598b] group-hover:text-white transition-all duration-300 shadow-sm ring-1 ring-gray-100 dark:ring-[#a2a8d3]/20 group-hover:ring-emerald-500 dark:group-hover:ring-[#38598b]">
                {surah.nomor}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-[#e7eaf6] text-lg group-hover:text-emerald-700 dark:group-hover:text-[#a2a8d3] transition-colors leading-tight">
                  {surah.namaLatin}
                </h4>
                <p className="text-xs text-gray-500 dark:text-[#a2a8d3] font-medium uppercase tracking-wider mt-0.5">
                  {surahMeanings[surah.nomor]?.[language] || surah.arti}
                </p>
              </div>
            </div>

            {/* Play Button */}
            <button
              onClick={handlePlay}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm z-20 ${
                isCurrentSurahPlaying 
                  ? 'bg-emerald-500 dark:bg-[#38598b] text-white shadow-emerald-500/30 dark:shadow-[#38598b]/30 scale-110' 
                  : 'bg-white/80 dark:bg-[#222831]/80 backdrop-blur-sm text-emerald-600 dark:text-[#a2a8d3] border border-gray-100 dark:border-[#a2a8d3]/30 hover:bg-emerald-50 dark:hover:bg-[#38598b]/20'
              }`}
              title={isCurrentSurahPlaying ? "Pause Audio" : "Play Full Surah"}
            >
              {isLoadingAudio ? (
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              ) : isCurrentSurahPlaying ? (
                <div className="relative">
                  <span className="absolute inset-0 animate-ping opacity-75 rounded-full bg-white/50"></span>
                  <Pause className="w-4 h-4 relative z-10" fill="currentColor" />
                </div>
              ) : (
                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
              )}
            </button>
          </div>
          
          <div className="flex items-end justify-between border-t border-gray-50 dark:border-[#a2a8d3]/20 pt-4 mt-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-[#a2a8d3]/70 font-medium">
                 <span className="flex items-center gap-1 bg-gray-50 dark:bg-[#38598b]/20 px-2 py-1 rounded-md group-hover:bg-white/80 dark:group-hover:bg-[#38598b]/40 transition-colors">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {surah.tempatTurun}
                </span>
                <span className="flex items-center gap-1 bg-gray-50 dark:bg-[#38598b]/20 px-2 py-1 rounded-md group-hover:bg-white/80 dark:group-hover:bg-[#38598b]/40 transition-colors">
                  <Star className="w-3 h-3 text-amber-400" />
                  {surah.jumlahAyat} {t('ayatCount')}
                </span>
              </div>
              {revelationOrder && (
                <div className="text-[10px] text-emerald-600 dark:text-[#a2a8d3] font-medium bg-emerald-50 dark:bg-[#38598b]/20 px-2 py-0.5 rounded-full w-fit">
                  {t('revelationNumber')}{revelationOrder}
                </div>
              )}
            </div>
            <h3 className="font-arabic text-2xl text-gray-300 dark:text-gray-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors duration-300" dir="rtl">
              {surah.nama}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default SurahCard;
