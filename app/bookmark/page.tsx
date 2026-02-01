'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useBookmark } from '../context/BookmarkContext';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';
import Header from '../components/Header';
import AyatCard from '../components/AyatCard';
import Link from 'next/link';
import { BookMarked, History, ArrowLeft, BookOpen, HelpCircle, X, Bookmark, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function BookmarkPage() {
  const { bookmarks, lastRead, removeBookmark, clearBookmarks } = useBookmark();
  const { 
    t, 
    fontSize, 
    translationFontSize, 
    arabicFont, 
    scriptType, 
    showLatin, 
    showTranslation, 
    showTafsir, 
    autoScroll, 
    language, 
    tajweedMode, 
    backgroundImage,
    autoTrackAudio 
  } = useSettings();
  
  const { 
    setPlaylist, 
    selectedQari, 
    isPlaying, 
    playAudio, 
    pauseAudio, 
    activeId,
    currentAudioSrc
  } = useAudio();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  const ayatSettings = {
    fontSize,
    translationFontSize,
    arabicFont,
    scriptType,
    showLatin,
    showTranslation,
    showTafsir,
    autoScroll,
    t,
    language,
    tajweedMode,
    backgroundImage,
    autoTrackAudio
  };

  // Sort bookmarks by timestamp descending (newest first)
  const sortedBookmarks = useMemo(() => {
    return [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);
  }, [bookmarks]);

  const handleClearAll = () => {
    if (window.confirm(t('clearAllConfirm'))) {
      clearBookmarks();
    }
  };

  useGSAP(() => {
    if (sortedBookmarks.length > 0) {
      gsap.from(".bookmark-card", {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all"
      });
    }
  }, { scope: containerRef, dependencies: [sortedBookmarks.length] });

  // Clear playlist on mount/unmount to prevent auto-play next track in Bookmarks
  // User wants playback to stop after the specific ayat is finished
  useEffect(() => {
    setPlaylist([]);
    return () => setPlaylist([]);
  }, [setPlaylist]);

  // Show help by default if no bookmarks
  useEffect(() => {
    if (bookmarks.length === 0) {
      setShowHelp(true);
    }
  }, [bookmarks.length]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-[#222831]">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
             <Link 
              href="/" 
              className="p-2.5 bg-white dark:bg-[#38598b]/20 rounded-xl hover:bg-gray-100 dark:hover:bg-[#38598b]/30 transition-colors shadow-sm border border-gray-100 dark:border-[#a2a8d3]/20"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-[#a2a8d3]" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-[#e7eaf6] flex items-center gap-3">
                <BookMarked className="w-8 h-8 text-emerald-600 dark:text-[#a2a8d3]" />
                {t('bookmark')}
              </h1>
              <p className="text-gray-500 dark:text-[#a2a8d3]/70 text-sm mt-1 ml-1">
                {bookmarks.length} {t('bookmark')} {t('saved')}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#38598b]/20 rounded-xl hover:bg-emerald-50 dark:hover:bg-[#38598b]/40 text-emerald-600 dark:text-[#a2a8d3] transition-colors shadow-sm border border-gray-100 dark:border-[#a2a8d3]/20"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-semibold text-sm">{t('howToBookmark')}</span>
          </button>
        </div>

        {/* Help Section */}
        {showHelp && (
          <div className="mb-8 bg-white dark:bg-[#222831]/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-emerald-100 dark:border-[#a2a8d3]/20 shadow-lg relative overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-xl font-bold text-emerald-800 dark:text-[#e7eaf6] flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl">
                  <BookMarked className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                {t('howToBookmark')}
              </h3>
              <button 
                onClick={() => setShowHelp(false)}
                className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-[#a2a8d3]" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
               <div className="bg-gray-50 dark:bg-[#2a303c]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                 <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-sm">1</div>
                 <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{t('read')} Al-Quran</h4>
                 <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('bookmarkHelpStep1')}</p>
               </div>
               <div className="bg-gray-50 dark:bg-[#2a303c]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                 <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-sm">2</div>
                 <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{t('addBookmark')}</h4>
                 <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('bookmarkHelpStep2')}</p>
                 <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-black/20 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                    <Bookmark className="w-3.5 h-3.5 fill-emerald-600 dark:fill-emerald-400" />
                    Demo Icon
                 </div>
               </div>
               <div className="bg-gray-50 dark:bg-[#2a303c]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                 <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-sm">3</div>
                 <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{t('collection')}</h4>
                 <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('bookmarkHelpStep3')}</p>
               </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowHelp(false)}
                className="px-6 py-2.5 bg-emerald-600 dark:bg-[#38598b] text-white rounded-xl font-bold text-sm hover:bg-emerald-700 dark:hover:bg-[#38598b]/80 transition-all shadow-lg shadow-emerald-200 dark:shadow-[#38598b]/50"
              >
                {t('gotIt')}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content (Bookmarks List) */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-[#e7eaf6]">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                  {t('bookmarksTitle') || t('bookmark')} {t('collection')}
                </h2>
                {bookmarks.length > 0 && (
                  <button 
                    onClick={handleClearAll}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs font-bold flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors border border-red-100 dark:border-red-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t('clearAll')}
                  </button>
                )}
              </div>
              
              {sortedBookmarks.length === 0 ? (
                <div className="bg-white dark:bg-[#222831]/50 rounded-3xl p-12 text-center border border-dashed border-gray-200 dark:border-[#a2a8d3]/20">
                   <div className="w-20 h-20 bg-gray-50 dark:bg-[#38598b]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookMarked className="w-10 h-10 text-gray-300 dark:text-[#a2a8d3]/50" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-[#e7eaf6] mb-3">
                     {t('noBookmarks')}
                   </h3>
                   <p className="text-gray-500 dark:text-[#a2a8d3]/70 max-w-sm mx-auto mb-8 leading-relaxed">
                     {t('noBookmarksDesc')}
                   </p>
                   <Link 
                     href="/" 
                     className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 dark:bg-[#38598b] text-white rounded-full font-bold hover:bg-emerald-700 dark:hover:bg-[#38598b]/80 transition-all shadow-lg shadow-emerald-200 dark:shadow-[#38598b]/50 hover:scale-105 active:scale-95"
                   >
                     <BookOpen className="w-4 h-4" />
                     {t('read')} Al-Quran
                   </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedBookmarks.map((b, i) => (
                    <div 
                      key={b.id} 
                      className="bookmark-card bg-white dark:bg-[#222831]/80 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-[#a2a8d3]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="bg-gray-50/80 dark:bg-[#38598b]/20 px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-[#a2a8d3]/10">
                        <div className="flex items-center gap-3">
                           <span className="bg-emerald-100 dark:bg-[#38598b]/40 text-emerald-700 dark:text-[#e7eaf6] text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-[#38598b]/50">
                             {b.surahNumber}:{b.ayatNumber}
                           </span>
                           <h3 className="font-bold text-gray-800 dark:text-[#e7eaf6] text-lg">
                             {b.surahName}
                           </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/surah/${b.surahNumber}#ayat-${b.ayatNumber}`}
                            className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-[#a2a8d3] hover:text-emerald-700 dark:hover:text-[#e7eaf6] transition-colors bg-white dark:bg-[#2a303c] px-3 py-1.5 rounded-full shadow-sm"
                          >
                            {t('read')} Full Surah
                            <BookOpen className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => removeBookmark(b.surahNumber, b.ayatNumber)}
                            className="p-1.5 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                            title={t('removeBookmark')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Reuse AyatCard but simplify container */}
                      <div className="p-0">
                         <AyatCard 
                           ayat={b.ayat} 
                           surahName={b.surahName} 
                           surahNumber={b.surahNumber} 
                           index={i}
                           className="shadow-none border-none !bg-transparent rounded-none"
                           shouldNavigateOnPlay={false}
                           settings={ayatSettings}
                           isPlaying={isPlaying}
                           isCurrentPlaying={isPlaying && currentAudioSrc === (b.ayat.audio[selectedQari] || b.ayat.audio['01'])}
                           playAudio={playAudio}
                           pauseAudio={pauseAudio}
                           audioSrc={b.ayat.audio[selectedQari] || b.ayat.audio['01']}
                         />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Section (Last Read) */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                {/* Last Read Card */}
                <div className="bg-white dark:bg-[#222831] p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110 duration-500"></div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-gray-900 dark:text-white font-bold text-lg">{t('lastRead')}</h3>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Lanjutkan membaca</p>
                    </div>
                  </div>
                  
                  {lastRead ? (
                    <div className="bg-gray-50 dark:bg-[#2a303c]/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/30 group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30 transition-colors">
                      <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-1">{t('surah')} {lastRead.surahName}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('ayat')} {lastRead.ayatNumber}</p>
                      <Link 
                        href={`/surah/${lastRead.surahNumber}#ayat-${lastRead.ayatNumber}`}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 dark:bg-[#38598b] text-white rounded-xl font-bold hover:bg-emerald-700 dark:hover:bg-[#38598b]/80 transition-all shadow-lg shadow-emerald-200 dark:shadow-[#38598b]/50 active:scale-95"
                      >
                        <BookOpen className="w-4 h-4" />
                        {t('continue')}
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-[#2a303c]/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700/50">
                      <p className="text-gray-400 dark:text-gray-500 italic">{t('noHistory')}</p>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
