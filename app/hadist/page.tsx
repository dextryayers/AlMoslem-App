import Header from '../components/Header';
import HadithContent from '../components/HadithContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kumpulan Hadits Pilihan - QQuran',
  description: 'Kumpulan hadits shahih dari Arbain Nawawi, Hadits Qudsi, dan Al-Adab Al-Mufrad lengkap dengan terjemahan Bahasa Indonesia.',
  keywords: ['Hadits', 'Hadits Arbain', 'Hadits Qudsi', 'Hadits Shahih', 'Al-Adab Al-Mufrad', 'Belajar Hadits'],
  openGraph: {
    title: 'Kumpulan Hadits Pilihan - QQuran',
    description: 'Kumpulan hadits shahih dari Arbain Nawawi, Hadits Qudsi, dan Al-Adab Al-Mufrad lengkap dengan terjemahan.',
    url: 'https://qquran.vercel.app/hadist',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kumpulan Hadits Pilihan - QQuran',
    description: 'Kumpulan hadits shahih dari Arbain Nawawi, Hadits Qudsi, dan Al-Adab Al-Mufrad lengkap dengan terjemahan.',
  }
};

export default function HadithLandingPage() {
  return (
    <>
      <Header />
      <HadithContent />
    </>
  );
}
