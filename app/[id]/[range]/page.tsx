import { getSurahDetail, getSurahTafsir } from '../../lib/api';
import SurahDetailHeader from '../../components/SurahDetailHeader';
import AyatList from '../../components/AyatList';
import Header from '../../components/Header';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string; range: string }>;
}

export default async function PartialSurahPage({ params }: PageProps) {
  const { id, range } = await params;
  const surahId = parseInt(id);
  
  // Parse range (e.g., "142-252")
  const [startStr, endStr] = range.split('-');
  const startAyat = parseInt(startStr);
  const endAyat = parseInt(endStr);

  if (isNaN(surahId) || isNaN(startAyat) || isNaN(endAyat)) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#222831] flex flex-col items-center justify-center p-6">
        <Header />
        <div className="text-center pt-20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#e7eaf6]">URL Tidak Valid</h2>
          <Link href="/" className="text-emerald-600 hover:underline mt-4 inline-block">Kembali ke Beranda</Link>
        </div>
      </main>
    );
  }
  
  const surahData = getSurahDetail(surahId);
  const tafsirData = getSurahTafsir(surahId);

  const [surah, tafsir] = await Promise.all([surahData, tafsirData]);

  if (!surah) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#222831] flex flex-col items-center justify-center p-6">
        <Header />
        <div className="text-center space-y-4 max-w-md mx-auto pt-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e7eaf6]">Gagal Memuat Surah</h2>
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

  // Filter Ayat based on range
  const filteredAyat = surah.ayat?.filter(a => a.nomorAyat >= startAyat && a.nomorAyat <= endAyat) || [];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#222831]">
      <Header />
      
      {/* Reusing SurahDetailHeader but maybe we can overlay the range info? 
          For now, standard header is fine, it shows Surah info.
      */}
      <SurahDetailHeader surah={surah} />

      <div className="container mx-auto max-w-4xl px-6 mb-8 -mt-8 relative z-20 text-center">
        <div className="inline-block bg-emerald-100 dark:bg-[#38598b]/40 text-emerald-800 dark:text-[#e7eaf6] px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-200 dark:border-[#a2a8d3]/30">
          Menampilkan Ayat {startAyat} - {endAyat}
        </div>
      </div>

      <AyatList 
        ayat={filteredAyat} 
        tafsirList={tafsir?.tafsir || []} 
        surahName={surah.namaLatin}
        surahNumber={surahId}
      />
    </main>
  );
}
