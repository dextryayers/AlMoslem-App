'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAudio, QARI_LIST } from '../context/AudioContext';
import { 
  Settings, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Volume1,
  VolumeX,
  Type,
  BookOpen,
  Eye,
  EyeOff,
  Scroll,
  Palette,
  FileText
} from 'lucide-react';
import gsap from 'gsap';

export default function ReadingSettingsSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    backgroundImage,
    setBackgroundImage,
    autoScroll,
    setAutoScroll,
    autoScrollSpeed,
    setAutoScrollSpeed,
    autoTrackAudio,
    setAutoTrackAudio,
    tajweedMode,
    setTajweedMode,
    showTafsir,
    setShowTafsir,
    showTranslation,
    setShowTranslation,
    scriptType,
    setScriptType,
    ayatNumberStyle,
    setAyatNumberStyle,
    fontSize,
    setFontSize,
    arabicFont,
    setArabicFont,
    language,
    setLanguage,
    t
  } = useSettings();

  const {
    selectedQari,
    setQari,
    volume,
    setVolume
  } = useAudio();

  // Animation for sidebar
  useEffect(() => {
    const sidebar = sidebarRef.current;
    
    if (isOpen) {
      gsap.to(sidebar, {
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
        display: 'block'
      });
    } else {
      gsap.to(sidebar, {
        x: '100%',
        duration: 0.5,
        ease: 'power3.in',
        display: 'none' // Hide after animation
      });
    }
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const backgrounds = [
    { id: 'none', name: t('bgNone'), value: 'none' },
    { id: 'paper', name: t('bgPaper'), value: 'url("/assets/paper-bg.jpg")' },
    { id: 'dark-wood', name: t('bgDarkWood'), value: 'url("/assets/dark-wood.jpg")' },
    { id: 'islamic', name: t('bgIslamic'), value: 'url("/assets/islamic-pattern.png")' },
  ];

  const fonts = [
    { id: 'lpmq', name: t('fontLpmq'), font: 'LPMQ Isep Misbah' },
    { id: 'indopak', name: t('fontIndoPak'), font: 'Scheherazade New' },
    { id: 'utsmani', name: t('fontUtsmani'), font: 'Amiri' },
  ];

  const ayatStyles = [
    { id: 'simple-circle', name: t('ayatStyleSimpleCircle') },
    { id: 'rub-el-hizb', name: t('ayatStyleRubElHizb') },
    { id: 'flower', name: t('ayatStyleFlower') },
    { id: 'hexagon', name: t('ayatStyleHexagon') },
    { id: 'octagon', name: t('ayatStyleOctagon') },
    { id: 'diamond', name: t('ayatStyleDiamond') },
  ];

  const languages = [
    { id: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'ru', name: 'Русский', flag: '🇷🇺' },
    { id: 'ja', name: '日本語', flag: '🇯🇵' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        ref={triggerRef}
        onClick={toggleSidebar}
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-50 
          bg-emerald-600 hover:bg-emerald-700 text-white p-3 
          rounded-l-xl shadow-lg transition-all duration-300
          ${isOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        `}
        aria-label="Open Settings"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Sidebar Overlay (optional, for clicking outside) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl z-50 transform translate-x-full overflow-y-auto border-l border-gray-200 dark:border-gray-800"
        style={{ display: 'none' }} // Initially hidden
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-inherit z-10">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Settings size={20} />
            {t('settings')}
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-8 pb-24">
          

          <section className="space-y-4">

            {/* Language Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('language')}</label>
              <div className="grid grid-cols-2 gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id as any)}
                    className={`p-2 text-xs rounded-lg border transition-all flex items-center gap-2
                      ${language === lang.id 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout / Font Style */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('fontTypeRasm')}</label>
              <div className="grid grid-cols-3 gap-2">
                {fonts.map(font => (
                  <button
                    key={font.id}
                    onClick={() => {
                      setScriptType(font.id as any);
                      if (font.font) setArabicFont(font.font);
                    }}
                    className={`p-2 text-xs rounded-lg border transition-all
                      ${scriptType === font.id 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Ayat Number Style */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('ayatNumberStyle')}</label>
              <div className="grid grid-cols-2 gap-2">
                {ayatStyles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setAyatNumberStyle(style.id as any)}
                    className={`p-2 text-xs rounded-lg border transition-all flex items-center gap-2 justify-center
                      ${ayatNumberStyle === style.id 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {/* Preview Icon */}
                    <span className="w-4 h-4 flex items-center justify-center">
                      {style.id === 'simple-circle' && <div className="w-3 h-3 rounded-full border border-current" />}
                      {style.id === 'rub-el-hizb' && <div className="w-3 h-3 bg-current transform rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />} 
                      {/* Simple placeholders for now */}
                      {style.id !== 'simple-circle' && style.id !== 'rub-el-hizb' && <div className="w-3 h-3 border border-current transform rotate-45" />}
                    </span>
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
             <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('fontSize')}</label>
                <span className="text-xs text-gray-500">{fontSize}px</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="60" 
                value={fontSize} 
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </section>

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* 2. Bacaan (Tajwid, Tafsir, Terjemahan) */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} /> {t('content')}
            </h3>

            <div className="space-y-3">
              {/* Tajwid Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('coloredTajweed')}</span>
                <button 
                  onClick={() => setTajweedMode(!tajweedMode)}
                  className={`w-11 h-6 flex items-center rounded-full transition-colors ${tajweedMode ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${tajweedMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Terjemahan Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('translation')}</span>
                <button 
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`w-11 h-6 flex items-center rounded-full transition-colors ${showTranslation ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${showTranslation ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Tafsir Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('tafsir')}</span>
                <button 
                  onClick={() => setShowTafsir(!showTafsir)}
                  className={`w-11 h-6 flex items-center rounded-full transition-colors ${showTafsir ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${showTafsir ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </section>

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* 3. Audio & Auto Scroll */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Volume2 size={16} /> {t('audioAndScroll')}
            </h3>

            {/* Qari Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('qari')}</label>
              <select 
                value={selectedQari}
                onChange={(e) => setQari(e.target.value as any)}
                className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500"
              >
                {QARI_LIST.map(q => (
                  <option key={q.id} value={q.id}>{q.name}</option>
                ))}
              </select>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />} {t('volume')}
                </label>
                <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Auto Scroll */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Scroll size={14} /> {t('autoScroll')}
                </span>
                <button 
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${autoScroll ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
                >
                  {autoScroll ? t('on') : t('off')}
                </button>
              </div>
              
              <div className={`space-y-2 transition-opacity duration-300 ${autoScroll ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">{t('speed')}</span>
                  <span className="text-xs text-gray-500">{autoScrollSpeed}x</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1"
                  value={autoScrollSpeed} 
                  onChange={(e) => setAutoScrollSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Auto Track Audio Setting */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/50 mt-2">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">{t('autoTrackAudio')}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 block">{t('autoTrackAudioDesc')}</span>
                </div>
                <button
                  onClick={() => setAutoTrackAudio(!autoTrackAudio)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    autoTrackAudio ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    autoTrackAudio ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}