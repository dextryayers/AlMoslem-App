import { getSurahList } from '../../lib/api';
import { JUZ_DATA, REVELATION_ORDER } from '../../lib/quran-data';
import Header from '../../components/Header';
import SurahCard from '../../components/SurahCard';
import JuzSurahList from '../../components/JuzSurahList';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JuzPage({ params }: PageProps) {
  const { id } = await params;
  const juzId = parseInt(id);
  const currentJuz = JUZ_DATA.find(j => j.id === juzId);
  const nextJuz = JUZ_DATA.find(j => j.id === juzId + 1);

  if (!currentJuz) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#222831] flex flex-col items-center justify-center p-6">
        <Header />
        <div className="text-center space-y-4 max-w-md mx-auto pt-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e7eaf6]">Juz Tidak Ditemukan</h2>
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

  // Determine Surah range logic
  // Start is always clear
  const startSurahNumber = currentJuz.startSurah;
  
  // End logic:
  // If next juz exists:
  //   If next juz starts at Ayat 1 of a surah, then that surah belongs to NEXT juz. So current ends at previous surah.
  //   If next juz starts at Ayat > 1, then that surah is split. It belongs to BOTH. So current ends at that surah.
  // If next juz does not exist (Juz 30), ends at 114.
  
  let endSurahNumber = 114;
  if (nextJuz) {
    if (nextJuz.startAyat === 1) {
      endSurahNumber = nextJuz.startSurah - 1;
    } else {
      endSurahNumber = nextJuz.startSurah;
    }
  }

  // Fetch all Surahs
  let allSurahs: any[] = [];
  try {
    allSurahs = await getSurahList();
  } catch (error) {
    console.error('Failed to fetch surahs:', error);
    // Continue with empty list, UI will just show empty grid or we can show error
  }
  
  if (allSurahs.length === 0) {
     return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#222831] flex flex-col items-center justify-center p-6">
        <Header />
        <div className="text-center space-y-4 max-w-md mx-auto pt-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e7eaf6]">Gagal Memuat Data</h2>
          <p className="text-gray-600 dark:text-[#a2a8d3]">Terjadi kesalahan saat mengambil data Surah. Silakan coba lagi nanti.</p>
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
  
  // Filter Surahs in this Juz
  const juzSurahs = allSurahs.filter(s => s.nomor >= startSurahNumber && s.nomor <= endSurahNumber);

  // Revelation Order Map
  const revelationOrderMap = REVELATION_ORDER.reduce((acc, nomor, index) => {
    acc[nomor] = index + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#222831]">
      <Header />
      
      {/* Juz Header */}
      <div className="relative bg-emerald-900 dark:bg-[#222831] text-white pt-32 pb-12 px-6 rounded-b-[3rem] shadow-xl mb-8 overflow-hidden border-b border-white/10 dark:border-[#a2a8d3]/20">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 dark:bg-[#38598b]/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white dark:text-[#a2a8d3] dark:hover:text-[#e7eaf6] mb-6 transition-colors hover:-translate-x-1 duration-300 absolute left-0 top-0">
            <ArrowLeft className="w-5 h-5" /> Kembali
          </Link>

          <h1 className="font-arabic text-5xl md:text-7xl mb-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 dark:from-[#e7eaf6] dark:to-[#a2a8d3]">
            Juz {currentJuz.id}
          </h1>
          <p className="text-xl text-emerald-100 dark:text-[#a2a8d3]">
            Menampilkan Surah {startSurahNumber} sampai {endSurahNumber}
          </p>
        </div>
      </div>

      <JuzSurahList 
        items={juzSurahs.map(surah => {
          let startAyat = 1;
          let endAyat = surah.jumlahAyat;

          // If this surah is the start of the current Juz
          if (surah.nomor === currentJuz.startSurah) {
            startAyat = currentJuz.startAyat;
          }

          // If this surah is the start of the NEXT Juz (meaning it's split)
          if (nextJuz && surah.nomor === nextJuz.startSurah) {
            endAyat = nextJuz.startAyat - 1;
          }

          return { surah, startAyat, endAyat };
        })}
        revelationOrderMap={revelationOrderMap}
      />
    </main>
  );
}
