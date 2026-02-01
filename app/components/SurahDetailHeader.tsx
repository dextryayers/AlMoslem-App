'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Surah } from '../types';
import Link from 'next/link';
import { ArrowLeft, BookOpen, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { surahMeanings } from '../lib/surahMeanings';

interface SurahDetailHeaderProps {
  surah: Surah;
}

export default function SurahDetailHeader({ surah }: SurahDetailHeaderProps) {
  const { t, language } = useSettings();
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(containerRef.current, {
      scaleY: 0,
      transformOrigin: "top",
      duration: 1,
      ease: 'power4.out',
    })
    .from(contentRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, "-=0.5");
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative bg-emerald-900 dark:bg-[#222831] text-white pt-32 pb-16 px-6 rounded-b-[3rem] shadow-2xl mb-12 overflow-hidden border-b dark:border-[#a2a8d3]/20">
       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 dark:bg-[#38598b]/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div ref={contentRef} className="container mx-auto max-w-4xl relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white dark:text-[#a2a8d3] dark:hover:text-[#e7eaf6] mb-8 transition-colors hover:-translate-x-1 duration-300">
          <ArrowLeft className="w-5 h-5" /> {t('backToHome')}
        </Link>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 dark:bg-[#38598b]/30 border border-white/10 dark:border-[#a2a8d3]/20 backdrop-blur-sm text-sm font-medium text-emerald-100 dark:text-[#e7eaf6] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-[#a2a8d3]"></span>
            {t('surahNumber')}{surah.nomor}
          </div>

          <h1 className="font-arabic text-6xl md:text-8xl mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 dark:from-[#e7eaf6] dark:to-[#a2a8d3]" dir="rtl">
            {surah.nama}
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white dark:text-[#e7eaf6]">{surah.namaLatin}</h2>
          
          <div className="flex items-center justify-center gap-6 text-emerald-100/80 dark:text-[#a2a8d3] mb-10">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {surahMeanings[surah.nomor]?.[language] || surah.arti}
            </span>
            <span className="w-1 h-1 bg-white/20 dark:bg-[#a2a8d3]/50 rounded-full"></span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {t(surah.tempatTurun.toLowerCase() as any) || surah.tempatTurun}
            </span>
            <span className="w-1 h-1 bg-white/20 dark:bg-[#a2a8d3]/50 rounded-full"></span>
            <span>{surah.jumlahAyat} {t('ayatCount')}</span>
          </div>
          
          {/* Show Basmalah for all surahs except Al-Fatihah (1) and At-Taubah (9) */}
          {surah.nomor !== 1 && surah.nomor !== 9 && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10 dark:border-[#a2a8d3]/20"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-emerald-900 dark:bg-[#222831]/90 backdrop-blur-sm px-6">
                  <p className="font-arabic text-3xl md:text-4xl text-emerald-100 dark:text-[#e7eaf6]">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
