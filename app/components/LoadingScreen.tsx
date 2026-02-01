'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Loader2, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';

export default function LoadingScreen() {
  const { t } = useSettings();
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeHighlight, setActiveHighlight] = useState(0);

  const highlights = useMemo(
    () => [
      'Murottal 30 Juz',
      'Tafsir & Terjemahan',
      'Hadits Shahih',
      'Ustaz AI Support',
    ],
    []
  );

  useEffect(() => {
    // Fake progress
    const duration = 3000; // 3 seconds total
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setIsComplete(true), 500); // Small delay before unmount
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isComplete) return undefined;
    const interval = setInterval(() => {
      setActiveHighlight((current) => (current + 1) % highlights.length);
    }, 800);
    return () => clearInterval(interval);
  }, [highlights.length, isComplete]);

  if (isComplete) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-[#0f172a] flex flex-col items-center justify-center overflow-hidden transition-colors duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
        
        {/* Starry Background for Dark Mode */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-1000">
            <div className="stars-sm absolute inset-0"></div>
            <div className="stars-md absolute inset-0"></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        {/* Logo Animation */}
        <div className="relative w-48 h-48 mb-10">
            {/* Rotating Rings */}
            <div className="absolute inset-0 border-[6px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin [animation-duration:3s]"></div>
            <div className="absolute inset-3 border-[6px] border-teal-500/20 border-b-teal-500 rounded-full animate-spin [animation-duration:2s] reverse"></div>
            <div className="absolute inset-6 border-[4px] border-amber-500/20 border-l-amber-500 rounded-full animate-spin [animation-duration:4s]"></div>

            {/* Center Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-35 h-35 bg-transparent rounded-2xl flex items-center justify-center transform rotate-3 overflow-hidden">
                    <Image 
                        src="/image/logo.png" 
                        alt="Al-Moslem Logo" 
                        width={98} 
                        height={98}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Decorative Sparkles */}
            <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-amber-400 animate-bounce [animation-duration:2s]" />
            <Sparkles className="absolute bottom-0 -left-6 w-6 h-6 text-emerald-400 animate-bounce [animation-duration:2.5s] delay-100" />
            <Star className="absolute top-1/2 -right-10 w-4 h-4 text-teal-300 animate-pulse delay-75" />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
                Al-Moslem
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium tracking-wide">V 1.2</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                Menyiapkan pengalaman ibadah digital terbaik untuk Anda...
            </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-6 relative">
            <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_100%] animate-shimmer transition-all duration-100 ease-out rounded-full"
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        {/* Dynamic Features Badge */}
        <div className="h-8 relative overflow-hidden w-full flex justify-center">
             {highlights.map((item, index) => (
                <div
                    key={item}
                    className={`absolute transition-all duration-500 transform ${
                        index === activeHighlight 
                            ? 'opacity-100 translate-y-0 scale-100' 
                            : 'opacity-0 translate-y-4 scale-95'
                    }`}
                >
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-sm">
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">{item}</span>
                    </div>
                </div>
             ))}
        </div>
      </div>
      
      {/* Footer Version */}
      <div className="absolute bottom-8 text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono tracking-widest uppercase opacity-60">v1.2.0 • by Hanif Abdurrohim</p>
      </div>
    </div>
  );
}
