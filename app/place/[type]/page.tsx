import { getSurahList } from '../../lib/api';
import { REVELATION_ORDER } from '../../lib/quran-data';
import Header from '../../components/Header';
import SurahList from '../../components/SurahList';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';

interface PageProps {
  params: Promise<{ type: string }>;
}

export default async function PlacePage({ params }: PageProps) {
  const { type } = await params;
  
  // Validate type
  const isValidType = type === 'makkiyyah' || type === 'madaniyyah';
  
  if (!isValidType) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#222831] flex flex-col items-center justify-center p-6">
        <Header />
        <div className="text-center space-y-4 max-w-md mx-auto pt-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e7eaf6]">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-500 dark:text-[#a2a8d3]">Kategori tempat turun surat tidak valid.</p>
          <Link 
            href="/"
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  // Map URL type to data value
  const locationFilter = type === 'makkiyyah' ? 'Mekah' : 'Madinah';
  const title = type === 'makkiyyah' ? 'Surah Makkiyah' : 'Surah Madaniyah';
  const description = type === 'makkiyyah' 
    ? 'Surat-surat yang diturunkan di kota Mekah (sebelum hijrah)' 
    : 'Surat-surat yang diturunkan di kota Madinah (setelah hijrah)';

  // Fetch all Surahs
  const allSurahs = await getSurahList();
  
  // Filter Surahs
  const filteredSurahs = allSurahs.filter(s => s.tempatTurun === locationFilter);

  // Revelation Order Map (for optional display logic if needed)
  const revelationOrderMap = REVELATION_ORDER.reduce((acc, nomor, index) => {
    acc[nomor] = index + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#222831]">
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
            <MapPin className="w-8 h-8 text-emerald-300 dark:text-[#a2a8d3]" />
          </div>

          <h1 className="font-bold text-4xl md:text-5xl mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 dark:from-[#e7eaf6] dark:to-[#a2a8d3]">
            {title}
          </h1>
          <p className="text-lg text-emerald-100 dark:text-[#a2a8d3] max-w-2xl mx-auto">
            {description}
          </p>
          <div className="mt-6 inline-block px-4 py-1.5 bg-white/10 dark:bg-[#38598b]/20 rounded-full text-sm font-medium border border-white/10 dark:border-[#a2a8d3]/20">
            Total {filteredSurahs.length} Surah
          </div>
        </div>
      </div>

      <SurahList 
        surahs={filteredSurahs} 
        revelationOrderMap={revelationOrderMap}
      />
    </main>
  );
}
