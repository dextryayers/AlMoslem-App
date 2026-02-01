'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Share2, Copy, BookOpen } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useState } from 'react';
import Header from './Header';

interface HadithDetailProps {
  bookId: string;
  hadith: any;
}

export default function HadithDetail({ bookId, hadith }: HadithDetailProps) {
  const { t, language } = useSettings();
  const [copied, setCopied] = useState(false);

  const getBookTitle = (id: string) => {
    if (id === 'nawawi') return t('hadithNawawi');
    if (id === 'qudsi') return t('hadithQudsi');
    if (id === 'aladab') return t('adabMufrad');
    return hadith.bookTitle || 'Hadith Book';
  };

  const getHadithTitle = () => {
    // Check for specific translation first
    if (hadith.translations && hadith.translations[language]) {
      return hadith.translations[language].title;
    }
    
    // Legacy/Fallback checks
    if (language === 'id') return hadith.judul;
    
    // For other languages without translation, try English or generic
    return hadith.english?.title || `${t('hadithNumber')} ${hadith.idInBook}`;
  };

  const getContent = () => {
    // Check for specific translation first
    if (hadith.translations && hadith.translations[language]) {
      return hadith.translations[language].text;
    }

    // Legacy/Fallback checks
    if (language === 'id') return hadith.terjemah || hadith.english?.text;
    
    // Fallback to English
    return hadith.english?.text || hadith.terjemah;
  };

  const getRiwayat = () => {
    // Check for specific translation first
    if (hadith.translations && hadith.translations[language] && hadith.translations[language].narrator) {
      return hadith.translations[language].narrator;
    }

    // Legacy/Fallback checks
    if (language === 'id') return hadith.riwayat;
    return hadith.english?.narrator || hadith.riwayat;
  };

  const handleCopy = () => {
    const text = `${hadith.arabic}\n\n${getContent()}\n\n(${getRiwayat()})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#222831] pb-20">
      <Header />
      {/* Header */}
      <div className="bg-white dark:bg-[#222831] border-b border-gray-100 dark:border-[#a2a8d3]/10 sticky top-20 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href={`/hadist/${bookId}`}
            className="flex items-center gap-2 text-gray-600 dark:text-[#a2a8d3] hover:text-emerald-600 dark:hover:text-[#e7eaf6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden md:inline">{t('backToBookList')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-[#a2a8d3]/60">{getBookTitle(bookId)}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-[#a2a8d3]/40"></span>
            <span className="text-sm font-bold text-gray-900 dark:text-[#e7eaf6]">No. {hadith.idInBook}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#393E46] text-gray-600 dark:text-[#a2a8d3] transition-colors"
              title="Copy"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Card */}
        <div className="bg-white dark:bg-[#222831] rounded-3xl shadow-sm border border-gray-100 dark:border-[#a2a8d3]/10 overflow-hidden">
          {/* Title Section */}
          <div className="bg-emerald-50 dark:bg-[#38598b]/10 p-6 border-b border-emerald-100 dark:border-[#a2a8d3]/10">
            <h1 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-[#e7eaf6] mb-2">
              {getHadithTitle()}
            </h1>
            <div className="flex justify-center">
               <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-[#38598b]/30 text-emerald-700 dark:text-[#a2a8d3] text-sm font-medium">
                 <BookOpen className="w-3 h-3" /> {getBookTitle(bookId)}
               </span>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            {/* Arabic */}
            <div className="text-right" dir="rtl">
              <p className="text-3xl md:text-4xl leading-[2] font-amiri text-gray-900 dark:text-[#e7eaf6]">
                {hadith.arabic}
              </p>
            </div>

            {/* Translation */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-[1px] bg-emerald-600 dark:bg-emerald-400"></span>
                {t('translation')}
              </h3>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-[#a2a8d3]">
                {getContent()}
              </p>
            </div>

            {/* Narrator */}
            <div className="bg-gray-50 dark:bg-[#393E46]/30 rounded-xl p-5 border border-gray-100 dark:border-[#a2a8d3]/5">
              <p className="text-sm text-gray-600 dark:text-[#a2a8d3]/80 italic text-center">
                {t('narratedBy')}: {getRiwayat()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {hadith.prev ? (
            <Link 
              href={`/hadist/${bookId}/${hadith.prev}`}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#222831] border border-gray-200 dark:border-[#a2a8d3]/20 text-gray-700 dark:text-[#a2a8d3] hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">{t('prevHadith')}</span>
            </Link>
          ) : <div></div>}

          {hadith.next ? (
            <Link 
              href={`/hadist/${bookId}/${hadith.next}`}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 dark:bg-[#38598b] text-white hover:bg-emerald-700 dark:hover:bg-[#38598b]/80 transition-all shadow-sm hover:shadow-md hover:shadow-emerald-500/20"
            >
              <span className="font-medium hidden sm:inline">{t('nextHadith')}</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : <div></div>}
        </div>
      </div>

      {copied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-50 animate-fade-in-up">
          Copied to clipboard
        </div>
      )}
    </main>
  );
}
