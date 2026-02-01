import { getHadithBook } from '../utils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import HadithBookList from '../../components/HadithBookList';

export async function generateMetadata({ params }: { params: Promise<{ bookId: string }> }): Promise<Metadata> {
  const { bookId } = await params;
  const data = await getHadithBook(bookId);

  if (!data) {
    return {
      title: 'Kitab Hadits Tidak Ditemukan',
    };
  }

  const title = data.metadata?.english?.title || data.metadata?.arabic?.title || 'Hadith Book';
  const author = data.metadata?.english?.author || data.metadata?.arabic?.author || '';

  return {
    title: `Kitab ${title} - Kumpulan Hadits Lengkap`,
    description: `Baca kumpulan hadits lengkap dari kitab ${title} karya ${author}. Tersedia dalam bahasa Arab dan terjemahan Indonesia.`,
    keywords: [title, 'Hadits', 'Kitab Hadits', author, 'Baca Hadits Online'],
    openGraph: {
      title: `Kitab ${title} - QQuran`,
      description: `Baca kumpulan hadits lengkap dari kitab ${title} karya ${author}.`,
      url: `https://qquran.vercel.app/hadist/${bookId}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `Kitab ${title} - QQuran`,
      description: `Baca kumpulan hadits lengkap dari kitab ${title} karya ${author}.`,
    }
  };
}

export default async function HadithBookPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const data = await getHadithBook(bookId);

  if (!data) {
    notFound();
  }

  return <HadithBookList bookId={bookId} data={data} />;
}
