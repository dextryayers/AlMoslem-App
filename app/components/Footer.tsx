'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Github, Heart, Globe, Mail, ArrowRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { t } = useSettings();
  const pathname = usePathname();
  const [ipAddress, setIpAddress] = useState<string>('');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(error => console.error('Error fetching IP:', error));
  }, []);

  const popularSurahs = [
    { number: 36, name: 'Yasin' },
    { number: 18, name: 'Al-Kahfi' },
    { number: 67, name: 'Al-Mulk' },
    { number: 56, name: 'Al-Waqi\'ah' },
    { number: 55, name: 'Ar-Rahman' },
  ];

  if (pathname === '/preview-img' || pathname === '/about' || pathname === '/donation' || pathname === '/ust-ai' || pathname === '/bookmark' || pathname === '/doa' || pathname === '/hadist' || pathname === '/register' || pathname === '/login' || pathname === '/profile' || pathname === '/forgot-password' || pathname === '/verify-otp' || pathname?.startsWith('/surah/') || pathname === '/build-poster') {
    return null;
  }

  if (pathname === '/setting') {
    return (
      <footer className="bg-white dark:bg-[#222831] border-t border-gray-100 dark:border-[#a2a8d3]/10 py-8 transition-colors duration-300">
        <div className="container mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-lg font-bold text-gray-900 dark:text-[#e7eaf6]">{t('contactUs')}</h4>
            <div className="flex gap-3">
              <a 
                href="mailto:ytaniipid@gmail.com" 
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#393E46] text-gray-600 dark:text-[#a2a8d3] hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/dextryayers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#393E46] text-gray-600 dark:text-[#a2a8d3] hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/6282332430578" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#393E46] text-gray-600 dark:text-[#a2a8d3] hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a 
                href="https://haniipp.space" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#393E46] text-gray-600 dark:text-[#a2a8d3] hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-[#a2a8d3]/60">
            &copy; {new Date().getFullYear()} Haniipp. All Rights Reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white dark:bg-[#222831] border-t border-gray-100 dark:border-[#a2a8d3]/10 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-[60px] h-[60px] bg-transparent rounded-xl flex items-center justify-center overflow-hidden">
                <Image 
                  src="/image/logo.png" 
                  alt="Al-Moslem Logo" 
                  width={60} 
                  height={60} 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-[#e7eaf6] tracking-tight">Al-Quran</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium tracking-wide">DIGITAL & TRANSLATION</p>
              </div>
            </div>
            <p className="text-gray-500 dark:text-[#a2a8d3]/80 leading-relaxed text-sm">
              {t('footerDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-[#e7eaf6] mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 dark:text-[#a2a8d3] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="-ml-6 group-hover:ml-0 transition-all duration-300">{t('home')}</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-[#a2a8d3] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="-ml-6 group-hover:ml-0 transition-all duration-300">{t('about')}</span>
                </Link>
              </li>
              <li>
                <Link href="/donation" className="text-gray-600 dark:text-[#a2a8d3] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="-ml-6 group-hover:ml-0 transition-all duration-300">{t('donation')}</span>
                </Link>
              </li>
              <li>
                <Link href="/setting" className="text-gray-600 dark:text-[#a2a8d3] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="-ml-6 group-hover:ml-0 transition-all duration-300">{t('settings')}</span>
                </Link>
              </li>
              <li>
                <Link href="/peta-situs" className="text-gray-600 dark:text-[#a2a8d3] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="-ml-6 group-hover:ml-0 transition-all duration-300">Sitemap</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Surahs */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-[#e7eaf6] mb-6">{t('popularSurah')}</h4>
            <ul className="space-y-3">
              {popularSurahs.map((surah) => (
                <li key={surah.number}>
                  <Link href={`/surah/${surah.number}`} className="text-gray-600 dark:text-[#a2a8d3] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-between group">
                    <span>{surah.name}</span>
                    <span className="text-xs bg-gray-100 dark:bg-[#393E46] px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      QS. {surah.number}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-[#e7eaf6] mb-6">{t('contactUs')}</h4>
            <div className="flex gap-3">
              <a 
                href="mailto:ytaniipid@gmail.com" 
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#393E46] text-gray-600 dark:text-[#a2a8d3] hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/dextryayers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#393E46] text-gray-600 dark:text-[#a2a8d3] hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/6282332430578" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#393E46] text-gray-600 dark:text-[#a2a8d3] hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a 
                href="https://haniipp.space" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#393E46] text-gray-600 dark:text-[#a2a8d3] hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-100 dark:border-[#a2a8d3]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-[#a2a8d3]/60">
            &copy; {new Date().getFullYear()} Powered By Hanif Abdurrohim, All Rights Reserved.
          </p>
          
          <div className="flex flex-col items-end gap-1">
            <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-[#a2a8d3]/80">
              {t('madeWith')} <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> {t('forUmmah')}
            </p>
            {ipAddress && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-[#393E46]/50 text-xs text-gray-500 dark:text-[#a2a8d3]/60">
                <Globe className="w-3 h-3" />
                <span>{t('ipAddress')} {ipAddress}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
