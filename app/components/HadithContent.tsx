'use client';

import { useSettings } from '../context/SettingsContext';
import Link from 'next/link';
import { ArrowLeft, Book, BookOpen } from 'lucide-react';

export default function HadithContent() {
  const { t } = useSettings();

  const books = [
    {
      id: 'nawawi',
      title: t('hadithNawawi'),
      description: t('hadithNawawiDesc'),
      count: 42,
      color: 'bg-emerald-600'
    },
    {
      id: 'qudsi',
      title: t('hadithQudsi'),
      description: t('hadithQudsiDesc'),
      count: 40,
      color: 'bg-blue-600'
    },
    {
      id: 'aladab',
      title: t('adabMufrad'),
      description: t('adabMufradDesc'),
      count: 1322,
      color: 'bg-purple-600'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#222831]">
      {/* Hero Section */}
      <div className="relative bg-emerald-900 dark:bg-[#222831] text-white pt-32 pb-16 px-6 rounded-b-[3rem] shadow-xl mb-12 overflow-hidden border-b border-white/10 dark:border-[#a2a8d3]/20">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 dark:bg-[#38598b]/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-400/10 dark:bg-[#38598b]/10 blur-[80px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white dark:text-[#a2a8d3] dark:hover:text-[#e7eaf6] mb-8 transition-all hover:-translate-x-1 duration-300 absolute left-0 top-0">
            <ArrowLeft className="w-5 h-5" /> {t('back')}
          </Link>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 dark:bg-[#38598b]/20 mb-8 backdrop-blur-sm border border-white/20 dark:border-[#a2a8d3]/20 shadow-2xl rotate-3 hover:rotate-6 transition-transform duration-500">
            <BookOpen className="w-10 h-10 text-emerald-300 dark:text-[#a2a8d3]" />
          </div>

          <h1 className="font-bold text-4xl md:text-6xl mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 dark:from-[#e7eaf6] dark:to-[#a2a8d3]">
            {t('hadith')}
          </h1>
          <p className="text-xl text-emerald-100 dark:text-[#a2a8d3] max-w-2xl mx-auto leading-relaxed">
            {t('footerDesc')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pb-24 max-w-5xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link 
              key={book.id}
              href={`/hadist/${book.id}`}
              className="group bg-white dark:bg-[#222831] rounded-3xl p-8 border border-gray-100 dark:border-[#a2a8d3]/20 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:shadow-[#38598b]/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl ${book.color} dark:bg-[#38598b] text-white flex items-center justify-center mb-6 shadow-lg`}>
                  <Book className="w-7 h-7" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e7eaf6] mb-3 group-hover:text-emerald-600 dark:group-hover:text-[#a2a8d3] transition-colors">
                  {book.title}
                </h2>
                
                <p className="text-gray-500 dark:text-[#a2a8d3]/70 mb-8 flex-1 leading-relaxed">
                  {book.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-[#a2a8d3]/10">
                  <span className="text-sm font-medium text-gray-400 dark:text-[#a2a8d3]/60">
                    {book.count} {t('hadith')}
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-[#e7eaf6] flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t('read')} <ArrowLeft className="w-4 h-4 rotate-180" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
