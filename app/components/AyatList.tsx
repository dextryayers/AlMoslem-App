'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Ayat, Tafsir } from '../types';
import AyatCard from './AyatCard';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';
import { useBookmark } from '../context/BookmarkContext';

gsap.registerPlugin(ScrollTrigger);

interface AyatListProps {
  ayat: Ayat[];
  tafsirList: Tafsir[];
  surahName: string;
  surahNumber: number;
}

const EDITION_MAP: Record<string, string> = {
  en: 'en.sahih',
  es: 'es.cortes',
  ru: 'ru.kuliev',
  ja: 'ja.japanese',
  de: 'de.aburida'
};

const TAFSIR_MAP: Record<string, string> = {
  en: 'en.hilali',
  es: 'es.bornez',
  ru: 'ru.kuliev-alsaadi',
  ja: 'ja.japanese',
  de: 'de.bubenheim'
};

const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export default function AyatList({ ayat, tafsirList, surahNumber, surahName }: AyatListProps) {
  const settings = useSettings();
  const { 
    language, 
    t, 
    tajweedMode, 
    autoScroll, 
    autoScrollSpeed,
    autoTrackAudio,
    fontSize,
    translationFontSize,
    arabicFont,
    scriptType,
    showLatin,
    showTranslation,
    showTafsir,
    backgroundImage,
    ayatNumberStyle
  } = settings;

  const { setPlaylist, selectedQari, isPlaying, playAudio, pauseAudio, currentAudioSrc } = useAudio();
  const { setLastRead } = useBookmark();
  const [translations, setTranslations] = useState<Record<number, string>>({});
  const [dynamicTafsir, setDynamicTafsir] = useState<Record<number, string>>({});
  const [tajweedData, setTajweedData] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<number | null>(null);

  // Memoize settings object passed to children to prevent unnecessary re-renders
  const childSettings = useMemo(() => ({
    fontSize,
    translationFontSize,
    arabicFont,
    scriptType,
    showLatin,
    showTranslation,
    showTafsir,
    autoScroll,
    autoTrackAudio,
    t,
    language,
    tajweedMode,
    backgroundImage,
    ayatNumberStyle
  }), [
    fontSize,
    translationFontSize,
    arabicFont,
    scriptType,
    showLatin,
    showTranslation,
    showTafsir,
    autoScroll,
    autoTrackAudio,
    t,
    language,
    tajweedMode,
    backgroundImage,
    ayatNumberStyle
  ]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 20, ayat.length));
        }
      },
      { rootMargin: '1000px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [ayat.length]);

  // Reset visible count when surah changes
  useEffect(() => {
    setVisibleCount(20);
  }, [surahNumber]);

  // Auto Scroll Logic
  useEffect(() => {
    if (!autoScroll) {
      if (scrollRef.current) {
        cancelAnimationFrame(scrollRef.current);
        scrollRef.current = null;
      }
      return;
    }

    const scroll = () => {
      window.scrollBy(0, autoScrollSpeed * 0.5);
      scrollRef.current = requestAnimationFrame(scroll);
    };

    scrollRef.current = requestAnimationFrame(scroll);

    return () => {
      if (scrollRef.current) {
        cancelAnimationFrame(scrollRef.current);
      }
    };
  }, [autoScroll, autoScrollSpeed]);

  // Auto-save last read on scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ayatNum = parseInt(entry.target.id.replace('ayat-', ''));
          if (!isNaN(ayatNum)) {
            const currentAyat = ayat.find(a => a.nomorAyat === ayatNum);
            if (currentAyat) {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => {
                setLastRead(surahNumber, surahName, currentAyat);
              }, 1000);
            }
          }
        }
      });
    }, {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    });

    const elements = document.querySelectorAll('[id^="ayat-"]');
    elements.forEach(el => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ayat, surahNumber, surahName, setLastRead, visibleCount]);

  // Playlist generation
  useEffect(() => {
    const QARI_PATHS: Record<string, string> = {
      '01': 'Abdullah-Al-Juhany',
      '02': 'Abdul-Muhsin-Al-Qasim',
      '03': 'Abdurrahman-as-Sudais',
      '04': 'Ibrahim-Al-Dossari',
      '05': 'Misyari-Rasyid-Al-Afasi',
      '06': 'Yasser-Al-Dosari',
    };
    const qariPath = QARI_PATHS[selectedQari] || 'Misyari-Rasyid-Al-Afasi';
    const pad3 = (num: number) => num.toString().padStart(3, '0');

    const playlist = ayat.map(item => {
      return `https://cdn.equran.id/audio-partial/${qariPath}/${pad3(surahNumber)}${pad3(item.nomorAyat)}.mp3`;
    });
    setPlaylist(playlist);
  }, [ayat, selectedQari, setPlaylist, surahNumber]);

  // Fetch Tajweed Data
  useEffect(() => {
    if (!tajweedMode) {
      setTajweedData({});
      return;
    }

    const fetchTajweed = async () => {
      try {
        const data = await fetchWithRetry(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-tajweed`);
        if (data.code === 200 && data.data && data.data.ayahs) {
          const map: Record<number, string> = {};
          data.data.ayahs.forEach((ayah: any) => {
            map[ayah.numberInSurah] = ayah.text;
          });
          setTajweedData(map);
        }
      } catch (error) {
        console.warn('Warning: Failed to fetch tajweed data after retries', error);
      }
    };

    fetchTajweed();
  }, [tajweedMode, surahNumber]);

  // Fetch Translations
  useEffect(() => {
    if (language === 'id' || !EDITION_MAP[language]) {
      setTranslations({});
      setDynamicTafsir({});
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setTranslations({});
      setDynamicTafsir({});
      
      try {
        const transEdition = EDITION_MAP[language];
        const tafsirEdition = TAFSIR_MAP[language];
        
        if (!transEdition) {
          setIsLoading(false);
          return;
        }

        try {
          const transData = await fetchWithRetry(`/api/translation?surah=${surahNumber}&edition=${transEdition}`);
          if (transData.code === 200 && transData.data && transData.data.ayahs) {
            const transMap: Record<number, string> = {};
            transData.data.ayahs.forEach((ayah: any) => {
              transMap[ayah.numberInSurah] = ayah.text;
            });
            setTranslations(transMap);
          }
        } catch (error) {
          console.warn('Warning: Failed to fetch translation after retries', error);
        }

        if (tafsirEdition) {
          try {
            const tafsirData = await fetchWithRetry(`/api/translation?surah=${surahNumber}&edition=${tafsirEdition}`);
            if (tafsirData.code === 200 && tafsirData.data && tafsirData.data.ayahs) {
              const tafsirMap: Record<number, string> = {};
              tafsirData.data.ayahs.forEach((ayah: any) => {
                tafsirMap[ayah.numberInSurah] = ayah.text;
              });
              setDynamicTafsir(tafsirMap);
            }
          } catch (error) {
            console.warn('Warning: Failed to fetch tafsir after retries', error);
          }
        }
      } catch (error) {
        console.warn('Warning: Error in fetchData execution', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [language, surahNumber]);

  // Memoize qari path logic to avoid recalculation
  const getAudioSrc = useCallback((ayatNum: number) => {
      const QARI_PATHS: Record<string, string> = {
        '01': 'Abdullah-Al-Juhany',
        '02': 'Abdul-Muhsin-Al-Qasim',
        '03': 'Abdurrahman-as-Sudais',
        '04': 'Ibrahim-Al-Dossari',
        '05': 'Misyari-Rasyid-Al-Afasi',
        '06': 'Yasser-Al-Dosari',
      };
      const qariPath = QARI_PATHS[selectedQari] || 'Misyari-Rasyid-Al-Afasi';
      const pad3 = (num: number) => num.toString().padStart(3, '0');
      return `https://cdn.equran.id/audio-partial/${qariPath}/${pad3(surahNumber)}${pad3(ayatNum)}.mp3`;
  }, [selectedQari, surahNumber]);

  return (
    <div className="max-w-4xl mx-auto pb-24 px-6">
      <div className="space-y-6">
        {ayat.slice(0, visibleCount).map((item, index) => {
          const defaultTafsir = tafsirList.find(t => t.ayat === item.nomorAyat);
          const currentTafsir = language === 'id' 
            ? defaultTafsir 
            : (dynamicTafsir[item.nomorAyat] ? { ayat: item.nomorAyat, teks: dynamicTafsir[item.nomorAyat] } : undefined);
          
          const audioSrc = getAudioSrc(item.nomorAyat);
          const isCurrentPlaying = isPlaying && currentAudioSrc === audioSrc;

          return (
            <div id={`ayat-${item.nomorAyat}`} key={item.nomorAyat}>
              <AyatCard 
                ayat={item} 
                index={index} 
                tafsir={currentTafsir}
                translation={isLoading ? t('loading') : translations[item.nomorAyat]}
                surahName={surahName}
                surahNumber={surahNumber}
                tajweedText={tajweedData[item.nomorAyat]}
                settings={childSettings}
                isPlaying={isPlaying}
                isCurrentPlaying={isCurrentPlaying}
                playAudio={playAudio}
                pauseAudio={pauseAudio}
                audioSrc={audioSrc}
              />
            </div>
          );
        })}
      </div>
      
      {/* Load More Trigger */}
      {visibleCount < ayat.length && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}