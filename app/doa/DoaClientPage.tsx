'use client';

import { useState, useMemo, useRef } from 'react';
import Header from '../components/Header';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  Search, Heart, BookOpen, HeartPulse, Shield, 
  Utensils, Plane, Landmark, Smile, Home, 
  Moon, Anchor, Wallet, Menu, ArrowLeft,
  Copy, Check, Cloud, Star
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Doa {
  id: number;
  nama: string;
  lafal: string;
  transliterasi: string;
  arti: string;
  riwayat: string;
  keterangan: string;
  tag: string[];
}

interface Category {
  id: string;
  title: string;
  icon: any;
  keywords: string[];
  tags?: string[];
  color: string;
  bgGradient: string;
}

const CATEGORIES: Category[] = [
  { 
    id: 'sakit', 
    title: 'Kesembuhan Penyakit', 
    icon: HeartPulse, 
    keywords: ['sakit', 'sembuh', 'obat', 'sehat', 'penyakit', 'demam', 'nyeri', 'badan', 'tubuh', 'jenguk', 'kunjung', 'mata', 'telinga', 'bisul', 'luka', 'kusta', 'gila', 'belang'],
    tags: ['sakit'],
    color: 'text-rose-500',
    bgGradient: 'from-rose-500/10 to-rose-500/5'
  },
  { 
    id: 'ampunan', 
    title: 'Mohon Ampunan & Perlindungan', 
    icon: Shield, 
    keywords: ['ampun', 'lindung', 'tobat', 'istighfar', 'selamat', 'bala', 'bencana', 'fitnah', 'syetan', 'neraka', 'dosa', 'maaf', 'khilaf', 'salah', 'buruk', 'kejahatan', 'musuh', 'zalim', 'aniaya'],
    tags: ['ampunan', 'perlindungan', 'keburukan', 'sifat buruk', 'syirik'],
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/10 to-blue-500/5'
  },
  { 
    id: 'akhlak', 
    title: 'Akhlak & Adab', 
    icon: Heart, 
    keywords: ['akhlak', 'marah', 'sabar', 'syukur', 'lisan', 'hati', 'dengki', 'sombong', 'ilmu', 'iman', 'cinta', 'kasih', 'puji', 'caci', 'benci', 'salam', 'bicara', 'ucapan', 'majelis', 'tamu', 'tetangga', 'teman'],
    tags: ['sifat buruk'],
    color: 'text-pink-500',
    bgGradient: 'from-pink-500/10 to-pink-500/5'
  },
  { 
    id: 'makan', 
    title: 'Makan dan Minum', 
    icon: Utensils, 
    keywords: ['makan', 'minum', 'puasa', 'lapar', 'haus', 'buka', 'sahur', 'jamuan', 'air', 'susu'],
    tags: ['makan', 'minum'],
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/10 to-orange-500/5'
  },
  { 
    id: 'pergi', 
    title: 'Bepergian', 
    icon: Plane, 
    keywords: ['pergi', 'jalan', 'kendaraan', 'safar', 'pulang', 'berangkat', 'pasar', 'kota', 'desa', 'singgah', 'laut', 'darat', 'udara', 'kaki'],
    tags: ['perjalanan', 'safar'],
    color: 'text-sky-500',
    bgGradient: 'from-sky-500/10 to-sky-500/5'
  },
  { 
    id: 'haji', 
    title: 'Haji dan Umroh', 
    icon: Landmark, 
    keywords: ['haji', 'umroh', 'arafah', 'thawaf', 'sai', 'ihram', 'talbiyah', 'mekah', 'madinah', 'hajar aswad', 'multazam', 'maqam', 'marwah', 'safa'],
    tags: ['haji', 'umroh'],
    color: 'text-emerald-500',
    bgGradient: 'from-emerald-500/10 to-emerald-500/5'
  },
  { 
    id: 'bahagia', 
    title: 'Kebahagiaan & Kesulitan', 
    icon: Smile, 
    keywords: ['bahagia', 'mudah', 'sedih', 'susah', 'hutang', 'gelisah', 'duka', 'gembira', 'senang', 'sulit', 'lancar', 'lilitan', 'bingung', 'gundah', 'takut', 'cemas'],
    tags: ['sedih', 'sulit', 'musibah', 'kabar', 'bahagia'],
    color: 'text-yellow-500',
    bgGradient: 'from-yellow-500/10 to-yellow-500/5'
  },
  { 
    id: 'keluarga', 
    title: 'Rumah Tangga & Keluarga', 
    icon: Home,
    keywords: ['nikah', 'jodoh', 'suami', 'istri', 'anak', 'orang tua', 'hamil', 'lahir', 'pengantin', 'keluarga', 'ibu', 'bapak', 'ayah', 'jimak', 'hubungan', 'persalinan', 'bayi'],
    tags: ['orang tua', 'keluarga', 'anak', 'suami', 'istri'],
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/10 to-purple-500/5'
  },
  { 
    id: 'alam',
    title: 'Alam & Cuaca',
    icon: Cloud,
    keywords: ['hujan', 'angin', 'petir', 'halilintar', 'gempa', 'bencana', 'langit', 'bulan', 'sabit', 'bintang', 'matahari', 'gerhana', 'banjir', 'awan'],
    tags: ['alam', 'cuaca'],
    color: 'text-cyan-500',
    bgGradient: 'from-cyan-500/10 to-cyan-500/5'
  },
  { 
    id: 'dzikir',
    title: 'Dzikir & Shalawat',
    icon: Star,
    keywords: ['dzikir', 'tasbih', 'tahmid', 'tahlil', 'takbir', 'shalawat', 'nabi', 'rasul', 'pagi', 'petang', 'sore'],
    tags: ['dzikir'],
    color: 'text-violet-500',
    bgGradient: 'from-violet-500/10 to-violet-500/5'
  },
  { 
    id: 'all', 
    title: 'Semua Doa', 
    icon: BookOpen, 
    keywords: [],
    color: 'text-indigo-500',
    bgGradient: 'from-indigo-500/10 to-indigo-500/5'
  },
  { 
    id: 'rumah', 
    title: 'Aktivitas Rumah', 
    icon: Home, 
    keywords: ['rumah', 'tidur', 'bangun', 'mandi', 'cermin', 'pakaian', 'masuk', 'keluar', 'wc', 'toilet', 'sisir', 'dandan', 'baju', 'lepas'],
    tags: ['tidur', 'malam', 'kamar mandi', 'wudhu', 'pakaian', 'rumah'],
    color: 'text-teal-500',
    bgGradient: 'from-teal-500/10 to-teal-500/5'
  },
  { 
    id: 'masjid', 
    title: 'Masjid', 
    icon: Moon, 
    keywords: ['masjid', 'adzan', 'iqamah', 'sholat', 'wudhu', 'sujud', 'ruku', 'menuju'],
    tags: ['masjid', 'sholat'],
    color: 'text-green-500',
    bgGradient: 'from-green-500/10 to-green-500/5'
  },
  { 
    id: 'ramadhan', 
    title: 'Ramadhan', 
    icon: Moon, 
    keywords: ['ramadhan', 'puasa', 'berbuka', 'lailatul', 'tarawih', 'fitrah', 'qadar', 'witir'],
    tags: ['ramadhan', 'puasa'],
    color: 'text-indigo-400',
    bgGradient: 'from-indigo-400/10 to-indigo-400/5'
  },
  { 
    id: 'hati', 
    title: 'Keteguhan Hati', 
    icon: Anchor, 
    keywords: ['hati', 'tetap', 'istiqomah', 'petunjuk', 'hidayah', 'sesat', 'yakin', 'ragu', 'cahaya', 'ilmu', 'bodoh'],
    tags: ['hati', 'iman', 'cahaya'],
    color: 'text-red-500',
    bgGradient: 'from-red-500/10 to-red-500/5'
  },
  { 
    id: 'rezeki', 
    title: 'Rezeki', 
    icon: Wallet, 
    keywords: ['rezeki', 'kaya', 'miskin', 'harta', 'dagang', 'kerja', 'usaha', 'uang', 'nafkah', 'fakir', 'tanggung', 'beban'],
    tags: ['hutang', 'rezeki', 'harta'],
    color: 'text-amber-500',
    bgGradient: 'from-amber-500/10 to-amber-500/5'
  },
  { 
    id: 'lainnya', 
    title: 'Doa Lainnya', 
    icon: Menu, 
    keywords: [],
    color: 'text-gray-500',
    bgGradient: 'from-gray-500/10 to-gray-500/5'
  }
];

