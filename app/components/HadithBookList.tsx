'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Header from './Header';

interface HadithBookListProps {
  bookId: string;
  data: any;
}

export default function HadithBookList({ bookId, data }: HadithBookListProps) {
  const { t, language } = useSettings();

  const getBookTitle = (id: string) => {
    if (id === 'nawawi') return t('hadithNawawi');
    if (id === 'qudsi') return t('hadithQudsi');
    if (id === 'aladab') return t('adabMufrad');
    return data.metadata?.english?.title || 'Hadith Book';
  };

  const getBookDesc = (id: string) => {
    if (id === 'nawawi') return t('hadithNawawiDesc');
    if (id === 'qudsi') return t('hadithQudsiDesc');
    if (id === 'aladab') return t('adabMufradDesc');
    return '';
  };

  const getHadithTitle = (hadith: any) => {
    if (language === 'id') {
      return hadith.judul;
    }
    // English or fallback
    return hadith.english?.title || `${t('hadithNumber')} ${hadith.idInBook}`;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#222831]">
      <Header />
      {/* Header */}
      <div className="bg-white dark:bg-[#222831] border-b border-gray-100 dark:border-[#a2a8d3]/10 sticky top-20 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/hadist" 
            className="flex items-center gap-2 text-gray-600 dark:text-[#a2a8d3] hover:text-emerald-600 dark:hover:text-[#e7eaf6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t('backToBookList')}</span>
          </Link>
          <h1 className="text-lg font-bold text-gray-900 dark:text-[#e7eaf6] hidden md:block">
            {getBookTitle(bookId)}
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Hero */}
      <div className="bg-emerald-900 dark:bg-[#222831] text-white py-12 px-6 mb-8 relative overflow-hidden border-b border-white/10 dark:border-[#a2a8d3]/20">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex items-start gap-6">
            <div className="hidden md:flex w-20 h-20 rounded-2xl bg-white/10 dark:bg-[#38598b]/20 items-center justify-center backdrop-blur-sm border border-white/20 dark:border-[#a2a8d3]/20">
              <BookOpen className="w-10 h-10 text-emerald-300 dark:text-[#a2a8d3]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{getBookTitle(bookId)}</h1>
              <p className="text-emerald-100 dark:text-[#a2a8d3] text-lg leading-relaxed max-w-2xl">
                {getBookDesc(bookId)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="bg-white dark:bg-[#222831] rounded-2xl shadow-sm border border-gray-100 dark:border-[#a2a8d3]/10 overflow-hidden">
          {data.hadiths.map((hadith: any, index: number) => (
            <Link 
              key={hadith.idInBook}
              href={`/hadist/${bookId}/${hadith.idInBook}`}
              className={`block p-6 hover:bg-gray-50 dark:hover:bg-[#393E46]/30 transition-colors ${
                index !== data.hadiths.length - 1 ? 'border-b border-gray-100 dark:border-[#a2a8d3]/10' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-[#38598b]/20 text-emerald-700 dark:text-[#a2a8d3] flex items-center justify-center font-bold text-sm shrink-0">
                    {hadith.idInBook}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-[#e7eaf6] mb-1">
                      {getHadithTitle(hadith)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-[#a2a8d3]/60 line-clamp-1">
                      {hadith.translations && hadith.translations[language] 
                        ? hadith.translations[language].text
                        : (language === 'id' 
                          ? (hadith.terjemah || hadith.english?.text) 
                          : (hadith.english?.text || hadith.terjemah))
                      }
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-[#a2a8d3]/40" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
