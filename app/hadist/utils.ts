
import fs from 'fs';
import path from 'path';
import { INDO_TRANSLATIONS } from './indo-data';
import { WORLD_TRANSLATIONS } from './world-data';

const BOOKS_MAP: Record<string, string> = {
  'nawawi': 'forties/nawawi40.json',
  'qudsi': 'forties/qudsi40.json',
  'aladab': 'other_books/aladab_almufrad.json'
};

export async function getHadithBook(bookId: string) {
  const relativePath = BOOKS_MAP[bookId];
  if (!relativePath) return null;

  const filePath = path.join(process.cwd(), 'app/hadith/hadith-json/db/by_book', relativePath);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Process hadiths to add Indonesian translation and title if available
    data.hadiths = data.hadiths.map((hadith: any) => {
      let terjemah = null;
      let judul = null;
      let riwayat = null;

      // Extract Riwayat from English narrator or text
      if (hadith.english && hadith.english.narrator) {
         riwayat = hadith.english.narrator;
      }
      
      // Try to clean up Riwayat if it's too long or just descriptive
      if (riwayat && riwayat.length > 100) {
         // Maybe take the last part if it contains "related by"
         const relatedBy = riwayat.match(/(related|transmitted|narrated) by .*/i);
         if (relatedBy) {
            riwayat = relatedBy[0];
         }
      }

      // Prepare translations object
      const translations: Record<string, any> = {};

      // Add ID (Indonesia)
      if (INDO_TRANSLATIONS[bookId]?.[hadith.idInBook]) {
         const indo = INDO_TRANSLATIONS[bookId][hadith.idInBook];
         translations.id = indo;
         // Legacy support
         terjemah = indo.terjemah;
         judul = indo.judul;
         riwayat = indo.riwayat; 
      }

      // Add World Translations
      Object.keys(WORLD_TRANSLATIONS).forEach(lang => {
          if (WORLD_TRANSLATIONS[lang]?.[bookId]?.[hadith.idInBook]) {
              translations[lang] = WORLD_TRANSLATIONS[lang][bookId][hadith.idInBook];
          }
      });

      // Fallback title if not found
      if (!judul) {
        // Try to use English title if available, or just Hadith Number
        judul = `Hadits Ke-${hadith.idInBook}`;
      }
      
      // If we still don't have a riwayat, try to extract from Arabic text (last line usually)
      if (!riwayat && hadith.arabic) {
        const arabicLines = hadith.arabic.split('\n');
        const lastLine = arabicLines[arabicLines.length - 1];
        if (lastLine && (lastLine.includes('رواه') || lastLine.includes('أخرجه'))) {
           riwayat = lastLine;
        }
      }

      return {
        ...hadith,
        terjemah: terjemah,
        judul: judul,
        riwayat: riwayat,
        translations: translations
      };
    });

    return data;
  } catch (error) {
    console.error(`Error reading hadith file for ${bookId}:`, error);
    return null;
  }
}

export async function getHadith(bookId: string, hadithId: string) {
  const data = await getHadithBook(bookId);
  if (!data) return null;

  const id = parseInt(hadithId);
  const hadith = data.hadiths.find((h: any) => h.idInBook === id);
  
  if (!hadith) return null;

  // Add next/prev navigation info
  const index = data.hadiths.indexOf(hadith);
  const prev = index > 0 ? data.hadiths[index - 1].idInBook : null;
  const next = index < data.hadiths.length - 1 ? data.hadiths[index + 1].idInBook : null;

  return {
    ...hadith,
    bookTitle: data.metadata?.english?.title || data.metadata?.arabic?.title,
    prev,
    next
  };
}
