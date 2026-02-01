'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, ChevronRight, ChevronDown, Globe, Clock, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { SIDEBAR_ITEMS, SHORT_HADITHS } from '../hadist/data';
import { INDO_TRANSLATIONS } from '../hadist/indo-data';
import { useSettings } from '../context/SettingsContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const LABEL_KEYS: Record<string, string> = {
  'Beranda': 'home',
  'Bookmark': 'bookmark',
  'Urutan Wahyu': 'revelationOrder',
  'Hadits': 'hadith',
  'Surah Makkiyah': 'makkiyah',
  'Surah Madaniyah': 'madaniyah',
  'Daftar Juz': 'juzList',
  'Jadwal Solat': 'prayerTimes',
  'Doa Harian': 'dailyDua',
  'Ustaz AI': 'ustazAi',
  'Poster Builder': 'posterBuilder',
  'Pengaturan': 'settings',
  'Login': 'login',
  'Hadits Nawawi': 'hadithNawawi',
  'Hadits Qudsi': 'hadithQudsi',
  'Al-Adab Al-Mufrad': 'adabMufrad'
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t, language } = useSettings();
  const [shouldRender, setShouldRender] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Hadits']);
  const [ipAddress, setIpAddress] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [randomHadith, setRandomHadith] = useState<typeof SHORT_HADITHS[0] | null>(null);

  useEffect(() => {
    // Initial random pick on mount
    if (SHORT_HADITHS.length > 0) {
      const randomIndex = Math.floor(Math.random() * SHORT_HADITHS.length);
      setRandomHadith(SHORT_HADITHS[randomIndex]);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (SHORT_HADITHS.length > 0) {
        // Get current hadith to avoid repeating the same one immediately
        let randomIndex;
        const currentHadith = randomHadith;
        
        do {
          randomIndex = Math.floor(Math.random() * SHORT_HADITHS.length);
        } while (SHORT_HADITHS.length > 1 && SHORT_HADITHS[randomIndex].id.judul === currentHadith?.id?.judul);
        
        setRandomHadith(SHORT_HADITHS[randomIndex]);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // Fetch IP safely
    const fetchIp = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
        
        const response = await fetch('https://api.ipify.org?format=json', { 
          signal: controller.signal,
          next: { revalidate: 3600 } 
        }).catch(() => null);
        
        clearTimeout(timeoutId);

        if (response?.ok) {
          const data = await response.json();
          setIpAddress(data.ip);
        }
      } catch (error) {
        // Silently fail or log debug
        console.debug('IP fetch failed:', error);
      }
    };

    fetchIp();

    // Initial time
    setCurrentTime(new Date());

    // Clock interval
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle visibility delay for animations
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShouldRender(true), 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close sidebar when route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const toggleItem = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-[#222831]/95 backdrop-blur-xl z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-gray-100 dark:border-[#a2a8d3]/10",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#a2a8d3]/10">
            <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
              <div className="relative w-12 h-12">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                 <div className="relative w-full h-full bg-white dark:bg-[#222831] rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 dark:border-[#a2a8d3]/10 shadow-sm">
                   <Image 
                     src="/image/logo.png" 
                     alt="Al-Moslem Logo" 
                     width={48} 
                     height={48} 
                     className="w-full h-full object-contain p-0.5" 
                   />
                 </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-[#e7eaf6] tracking-tight leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{t('appTitle')}</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 leading-tight">{t('appSubtitle')}</span>
              </div>
            </Link>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#38598b]/20 rounded-full transition-colors text-gray-500 dark:text-[#a2a8d3]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Real-time Clock Section */}
          {currentTime && (
            <div className="px-6 py-4 border-b border-gray-100 dark:border-[#a2a8d3]/10 bg-gray-50/50 dark:bg-[#38598b]/5">
              <div className="flex flex-col gap-1">
                {/* Greeting */}
                <div className="text-sm font-semibold text-gray-700 dark:text-[#e7eaf6] mb-1">
                  {(() => {
                    const hour = currentTime.getHours();
                    let greetingKey = 'goodNight';
                    if (hour >= 5 && hour < 11) greetingKey = 'goodMorning';
                    else if (hour >= 11 && hour < 15) greetingKey = 'goodAfternoon';
                    else if (hour >= 15 && hour < 19) greetingKey = 'goodEvening';
                    return t(greetingKey as any);
                  })()}
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                  <Clock className="w-4 h-4" />
                  <span>
                    {currentTime.toLocaleTimeString(language === 'id' ? 'id-ID' : language === 'es' ? 'es-ES' : language === 'ru' ? 'ru-RU' : language === 'ja' ? 'ja-JP' : language === 'de' ? 'de-DE' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#a2a8d3]">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {currentTime.toLocaleDateString(language === 'id' ? 'id-ID' : language === 'es' ? 'es-ES' : language === 'ru' ? 'ru-RU' : language === 'ja' ? 'ja-JP' : language === 'de' ? 'de-DE' : 'en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItems.includes(item.label);
              const translatedLabel = t(LABEL_KEYS[item.label] as any) || item.label;

              return (
                <div key={item.label}>
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleItem(item.label)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                        isActive || isExpanded
                          ? "bg-emerald-50 dark:bg-[#38598b]/20 text-emerald-700 dark:text-[#e7eaf6] font-semibold" 
                          : "text-gray-600 dark:text-[#a2a8d3] hover:bg-gray-50 dark:hover:bg-[#38598b]/10 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn(
                          "w-5 h-5 transition-colors",
                          isActive || isExpanded ? "text-emerald-600 dark:text-[#38598b]" : "text-gray-400 dark:text-[#a2a8d3]/60 group-hover:text-emerald-600 dark:group-hover:text-[#e7eaf6]"
                        )} />
                        <span>{translatedLabel}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-[#38598b]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-[#a2a8d3]/60" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                        isActive 
                          ? "bg-emerald-50 dark:bg-[#38598b]/20 text-emerald-700 dark:text-[#e7eaf6] font-semibold" 
                          : "text-gray-600 dark:text-[#a2a8d3] hover:bg-gray-50 dark:hover:bg-[#38598b]/10 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn(
                          "w-5 h-5 transition-colors",
                          isActive ? "text-emerald-600 dark:text-[#38598b]" : "text-gray-400 dark:text-[#a2a8d3]/60 group-hover:text-emerald-600 dark:group-hover:text-[#e7eaf6]"
                        )} />
                        <span>{translatedLabel}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-[#38598b]" />}
                    </Link>
                  )}

                  {/* Submenu */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 dark:border-[#a2a8d3]/10 pl-2">
                      {item.subItems?.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        const translatedSubLabel = t(LABEL_KEYS[subItem.label] as any) || subItem.label;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 text-sm",
                              isSubActive
                                ? "text-emerald-700 dark:text-[#e7eaf6] font-medium bg-emerald-50/50 dark:bg-[#38598b]/10"
                                : "text-gray-500 dark:text-[#a2a8d3] hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#38598b]/5"
                            )}
                          >
                            <span>{translatedSubLabel}</span>
                            {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-[#38598b]" />}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-[#a2a8d3]/10">
            <div className="bg-emerald-600 dark:bg-[#38598b] rounded-2xl p-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <h4 className="font-bold text-white mb-1">{t('hadithOfDay')}</h4>
                {(() => {
                  if (!randomHadith) return <div className="text-emerald-100 dark:text-[#e7eaf6]/80 text-xs">{t('hadithSample')}</div>;
                  // @ts-ignore
                  const content = randomHadith[language] || randomHadith['id'];
                  return (
                    <>
                      <p className="text-emerald-50 dark:text-[#e7eaf6]/90 text-[10px] font-semibold mb-1 opacity-90">
                        {content.judul}
                      </p>
                      <div className="text-emerald-100 dark:text-[#e7eaf6]/80 text-xs">
                        "{content.terjemah}"
                        {content.riwayat && (
                          <span className="block mt-1 text-[10px] opacity-75 italic">
                            ({content.riwayat})
                          </span>
                        )}
                      </div>
                    </>
                  );
                })()}
                <Link href="/hadist" className="inline-block mt-3 text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                  {t('readMore')}
                </Link>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-[#a2a8d3]/50 mt-6">
              © {new Date().getFullYear()} {t('copyright')}
            </p>
            {ipAddress && (
              <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400 dark:text-[#a2a8d3]/50 mt-2 opacity-75">
                <Globe className="w-3 h-3" />
                {t('ipAddressLabel')} {ipAddress}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
