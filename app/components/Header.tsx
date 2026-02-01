'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Moon, Search, Settings, ChevronDown, Menu, User, LogOut, LogIn } from 'lucide-react';
import { useAudio, QARI_LIST } from '../context/AudioContext';
import { cn } from '../lib/utils';
import ThemeToggle from './ThemeToggle';
import Sidebar from './Sidebar';
import { useSession, signOut } from 'next-auth/react';
import { useSettings } from '../context/SettingsContext';

export default function Header() {
  const { t, autoScroll, setAutoScroll } = useSettings();
  const headerRef = useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { selectedQari, setQari } = useAudio();
  const { data: session, status } = useSession();

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      clearProps: 'all'
    });
  }, { scope: headerRef });

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#222831]/90 backdrop-blur-xl border-b border-gray-100 dark:border-[#a2a8d3]/20">
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Sidebar Toggle */}
            <button 
              onClick={() => {
                setIsSidebarOpen(true);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#38598b]/20 rounded-xl transition-colors text-gray-700 dark:text-[#a2a8d3] relative z-[100] cursor-pointer"
              aria-label={t('menu')}
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex items-center gap-3 group">
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
                <span className="text-lg font-bold text-gray-900 dark:text-[#e7eaf6] tracking-tight leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {t('appTitle')}
                </span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 leading-tight">
                  {t('appSubtitle')}
                </span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Settings Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#38598b]/20 rounded-full transition-colors text-sm font-medium text-gray-700 dark:text-[#a2a8d3]"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">{t('settings')}</span>
              </button>

              {isSettingsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSettingsOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#222831] rounded-2xl shadow-xl border border-gray-100 dark:border-[#a2a8d3]/20 p-4 z-20 animate-in fade-in zoom-in-95 duration-200">
                    <h3 className="font-bold text-gray-900 dark:text-[#e7eaf6] mb-3 text-sm">{t('chooseQari')}</h3>
                    <div className="space-y-1">
                      {QARI_LIST.map((qari) => (
                        <button
                          key={qari.id}
                          onClick={() => {
                            setQari(qari.id as any);
                            setIsSettingsOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between",
                            selectedQari === qari.id 
                              ? "bg-emerald-50 dark:bg-[#38598b]/30 text-emerald-700 dark:text-[#e7eaf6] font-medium" 
                              : "hover:bg-gray-50 dark:hover:bg-[#38598b]/20 text-gray-600 dark:text-[#a2a8d3]"
                          )}
                        >
                          {t(`qari_${qari.id}` as any)}
                          {selectedQari === qari.id && <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#38598b]" />}
                        </button>
                      ))}
                    </div>

                    {/* Auto Scroll Toggle */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#a2a8d3]/20">
                      <label className="flex items-center justify-between px-3 cursor-pointer group">
                        <span className="text-sm font-medium text-gray-700 dark:text-[#e7eaf6] group-hover:text-emerald-600 dark:group-hover:text-[#a2a8d3] transition-colors">{t('autoScroll')}</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={autoScroll} 
                            onChange={(e) => setAutoScroll(e.target.checked)} 
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#38598b]/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative ml-1">
              {status === 'loading' ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              ) : session ? (
                <>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-[#38598b]/30 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-emerald-500 dark:hover:border-[#38598b] transition-all"
                  >
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-emerald-700 dark:text-[#e7eaf6] font-bold text-lg">
                        {session.user?.name?.[0] || 'U'}
                      </span>
                    )}
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#222831] rounded-2xl shadow-xl border border-gray-100 dark:border-[#a2a8d3]/20 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                          <p className="font-bold text-gray-900 dark:text-white truncate">{session.user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user?.email}</p>
                        </div>
                        
                        <Link 
                          href="/profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-[#38598b]/20 text-gray-700 dark:text-[#a2a8d3] transition-colors"
                        >
                          <User className="w-4 h-4" />
                          {t('profile')}
                        </Link>
                        
                        <button
                          onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            signOut({ callbackUrl: '/login' });
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('logout')}
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link 
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors text-sm font-medium shadow-lg shadow-emerald-600/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('login')}</span>
                </Link>
              )}
            </div>
          </div>
      </div>
    </header>
    </>
  );
}
