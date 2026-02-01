import { SurahTafsir, Surah, Ayat } from '../types';
import surahListFallback from '../data/surah-list.json';

const BASE_URL = 'https://api.alquran.cloud/v1';

// Helper for retry logic
const fetchWithRetry = async (endpoint: string, retries = 3, delay = 1000) => {
  const isServer = typeof window === 'undefined';
  
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  // Only add User-Agent on server-side to avoid "Refused to set unsafe header" warning in browser
  // and to mimic a real browser when running on the server
  if (isServer) {
    headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: headers,
        next: { revalidate: 3600 } // Next.js caching
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      const isLastAttempt = i === retries - 1;
      if (isLastAttempt) throw error;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      console.log(`Retrying ${endpoint}... Attempt ${i + 2}`);
    }
  }
};

export const getSurahList = async (): Promise<Surah[]> => {
  // Since equran.id is unstable, we use the local fallback list which is reliable and faster.
  // This list contains correct Indonesian names and audio links (CDN).
  return surahListFallback as Surah[];
};

export const getSurahDetail = async (nomor: number): Promise<Surah | null> => {
  try {
    // Fetch multiple editions in one go:
    // - quran-uthmani: Standard Arabic text (Uthmani) - Clean text without custom tajweed codes
    // - quran-indopak: Indopak script (Asian style)
    // - id.indonesian: Indonesian translation
    // - en.transliteration: Latin transliteration
    // - ar.alafasy: Audio
    const data = await fetchWithRetry(`/surah/${nomor}/editions/quran-uthmani,quran-indopak,id.indonesian,en.transliteration,ar.alafasy`);
    
    if (data.code === 200 && data.data && data.data.length >= 5) {
      const [uthmani, indopak, indo, latin, audio] = data.data;
      
      // Map to Ayat interface
      const ayat: Ayat[] = uthmani.ayahs.map((a: any, i: number) => {
        let textArab = a.text;
        let textIndopak = indopak.ayahs[i] ? indopak.ayahs[i].text : a.text;

        // Strip Basmalah from first ayat of surah (except Al-Fatihah and At-Taubah)
        if (a.numberInSurah === 1 && uthmani.number !== 1 && uthmani.number !== 9) {
           // Comprehensive Basmalah variations (Uthmani, Indopak, Simple, etc.)
           const basmalahPrefixes = [
             "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", // Uthmani (API Default)
             "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", // Indopak (API returned this)
             "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", // Simple/Indopak
             "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ", // Indopak variant
             "بِسْمِ اللهِ الرَّحْمxnِ الرَّحِيمِ"    // Other variants
           ];
           
           // Strip from textArab
           for (const prefix of basmalahPrefixes) {
             if (textArab.startsWith(prefix)) {
               textArab = textArab.substring(prefix.length).trim();
               break;
             }
           }
           
           // Strip from textIndopak
           for (const prefix of basmalahPrefixes) {
             if (textIndopak.startsWith(prefix)) {
               textIndopak = textIndopak.substring(prefix.length).trim();
               break;
             }
           }
        }

        return {
          nomorAyat: a.numberInSurah,
          globalId: a.number,
          surahNumber: uthmani.number,
          teksArab: textArab,
          teksIndopak: textIndopak,
          teksLatin: latin.ayahs[i] ? latin.ayahs[i].text : '',
          teksIndonesia: indo.ayahs[i] ? indo.ayahs[i].text : '',
          audio: {
            '01': audio.ayahs[i] ? audio.ayahs[i].audio : '' // Map to default '01' key
          }
        };
      });

      // Get metadata from surahListFallback to ensure we have Indonesian names/desc
      const fallbackMeta = (surahListFallback as Surah[]).find(s => s.nomor === nomor);

      return {
        nomor: uthmani.number,
        nama: uthmani.name, // Arabic name
        namaLatin: fallbackMeta?.namaLatin || uthmani.englishName,
        jumlahAyat: uthmani.numberOfAyahs,
        tempatTurun: fallbackMeta?.tempatTurun || uthmani.revelationType,
        arti: fallbackMeta?.arti || uthmani.englishNameTranslation,
        deskripsi: fallbackMeta?.deskripsi || '',
        audioFull: fallbackMeta?.audioFull || {},
        ayat: ayat
      };
    }
    return null;
  } catch (e) {
    console.error(`Error fetching surah ${nomor}:`, e);
    
    // Last resort fallback if API completely fails, try to return just the metadata from list
    const fallbackMeta = (surahListFallback as Surah[]).find(s => s.nomor === nomor);
    if (fallbackMeta) {
      return fallbackMeta;
    }
    return null;
  }
};

export const getSurahTafsir = async (nomor: number): Promise<SurahTafsir | null> => {
  try {
    // Using Tafsir Jalalayn (Indonesian) from alquran.cloud
    const data = await fetchWithRetry(`/surah/${nomor}/id.jalalayn`);
    
    if (data.code === 200 && data.data) {
      const tafsirData = data.data;
      
      // Get metadata from surahListFallback
      const fallbackMeta = (surahListFallback as Surah[]).find(s => s.nomor === nomor);

      return {
        nomor: tafsirData.number,
        nama: tafsirData.name,
        namaLatin: fallbackMeta?.namaLatin || tafsirData.englishName,
        jumlahAyat: tafsirData.numberOfAyahs,
        tempatTurun: fallbackMeta?.tempatTurun || tafsirData.revelationType,
        arti: fallbackMeta?.arti || tafsirData.englishNameTranslation,
        deskripsi: fallbackMeta?.deskripsi || '',
        tafsir: tafsirData.ayahs.map((t: any) => ({
          ayat: t.numberInSurah,
          teks: t.text
        }))
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching tafsir ${nomor}:`, error);
    return null;
  }
};
