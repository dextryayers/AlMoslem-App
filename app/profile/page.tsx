'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { 
  User, Mail, LogOut, BookOpen, Bookmark, 
  Settings, Edit, Camera, ChevronRight, Sparkles, Clock, Activity,
  Crown, ShieldCheck, Heart
} from 'lucide-react';
import Header from '../components/Header';
import { useSettings } from '../context/SettingsContext';
import { useBookmark } from '../context/BookmarkContext';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { getRelativeTime, cn } from '../lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ActivityChart from '../components/ActivityChart';

export default function ProfilePage() {
  const { t, language } = useSettings();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { bookmarks, lastReadHistory } = useBookmark();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate header elements
    gsap.from(".hero-element", {
      y: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    });

    // Animate bento grid items
    gsap.from(".bento-item", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.2,
      ease: "back.out(1.2)"
    });

    // Animate list items inside history
    gsap.from(".history-item", {
      x: -10,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      delay: 0.6,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: t('logout') + '?',
      text: 'Anda yakin ingin keluar dari akun?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'rounded-2xl border border-gray-700',
        confirmButton: 'rounded-xl px-6',
        cancelButton: 'rounded-xl px-6'
      }
    });

    if (result.isConfirmed) {
      await signOut({ redirect: false });
      router.push('/login');
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1e293b',
        color: '#fff'
      });
      
      Toast.fire({
        icon: 'success',
        title: 'Berhasil keluar'
      });
    }
  };

  const handleEditProfile = () => {
    Swal.fire({
      title: 'Edit Profile',
      text: 'Fitur ini akan segera hadir! Nantikan update selanjutnya.',
      icon: 'info',
      confirmButtonText: 'Oke',
      confirmButtonColor: '#10b981',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'rounded-2xl border border-gray-700',
        confirmButton: 'rounded-xl px-6'
      }
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50/50 dark:bg-[#0f1115] pb-20 font-sans selection:bg-emerald-500/30">
      <Header />
      
      {/* Modern Hero Section */}
      <div className="relative h-[350px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 via-teal-700 to-gray-50/50 dark:to-[#0f1115]"></div>
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        {/* Gradient Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50/50 dark:from-[#0f1115] to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10 pt-12 flex justify-between items-start">
           <div className="hero-element">
             <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium backdrop-blur-md">
                Member since 2024
             </span>
           </div>
           <div className="hero-element hidden md:block">
              <div className="flex items-center gap-2 text-white/80 text-sm bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm">
                 <ShieldCheck className="w-4 h-4 text-emerald-300" />
                 <span>Verified Account</span>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-48 relative z-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Profile & Stats (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Card */}
            <div className="bento-item bg-white dark:bg-[#1e232e] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110 duration-500"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="relative group/avatar mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#2a303c] shadow-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 relative z-10 ring-4 ring-emerald-500/20 dark:ring-emerald-500/10">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'Profile'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-gray-400 dark:text-gray-500 flex items-center justify-center h-full">
                        {session.user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handleEditProfile}
                    className="absolute bottom-1 right-1 z-20 p-2 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all transform hover:scale-110 active:scale-95 border-2 border-white dark:border-[#1e232e]"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2 mb-1">
                  {session.user?.name}
                  <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5 mb-6">
                  <Mail className="w-3.5 h-3.5" />
                  {session.user?.email}
                </p>

                <div className="grid grid-cols-2 gap-3 w-full">
                   <button 
                      onClick={handleEditProfile}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-[#252b36] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a303c] transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700"
                   >
                      <Edit className="w-4 h-4" />
                      Edit
                   </button>
                   <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors text-sm font-semibold border border-emerald-100 dark:border-emerald-500/20">
                      <Crown className="w-4 h-4" />
                      Premium
                   </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               {/* Bookmarks Card */}
               <div className="bento-item col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 shadow-lg shadow-blue-500/20 text-white relative overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
                  <div className="relative z-10 flex justify-between items-start">
                     <div>
                        <div className="p-2 bg-white/20 rounded-lg w-fit mb-3 backdrop-blur-sm">
                           <Bookmark className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-blue-100 text-sm font-medium">{t('bookmark')}</p>
                        <h3 className="text-3xl font-bold mt-1">{bookmarks.length} <span className="text-sm font-normal text-blue-100 opacity-80">Ayat</span></h3>
                     </div>
                     <div className="h-full flex items-end">
                        <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Menu Section */}
            <div className="bento-item bg-white dark:bg-[#1e232e] rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800/50">
                 <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-2">Menu</h3>
              </div>
              <div className="p-2 space-y-1">
                <Link href="/setting" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#252b36] rounded-2xl transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                      <Settings className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{t('settingsTitle')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors" />
                </Link>

                <Link href="/about" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#252b36] rounded-2xl transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Donasi & About</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors" />
                </Link>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all group"
                >
                   <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-red-500 transition-colors">{t('logout')}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Activity & History (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Activity Chart Card */}
            <div className="bento-item bg-white dark:bg-[#1e232e] p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                        <Activity className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('readingActivity')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('activityStats')}</p>
                     </div>
                  </div>
                  {/* Optional: Filter/Time range dropdown could go here */}
               </div>
               
               <div className="h-[300px] w-full">
                  {lastReadHistory && lastReadHistory.length > 0 ? (
                     <ActivityChart history={lastReadHistory} locale={language} t={t} />
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                        <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-400">{t('noReadingHistory')}</p>
                     </div>
                  )}
               </div>
            </div>

            {/* Reading History */}
            <div className="bento-item bg-white dark:bg-[#1e232e] p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
               <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="p-2.5 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                     <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('lastHistory')}</h3>
               </div>

               {lastReadHistory && lastReadHistory.length > 0 ? (
                  <div className="space-y-4">
                     {lastReadHistory.slice(0, 5).map((item, index) => (
                        <Link 
                           key={`${item.surahNumber}-${item.ayatNumber}-${index}`}
                           href={`/surah/${item.surahNumber}#ayat-${item.ayatNumber}`}
                           className="history-item group block"
                        >
                           <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#252b36] border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-white dark:hover:bg-[#2a303c] hover:shadow-md transition-all duration-300">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                    {item.surahNumber}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                       QS. {item.surahName}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                       <span className="font-medium text-emerald-600 dark:text-emerald-400">Ayat {item.ayatNumber}</span>
                                       <span>•</span>
                                       <span>{getRelativeTime(item.timestamp, language)}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
                                 <ChevronRight className="w-4 h-4" />
                              </div>
                           </div>
                        </Link>
                     ))}
                     
                     {lastReadHistory.length > 5 && (
                        <button className="w-full py-3 text-center text-sm font-semibold text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors border-t border-gray-100 dark:border-gray-800 mt-4">
                           View All History
                        </button>
                     )}
                  </div>
               ) : (
                  <div className="text-center py-12">
                     <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-600">
                        <BookOpen className="w-8 h-8" />
                     </div>
                     <p className="text-gray-500 dark:text-gray-400">{t('noReadingHistory')}</p>
                     <Link href="/" className="inline-block mt-4 px-6 py-2 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30">
                        Mulai Membaca
                     </Link>
                  </div>
               )}
            </div>

          </div>

        </div>
        
        {/* Footer/Version */}
        <div className="text-center pt-12 pb-8 opacity-60 hover:opacity-100 transition-opacity">
           <p className="text-xs text-gray-400 dark:text-gray-600 font-medium tracking-widest uppercase">QQuran v2.0 • Made with ❤️ by Haniipp</p>
        </div>
      </div>
    </div>
  );
}