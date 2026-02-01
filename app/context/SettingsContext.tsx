'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../lib/i18n';

export type ScriptType = 'uthmani' | 'indopak' | 'kemenag' | 'bahriyah' | 'braille' | 'hafs';

export type AyatNumberStyle = 'simple-circle' | 'rub-el-hizb' | 'flower' | 'hexagon' | 'octagon' | 'diamond';

interface SettingsContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  translationFontSize: number;
  setTranslationFontSize: (size: number) => void;
  arabicFont: string;
  setArabicFont: (font: string) => void;
  scriptType: ScriptType;
  setScriptType: (type: ScriptType) => void;
  ayatNumberStyle: AyatNumberStyle;
  setAyatNumberStyle: (style: AyatNumberStyle) => void;
  showLatin: boolean;
  setShowLatin: (show: boolean) => void;
  showTranslation: boolean;
  setShowTranslation: (show: boolean) => void;
  showTafsir: boolean;
  setShowTafsir: (show: boolean) => void;
  showWatermark: boolean;
  setShowWatermark: (show: boolean) => void;
  tajweedMode: boolean;
  setTajweedMode: (show: boolean) => void;
  autoScroll: boolean;
  setAutoScroll: (scroll: boolean) => void;
  autoScrollSpeed: number;
  setAutoScrollSpeed: (speed: number) => void;
  autoTrackAudio: boolean;
  setAutoTrackAudio: (track: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
  backgroundOpacity: number;
  setBackgroundOpacity: (opacity: number) => void;
  t: (key: keyof typeof TRANSLATIONS.id) => string;
  resetSettings: () => void;
}

