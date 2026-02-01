'use client';

import { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { ArrowLeft, Download, Share2, Image as ImageIcon, Type, Layout, RefreshCw, Check, Square, RectangleVertical, RectangleHorizontal, Smartphone, Monitor, Upload, ChevronRight, ChevronLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../lib/utils';
import { loadFabricImage, addWatermark } from '../lib/canvasUtils';
import * as fabric from 'fabric';

// --- Constants ---

const BACKGROUNDS = [
  // Masjids (User Selection)
  { id: 'masjid1', name: 'Masjid 1', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/flagged/photo-1558113118-e42e558b352a?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid2', name: 'Masjid 2', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1511091734515-e50d46c37240?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid3', name: 'Masjid 3', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1572358899655-f63ece97bfa5?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid4', name: 'Masjid 4', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1592326871020-04f58c1a52f3?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid5', name: 'Masjid 5', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid6', name: 'Masjid 6', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1623811852177-611cda0b372f?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid7', name: 'Masjid 7', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1546369527-f5279d232524?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid8', name: 'Masjid 8', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1552423314-cf29ab68ad73?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid9', name: 'Masjid 9', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1607398202930-f4c68d729323?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid10', name: 'Masjid 10', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1590092794015-bce5431c83f4?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid11', name: 'Masjid 11', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1564407727371-3eece6c58961?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid12', name: 'Masjid 12', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1582631313764-62141d98b4bb?auto=format&fit=crop&w=1920&q=80' },
  
  // Nature/Sky
  { id: 'alam1', name: 'Alam 1', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1604093882750-3ed498f3178b?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam2', name: 'Alam 2', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1610123598147-f632aa18b275?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam3', name: 'Alam 3', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1613502719343-267bfb1fc7ed?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam4', name: 'Alam 4', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1419064642531-e575728395f2?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam5', name: 'Alam 5', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1586513677534-b926f5477204?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam6', name: 'Alam 6', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1595538154519-bc102fd25a97?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam7', name: 'Alam 7', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1681953516936-0b0fb98328cd?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam8', name: 'Alam 8', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam9', name: 'Alam 9', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1606857897239-ec86f2c4e771?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam10', name: 'Alam 10', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1717964134799-a98f497172a5?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam11', name: 'Alam 11', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1603276730862-cbf79a742aae?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam12', name: 'Alam 12', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1637145393753-bc4ddcd35eab?auto=format&fit=crop&w=1920&q=80' },

  // Flowers/Abstract
  { id: 'bunga1', name: 'Bunga 1', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga2', name: 'Bunga 2', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1474112704314-8162b7749a90?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga3', name: 'Bunga 3', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1447875569765-2b3db822bec9?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga4', name: 'Bunga 4', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1533907650686-70576141c030?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga5', name: 'Bunga 5', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1497178398528-7ff4a4bad7ab?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga6', name: 'Bunga 6', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1529884004199-50514511b8de?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga7', name: 'Bunga 7', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1653244803250-f8369df1d5cd?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga8', name: 'Bunga 8', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1665928939223-423d61a8fc81?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga9', name: 'Bunga 9', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1602061311846-007517b83b7c?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga10', name: 'Bunga 10', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1493815793585-d94ccbc86df8?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga11', name: 'Bunga 11', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/flagged/photo-1589393191839-ccec3d7f5e2c?auto=format&fit=crop&w=1920&q=80' },
  
  // Gradients
  { id: 'gradient1', name: 'Emerald', category: 'Gradient', type: 'gradient', value: ['#10b981', '#134e4a'] },
  { id: 'gradient2', name: 'Ocean', category: 'Gradient', type: 'gradient', value: ['#3b82f6', '#1e3a8a'] },
  { id: 'gradient3', name: 'Royal', category: 'Gradient', type: 'gradient', value: ['#8b5cf6', '#4c1d95'] },
  { id: 'gradient4', name: 'Sunset', category: 'Gradient', type: 'gradient', value: ['#f59e0b', '#b45309'] },
  
  // Solid
  { id: 'dark', name: 'Dark', category: 'Solid', type: 'solid', value: '#222831' },
  { id: 'light', name: 'Light', category: 'Solid', type: 'solid', value: '#f8fafc' },
];

interface AyatData {
    arabic: string;
    translation?: string;
    tafsir?: string;
    surahName?: string;
    surahNumber?: number;
    ayatNumber?: number;
    latin?: string;
}

const ASPECT_RATIOS = [
    // Square
    { id: '1:1', label: '1:1', width: 1080, height: 1080, icon: Square, desc: 'IG Feed Square' },

    // Landscape (Desktop/Video)
    { id: '16:9', label: '16:9', width: 1920, height: 1080, icon: Monitor, desc: 'YouTube / Desktop' },
    { id: '4:3', label: '4:3', width: 1440, height: 1080, icon: Monitor, desc: 'Classic 4:3' },
    { id: '3:2', label: '3:2', width: 1620, height: 1080, icon: RectangleHorizontal, desc: 'Classic Photo' },
    { id: '21:9', label: '21:9', width: 2520, height: 1080, icon: Monitor, desc: 'Cinematic / Ultrawide' },
    { id: 'custom', label: 'Custom', width: 1080, height: 1080, icon: Layout, desc: 'Custom Size' },
];

const FORMATS = [
  { id: 'png', label: 'PNG' },
  { id: 'jpeg', label: 'JPG' },
  { id: 'svg', label: 'SVG' },
  { id: 'webp', label: 'WEBP' },
];

const WATERMARK_ASSET_PATH = '/image/watermark.png';

const ARABIC_FONTS = [
    { id: 'LPMQ Isep Misbah', name: 'LPMQ (Default)', family: 'LPMQ Isep Misbah' },
    { id: 'Amiri', name: 'Amiri (Naskh)', family: 'Amiri', url: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap' },
    { id: 'Scheherazade New', name: 'Scheherazade', family: 'Scheherazade New', url: 'https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap' },
    { id: 'Noto Naskh Arabic', name: 'Noto Naskh', family: 'Noto Naskh Arabic', url: 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap' },
    { id: 'Reem Kufi', name: 'Reem Kufi', family: 'Reem Kufi', url: 'https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;700&display=swap' },
    { id: 'Lateef', name: 'Lateef', family: 'Lateef', url: 'https://fonts.googleapis.com/css2?family=Lateef:wght@400;700&display=swap' },
    { id: 'Aref Ruqaa', name: 'Aref Ruqaa', family: 'Aref Ruqaa', url: 'https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&display=swap' },
    { id: 'Cairo', name: 'Cairo (Modern)', family: 'Cairo', url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap' },
    { id: 'Tajawal', name: 'Tajawal (Modern)', family: 'Tajawal', url: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap' },
    { id: 'Almarai', name: 'Almarai', family: 'Almarai', url: 'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap' },
];

const LATIN_FONTS = [
    { id: 'sans-serif', name: 'System Default', family: 'sans-serif' },
    // Sans Serif
    { id: 'Roboto', name: 'Roboto', family: 'Roboto', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' },
    { id: 'Lato', name: 'Lato', family: 'Lato', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap' },
    { id: 'Montserrat', name: 'Montserrat', family: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap' },
    { id: 'Open Sans', name: 'Open Sans', family: 'Open Sans', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap' },
    { id: 'Poppins', name: 'Poppins', family: 'Poppins', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap' },
    { id: 'Raleway', name: 'Raleway', family: 'Raleway', url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&display=swap' },
    { id: 'Nunito', name: 'Nunito (Rounded)', family: 'Nunito', url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap' },
    { id: 'Quicksand', name: 'Quicksand (Rounded)', family: 'Quicksand', url: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap' },
    { id: 'Oswald', name: 'Oswald (Condensed)', family: 'Oswald', url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;600&display=swap' },
    
    // Serif
    { id: 'Playfair Display', name: 'Playfair (Serif)', family: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap' },
    { id: 'Merriweather', name: 'Merriweather (Serif)', family: 'Merriweather', url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap' },
    { id: 'Lora', name: 'Lora (Serif)', family: 'Lora', url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap' },
    { id: 'Crimson Text', name: 'Crimson Text (Book)', family: 'Crimson Text', url: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap' },
    
    // Handwriting / Display
    { id: 'Dancing Script', name: 'Dancing Script', family: 'Dancing Script', url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap' },
    { id: 'Pacifico', name: 'Pacifico', family: 'Pacifico', url: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap' },
    { id: 'Great Vibes', name: 'Great Vibes', family: 'Great Vibes', url: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap' },
    { id: 'Indie Flower', name: 'Indie Flower', family: 'Indie Flower', url: 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap' },
    { id: 'Shadows Into Light', name: 'Shadows Into Light', family: 'Shadows Into Light', url: 'https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap' },
    { id: 'Satisfy', name: 'Satisfy', family: 'Satisfy', url: 'https://fonts.googleapis.com/css2?family=Satisfy&display=swap' },
    { id: 'Righteous', name: 'Righteous (Modern)', family: 'Righteous', url: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap' },
];

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const surahNumber = searchParams.get('surah');
  const ayatNumber = searchParams.get('ayat');

    const { language, arabicFont, showWatermark, setShowWatermark, t } = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const watermarkImageRef = useRef<fabric.Image | null>(null);

  // Preload Watermark Image
  useEffect(() => {
    const preloadWatermark = async () => {
        try {
            const img = await loadFabricImage(WATERMARK_ASSET_PATH);
            watermarkImageRef.current = img;
            console.log("Watermark image preloaded successfully");
        } catch (error) {
            console.error("Failed to preload watermark image:", error);
        }
    };
    preloadWatermark();
  }, []);
  
  // Data State
  const [ayatData, setAyatData] = useState<AyatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editor State
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]); // Default 9:16 (First item)
  const [customDimensions, setCustomDimensions] = useState<{width: string | number, height: string | number}>({ width: 1080, height: 1080 });
  
  const handleCustomDimensionChange = (key: 'width' | 'height', value: string) => {
      const newDims = { ...customDimensions, [key]: value };
      setCustomDimensions(newDims);

      const width = parseInt(String(newDims.width));
      const height = parseInt(String(newDims.height));

      if (!isNaN(width) && width > 0 && !isNaN(height) && height > 0) {
          setSelectedRatio(prev => ({
              ...prev,
              id: 'custom',
              label: 'Custom',
              width: width,
              height: height,
              icon: Layout,
              desc: 'Custom Size'
          }));
      }
  };

  const [previewArabicFont, setPreviewArabicFont] = useState(ARABIC_FONTS[0]);
    // Set distinct default fonts for better visibility of changes
    const [previewLatinFont, setPreviewLatinFont] = useState(LATIN_FONTS.find(f => f.id === 'Quicksand') || LATIN_FONTS[0]);
    const [previewTranslationFont, setPreviewTranslationFont] = useState(LATIN_FONTS.find(f => f.id === 'Playfair Display') || LATIN_FONTS[0]);

    // Font loading effect moved below updateCanvasContent to allow re-rendering triggers

  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]); // Default Masjid 1
  const [activeCategory, setActiveCategory] = useState('Masjid');
  const [showLatin, setShowLatin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafsir, setShowTafsir] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scale, setScale] = useState(0.5);
  
  // Visual Enhancements
  const [bgBlur, setBgBlur] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0.4); // Default 40% for better visibility
  const [customBg, setCustomBg] = useState<string | null>(null);

  // Mobile UI
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryLabel = useCallback((cat: string) => {
    return t(cat as any) || cat;
  }, [t]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomBg(result);
        setSelectedBg({
            id: 'custom',
            name: 'Custom Image',
            category: 'Custom',
            type: 'image',
            value: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Resize Logic
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const { clientWidth, clientHeight } = containerRef.current;
      
      // Padding for better aesthetics
            const isMobile = window.innerWidth < 1024;
            // Add padding on mobile as requested (20px each side = 40px total)
            const padding = isMobile ? 40 : 60;
            const availableWidth = clientWidth - padding;
            const availableHeight = clientHeight - padding;
            
            // Calculate scale to fit
            const scaleX = availableWidth / selectedRatio.width;
            const scaleY = availableHeight / selectedRatio.height;
            
            // Fit entirely within the screen with padding (Contain)
            // This ensures margins on all sides (top, bottom, left, right) and perfect centering
            const newScale = Math.min(scaleX, scaleY, 0.98);
            
            setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Add ResizeObserver to handle container size changes (e.g. sidebar toggle)
    const resizeObserver = new ResizeObserver(() => {
        handleResize();
    });
    
    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }

    return () => {
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
    };
  }, [selectedRatio, isMobileSidebarOpen]);

  // 1. Fetch Data
  useEffect(() => {
    if (!surahNumber || !ayatNumber) {
        setLoading(false);
        // Don't set error immediately to avoid flash if params are coming
        return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const editionMap: Record<string, { trans: string; tafsir: string }> = {
            id: { trans: 'id.indonesian', tafsir: 'id.jalalayn' },
            en: { trans: 'en.sahih', tafsir: 'en.khattab' },
            es: { trans: 'es.cortes', tafsir: 'es.bornez' },
            ru: { trans: 'ru.kuliev', tafsir: 'ru.kuliev-alsaadi' },
            de: { trans: 'de.aburida', tafsir: 'de.bubenheim' },
            ja: { trans: 'ja.kobayashi', tafsir: 'ja.kobayashi' }
        };

        const selectedEdition = editionMap[language] || editionMap['en'];
        const langEdition = selectedEdition.trans;
        const tafsirEdition = selectedEdition.tafsir;

        const [arabicRes, transRes, tafsirRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayatNumber}/quran-uthmani`),
          fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayatNumber}/${langEdition}`),
          fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayatNumber}/${tafsirEdition}`)
        ]);

        const arabicData = await arabicRes.json();
        const transData = await transRes.json();
        const tafsirData = await tafsirRes.json();

        if (arabicData.code === 200 && transData.code === 200) {
           let latinText = '';
           try {
             const latinRes = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayatNumber}/en.transliteration`);
             const latinData = await latinRes.json();
             if (latinData.code === 200) latinText = latinData.data.text;
                     } catch (err) {
                         console.log('Latin fetch failed', err);
                     }

           setAyatData({
             arabic: arabicData.data.text,
             translation: transData.data.text,
             tafsir: tafsirData.code === 200 ? tafsirData.data.text : '',
             surahName: arabicData.data.surah.englishName,
             surahNumber: arabicData.data.surah.number,
             ayatNumber: arabicData.data.numberInSurah,
             latin: latinText
           });
        } else {
          setError(t('error'));
        }
      } catch (err) {
        console.error(err);
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surahNumber, ayatNumber, language]);

  // 2. Initialize Canvas (Run once we have the element)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    // Wait for loading to finish and canvas element to exist
    if (loading) return;
    if (!canvasRef.current || fabricCanvasRef.current) return;

    console.log("Initializing Fabric Canvas...");
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: selectedRatio.width,
      height: selectedRatio.height,
      backgroundColor: '#222831',
      selection: false,
      enableRetinaScaling: true,
      preserveObjectStacking: true
    });

    fabricCanvasRef.current = canvas;
    setFabricCanvas(canvas); // Keep state for re-renders if needed, but rely on ref for logic

    return () => {
      console.log("Disposing Fabric Canvas...");
      canvas.dispose();
      fabricCanvasRef.current = null;
      setFabricCanvas(null);
    };
    }, [loading, selectedRatio.width, selectedRatio.height]); // Run when loading completes and canvas appears

  // 3. Update Content
  const updateCanvasContent = useCallback(async () => {
    console.log("updateCanvasContent called", { showWatermark }); // DEBUG LOG

    // Prefer Ref for latest instance, fallback to state
    const canvas = fabricCanvasRef.current || fabricCanvas;
    if (!canvas) return;
    if (!canvas.width || !canvas.height) return; // Ensure dimensions
    
    // Clear and set background
    canvas.clear();
    canvas.backgroundColor = '#222831';

    if (!ayatData) {
        // Fallback or Loading State
        const text = loading ? t('loading') : (error || t('noData'));
        const infoText = new fabric.Text(text, {
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            originX: 'center',
            originY: 'center',
            fill: '#ffffff',
            fontSize: 30,
            fontFamily: 'sans-serif',
            textAlign: 'center'
        });
        canvas.add(infoText);
        canvas.requestRenderAll();
        return;
    }

    // Use a flag to check if we are still relevant (simple debounce/race condition check)
    const currentRenderId = Date.now();
    (canvas as unknown as { renderId?: number }).renderId = currentRenderId;

    try {
        // Clear immediately
        canvas.clear();
        canvas.backgroundColor = '#222831'; // Default dark bg

        // --- RENDER LAYERS ---
        // 1. Background Image
        // 2. Overlay (Dimmer)
        // 3. Text Content Group (Auto-Fit)

        const resolveAssetUrl = (path: string) => {
            if (/^(data:|blob:|https?:)/.test(path)) return path;
            if (typeof window === 'undefined') return path;
            return `${window.location.origin}${path}`;
        };

        const loadFabricImage = (url: string) =>
            new Promise<fabric.Image>((resolve, reject) => {
                const img = document.createElement('img');
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const fabricImg = new fabric.Image(img);
                    resolve(fabricImg);
                };
                img.onerror = (e) => {
                    reject(new Error(`Failed to load image: ${url}`));
                };
                img.src = url;
            });

        // --- 1. Background Image ---
        if (selectedBg.type === 'image' || selectedBg.type === 'custom') {
            try {
                // Use fabric.Image.fromURL for async loading
                const img = await loadFabricImage(resolveAssetUrl(selectedBg.value as string));

                if ((canvas as any).renderId !== currentRenderId) return;
                
                // Scale Image to Cover Canvas (Object-Fit: Cover)
                const canvasAspect = canvas.width! / canvas.height!;
                const imgAspect = img.width! / img.height!;
                let scaleImg;
                
                if (canvasAspect >= imgAspect) {
                    scaleImg = canvas.width! / img.width!;
                } else {
                    scaleImg = canvas.height! / img.height!;
                }
                
                img.set({
                    scaleX: scaleImg,
                    scaleY: scaleImg,
                    left: canvas.width! / 2,
                    top: canvas.height! / 2,
                    originX: 'center',
                    originY: 'center',
                    opacity: 1,
                    selectable: false,
                    evented: false
                });
                
                // Apply Blur if needed
                if (bgBlur > 0) {
                   // Note: Fabric.js filters might need webgl, skipping complex filters for stability if simple
                   // or we can use a simple blur filter if supported
                   const blurFilter = new fabric.filters.Blur({ blur: bgBlur / 10 });
                   img.filters = [blurFilter];
                   img.applyFilters();
                }

                canvas.add(img);
            } catch (err) {
                console.error("Failed to load bg image", err);
            }
        } else if (selectedBg.type === 'gradient') {
            const gradientColors = selectedBg.value as string[];
            const gradient = new fabric.Gradient({
                type: 'linear',
                coords: { x1: 0, y1: 0, x2: canvas.width!, y2: canvas.height! },
                colorStops: [
                    { offset: 0, color: gradientColors[0] },
                    { offset: 1, color: gradientColors[1] }
                ]
            });
            // Create a rect to hold gradient
            const bgRect = new fabric.Rect({
                width: canvas.width,
                height: canvas.height,
                left: 0,
                top: 0,
                fill: gradient,
                selectable: false,
                evented: false
            });
            canvas.add(bgRect);
        } else if (selectedBg.type === 'solid') {
             const bgRect = new fabric.Rect({
                width: canvas.width,
                height: canvas.height,
                left: 0,
                top: 0,
                fill: selectedBg.value as string,
                selectable: false,
                evented: false
            });
            canvas.add(bgRect);
        }

        // --- 3. Text Content (Smart Layout) ---
        
        // Define Safe Area (Padding)
        const canvasWidth = canvas.width!;
        const canvasHeight = canvas.height!;
        const isPortrait = canvasHeight > canvasWidth;
        const isSquare = canvasHeight === canvasWidth;
        
        // Content Width Logic:
        // Portrait & Square: 85% width
        // Landscape: Max 60% width (Central Column) or 1000px, whichever is smaller
        let contentWidth = (isPortrait || isSquare) ? (canvasWidth * 0.85) : Math.min(canvasWidth * 0.6, 1000);
        
        // Initial Font Sizes (Base Reference: 1080px Width)
        // We calculate a base scale factor relative to 1080px width
        const baseScale = Math.min(canvasWidth, canvasHeight) / 1080; 
        
        let headerFontSize = 40 * baseScale;
        let arabicFontSize = 70 * baseScale; // Bigger Arabic
        let latinFontSize = 32 * baseScale;
        let transFontSize = 28 * baseScale;
        let tafsirFontSize = 24 * baseScale;
        
        // Prepare Text Objects Helper
        const createTextObjects = (scaleMultiplier: number = 1) => {
            const objs: fabric.Object[] = [];
            const spacing = 30 * baseScale * scaleMultiplier; // Vertical gap
            
            // Common shadow/stroke for readability
            const hasShadow = true;
            const shadow = new fabric.Shadow({ color: 'rgba(0,0,0,0.6)', blur: 10, offsetX: 0, offsetY: 2 });

            // Boldness Logic (User requested "semakin bold")
            // Map overlayOpacity (0-1) to strokeWidth (0-3px relative to scale)
            // We use the slider previously for 'Shadow/Overlay' now for 'Boldness'
            const boldStrokeWidth = (overlayOpacity * 2.5) * baseScale * scaleMultiplier;
            
            // 1. Header (Surah Name)
            const headerText = language === 'id' ? `QS. ${ayatData.surahName} : ${ayatData.ayatNumber}` : `${t('surah')} ${ayatData.surahName} : ${ayatData.ayatNumber}`;
            const header = new fabric.Text(headerText, {
                fontSize: headerFontSize * scaleMultiplier,
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                fill: '#ffffff',
                stroke: '#ffffff',
                strokeWidth: boldStrokeWidth,
                originX: 'center',
                originY: 'top',
                shadow: shadow,
                textAlign: 'center'
            });
            objs.push(header);

            // 2. Arabic Text
            const effectiveFont = previewArabicFont.family;
            const arabic = new fabric.Textbox(ayatData.arabic, {
                width: contentWidth,
                fontSize: arabicFontSize * scaleMultiplier,
                fontFamily: effectiveFont,
                textAlign: 'center',
                fill: '#ffffff',
                stroke: '#ffffff',
                strokeWidth: boldStrokeWidth,
                originX: 'center',
                originY: 'top',
                splitByGrapheme: false, // Keep words together
                shadow: shadow
            });
            objs.push(arabic);

            // 3. Latin (Optional)
            if (showLatin && ayatData.latin) {
                const latin = new fabric.Textbox(ayatData.latin, {
                    width: contentWidth,
                    fontSize: latinFontSize * scaleMultiplier,
                    fontFamily: previewLatinFont.family,
                    fontStyle: 'italic',
                    textAlign: 'center',
                    fill: '#6ee7b7', // Emerald-300
                    stroke: '#6ee7b7',
                    strokeWidth: boldStrokeWidth,
                    originX: 'center',
                    originY: 'top',
                    shadow: shadow
                });
                objs.push(latin);
            }

            // 4. Translation (Optional)
            if (showTranslation && ayatData.translation) {
                const trans = new fabric.Textbox(ayatData.translation, {
                    width: contentWidth,
                    fontSize: transFontSize * scaleMultiplier,
                    fontFamily: previewTranslationFont.family,
                    textAlign: 'center',
                    fill: '#e2e8f0', // Slate-200
                    stroke: '#e2e8f0',
                    strokeWidth: boldStrokeWidth,
                    originX: 'center',
                    originY: 'top',
                    shadow: shadow
                });
                objs.push(trans);
            }

            // 5. Tafsir (Optional)
            if (showTafsir && ayatData.tafsir) {
                 const tafsir = new fabric.Textbox(ayatData.tafsir, {
                    width: contentWidth,
                    fontSize: tafsirFontSize * scaleMultiplier,
                    fontFamily: previewTranslationFont.family,
                    textAlign: 'center',
                    fill: '#94a3b8', // Slate-400
                    stroke: '#94a3b8',
                    strokeWidth: boldStrokeWidth,
                    originX: 'center',
                    originY: 'top',
                    shadow: shadow
                });
                objs.push(tafsir);
            }
            
            return { objs, spacing };
        };

        // --- AUTO-FIT LOGIC ---
        // 1. Create objects at scale 1
        // 2. Measure total height
        // 3. If total height > maxSafeHeight, reduce scale and recreate
        
        // Adjust safe height based on orientation
        // Portrait (9:16) needs more vertical padding for Story/TikTok UI (top/bottom bars)
        const safeHeightRatio = isPortrait ? 0.8 : 0.85; 
        const maxSafeHeight = canvasHeight * safeHeightRatio;
        
        let finalScale = 1;
        let layoutGroup: { objs: fabric.Object[], spacing: number } | null = null;
        let measuredHeight = 0;

        // Iteration 1: Check height
        let attempt = createTextObjects(1);
        let currentHeight = attempt.objs.reduce((acc, obj) => acc + obj.getScaledHeight() + attempt.spacing, 0) - attempt.spacing; // minus last spacing
        
        if (currentHeight > maxSafeHeight) {
            // Calculate required scale
            finalScale = maxSafeHeight / currentHeight;
            // Limit minimum scale to avoid unreadable text (e.g. 0.4)
            finalScale = Math.max(finalScale, 0.4);
        }

        // Generate Final Objects with adjusted scale
        layoutGroup = createTextObjects(finalScale);
        measuredHeight = layoutGroup.objs.reduce((acc, obj) => acc + obj.getScaledHeight() + layoutGroup.spacing, 0) - layoutGroup.spacing;

        // --- PLACEMENT (GROUPING) ---
        // Stack objects vertically for the group
        let groupY = 0;
        
        // We set coordinates relative to the group's origin.
        // Fabric Group objects have coordinates relative to the group center (usually).
        // BUT when creating new Group([objs]), it takes their world coordinates.
        // So we position them in the world as if the group was at 0,0 top-left (or anywhere), then group them.
        
        // Let's position them starting at (0,0) in world space.
        layoutGroup.objs.forEach((obj) => {
             obj.set({
                 originX: 'center',
                 originY: 'top',
                 left: 0, 
                 top: groupY
             });
             groupY += obj.getScaledHeight() + layoutGroup.spacing;
        });

        // Create the group
        const mainGroup = new fabric.Group(layoutGroup.objs, {
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: 'center',
            originY: 'center',
            selectable: true, // Allow moving
            hasControls: true, // Allow resizing/rotation
            subTargetCheck: false, // Move as one unit
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,
        });

        canvas.add(mainGroup);
        canvas.setActiveObject(mainGroup); // Auto-select the group for better UX
        
        // Render text immediately before watermark loading
        canvas.requestRenderAll();
        
        // Remove any existing watermark objects (identified by custom property)
        // Note: We can't easily query by custom property in Fabric 7 without subclassing or iterating
        // But we can clear everything and redraw, which we did with canvas.clear()
        // If we are appending, we don't need to remove specifically if we cleared the canvas.
        // However, if we want to toggle watermark without clearing everything, we would need to track objects.
        // For now, updateCanvasContent clears everything so we are good.

        // Add Branding/Watermark (Bottom Left - Logo + Text)
        if (showWatermark) {
            // Check renderId to ensure we are still on the same render cycle
            if ((canvas as any).renderId !== currentRenderId) return;

            // Use preloaded image if available, otherwise path
            const logoSource = watermarkImageRef.current || WATERMARK_ASSET_PATH;

            await addWatermark(
                canvas, 
                t('watermarkBrand'), 
                logoSource,
                {
                    width: canvas.width || selectedRatio.width,
                    height: canvas.height || selectedRatio.height
                }
            );
        }

        canvas.requestRenderAll();

    } catch (err) {
        console.error("Canvas Render Error:", err);
    }
  }, [ayatData, selectedRatio, selectedBg, showLatin, showTranslation, showTafsir, showWatermark, overlayOpacity, bgBlur, previewArabicFont, previewLatinFont, previewTranslationFont, loading, error, language, t]);

  // Handle Resize via setDimensions
  useEffect(() => {
      if (fabricCanvasRef.current) {
          const width = Math.max(1, selectedRatio.width || 1);
          const height = Math.max(1, selectedRatio.height || 1);
          
          try {
              fabricCanvasRef.current.setDimensions({
                  width: width,
                  height: height
              });
              fabricCanvasRef.current.requestRenderAll();
              updateCanvasContent(); // Trigger update on resize
          } catch (err) {
              console.error("Error resizing canvas:", err);
          }
      }
  }, [selectedRatio, updateCanvasContent]);



  // Handle Font Loading and Refresh
  useEffect(() => {
    const loadFontsAndRender = async () => {
        const fontsToLoad = [previewArabicFont, previewLatinFont, previewTranslationFont];
        
        const promises = fontsToLoad.map(async (fontObj) => {
            if (fontObj.url) {
                const linkId = `font-${fontObj.id.replace(/\s+/g, '-')}`;
                if (!document.getElementById(linkId)) {
                    const link = document.createElement('link');
                    link.id = linkId;
                    link.href = fontObj.url;
                    link.rel = 'stylesheet';
                    document.head.appendChild(link);
                }
                
                try {
                    // Wait for font to load to ensure Fabric renders it correctly
                    await document.fonts.load(`1em "${fontObj.family}"`);
                } catch (e) {
                    console.error(`Font load failed for ${fontObj.family}`, e);
                }
            }
        });

        await Promise.all(promises);
        updateCanvasContent();
    };

    loadFontsAndRender();
  }, [previewArabicFont, previewLatinFont, previewTranslationFont, updateCanvasContent]);


  // Actions
  const handleDownload = () => {
      if (!fabricCanvas || !ayatData) return;

      const fileName = `QS_${ayatData.surahName}_${ayatData.ayatNumber}.${selectedFormat}`;
      let dataURL;

      if (selectedFormat === 'svg') {
          const svgContent = fabricCanvas.toSVG();
          const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
          dataURL = URL.createObjectURL(blob);
      } else {
          const format = selectedFormat === 'jpeg' ? 'jpeg' : (selectedFormat === 'webp' ? 'webp' : 'png');
          dataURL = fabricCanvas.toDataURL({
              format: format as unknown as fabric.ImageFormat,
              quality: 1,
              multiplier: 1
          });
      }

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataURL;
      link.click();
      
      if (selectedFormat === 'svg') {
          setTimeout(() => URL.revokeObjectURL(dataURL), 100);
      }
  };

  const handleShare = async () => {
        if (!fabricCanvas || !ayatData) return;
    
        // Show share options using SweetAlert2
        const result = await Swal.fire({
            title: t('share'),
            html: `
                <div class="grid grid-cols-3 gap-3">
                    <button id="share-native" class="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        </div>
                        <span class="text-[10px] font-medium text-gray-700 dark:text-gray-300">${t('shareOption')}</span>
                    </button>
                    <button id="share-wa" class="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                         <div class="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                        </div>
                        <span class="text-[10px] font-medium text-gray-700 dark:text-gray-300">WhatsApp</span>
                    </button>
                    <button id="share-twitter" class="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <div class="w-10 h-10 bg-black dark:bg-black rounded-full flex items-center justify-center text-white mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
                        </div>
                        <span class="text-[10px] font-medium text-gray-700 dark:text-gray-300">X / Twitter</span>
                    </button>
                    <button id="share-telegram" class="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <div class="w-10 h-10 bg-[#0088cc] rounded-full flex items-center justify-center text-white mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.213-2.936 1.192z"/></svg>
                        </div>
                        <span class="text-[10px] font-medium text-gray-700 dark:text-gray-300">Telegram</span>
                    </button>
                    <button id="share-facebook" class="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <div class="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
                        </div>
                        <span class="text-[10px] font-medium text-gray-700 dark:text-gray-300">Facebook</span>
                    </button>
                    <button id="copy-link" class="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white mb-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        </div>
                        <span class="text-[10px] font-medium text-gray-700 dark:text-gray-300">${t('copyLink')}</span>
                    </button>
                    <button id="copy-image" class="col-span-3 flex flex-row items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors gap-2">
                        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </div>
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">${t('copyImageClipboard')}</span>
                    </button>
                </div>
                <div class="mt-4 text-[10px] text-gray-400">
                    ${t('shareHint')}
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            background: document.documentElement.classList.contains('dark') ? '#222831' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
            didOpen: () => {
                // Native Share
                document.getElementById('share-native')?.addEventListener('click', async () => {
                    try {
                        setIsProcessing(true);
                        const dataURL = fabricCanvas.toDataURL({ format: 'png', quality: 0.95, multiplier: 1 });
                        const blob = await (await fetch(dataURL)).blob();
                        const file = new File([blob], 'quote.png', { type: 'image/png' });
                        
                        if (navigator.share) {
                            await navigator.share({
                                title: t('shareNativeTitle').replace('{surah}', ayatData.surahName || '').replace('{ayat}', String(ayatData.ayatNumber)),
                                text: t('shareNativeText').replace('{translation}', ayatData.translation || '').replace('{url}', window.location.href),
                                files: [file]
                            });
                            Swal.close();
                        } else {
                            Swal.fire({
                                icon: 'info',
                                title: 'Not Supported',
                                text: 'Web Share API is not supported on this browser. Please use Download or Copy Image.',
                                background: document.documentElement.classList.contains('dark') ? '#222831' : '#fff',
                                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                            });
                        }
                    } catch (err) {
                        console.error(err);
                    } finally {
                        setIsProcessing(false);
                    }
                });

                // WhatsApp (Text Link)
                document.getElementById('share-wa')?.addEventListener('click', () => {
                    const text = t('shareWaText')
                        .replace('{surah}', ayatData.surahName || '')
                        .replace('{ayat}', String(ayatData.ayatNumber))
                        .replace('{translation}', ayatData.translation || '')
                        .replace('{url}', window.location.href);
                    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                    window.open(url, '_blank');
                    Swal.close();
                });

                // Twitter / X
                document.getElementById('share-twitter')?.addEventListener('click', () => {
                    const title = t('shareNativeTitle').replace('{surah}', ayatData.surahName || '').replace('{ayat}', String(ayatData.ayatNumber));
                    const body = t('shareNativeText').replace('{translation}', ayatData.translation || '').replace('{url}', window.location.href);
                    const text = `${title}\n${body}`;
                    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                    window.open(url, '_blank');
                    Swal.close();
                });

                // Telegram
                document.getElementById('share-telegram')?.addEventListener('click', () => {
                    const title = t('shareNativeTitle').replace('{surah}', ayatData.surahName || '').replace('{ayat}', String(ayatData.ayatNumber));
                    const text = `${title}\n"${ayatData.translation}"`;
                    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
                    window.open(url, '_blank');
                    Swal.close();
                });

                // Facebook
                document.getElementById('share-facebook')?.addEventListener('click', () => {
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                    window.open(url, '_blank');
                    Swal.close();
                });
               // Copy Link
                document.getElementById('copy-link')?.addEventListener('click', async () => {
                    try {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(window.location.href);
                        } else {
                            // Fallback for insecure contexts (HTTP)
                            const textArea = document.createElement("textarea");
                            textArea.value = window.location.href;
                            textArea.style.position = "fixed"; // Avoid scrolling to bottom
                            document.body.appendChild(textArea);
                            textArea.focus();
                            textArea.select();
                            try {
                                document.execCommand('copy');
                            } catch (err) {
                                console.error('Fallback copy failed', err);
                                throw new Error('Copy failed');
                            }
                            document.body.removeChild(textArea);
                        }
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Link Copied!',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 1500,
                            background: document.documentElement.classList.contains('dark') ? '#222831' : '#fff',
                            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                        });
                    } catch (err) {
                        console.error(err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Gagal menyalin link.',
                            background: document.documentElement.classList.contains('dark') ? '#222831' : '#fff',
                            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                        });
                    }
                });

                // Copy Image
                document.getElementById('copy-image')?.addEventListener('click', async () => {
                    // Check for Clipboard API support (requires HTTPS)
                    if (!navigator.clipboard || !navigator.clipboard.write) {
                        Swal.fire({
                            icon: 'info',
                            title: 'Fitur Terbatas',
                            text: 'Fitur Salin Gambar memerlukan koneksi aman (HTTPS) atau localhost. Karena Anda mengakses via IP Address, silakan gunakan tombol Download sebagai gantinya.',
                            background: document.documentElement.classList.contains('dark') ? '#222831' : '#fff',
                            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                        });
                        return;
                    }

                    try {
                        const dataURL = fabricCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
                        const blob = await (await fetch(dataURL)).blob();
                        await navigator.clipboard.write([
                            new ClipboardItem({
                                [blob.type]: blob
                            })
                        ]);
                        Swal.fire({
                            icon: 'success',
                            title: 'Image Copied!',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 1500,
                            background: document.documentElement.classList.contains('dark') ? '#222831' : '#fff',
                            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                        });
                    } catch (err) {
                        console.error('Copy image failed:', err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Maaf',
                            text: 'Gagal menyalin gambar. Silakan coba tombol Download.',
                            background: document.documentElement.classList.contains('dark') ? '#222831' : '#fff',
                            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                        });
                    }
                });
            }
        });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#1a1c23] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">{t('loading')}</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#1a1c23] gap-4">
        <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full text-red-500">
            <RefreshCw className="w-8 h-8" />
        </div>
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
            {t('retry')}
        </button>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 dark:bg-[#1a1c23] flex flex-col lg:flex-row font-sans overflow-hidden relative">
        {/* DEBUG: Verify Image Loads */}
        <div style={{ position: 'absolute', zIndex: 9999, top: 0, left: 0, background: 'white', padding: '5px', display: 'none' }}>
            <p className="text-xs text-black">Debug Watermark:</p>
            <img src={WATERMARK_ASSET_PATH} alt="Debug WM" width={50} height={50} style={{ border: '1px solid red' }} />
        </div>

        {/* Mobile Toggle Button */}
        <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-[#222831] p-3 rounded-r-xl shadow-lg border border-l-0 border-gray-200 dark:border-gray-800 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-all"
            aria-label="Toggle Sidebar"
        >
            {isMobileSidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>

        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-200"
                onClick={() => setIsMobileSidebarOpen(false)}
            />
        )}

        {/* Sidebar Controls */}
        <div className={cn(
            "w-[85vw] max-w-[400px] lg:w-[400px] bg-white dark:bg-[#222831] border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto p-6 relative z-40 shadow-xl scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 flex-shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 fixed lg:relative",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-white" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">{t('imageEditor')}</h1>
                    {ayatData && (
                        <p className="text-xs text-emerald-500 font-medium">QS. {ayatData.surahName} : {ayatData.ayatNumber}</p>
                    )}
                </div>
            </div>

            {/* 1. Aspect Ratio */}
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <Layout className="w-4 h-4" /> {t('aspectRatio')}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {ASPECT_RATIOS.map((ratio) => {
                        const isSelected = selectedRatio.id === ratio.id;
                        const ratioValue = ratio.width / ratio.height;
                        const portraitLongSide = (ratio as unknown as { previewLongSide?: number }).previewLongSide ?? 96;
                        const landscapeLongSide = 76;
                        const maxSide = ratioValue >= 1 ? landscapeLongSide : portraitLongSide;
                        const displayWidth = ratioValue >= 1 ? maxSide : maxSide * ratioValue;
                        const displayHeight = ratioValue >= 1 ? maxSide / ratioValue : maxSide;

                        return (
                            <button
                                key={ratio.id}
                                onClick={() => {
                                    if (ratio.id === 'custom') {
                                        setSelectedRatio({
                                            ...ratio,
                                            width: Number(customDimensions.width) || 1080,
                                            height: Number(customDimensions.height) || 1080
                                        });
                                    } else {
                                        setSelectedRatio(ratio);
                                    }
                                }}
                                aria-pressed={isSelected}
                                className={cn(
                                    "p-3 rounded-xl border transition-all backdrop-blur-sm shadow-sm flex flex-col gap-2",
                                    "hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md",
                                    isSelected
                                        ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-900/20"
                                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-gray-900/40"
                                )}
                            >
                                <div className="flex items-center justify-center">
                                    <div
                                        className={cn(
                                            "relative flex items-center justify-center rounded-md border text-[10px] font-semibold uppercase tracking-wide",
                                            isSelected
                                                ? "border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                                                : "border-gray-300 dark:border-gray-700 bg-gray-200/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200"
                                        )}
                                        style={{ width: displayWidth, height: displayHeight }}
                                    >
                                        {ratio.label}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-semibold">{ratio.label}</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                        {ratio.width}×{ratio.height}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
                
                {selectedRatio.id === 'custom' && (
                    <div className="mt-4 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{t('widthPx')}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={customDimensions.width}
                                    onChange={(e) => handleCustomDimensionChange('width', e.target.value)}
                                    className="w-full p-2 pl-3 pr-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">px</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{t('heightPx')}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={customDimensions.height}
                                    onChange={(e) => handleCustomDimensionChange('height', e.target.value)}
                                    className="w-full p-2 pl-3 pr-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">px</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Backgrounds */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> {t('background')}
                    </h3>
                    <span className="text-xs text-emerald-500 font-medium">{BACKGROUNDS.filter(b => b.category === activeCategory).length} {t('choices')}</span>
                </div>
                
                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                    {Array.from(new Set(BACKGROUNDS.map(b => b.category))).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                                activeCategory === cat
                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                        >
                            {categoryLabel(cat)}
                        </button>
                    ))}
                     <button
                        onClick={() => setActiveCategory('Custom')}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                            activeCategory === 'Custom'
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        {t('Custom')}
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {activeCategory === 'Custom' ? (
                         <div className="col-span-3">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group"
                            >
                                <Upload className="w-8 h-8 text-gray-400 group-hover:text-emerald-500 mb-2 transition-colors" />
                                <span className="text-xs text-gray-500 group-hover:text-emerald-500 text-center">{t('uploadImage')}</span>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileUpload}
                                    className="hidden" 
                                />
                            </div>
                            {customBg && (
                                <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-emerald-500">
                                    <img src={customBg} alt="Custom" className="w-full h-full object-cover" />
                                </div>
                            )}
                         </div>
                    ) : (
                        BACKGROUNDS.filter(b => b.category === activeCategory).map((bg) => (
                            <button
                                key={bg.id}
                                onClick={() => setSelectedBg(bg)}
                                className={cn(
                                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-all group",
                                    selectedBg.id === bg.id
                                        ? "border-emerald-500 ring-2 ring-emerald-500/20"
                                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                )}
                            >
                                {bg.type === 'image' && (
                                    <img 
                                        src={bg.value as string} 
                                        alt={bg.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                )}
                                {bg.type === 'gradient' && (
                                    <div 
                                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        style={{ background: `linear-gradient(to bottom right, ${(bg.value as string[])[0]}, ${(bg.value as string[])[1]})` }} 
                                    />
                                )}
                                {bg.type === 'solid' && (
                                    <div 
                                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundColor: bg.value as string }} 
                                    />
                                )}
                                {selectedBg.id === bg.id && (
                                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                        <div className="bg-emerald-500 rounded-full p-1">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* 2b. Font Styles */}
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <Type className="w-4 h-4" /> {t('fontStyles')}
                </h3>
                
                {/* Arabic Font */}
                <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <label className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2 block flex items-center justify-between">
                        <span>{t('arabicFontAyah')}</span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-300">{t('primary')}</span>
                    </label>
                    <select
                        value={previewArabicFont.id}
                        onChange={(e) => {
                            const font = ARABIC_FONTS.find(f => f.id === e.target.value);
                            if (font) setPreviewArabicFont(font);
                        }}
                        className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500"
                    >
                        {ARABIC_FONTS.map(font => (
                            <option key={font.id} value={font.id}>{font.name}</option>
                        ))}
                    </select>
                </div>

                {/* Latin Font */}
                <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-2 block">{t('latinTransliterationFont')}</label>
                    <select
                        value={previewLatinFont.id}
                        onChange={(e) => {
                            const font = LATIN_FONTS.find(f => f.id === e.target.value);
                            if (font) setPreviewLatinFont(font);
                        }}
                        className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500"
                    >
                        {LATIN_FONTS.map(font => (
                            <option key={font.id} value={font.id}>{font.name}</option>
                        ))}
                    </select>
                </div>

                {/* Translation Font */}
                <div>
                    <label className="text-xs text-gray-500 mb-2 block">{t('translationFont')}</label>
                    <select
                        value={previewTranslationFont.id}
                        onChange={(e) => {
                            const font = LATIN_FONTS.find(f => f.id === e.target.value);
                            if (font) setPreviewTranslationFont(font);
                        }}
                        className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500"
                    >
                        {LATIN_FONTS.map(font => (
                            <option key={font.id} value={font.id}>{font.name}</option>
                        ))}
                    </select>
                </div>
            </div>

           {/* Visual Adjustments */}
           <div className="mb-8">
               <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                   <Layout className="w-4 h-4" /> {t('appearance')}
               </h3>
               <div className="space-y-4 p-4 rounded-xl bg-gray-50 dark:bg-[#1a1c23]">
                   <div className="space-y-2">
                       <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                           <span>{t('blur')}</span>
                           <span>{bgBlur}</span>
                       </div>
                       <input 
                         type="range" 
                         min="0" 
                         max="10" 
                         value={bgBlur} 
                         onChange={(e) => setBgBlur(Number(e.target.value))}
                         className="w-full accent-emerald-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                       />
                   </div>
                   <div className="space-y-2">
                       <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                           <span>{t('textBoldness')}</span>
                           <span>{Math.round(overlayOpacity * 100)}%</span>
                       </div>
                       <input 
                         type="range" 
                         min="0" 
                         max="100" 
                         value={overlayOpacity * 100} 
                         onChange={(e) => setOverlayOpacity(Number(e.target.value) / 100)}
                         className="w-full accent-emerald-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                       />
                   </div>
               </div>
           </div>

           {/* 3. Content Toggles */}
           <div className="mb-8">
               <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                   <Type className="w-4 h-4" /> {t('content')}
               </h3>
               <div className="space-y-2">
                   <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1a1c23] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                       <span className="text-sm text-gray-700 dark:text-gray-200">{t('transliteration')}</span>
                       <input type="checkbox" checked={showLatin} onChange={(e) => setShowLatin(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                   </label>
                   <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1a1c23] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                       <span className="text-sm text-gray-700 dark:text-gray-200">{t('translation')}</span>
                       <input type="checkbox" checked={showTranslation} onChange={(e) => setShowTranslation(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                   </label>
                   <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1a1c23] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                       <span className="text-sm text-gray-700 dark:text-gray-200">{t('tafsir')}</span>
                       <input type="checkbox" checked={showTafsir} onChange={(e) => setShowTafsir(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                   </label>
                   <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1a1c23] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="text-sm text-gray-700 dark:text-gray-200">{t('showWatermark')}</span>
                        <input 
                            type="checkbox" 
                            checked={showWatermark} 
                            onChange={(e) => setShowWatermark(e.target.checked)} 
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
               </div>
           </div>

           {/* 4. Format & Actions */}
           <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('downloadFormat')}</h3>
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        {FORMATS.map(f => (
                            <button
                                key={f.id}
                                onClick={() => setSelectedFormat(f.id)}
                                className={cn(
                                    "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                                    selectedFormat === f.id 
                                        ? "bg-white dark:bg-[#222831] text-emerald-600 dark:text-emerald-400 shadow-sm" 
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                                )}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

               <div className="grid grid-cols-2 gap-3">
                   <button onClick={handleShare} disabled={isProcessing} className="flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl transition-colors font-medium">
                       {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                       {t('share')}
                   </button>
                   <button onClick={handleDownload} className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-emerald-600/20">
                       <Download className="w-4 h-4" />
                       {t('download')}
                   </button>
               </div>
           </div>
       </div>

       {/* Canvas Preview Area */}
       <div ref={containerRef} className="flex-1 w-full h-full bg-gray-100 dark:bg-[#0f1115] flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden relative">
           
           <div 
             className="shadow-2xl rounded-sm overflow-hidden border-4 lg:border-8 border-white dark:border-[#222831] bg-[#222831] transition-transform duration-300 ease-out origin-center"
             style={{ 
                 transform: `scale(${scale})`
             }}
           >
               <canvas ref={canvasRef} />
           </div>
       </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1a1c23]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
