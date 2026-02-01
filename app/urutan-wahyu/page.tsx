import { getSurahList } from '../lib/api';
import { REVELATION_ORDER } from '../lib/quran-data';
import Header from '../components/Header';
import SurahList from '../components/SurahList';
import Link from 'next/link';
import { ArrowLeft, Scroll } from 'lucide-react';

export default async function RevelationOrderPage() {
  const allSurahs = await getSurahList();
  
  // Create a map for quick lookup of revelation order
  const revelationOrderMap = REVELATION_ORDER.reduce((acc, nomor, index) => {
    acc[nomor] = index + 1;
    return acc;
  }, {} as Record<number, number>);

  // Sort Surahs by Revelation Order
  const sortedSurahs = [...allSurahs].sort((a, b) => {
    const orderA = revelationOrderMap[a.nomor] || 999;
    const orderB = revelationOrderMap[b.nomor] || 999;
    return orderA - orderB;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": sortedSurahs.map((surah, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": `Surah ${surah.namaLatin}`,
      "url": `https://almoslem.haniipp.space/surah/${surah.nomor}`
    }))
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#222831]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      {/* Header Section */}
      <div className="relative bg-emerald-900 dark:bg-[#222831] text-white pt-32 pb-12 px-6 rounded-b-[3rem] shadow-xl mb-8 overflow-hidden border-b border-white/10 dark:border-[#a2a8d3]/20">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 dark:bg-[#38598b]/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white dark:text-[#a2a8d3] dark:hover:text-[#e7eaf6] mb-6 transition-colors hover:-translate-x-1 duration-300 absolute left-0 top-0">
            <ArrowLeft className="w-5 h-5" /> Kembali
          </Link>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 dark:bg-[#38598b]/20 mb-6 backdrop-blur-sm border border-white/20 dark:border-[#a2a8d3]/20">
            <Scroll className="w-8 h-8 text-emerald-300 dark:text-[#a2a8d3]" />
          </div>

          <h1 className="font-bold text-4xl md:text-5xl mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 dark:from-[#e7eaf6] dark:to-[#a2a8d3]">
            Urutan Wahyu
          </h1>
          <p className="text-lg text-emerald-100 dark:text-[#a2a8d3] max-w-2xl mx-auto">
            Kronologi turunnya Surah-surah Al-Qur&apos;an kepada Nabi Muhammad SAW.
          </p>
        </div>
      </div>

      <SurahList 
        surahs={sortedSurahs} 
        revelationOrderMap={revelationOrderMap}
      />
    </main>
  );
}