const defaultSettings = {
  fontSize: 32, // Default size
  translationFontSize: 16, // Default translation size
  arabicFont: 'Amiri', // Default font - Changed to Amiri for better compatibility
  scriptType: 'uthmani' as ScriptType,
  ayatNumberStyle: 'rub-el-hizb' as AyatNumberStyle,
  showLatin: true,
  showTranslation: true,
  showTafsir: false,
  showWatermark: true,
  tajweedMode: false,
  autoScroll: false, // Default off to prevent unwanted scrolling
  autoScrollSpeed: 1, // Default speed multiplier
  autoTrackAudio: true, // Default on for better UX
  language: 'id' as Language,
  backgroundImage: null as string | null,
  backgroundOpacity: 0.5,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(defaultSettings.fontSize);
  const [translationFontSize, setTranslationFontSize] = useState(defaultSettings.translationFontSize);
  const [arabicFont, setArabicFont] = useState(defaultSettings.arabicFont);
  const [scriptType, setScriptType] = useState<ScriptType>(defaultSettings.scriptType);
  const [ayatNumberStyle, setAyatNumberStyle] = useState<AyatNumberStyle>(defaultSettings.ayatNumberStyle);
  const [showLatin, setShowLatin] = useState(defaultSettings.showLatin);
  const [showTranslation, setShowTranslation] = useState(defaultSettings.showTranslation);
  const [showTafsir, setShowTafsir] = useState(defaultSettings.showTafsir);
  const [showWatermark, setShowWatermark] = useState(defaultSettings.showWatermark);
  const [tajweedMode, setTajweedMode] = useState(defaultSettings.tajweedMode);
  const [autoScroll, setAutoScroll] = useState(defaultSettings.autoScroll);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(defaultSettings.autoScrollSpeed);
  const [autoTrackAudio, setAutoTrackAudio] = useState(defaultSettings.autoTrackAudio);
  const [language, setLanguage] = useState<Language>(defaultSettings.language);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(defaultSettings.backgroundImage);
  const [backgroundOpacity, setBackgroundOpacity] = useState(defaultSettings.backgroundOpacity);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('quran-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setFontSize(parsed.fontSize || defaultSettings.fontSize);
      setTranslationFontSize(parsed.translationFontSize || defaultSettings.translationFontSize);
      setArabicFont(parsed.arabicFont || defaultSettings.arabicFont);
      setScriptType(parsed.scriptType || defaultSettings.scriptType);
      setAyatNumberStyle(parsed.ayatNumberStyle || defaultSettings.ayatNumberStyle);
      setShowLatin(parsed.showLatin ?? defaultSettings.showLatin);
      setShowTranslation(parsed.showTranslation ?? defaultSettings.showTranslation);
      setShowTafsir(parsed.showTafsir ?? defaultSettings.showTafsir);
      setShowWatermark(parsed.showWatermark ?? defaultSettings.showWatermark);
      setTajweedMode(parsed.tajweedMode ?? defaultSettings.tajweedMode);
      setAutoScroll(parsed.autoScroll ?? defaultSettings.autoScroll);
      setAutoScrollSpeed(parsed.autoScrollSpeed ?? defaultSettings.autoScrollSpeed);
      setAutoTrackAudio(parsed.autoTrackAudio ?? defaultSettings.autoTrackAudio);
      const validLangs: Language[] = ['id', 'en', 'es', 'ru', 'ja', 'de'];
      setLanguage(validLangs.includes(parsed.language) ? parsed.language : defaultSettings.language);
      setBackgroundImage(parsed.backgroundImage ?? defaultSettings.backgroundImage);
      setBackgroundOpacity(parsed.backgroundOpacity ?? defaultSettings.backgroundOpacity);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('quran-settings', JSON.stringify({
      fontSize,
      translationFontSize,
      arabicFont,
      scriptType,
      showLatin,
      showTranslation,
      showTafsir,
      showWatermark,
      tajweedMode,
      autoScroll,
      autoScrollSpeed,
      autoTrackAudio,
      language,
      backgroundImage,
      backgroundOpacity,
      ayatNumberStyle: ayatNumberStyle // Save manually
    }));
  }, [
    fontSize,
    translationFontSize,
    arabicFont,
    scriptType,
    ayatNumberStyle,
    showLatin,
    showTranslation,
    showTafsir,
    showWatermark,
    tajweedMode,
    autoScroll,
    autoScrollSpeed,
    autoTrackAudio,
    language,
    backgroundImage,
    backgroundOpacity
  ]);
  const resetSettings = () => {
    setFontSize(defaultSettings.fontSize);
    setTranslationFontSize(defaultSettings.translationFontSize);
    setArabicFont(defaultSettings.arabicFont);
    setScriptType(defaultSettings.scriptType);
    setAyatNumberStyle(defaultSettings.ayatNumberStyle);
    setShowLatin(defaultSettings.showLatin);
    setShowTranslation(defaultSettings.showTranslation);
    setShowTafsir(defaultSettings.showTafsir);
    setShowWatermark(defaultSettings.showWatermark);
    setTajweedMode(defaultSettings.tajweedMode);
    setAutoScroll(defaultSettings.autoScroll);
    setAutoScrollSpeed(defaultSettings.autoScrollSpeed);
    setAutoTrackAudio(defaultSettings.autoTrackAudio);
    setLanguage(defaultSettings.language);
    setBackgroundImage(defaultSettings.backgroundImage);
    setBackgroundOpacity(defaultSettings.backgroundOpacity);
  };

  const t = (key: keyof typeof TRANSLATIONS.id) => {
    const langObj = (TRANSLATIONS as any)[language] || TRANSLATIONS['id'];
    return (langObj && langObj[key]) ?? TRANSLATIONS['id'][key] ?? (key as string);
  };

  const value = React.useMemo(() => ({
    fontSize,
    setFontSize,
    translationFontSize,
    setTranslationFontSize,
    arabicFont,
    setArabicFont,
    scriptType,
    setScriptType,
    ayatNumberStyle,
    setAyatNumberStyle,
    showLatin,
    setShowLatin,
    showTranslation,
    setShowTranslation,
    showTafsir,
    setShowTafsir,
    showWatermark,
    setShowWatermark,
    tajweedMode,
    setTajweedMode,
    autoScroll,
    setAutoScroll,
    autoScrollSpeed,
    setAutoScrollSpeed,
    autoTrackAudio,
    setAutoTrackAudio,
    language,
    setLanguage,
    backgroundImage,
    setBackgroundImage,
    backgroundOpacity,
    setBackgroundOpacity,
    t,
    resetSettings,
  }), [
    fontSize,
    translationFontSize,
    arabicFont,
    scriptType,
    ayatNumberStyle,
    showLatin,
    showTranslation,
    showTafsir,
    showWatermark,
    tajweedMode,
    autoScroll,
    autoScrollSpeed,
    autoTrackAudio,
    language,
    backgroundImage,
    backgroundOpacity,
    ayatNumberStyle
  ]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