export default function DoaClientPage({ initialDoas }: { initialDoas: Doa[] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!search) return CATEGORIES;
    return CATEGORIES.filter(cat => 
      cat.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // GSAP Animations
  useGSAP(() => {
    // Animate Header
    gsap.from(headerRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Animate Content
    const cards = containerRef.current?.querySelectorAll('.animate-card');
    if (cards && cards.length > 0) {
      gsap.fromTo(cards, 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.05,
          ease: 'back.out(1.2)'
        }
      );
    }
  }, [selectedCategory, filteredCategories]); // Re-run when view changes

  // Get prayers for selected category
  const categoryDoas = useMemo(() => {
    if (!selectedCategory) return [];
    
    // If "Semua Doa", return all (filtered by search if any)
    if (selectedCategory.id === 'all') {
      return initialDoas.filter(doa => 
        !search || 
        doa.nama.toLowerCase().includes(search.toLowerCase()) ||
        doa.arti.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Logic for specific categories
    let prayers = initialDoas.filter(doa => {
      // 1. Check strict Tags if available
      if (selectedCategory.tags && selectedCategory.tags.length > 0) {
        const hasMatchingTag = doa.tag.some(t => 
          selectedCategory.tags?.some(catTag => catTag.toLowerCase() === t.toLowerCase())
        );
        if (hasMatchingTag) return true;
      }

      // 2. Check keywords against name (Priority 1)
      const nameMatch = selectedCategory.keywords.some(keyword => 
        doa.nama.toLowerCase().includes(keyword.toLowerCase())
      );
      if (nameMatch) return true;

      // 3. Check keywords against meaning/keterangan/tags (Priority 2) - stricter or secondary
      const textToCheck = `${doa.arti} ${doa.tag.join(' ')} ${doa.keterangan || ''}`.toLowerCase();
      
      // Some categories should be stricter and ONLY check title if the keywords are too generic
      const strictTitleOnly = ['sakit', 'makan', 'rumah', 'masjid', 'pergi', 'keluarga'].includes(selectedCategory.id);
      
      if (!strictTitleOnly) {
        return selectedCategory.keywords.some(keyword => textToCheck.includes(keyword.toLowerCase()));
      }
      
      return false;
    });

    // Logic for "Doa Lainnya" - exclude prayers that fit in other specific categories
    if (selectedCategory.id === 'lainnya') {
      prayers = initialDoas.filter(doa => {
        // Check if this doa matches any other category
        const isMatched = CATEGORIES.some(cat => {
          if (cat.id === 'all' || cat.id === 'lainnya') return false;
          
          // Check tags
          if (cat.tags && cat.tags.length > 0) {
             if (doa.tag.some(t => cat.tags?.some(catTag => catTag.toLowerCase() === t.toLowerCase()))) return true;
          }
          
          // Check keywords (Title match is strong signal)
          const nameMatch = cat.keywords.some(keyword => doa.nama.toLowerCase().includes(keyword.toLowerCase()));
          if (nameMatch) return true;

          return false;
        });
        
        return !isMatched;
      });
    }

    // Apply search filter on top of category filter if user searches within a category
    if (search) {
      prayers = prayers.filter(doa => 
        doa.nama.toLowerCase().includes(search.toLowerCase()) ||
        doa.arti.toLowerCase().includes(search.toLowerCase())
      );
    }

    return prayers;
  }, [selectedCategory, initialDoas, search]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSearch(''); // Reset search when entering a category
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSearch('');
  };

  const handleCopy = (doa: Doa) => {
    const textToCopy = `${doa.nama}\n\n${doa.lafal}\n\n${doa.transliterasi}\n\n"${doa.arti}"\n\n(Sumber: ${doa.riwayat})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(doa.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#111827] pt-20">
      <Header />
      
      {/* Header Section */}
      <div ref={headerRef} className="container mx-auto px-6 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-6">
          {selectedCategory ? (
            <button 
              onClick={handleBack}
              className="p-3 rounded-full bg-white dark:bg-[#1f2937] hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:-translate-x-1 transition-transform" />
            </button>
          ) : null}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              {selectedCategory ? (
                <>
                  <selectedCategory.icon className={cn("w-8 h-8", selectedCategory.color)} />
                  {selectedCategory.title}
                </>
              ) : (
                'Kumpulan Doa Harian'
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {selectedCategory 
                ? `${categoryDoas.length} doa tersedia` 
                : 'Temukan doa yang sesuai dengan kebutuhanmu'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 group">
          <input 
            type="text" 
            placeholder={selectedCategory ? "Cari doa di kategori ini..." : "Cari kategori doa..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all pl-12 shadow-sm group-hover:shadow-md"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-emerald-500 transition-colors w-5 h-5" />
          {search && (
             <button 
               onClick={() => setSearch('')}
               className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
             >
               <span className="sr-only">Clear search</span>
               ×
             </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div ref={containerRef} className="container mx-auto px-6 pb-20">
        {!selectedCategory ? (
          /* Grid Categories View */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="animate-card relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-[#1f2937] border border-gray-100 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 group aspect-[4/3] shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br", category.bgGradient)} />
                
                <div className={cn("relative mb-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 group-hover:scale-110 transition-transform duration-500 shadow-inner", category.color)}>
                  <category.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <span className="relative font-medium text-center text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors line-clamp-2">
                  {category.title}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Doa List View */
          <div className="space-y-6">
             {categoryDoas.length > 0 ? (
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 {categoryDoas.map(doa => (
                   <div key={doa.id} className="animate-card group relative bg-white dark:bg-[#1f2937] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300">
                      {/* Header Card */}
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg md:text-xl leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {doa.nama}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                             {doa.tag.slice(0, 3).map((tag, idx) => (
                               <span key={idx} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                                 {tag}
                               </span>
                             ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 text-sm font-bold shadow-sm">
                             {doa.id}
                           </div>
                           <button
                             onClick={() => handleCopy(doa)}
                             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-emerald-500 transition-colors"
                             title="Salin Doa"
                           >
                             {copiedId === doa.id ? (
                               <Check className="w-4 h-4 text-emerald-500" />
                             ) : (
                               <Copy className="w-4 h-4" />
                             )}
                           </button>
                        </div>
                      </div>
                      
                      {/* Arabic Content */}
                      <div className="mb-6 pl-4 md:pl-0">
                        <p className="font-arabic text-3xl md:text-4xl text-right leading-[2.5] text-gray-800 dark:text-gray-100 mb-6" dir="rtl">
                          {doa.lafal}
                        </p>
                        
                        <div className="space-y-4">
                          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20">
                            <p className="text-base text-emerald-700 dark:text-emerald-300 font-medium italic leading-relaxed">
                              {doa.transliterasi}
                            </p>
                          </div>
                          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                            {doa.arti}
                          </p>
                        </div>
                      </div>

                      {/* Footer Card */}
                      <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                         <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 font-medium">
                           <BookOpen className="w-3.5 h-3.5" />
                           {doa.riwayat || 'Sumber Terpercaya'}
                         </span>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-20 animate-card">
                 <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                    <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tidak ditemukan</h3>
                 <p className="text-gray-500 dark:text-gray-400 mb-6">Maaf, doa yang kamu cari tidak ditemukan di kategori ini.</p>
                 <button 
                    onClick={handleBack}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition-colors shadow-lg shadow-emerald-600/20"
                 >
                   Kembali ke Kategori
                 </button>
               </div>
             )}
          </div>
        )}
      </div>
    </main>
  );
}
