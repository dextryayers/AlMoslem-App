import { Metadata } from 'next';
import Link from 'next/link';
import { getSurahList } from '../lib/api';
import Header from '../components/Header';
import { ArrowLeft, Map, Book, Layers, FileText, Info, Calendar, MessageCircle, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sitemap - Al-Moslem',
  description: 'Peta situs Al-Moslem untuk memudahkan navigasi ke seluruh konten Al-Quran, Hadits, Doa, dan fitur lainnya.',
};

export default async function SitemapPage() {
  const surahs = await getSurahList();

  const mainLinks = [
    { title: 'Beranda', href: '/', icon: <Layers className="w-5 h-5" /> },
    { title: 'Jadwal Sholat', href: '/jadwalsolat', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Ustaz AI', href: '/ust-ai', icon: <MessageCircle className="w-5 h-5" /> },
    { title: 'Preview Image (Quotes)', href: '/preview-img', icon: <FileText className="w-5 h-5" /> },
    { title: 'Tentang Kami', href: '/about', icon: <Info className="w-5 h-5" /> },
    { title: 'Donasi', href: '/donation', icon: <Heart className="w-5 h-5" /> },
    { title: 'Kumpulan Doa', href: '/doa', icon: <Book className="w-5 h-5" /> },
    { title: 'Urutan Wahyu', href: '/urutan-wahyu', icon: <Layers className="w-5 h-5" /> },
  ];

  const hadithBooks = [
    { title: 'Hadits Arbain Nawawi', href: '/hadist/nawawi' },
    { title: 'Hadits Qudsi', href: '/hadist/qudsi' },
    { title: 'Al-Adab Al-Mufrad', href: '/hadist/aladab' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#222831]">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24 max-w-5xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6">
            <Map className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-[#e7eaf6] mb-4">
            Peta Situs (Sitemap)
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Daftar lengkap seluruh halaman yang tersedia di Al-Moslem untuk memudahkan Anda menemukan konten yang dicari.
          </p>
        </div>

        {/* Main Sections */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-[#e7eaf6] mb-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3">
            <Layers className="w-6 h-6 text-emerald-500" />
            Halaman Utama
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainLinks.map((link, idx) => (
              <Link 
                key={idx} 
                href={link.href}
                className="flex items-center gap-3 p-4 bg-white dark:bg-[#2a303c] rounded-xl shadow-sm hover:shadow-md hover:bg-emerald-50 dark:hover:bg-[#323846] transition-all border border-gray-100 dark:border-gray-700"
              >
                <div className="text-emerald-600 dark:text-emerald-400">
                  {link.icon}
                </div>
                <span className="font-medium text-gray-700 dark:text-[#e7eaf6]">{link.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Hadith Books */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-[#e7eaf6] mb-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3">
            <Book className="w-6 h-6 text-emerald-500" />
            Kitab Hadits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hadithBooks.map((book, idx) => (
              <Link 
                key={idx} 
                href={book.href}
                className="block p-4 bg-white dark:bg-[#2a303c] rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all border border-gray-100 dark:border-gray-700"
              >
                <span className="font-medium text-gray-700 dark:text-[#e7eaf6]">{book.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Surah List */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-[#e7eaf6] mb-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3">
            <Book className="w-6 h-6 text-emerald-500" />
            Daftar Surat Al-Quran
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {surahs.map((surah) => (
              <Link 
                key={surah.nomor} 
                href={`/surah/${surah.nomor}`}
                className="flex items-center gap-2 p-3 bg-white dark:bg-[#2a303c] rounded-lg text-sm hover:bg-emerald-50 dark:hover:bg-[#323846] transition-colors border border-gray-100 dark:border-gray-700"
              >
                <span className="w-6 h-6 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                  {surah.nomor}
                </span>
                <span className="text-gray-700 dark:text-[#e7eaf6] truncate">{surah.namaLatin}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Juz List */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-[#e7eaf6] mb-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3">
            <Layers className="w-6 h-6 text-emerald-500" />
            Juz Al-Quran
          </h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
              <Link 
                key={juz} 
                href={`/juz/${juz}`}
                className="flex items-center justify-center p-3 bg-white dark:bg-[#2a303c] rounded-lg hover:bg-emerald-50 dark:hover:bg-[#323846] transition-colors border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-[#e7eaf6] font-medium"
              >
                Juz {juz}
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
