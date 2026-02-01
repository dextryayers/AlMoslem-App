import Header from './components/Header';
import HomeContent from './components/HomeContent';
import { getSurahList } from './lib/api';

export default async function Home() {
  const surahs = await getSurahList();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Apa itu Al-Moslem?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Al-Moslem adalah platform Al-Quran Digital terlengkap yang menyediakan fitur baca Al-Quran online 30 Juz, terjemahan Bahasa Indonesia resmi Kemenag, tafsir lengkap, audio murottal dari berbagai Qari, dan asisten cerdas Islami berbasis AI."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah Al-Moslem gratis digunakan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ya, Al-Moslem 100% gratis dan bebas iklan yang mengganggu. Platform ini didedikasikan untuk memudahkan umat Muslim membaca dan mempelajari Al-Quran di mana saja."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah terjemahan di Al-Moslem akurat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Insya Allah akurat. Al-Moslem menggunakan sumber data terpercaya dari Kemenag (Kementerian Agama Republik Indonesia) untuk teks Al-Quran, terjemahan, dan tafsir."
        }
      },
      {
        "@type": "Question",
        "name": "Fitur apa saja yang tersedia di Al-Moslem?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fitur unggulan meliputi: Baca Quran per ayat/surah/juz, Mode Gelap/Terang, Audio Murottal 30 Juz, Pencarian Ayat, Penanda Terakhir Baca, Salin Ayat, dan Ustaz AI untuk tanya jawab seputar Islam."
        }
      }
    ]
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <HomeContent initialSurahs={surahs} />
    </main>
  );
}
