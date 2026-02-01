import { getSurahDetail, getSurahTafsir } from '../../lib/api';
import SurahDetailHeader from '../../components/SurahDetailHeader';
import AyatList from '../../components/AyatList';
import Header from '../../components/Header';
import SurahBackground from '../../components/SurahBackground';
import ReadingSettingsSidebar from '../../components/ReadingSettingsSidebar';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ nomor: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { nomor } = await params;
  const surah = await getSurahDetail(parseInt(nomor));

  if (!surah) {
    return {
      title: 'Surah Tidak Ditemukan',
    };
  }

  return {
    title: `Surah ${surah.namaLatin} (${surah.arti}) - Terjemahan & Tafsir`,
    description: `Baca Surah ${surah.namaLatin} lengkap dengan terjemahan Bahasa Indonesia, tafsir, dan audio murottal. Surah ke-${surah.nomor} dalam Al-Quran, terdiri dari ${surah.jumlahAyat} ayat, diturunkan di ${surah.tempatTurun}.`,
    keywords: [`Surah ${surah.namaLatin}`, `Tafsir ${surah.namaLatin}`, `Baca ${surah.namaLatin}`, "Al-Quran Online", surah.arti],
    openGraph: {
      title: `Surah ${surah.namaLatin} - QQuran`,
      description: `Baca Surah ${surah.namaLatin} (${surah.arti}) dengan terjemahan dan tafsir lengkap.`,
      url: `https://almoslem.haniipp.space/surah/${surah.nomor}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `Surah ${surah.namaLatin} - QQuran`,
      description: `Baca Surah ${surah.namaLatin} (${surah.arti}) dengan terjemahan dan tafsir lengkap.`,
    }
  };
}

export default async function SurahDetail({ params }: PageProps) {
  const { nomor } = await params;
  const nomorInt = parseInt(nomor);
  
  const surahData = getSurahDetail(nomorInt);
  const tafsirData = getSurahTafsir(nomorInt);

  const [surah, tafsir] = await Promise.all([surahData, tafsirData]);

  if (!surah) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-transparent flex flex-col items-center justify-center p-6">
        <Header />
        <div className="text-center space-y-4 max-w-md mx-auto pt-20">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e7eaf6]">Gagal Memuat Surah</h2>
          <p className="text-gray-600 dark:text-[#a2a8d3]">
            Terjadi kesalahan saat mengambil data. Mohon periksa koneksi internet Anda dan coba muat ulang halaman.
          </p>
          <a 
            href={`/surah/${nomor}`}
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors"
          >
            Coba Lagi
          </a>
        </div>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Beranda",
            "item": "https://almoslem.haniipp.space"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": `Surah ${surah.namaLatin}`,
            "item": `https://almoslem.haniipp.space/surah/${surah.nomor}`
          }
        ]
      },
      {
        "@type": "Chapter",
        "name": `Surah ${surah.namaLatin}`,
        "headline": `Surah ${surah.namaLatin} (${surah.arti})`,
        "alternativeHeadline": surah.nama,
        "position": surah.nomor,
        "description": `Baca Surah ${surah.namaLatin} (${surah.arti}) lengkap dengan terjemahan Bahasa Indonesia, tafsir, dan audio murottal. Diturunkan di ${surah.tempatTurun} dengan jumlah ${surah.jumlahAyat} ayat.`,
        "inLanguage": "id",
        "isPartOf": {
          "@type": "Book",
          "name": "Al-Quran",
          "inLanguage": "ar",
          "author": {
            "@type": "Person",
            "name": "Allah SWT"
          }
        },
        "publisher": {
           "@type": "Organization",
           "name": "Al-Moslem",
           "url": "https://almoslem.haniipp.space"
        }
      }
    ]
  };

  return (
    <main className="min-h-screen dark:bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SurahBackground />
      <ReadingSettingsSidebar />
      <Header />
      <SurahDetailHeader surah={surah} />
      <AyatList 
        ayat={surah.ayat || []} 
        tafsirList={tafsir?.tafsir || []} 
        surahName={surah.namaLatin}
        surahNumber={surah.nomor}
      />
    </main>
  );
}
