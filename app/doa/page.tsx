import { Metadata } from 'next';
import DoaClientPage from './DoaClientPage';

export const metadata: Metadata = {
  title: 'Kumpulan Doa Harian Lengkap - QQuran',
  description: 'Kumpulan doa harian mustajab dan dzikir lengkap dengan tulisan Arab, Latin, dan terjemahan Bahasa Indonesia. Temukan doa sehari-hari untuk berbagai situasi.',
  keywords: ['Doa Harian', 'Kumpulan Doa', 'Doa Mustajab', 'Dzikir Pagi Petang', 'Doa Islam', 'Doa Sehari-hari'],
  openGraph: {
    title: 'Kumpulan Doa Harian Lengkap - QQuran',
    description: 'Kumpulan doa harian mustajab dan dzikir lengkap dengan tulisan Arab, Latin, dan terjemahan.',
    url: 'https://qquran.vercel.app/doa',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kumpulan Doa Harian Lengkap - QQuran',
    description: 'Kumpulan doa harian mustajab dan dzikir lengkap dengan tulisan Arab, Latin, dan terjemahan.',
  }
};

async function getDoas() {
  try {
    const res = await fetch('https://equran.id/api/doa', { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const response = await res.json();
    // API returns { status: 'success', total: number, data: [...] }
    // Map the API response to match our interface
    return response.data.map((item: any) => ({
      id: item.id,
      nama: item.nama,
      lafal: item.ar,
      transliterasi: item.tr,
      arti: item.idn,
      riwayat: item.tentang,
      keterangan: item.grup,
      tag: item.tag
    }));
  } catch (error) {
    console.error('Error fetching doas:', error);
    return [];
  }
}

export default async function DoaPage() {
  const doas = await getDoas();
  return <DoaClientPage initialDoas={doas} />;
}
