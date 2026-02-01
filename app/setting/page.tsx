'use client';

import { useSettings } from '../context/SettingsContext';
import { useAudio, QARI_LIST } from '../context/AudioContext';
import { getFontFamily } from '../lib/fonts';
import { Settings, Type, Globe, Moon, Sun, Mic2, Smartphone, Monitor, Volume2, BookOpen, Layers, RefreshCw, Palette, Sparkles, AlertCircle, Check, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import Header from '../components/Header';
import { useTheme } from 'next-themes';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ARABIC_FONTS = [
  { name: 'Amiri', value: 'Amiri', label: 'Amiri (Naskh)' },
  { name: 'LPMQ Isep Misbah', value: 'LPMQ Isep Misbah', label: 'LPMQ Isep Misbah (Kemenag)' },
  { name: 'Scheherazade New', value: 'Scheherazade New', label: 'Scheherazade' },
  { name: 'Noto Naskh Arabic', value: 'Noto Naskh Arabic', label: 'Noto Naskh' },
  { name: 'Lateef', value: 'Lateef', label: 'Lateef' },
  { name: 'IBM Plex Sans Arabic', value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans' },
  { name: 'Cairo', value: 'Cairo', label: 'Cairo (Modern)' },
  { name: 'Aref Ruqaa', value: 'Aref Ruqaa', label: 'Aref Ruqaa (Calligraphy)' },
  { name: 'Tajawal', value: 'Tajawal', label: 'Tajawal' },
  { name: 'Reem Kufi', value: 'Reem Kufi', label: 'Reem Kufi' },
  { name: 'El Messiri', value: 'El Messiri', label: 'El Messiri' },
];

const LANGUAGES = [
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const BACKGROUND_THEMES = [
  { id: 'none', name: 'None', url: null },
  // Nature scenery options
  { id: 'mountains', name: 'Mountains', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop' },
  { id: 'forest', name: 'Forest', url: 'https://images.unsplash.com/photo-1500839941678-aae14dbfae9a?q=80&w=2000&auto=format&fit=crop' },
  { id: 'beach', name: 'Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop' },
  { id: 'waterfall', name: 'Waterfall', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2000&auto=format&fit=crop' },
  { id: 'lake', name: 'Lake', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop' },
  { id: 'river', name: 'River', url: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=2000&auto=format&fit=crop' },
  { id: 'sunrise', name: 'Sunrise', url: 'https://images.unsplash.com/photo-1446034295857-c39f8844fad4?q=80&w=2000&auto=format&fit=crop' },
  { id: 'sunset', name: 'Sunset', url: 'https://images.unsplash.com/photo-1478478621954-4fef818280c2?q=80&w=2000&auto=format&fit=crop' },
  { id: 'clouds', name: 'Clouds', url: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=2000&auto=format&fit=crop' },
  { id: 'night_sky', name: 'Night Sky', url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2000&auto=format&fit=crop' },
  { id: 'snow', name: 'Snow Landscape', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop' },
  { id: 'canyon', name: 'Canyon', url: 'https://images.unsplash.com/photo-1516306580123-bd6c5a42d9b2?q=80&w=2000&auto=format&fit=crop' },
  { id: 'tropical', name: 'Tropical Island', url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=2000&auto=format&fit=crop' },
  { id: 'rice_terrace', name: 'Rice Terrace', url: 'https://images.unsplash.com/photo-1558980664-10b69b8b8c5d?q=80&w=2000&auto=format&fit=crop' },
  // Existing non-nature options
  { id: 'mosque', name: 'Mosque', url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop' },
  { id: 'stars', name: 'Stars', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop' },
  { id: 'gradient', name: 'Abstract', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop' },
  { id: 'desert', name: 'Desert', url: 'https://images.unsplash.com/photo-1547234935-80c7142ee969?q=80&w=2000&auto=format&fit=crop' },
  { id: 'floral', name: 'Floral', url: 'https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=2000&auto=format&fit=crop' },
];

export default function SettingPage() {
  const {
    fontSize,
    setFontSize,
    translationFontSize,
    setTranslationFontSize,
    arabicFont,
    setArabicFont,
    scriptType,
    setScriptType,
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
    language,
    setLanguage,
    backgroundImage,
    setBackgroundImage,
    backgroundOpacity,
    setBackgroundOpacity,
    t,
    resetSettings
  } = useSettings();

  const { selectedQari, setQari, playbackSpeed, setPlaybackSpeed } = useAudio();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".settings-header", {
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    })
    .from(".settings-card", {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.3")
    .from(".preview-card", {
      x: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.5");
  }, { scope: containerRef });

  if (!mounted) return null;

  const handleReset = () => {
    if (confirm(t('resetSettingsConfirm'))) {
      resetSettings();
      // Optional: Add toast notification here
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-[#222831] transition-colors duration-300 font-sans">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="settings-header flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                <Settings className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('settingsTitle')}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{t('settingsDesc')}</p>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleReset}
              className="w-full md:w-auto gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t('resetSettings') || 'Reset Settings'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Settings Controls */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* General Settings */}
              <Card className="settings-card border-none shadow-sm bg-white dark:bg-[#2a303c]/50 backdrop-blur-sm dark:border dark:border-white/5 overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-emerald-500" />
                    <CardTitle>{t('general')}</CardTitle>
                  </div>
                  <CardDescription>Bahasa dan tampilan aplikasi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('uiLanguage')}</label>
                        <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                          <SelectTrigger className="w-full h-11 bg-gray-50 dark:bg-[#222831] border-gray-200 dark:border-white/10">
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                <span className="flex items-center gap-2">
                                  <span className="text-lg">{lang.flag}</span>
                                  {lang.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                     </div>

                     <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('theme')}</label>
                        <div className="flex items-center p-1 bg-gray-100 dark:bg-[#222831] rounded-lg border border-gray-200 dark:border-white/10">
                          <button
                            onClick={() => setTheme('light')}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all",
                              theme === 'light' 
                                ? "bg-white text-gray-900 shadow-sm" 
                                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            )}
                          >
                            <Sun className="w-4 h-4" />
                            {t('light')}
                          </button>
                          <button
                            onClick={() => setTheme('dark')}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all",
                              theme === 'dark' 
                                ? "bg-gray-700 text-white shadow-sm" 
                                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            )}
                          >
                            <Moon className="w-4 h-4" />
                            {t('dark')}
                          </button>
                        </div>
                     </div>

                     <Separator className="col-span-1 md:col-span-2 my-2" />

                     <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('background')}</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('backgroundDesc')}</p>
                          </div>
                          {backgroundImage && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setBackgroundImage(null)}
                              className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              {t('noBackground')}
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {BACKGROUND_THEMES.map((bg) => (
                            <button
                              key={bg.id}
                              onClick={() => setBackgroundImage(bg.url)}
                              className={cn(
                                "relative aspect-video rounded-lg overflow-hidden border-2 transition-all group",
                                backgroundImage === bg.url 
                                  ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                                  : "border-transparent hover:border-gray-200 dark:hover:border-white/10"
                              )}
                            >
                              {bg.url ? (
                <img 
                                  src={bg.url} 
                                  alt={bg.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 dark:bg-[#222831] flex items-center justify-center text-gray-400 dark:text-gray-600">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                              )}
                              
                              <div className={cn(
                                "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity",
                                backgroundImage === bg.url ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              )}>
                                {backgroundImage === bg.url && (
                                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                {backgroundImage !== bg.url && (
                                  <span className="text-white text-xs font-medium px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                                    {bg.name}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>

                        {backgroundImage && (
                          <div className="space-y-3 pt-2 bg-gray-50 dark:bg-[#222831] p-3 rounded-lg border border-gray-100 dark:border-white/5">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('backgroundOpacity')}</label>
                              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{(backgroundOpacity * 100).toFixed(0)}%</span>
                            </div>
                            <Slider
                              defaultValue={[backgroundOpacity]}
                              value={[backgroundOpacity]}
                              max={1}
                              min={0.1}
                              step={0.05}
                              onValueChange={(vals) => setBackgroundOpacity(vals[0])}
                            />
                          </div>
                        )}
                     </div>
                   </div>
                </CardContent>
              </Card>

              {/* Typography Settings */}
              <Card className="settings-card border-none shadow-sm bg-white dark:bg-[#2a303c]/50 backdrop-blur-sm dark:border dark:border-white/5 overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-emerald-500" />
                    <CardTitle>{t('appearance')}</CardTitle>
                  </div>
                  <CardDescription>Ukuran font dan jenis huruf</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Script Type (Rasm) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Mushaf & Rasm</label>
                         <p className="text-xs text-gray-500 dark:text-gray-400">Pilih gaya penulisan dan standar mushaf</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {/* Uthmani Standard */}
                       <button
                         onClick={() => {
                           setScriptType('uthmani');
                           setArabicFont('Amiri');
                         }}
                         className={cn(
                           "relative p-4 rounded-xl border transition-all text-left flex items-center justify-between group overflow-hidden",
                           scriptType === 'uthmani'
                             ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20"
                             : "border-gray-200 dark:border-white/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 bg-gray-50 dark:bg-[#222831]"
                         )}
                       >
                          <span className={cn(
                            "text-sm font-medium z-10",
                            scriptType === 'uthmani' ? "text-emerald-700 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"
                          )}>
                            Standar Utsmani
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 z-10">Madinah Standard</span>
                       </button>

                       {/* Hafs Tradition */}
                       <button
                         onClick={() => {
                           setScriptType('hafs');
                           setArabicFont('Amiri');
                         }}
                         className={cn(
                           "relative p-4 rounded-xl border transition-all text-left flex items-center justify-between group overflow-hidden",
                           scriptType === 'hafs'
                             ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20"
                             : "border-gray-200 dark:border-white/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 bg-gray-50 dark:bg-[#222831]"
                         )}
                       >
                          <span className={cn(
                            "text-sm font-medium z-10",
                            scriptType === 'hafs' ? "text-emerald-700 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"
                          )}>
                            Mushaf Hafs
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 z-10">Tradisi Kufah</span>
                       </button>

                       {/* Indopak / Asia */}
                       <button
                         onClick={() => {
                           setScriptType('indopak');
                           setArabicFont('Scheherazade New');
                         }}
                         className={cn(
                           "relative p-4 rounded-xl border transition-all text-left flex items-center justify-between group overflow-hidden",
                           scriptType === 'indopak'
                             ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20"
                             : "border-gray-200 dark:border-white/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 bg-gray-50 dark:bg-[#222831]"
                         )}
                       >
                          <span className={cn(
                            "text-sm font-medium z-10",
                            scriptType === 'indopak' ? "text-emerald-700 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"
                          )}>
                            Indopak (Asia)
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 z-10">Asian Style</span>
                       </button>

                       {/* Kemenag Indonesia */}
                       <button
                         onClick={() => {
                           setScriptType('kemenag');
                           setArabicFont('LPMQ Isep Misbah');
                         }}
                         className={cn(
                           "relative p-4 rounded-xl border transition-all text-left flex items-center justify-between group overflow-hidden",
                           scriptType === 'kemenag'
                             ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20"
                             : "border-gray-200 dark:border-white/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 bg-gray-50 dark:bg-[#222831]"
                         )}
                       >
                          <span className={cn(
                            "text-sm font-medium z-10",
                            scriptType === 'kemenag' ? "text-emerald-700 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"
                          )}>
                            Standar Indonesia
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 z-10">Kemenag RI</span>
                       </button>

                       {/* Bahriyah / Pojok */}
                       <button
                         onClick={() => {
                           setScriptType('bahriyah');
                           setArabicFont('Lateef');
                         }}
                         className={cn(
                           "relative p-4 rounded-xl border transition-all text-left flex items-center justify-between group overflow-hidden",
                           scriptType === 'bahriyah'
                             ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20"
                             : "border-gray-200 dark:border-white/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 bg-gray-50 dark:bg-[#222831]"
                         )}
                       >
                          <span className={cn(
                            "text-sm font-medium z-10",
                            scriptType === 'bahriyah' ? "text-emerald-700 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"
                          )}>
                            Mushaf Bahriyah
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 z-10">Pojok / Hafalan</span>
                       </button>

                       {/* Braille */}
                       <button
                         onClick={() => {
                           setScriptType('braille');
                           // Keep current font but maybe we will add Braille font later
                         }}
                         className={cn(
                           "relative p-4 rounded-xl border transition-all text-left flex items-center justify-between group overflow-hidden",
                           scriptType === 'braille'
                             ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20"
                             : "border-gray-200 dark:border-white/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 bg-gray-50 dark:bg-[#222831]"
                         )}
                       >
                          <span className={cn(
                            "text-sm font-medium z-10",
                            scriptType === 'braille' ? "text-emerald-700 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"
                          )}>
                            Mushaf Braille
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 z-10">Tunanetra</span>
                       </button>
                    </div>
                  </div>

                  <Separator />

                  {/* Arabic Font Size */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('fontSize')}</label>
                      <span className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                        {fontSize}px
                      </span>
                    </div>
                    <Slider
                      defaultValue={[fontSize]}
                      max={60}
                      min={20}
                      step={1}
                      onValueChange={(vals) => setFontSize(vals[0])}
                      className="py-4"
                    />
                  </div>

                  <Separator />

                  {/* Translation Font Size */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('translationFontSize')}</label>
                      <span className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                        {translationFontSize}px
                      </span>
                    </div>
                    <Slider
                      defaultValue={[translationFontSize]}
                      max={24}
                      min={12}
                      step={1}
                      onValueChange={(vals) => setTranslationFontSize(vals[0])}
                      className="py-4"
                    />
                  </div>

                  <Separator />

                  {/* Font Family */}
                  <div className="space-y-4">
                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('arabicFont')}</label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ARABIC_FONTS.map((font) => (
                          <button
                            key={font.value}
                            onClick={() => setArabicFont(font.value)}
                            className={cn(
                              "relative p-4 rounded-xl border transition-all text-left flex items-center justify-between group overflow-hidden",
                              arabicFont === font.value
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20"
                                : "border-gray-200 dark:border-white/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 bg-gray-50 dark:bg-[#222831]"
                            )}
                          >
                            <span className={cn(
                              "text-sm font-medium z-10",
                              arabicFont === font.value ? "text-emerald-700 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"
                            )}>
                              {font.label}
                            </span>
                            <span className={cn(
                              "text-2xl z-10 transition-colors",
                              arabicFont === font.value ? "text-emerald-800 dark:text-emerald-300" : "text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                            )} style={{ fontFamily: getFontFamily(font.value) }}>
                              بِسْمِ
                            </span>
                            
                            {arabicFont === font.value && (
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 to-transparent dark:from-emerald-500/5 pointer-events-none" />
                            )}
                          </button>
                        ))}
                     </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audio & Display Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="settings-card border-none shadow-sm bg-white dark:bg-[#2a303c]/50 backdrop-blur-sm dark:border dark:border-white/5 h-full overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Mic2 className="w-5 h-5 text-emerald-500" />
                      <CardTitle>{t('audio')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('chooseQari')}</label>
                      <Select value={selectedQari} onValueChange={(val: any) => setQari(val)}>
                        <SelectTrigger className="w-full h-11 bg-gray-50 dark:bg-[#222831] border-gray-200 dark:border-white/10">
                          <SelectValue placeholder="Select Reciter" />
                        </SelectTrigger>
                        <SelectContent>
                           {QARI_LIST.map((qari) => (
                            <SelectItem key={qari.id} value={qari.id}>
                              {t(`qari_${qari.id}` as any) || qari.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('speed')}</label>
                        <span className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                          {playbackSpeed}x
                        </span>
                      </div>
                      <Slider
                        defaultValue={[playbackSpeed]}
                        max={2}
                        min={0.5}
                        step={0.25}
                        onValueChange={(vals) => setPlaybackSpeed(vals[0])}
                        className="py-4"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-900 dark:text-white">{t('autoScroll')}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('autoScrollDesc')}</p>
                      </div>
                      <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="settings-card border-none shadow-sm bg-white dark:bg-[#2a303c]/50 backdrop-blur-sm dark:border dark:border-white/5 h-full overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-emerald-500" />
                      <CardTitle>{t('otherSettings')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-900 dark:text-white">{t('showLatin')}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('showLatinDesc')}</p>
                      </div>
                      <Switch checked={showLatin} onCheckedChange={setShowLatin} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-900 dark:text-white">{t('showTranslation')}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('showTranslationDesc')}</p>
                      </div>
                      <Switch checked={showTranslation} onCheckedChange={setShowTranslation} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-gray-900 dark:text-white">{t('showTafsir')}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('showTafsirDesc')}</p>
                      </div>
                      <Switch checked={showTafsir} onCheckedChange={setShowTafsir} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <div className="flex items-center gap-2">
                           <label className="text-sm font-medium text-gray-900 dark:text-white">{t('tajweedMode') || 'Tajweed Mode'}</label>
                           <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{t('newBadge')}</span>
                         </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('tajweedModeDesc')}</p>
                      </div>
                      <Switch checked={tajweedMode} onCheckedChange={setTajweedMode} />
                    </div>

                  </CardContent>
                </Card>
              </div>

              {/* Tajweed Legend - Only visible when Tajweed Mode is enabled */}
              {tajweedMode && (
                <Card className="settings-card border-none shadow-sm bg-white dark:bg-[#2a303c]/50 backdrop-blur-sm dark:border dark:border-white/5 overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-emerald-500" />
                      <CardTitle>{t('tajweedGuideTitle')}</CardTitle>
                    </div>
                    <CardDescription>{t('tajweedGuideDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#222831] border border-gray-100 dark:border-white/5">
                        <div className="w-4 h-4 mt-1 rounded-full bg-orange-500 shadow-sm ring-2 ring-orange-500/20 shrink-0"></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('tajweed_ghunnah')}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('tajweed_ghunnah_desc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#222831] border border-gray-100 dark:border-white/5">
                        <div className="w-4 h-4 mt-1 rounded-full bg-purple-500 shadow-sm ring-2 ring-purple-500/20 shrink-0"></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('tajweed_idghamBighunnah')}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('tajweed_idghamBighunnah_desc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#222831] border border-gray-100 dark:border-white/5">
                        <div className="w-4 h-4 mt-1 rounded-full bg-gray-400 shadow-sm ring-2 ring-gray-400/20 shrink-0"></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('tajweed_idghamBilagunnah')}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('tajweed_idghamBilagunnah_desc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#222831] border border-gray-100 dark:border-white/5">
                        <div className="w-4 h-4 mt-1 rounded-full bg-lime-500 shadow-sm ring-2 ring-lime-500/20 shrink-0"></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('tajweed_idghamMimi')}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('tajweed_idghamMimi_desc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#222831] border border-gray-100 dark:border-white/5">
                        <div className="w-4 h-4 mt-1 rounded-full bg-blue-500 shadow-sm ring-2 ring-blue-500/20 shrink-0"></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('tajweed_iqlab')}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('tajweed_iqlab_desc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#222831] border border-gray-100 dark:border-white/5">
                        <div className="w-4 h-4 mt-1 rounded-full bg-red-500 shadow-sm ring-2 ring-red-500/20 shrink-0"></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('tajweed_ikhfa')}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('tajweed_ikhfa_desc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#222831] border border-gray-100 dark:border-white/5">
                        <div className="w-4 h-4 mt-1 rounded-full bg-pink-500 shadow-sm ring-2 ring-pink-500/20 shrink-0"></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('tajweed_ikhfaSyafawi')}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('tajweed_ikhfaSyafawi_desc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#222831] border border-gray-100 dark:border-white/5">
                        <div className="w-4 h-4 mt-1 rounded-full bg-green-500 shadow-sm ring-2 ring-green-500/20 shrink-0"></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('tajweed_qalqalah')}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('tajweed_qalqalah_desc')}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <Card className="preview-card border-none shadow-lg bg-white dark:bg-[#2a303c]/50 backdrop-blur-sm dark:border dark:border-white/5 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <CardHeader>
                   <div className="flex items-center gap-2 mb-2">
                     <Sparkles className="w-4 h-4 text-emerald-500" />
                     <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{t('livePreview')}</span>
                   </div>
                   <CardTitle className="text-xl">{t('fontPreview')}</CardTitle>
                   <CardDescription>{t('previewDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#222831] border border-gray-100 dark:border-white/5 space-y-6 text-center">
                      <div 
                        className="text-gray-900 dark:text-white leading-loose transition-all duration-300"
                        style={{ 
                          fontFamily: arabicFont, 
                          fontSize: `${fontSize}px`,
                        }}
                      >
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>

                      {showLatin && (
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium italic text-sm">
                          Bismillaahir Rahmaanir Rahiim
                        </p>
                      )}

                      {showTranslation && (
                        <p 
                          className="text-gray-600 dark:text-gray-400 transition-all duration-300"
                          style={{ fontSize: `${translationFontSize}px` }}
                        >
                          {t('sampleText')}
                        </p>
                      )}
                   </div>

                   <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                      <AlertCircle className="w-3 h-3" />
                      <span>{t('changesSaved')}</span>
                   </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
