'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useRef, memo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface JuzCardProps {
  juz: {
    id: number;
    name: string;
    startSurah: number;
    startAyat: number;
  };
  surahName?: string;
  t: (key: any) => string;
}

const JuzCard = memo(function JuzCard({ juz, surahName, t }: JuzCardProps) {
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top bottom-=50",
        toggleActions: "play none none none",
        once: true
      }
    });
  }, { scope: cardRef });

  return (
    <Link 
      ref={cardRef}
      href={`/juz/${juz.id}`}
      className="group relative bg-white dark:bg-[#222831]/80 backdrop-blur-sm border border-gray-100 dark:border-[#a2a8d3]/10 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-[#38598b]/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '150px'
      }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform duration-500">
        <BookOpen className="w-24 h-24 text-emerald-600 dark:text-[#a2a8d3]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-[#38598b]/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-[#e7eaf6] font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-[#38598b] transition-colors duration-300">
            {juz.id}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-[#a2a8d3] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
            {t('readJuz')} <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-[#e7eaf6] mb-1">
          {juz.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-[#a2a8d3]">
          {t('startsAt')} {surahName} {t('ayat').toLowerCase()} {juz.startAyat}
        </p>
      </div>

      <div className="absolute inset-0 border-2 border-emerald-500/0 dark:border-[#38598b]/0 rounded-2xl group-hover:border-emerald-500/10 dark:group-hover:border-[#38598b]/30 transition-colors duration-300 pointer-events-none" />
    </Link>
  );
});

export default JuzCard;
