'use client';

import React, { useRef, useState, useEffect, memo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Play, Pause, Share2, BookOpen, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import { Ayat, Tafsir } from '../types';
import { cn } from '../lib/utils';
import { useBookmark } from '../context/BookmarkContext';
import { getFontFamily } from '../lib/fonts';

interface AyatCardProps {
  ayat: Ayat;
  index: number;
  tafsir?: Tafsir;
  translation?: string;
  surahName: string;
  surahNumber: number;
  tajweedText?: string;
  className?: string;
  shouldNavigateOnPlay?: boolean;
  // Props from parent (AyatList) to avoid direct context usage
  settings: {
    fontSize: number;
    translationFontSize: number;
    arabicFont: string;
    scriptType: string;
    showLatin: boolean;
    showTranslation: boolean;
    showTafsir: boolean;
    autoScroll: boolean;
    t: (key: any) => string;
    language: string;
    tajweedMode: boolean;
    backgroundImage: string | null;
    autoTrackAudio: boolean;
    ayatNumberStyle?: 'simple-circle' | 'rub-el-hizb' | 'flower' | 'hexagon' | 'octagon' | 'diamond';
  };
  isPlaying: boolean;
  isCurrentPlaying: boolean;
  playAudio: (src: string) => void;
  pauseAudio: () => void;
  audioSrc: string;
}

const AyatCard = memo(function AyatCard({ 
  ayat, 
  index, 
  tafsir, 
  translation, 
  surahName, 
  surahNumber, 
  tajweedText, 
  className, 
  shouldNavigateOnPlay = false,
  settings,
  isPlaying,
  isCurrentPlaying,
  playAudio,
  pauseAudio,
  audioSrc
}: AyatCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const tafsirRef = useRef<HTMLDivElement>(null);
  const [isTafsirExpanded, setIsTafsirExpanded] = useState(false);
  
  // Destructure props for easier usage
  const { 
    fontSize, 
    translationFontSize, 
    arabicFont, 
    scriptType, 
    showLatin, 
    showTranslation, 
    showTafsir, 
    autoScroll, 
    autoTrackAudio,
    t, 
    language, 
    tajweedMode, 
    backgroundImage,
    ayatNumberStyle = 'rub-el-hizb'
  } = settings;

  const renderAyatNumber = () => {
    const commonClasses = "absolute inset-0 w-full h-full text-emerald-100 dark:text-emerald-900/30 fill-current stroke-emerald-500/20 dark:stroke-emerald-400/20 stroke-2 transition-all duration-300 group-hover:stroke-emerald-500 group-hover:text-emerald-200 dark:group-hover:text-emerald-900/50";
    
    switch (ayatNumberStyle) {
      case 'simple-circle':
        return (
          <svg viewBox="0 0 100 100" className={commonClasses}>
            <circle cx="50" cy="50" r="45" />
          </svg>
        );
      case 'flower':
        return (
          <svg viewBox="0 0 100 100" className={commonClasses}>
            <path d="M50 0 C60 20 80 20 85 35 C95 40 95 60 85 65 C80 80 60 80 50 100 C40 80 20 80 15 65 C5 60 5 40 15 35 C20 20 40 20 50 0 Z" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg viewBox="0 0 100 100" className={commonClasses}>
            <polygon points="50 5, 95 27.5, 95 72.5, 50 95, 5 72.5, 5 27.5" />
          </svg>
        );
      case 'octagon':
        return (
          <svg viewBox="0 0 100 100" className={commonClasses}>
            <polygon points="30 5, 70 5, 95 30, 95 70, 70 95, 30 95, 5 70, 5 30" />
          </svg>
        );
      case 'diamond':
        return (
          <svg viewBox="0 0 100 100" className={commonClasses}>
             <rect x="15" y="15" width="70" height="70" transform="rotate(45 50 50)" rx="4" />
          </svg>
        );
      case 'rub-el-hizb':
      default:
        return (
          <svg viewBox="0 0 100 100" className={commonClasses}>
            <g transform="translate(50 50)">
              <rect x="-30" y="-30" width="60" height="60" rx="4" transform="rotate(45)" />
              <rect x="-30" y="-30" width="60" height="60" rx="4" />
            </g>
          </svg>
        );
    }
  };

  const { isBookmarked, addBookmark, removeBookmark, setLastRead } = useBookmark();

  const isSaved = isBookmarked(surahNumber, ayat.nomorAyat);

  const handleBookmark = () => {
    if (isSaved) {
      removeBookmark(surahNumber, ayat.nomorAyat);
    } else {
      addBookmark(surahNumber, surahName, ayat);
    }
  };

  const parseTajweed = (text: string) => {
    const classMap: Record<string, string> = {
      'g': 'ghunnah',
      'a': 'idgham_ghunnah',
      'u': 'idgham_no_ghunnah',
      'w': 'idgham_shafawi',
      'i': 'iqlab',
      'f': 'ikhfa',
      'c': 'ikhfa_syafawi',
      'q': 'qalqalah',
      'm': 'madda_necessary',
      'p': 'madda_permissible',
      'o': 'madda_obligatory',
      'd': 'idgham_no_ghunnah',
      'b': 'idgham_no_ghunnah',
    };

    return text.replace(/\[([a-z])(?::[^\[]+)?\[(.*?)\]/g, (match, code, content) => {
      const className = classMap[code];
      if (className) {
        return `<span class="${className}">${content}</span>`;
      }
      return content;
    });
  };

  const source = language === 'id' ? 'Kemenag RI' : 'Al-Quran Cloud';

  useEffect(() => {
    // Only scroll if autoTrackAudio is enabled AND the audio is currently playing this verse
    if (isCurrentPlaying && autoTrackAudio && cardRef.current) {
      // Add a delay to ensure layout is stable and avoid conflicts
      const timer = setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isCurrentPlaying, autoTrackAudio]);

  // Initial animation
  useGSAP(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: 0.15, delay: 0, scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 100%',
      }}
    );
  }, { scope: cardRef });

  // Handle play button click
  const handlePlay = () => {
    if (shouldNavigateOnPlay) {
      // Logic for homepage or list view navigation
      router.push(`/surah/${surahNumber}`);
      // Wait for navigation then play (simulated)
      setTimeout(() => {
        playAudio(audioSrc);
      }, 500);
    } else {
      if (isCurrentPlaying) {
        pauseAudio();
      } else {
        playAudio(audioSrc);
      }
    }
  };

  return (
    <div 
      ref={cardRef} 
      className={cn(
        "relative rounded-2xl transition-all duration-300 border backdrop-blur-sm",
        isCurrentPlaying 
          ? "bg-emerald-50/90 dark:bg-emerald-900/20 border-emerald-500 shadow-lg shadow-emerald-500/10" 
          : "bg-white/80 dark:bg-gray-800/60 border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800",
        className
      )}
      style={{
         contentVisibility: 'auto', // Optimization for rendering
         containIntrinsicSize: '500px' // Approximate height to prevent scroll jump
      }}
    >
      {/* Card Header (Number) */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center group">
             {/* Decorative Background */}
             {renderAyatNumber()}
             <span className="relative z-10 font-bold text-emerald-700 dark:text-emerald-400 font-number text-lg">
               {ayat.nomorAyat}
             </span>
          </div>
        </div>
      </div>

      {/* Arabic Text */}
      <div className="p-6 text-right space-y-6">
        {tajweedMode && tajweedText ? (
          <div 
            className="leading-loose dir-rtl"
            style={{ 
              fontSize: `${fontSize}px`,
              fontFamily: getFontFamily(arabicFont)
            }}
            dangerouslySetInnerHTML={{ __html: parseTajweed(tajweedText) }}
          />
        ) : (
          <p 
            className="leading-loose dir-rtl text-gray-800 dark:text-gray-100"
            style={{ 
              fontSize: `${fontSize}px`,
              fontFamily: getFontFamily(arabicFont)
            }}
          >
            {scriptType === 'indopak' && ayat.teksIndopak ? ayat.teksIndopak : ayat.teksArab} 
          </p>
        )}
      </div>

      {/* Translation & Latin */}
      <div className="p-6 pt-0 space-y-4">
        {showLatin && (
          <p className="text-emerald-600 dark:text-emerald-400 font-medium text-lg leading-relaxed">
            {ayat.teksLatin}
          </p>
        )}

        {showTranslation && (
          <div className="space-y-1">
            <p 
              className="text-gray-600 dark:text-gray-300 leading-relaxed"
              style={{ fontSize: `${translationFontSize}px` }}
            >
              {translation || ayat.teksIndonesia}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Sumber: {source}
            </p>
          </div>
        )}

        {/* Tafsir Accordion */}
        {(showTafsir && tafsir) && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-4">
            <button
              onClick={() => setIsTafsirExpanded(!isTafsirExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors w-full"
            >
              <BookOpen size={16} />
              {isTafsirExpanded ? 'Sembunyikan Tafsir' : 'Baca Tafsir'}
              {isTafsirExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            <div 
              ref={tafsirRef}
              className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                isTafsirExpanded ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"
              )}
            >
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {tafsir?.teks || "Tafsir tidak tersedia."}
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  Sumber: Kemenag RI
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons (Moved to Bottom) */}
      <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <button 
            onClick={handleBookmark}
            className={cn(
              "p-2.5 rounded-full transition-colors flex items-center gap-2 text-sm font-medium",
              isSaved 
                ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20" 
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:text-gray-400"
            )}
            title="Bookmark"
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
            <span className="hidden sm:inline">{isSaved ? 'Tersimpan' : 'Simpan'}</span>
          </button>
          
          <button 
            onClick={() => {
              router.push(`/preview-img?surah=${surahNumber}&ayat=${ayat.nomorAyat}`);
            }}
            className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:text-gray-400 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
            title="Buat Gambar Quote"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
        </div>

        <button
          onClick={handlePlay}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
            isCurrentPlaying 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30" 
              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50"
          )}
          title={isCurrentPlaying ? "Pause" : "Play"}
        >
          {isCurrentPlaying ? (
            <>
              <Pause size={18} fill="currentColor" />
              <span className="font-medium text-sm">Jeda</span>
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              <span className="font-medium text-sm">Putar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

export default AyatCard;