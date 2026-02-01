'use client';

import Image from 'next/image';
import Header from '../components/Header';
import { useSettings } from '../context/SettingsContext';
import { Github, Globe, Heart, Code, Coffee, Sparkles, Quote, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  const { t } = useSettings();

  const techStack = [
    { name: 'Next.js 16', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'React 19', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'Gemini AI', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1c23] pb-20 font-sans">
      <Header />
      
      {/* Hero Section with Gradient */}
      <div className="relative pt-32 pb-32 bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-900 dark:to-teal-900 overflow-hidden rounded-b-[3rem] shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
            {t('specialEdition') || 'Edisi Spesial'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            {t('photoCaption')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-20 relative z-20">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#222831] rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 text-center sticky top-24">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Image 
                  src="/image/head.webp" 
                  alt={t('hanif')}
                  fill
                  className="object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-md relative z-10"
                  priority
                />
                <div className="absolute bottom-2 right-2 z-20 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white dark:border-gray-800">
                  <Code className="w-4 h-4" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {t('hanif')}
              </h2>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-6">
                Fullstack Developer
              </p>

              <div className="flex justify-center gap-3 mb-8">
                <a href="https://github.com/dextryayers" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://haniipp.space" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="/donation" className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-300">
                  <Heart className="w-5 h-5" />
                </a>
              </div>

              <div className="text-left space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Lokasi</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{t('devLocation')}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Open to Work
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Story Card */}
            <div className="bg-white dark:bg-[#222831] rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Coffee className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('human')}
                </h3>
              </div>
              
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="mb-4 text-lg">
                  {t('aboutText1')}
                </p>
                <p className="mb-4">
                  {t('aboutText2')}
                </p>
                <p>
                  {t('aboutText3')}
                </p>
              </div>

              <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 relative overflow-hidden">
                <Quote className="absolute top-4 right-4 w-12 h-12 text-emerald-200 dark:text-emerald-800/50 -rotate-12" />
                <p className="text-emerald-800 dark:text-emerald-200 font-medium italic relative z-10 text-center text-lg">
                  {t('quote')}
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white dark:bg-[#222831] rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('futureVision')}
                </h3>
              </div>
              
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="mb-4">
                  {t('aboutText4')}
                </p>
                <p>
                  {t('aboutText5')}
                </p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-white dark:bg-[#222831] rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tech Stack
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {techStack.map((tech) => (
                  <div key={tech.name} className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 group cursor-default border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                    <div className="w-10 h-10 relative mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                      <Image 
                        src={tech.icon} 
                        alt={tech.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
