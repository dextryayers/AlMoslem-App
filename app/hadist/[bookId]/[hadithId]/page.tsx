import { getHadith } from '../../utils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import HadithDetail from '../../../components/HadithDetail';

export async function generateMetadata({ params }: { params: Promise<{ bookId: string; hadithId: string }> }): Promise<Metadata> {
  const { bookId, hadithId } = await params;
  const hadith = await getHadith(bookId, hadithId);

  if (!hadith) {
    return {
      title: 'Hadits Tidak Ditemukan',
    };
  }

  // Generate description (first 150 chars of translation)
  const description = hadith.terjemah 
    ? hadith.terjemah.substring(0, 150) + '...'
    : `Baca Hadits No. ${hadithId} dari kitab ${hadith.bookTitle}`;

  return {
    title: `${hadith.judul} - QQuran`,
    description: description,
    openGraph: {
      title: `${hadith.judul} - QQuran`,
      description: description,
      url: `https://qquran.vercel.app/hadist/${bookId}/${hadithId}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${hadith.judul} - QQuran`,
      description: description,
    }
  };
}

export default async function HadithDetailPage({ params }: { params: Promise<{ bookId: string; hadithId: string }> }) {
  const { bookId, hadithId } = await params;
  const hadith = await getHadith(bookId, hadithId);

  if (!hadith) {
    notFound();
  }

  return <HadithDetail bookId={bookId} hadith={hadith} />;
}
