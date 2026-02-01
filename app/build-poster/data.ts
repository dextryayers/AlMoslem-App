
import { Square, RectangleHorizontal, Monitor, Layout, Circle, Triangle, Star, Hexagon, Heart } from 'lucide-react';

// Enhanced Assets with More Options
export const BACKGROUNDS = [
  // Masjids (Islamic Architecture)
  { id: 'masjid1', name: 'Masjid Sunset', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/flagged/photo-1558113118-e42e558b352a?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid2', name: 'Masjid Blue', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1511091734515-e50d46c37240?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid3', name: 'Masjid Arch', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1572358899655-f63ece97bfa5?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid4', name: 'Masjid White', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1592326871020-04f58c1a52f3?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid5', name: 'Masjid Dome', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid6', name: 'Masjid Night', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1920&q=80' },
  { id: 'masjid7', name: 'Masjid Interior', category: 'Masjid', type: 'image', value: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1920&q=80' },

  // Nature/Sky
  { id: 'alam1', name: 'Forest Mist', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1604093882750-3ed498f3178b?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam2', name: 'Blue Sky', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1610123598147-f632aa18b275?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam3', name: 'Mountains', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1613502719343-267bfb1fc7ed?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam4', name: 'Desert Dunes', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1920&q=80' },
  { id: 'alam5', name: 'Starry Night', category: 'Alam', type: 'image', value: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80' },

  // Abstract/Textures
  { id: 'abstract1', name: 'White Marble', category: 'Texture', type: 'image', value: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1920&q=80' },
  { id: 'abstract2', name: 'Paper Texture', category: 'Texture', type: 'image', value: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1920&q=80' },
  { id: 'abstract3', name: 'Dark Slate', category: 'Texture', type: 'image', value: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=1920&q=80' },

  // Flowers
  { id: 'bunga1', name: 'White Flowers', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=1920&q=80' },
  { id: 'bunga2', name: 'Dried Flowers', category: 'Bunga', type: 'image', value: 'https://images.unsplash.com/photo-1474112704314-8162b7749a90?auto=format&fit=crop&w=1920&q=80' },
  
  // Gradients
  { id: 'gradient1', name: 'Emerald', category: 'Gradient', type: 'gradient', value: ['#10b981', '#134e4a'] },
  { id: 'gradient2', name: 'Ocean', category: 'Gradient', type: 'gradient', value: ['#3b82f6', '#1e3a8a'] },
  { id: 'gradient3', name: 'Royal', category: 'Gradient', type: 'gradient', value: ['#8b5cf6', '#4c1d95'] },
  { id: 'gradient4', name: 'Sunset', category: 'Gradient', type: 'gradient', value: ['#f59e0b', '#b45309'] },
  { id: 'gradient5', name: 'Rose', category: 'Gradient', type: 'gradient', value: ['#f43f5e', '#881337'] },
  { id: 'gradient6', name: 'Midnight', category: 'Gradient', type: 'gradient', value: ['#0f172a', '#334155'] },
  
  // Solid
  { id: 'dark', name: 'Dark', category: 'Solid', type: 'solid', value: '#222831' },
  { id: 'light', name: 'Light', category: 'Solid', type: 'solid', value: '#f8fafc' },
  { id: 'cream', name: 'Cream', category: 'Solid', type: 'solid', value: '#fff7ed' },
];

export const SHAPES = [
    { id: 'rect', label: 'Rectangle', icon: Square, type: 'rect' },
    { id: 'circle', label: 'Circle', icon: Circle, type: 'circle' },
    { id: 'triangle', label: 'Triangle', icon: Triangle, type: 'triangle' },
    // { id: 'star', label: 'Star', icon: Star, type: 'polygon' }, // Requires complex logic for star
];

export const ELEMENTS = [
    { id: 'frame1', name: 'Simple Border', category: 'Frame', type: 'svg', value: '<svg width="100" height="100"><rect x="5" y="5" width="90" height="90" fill="none" stroke="black" stroke-width="2"/></svg>' },
    { id: 'line', name: 'Line', category: 'Line', type: 'line' },
];

export const WATERMARKS = [
    { id: 'logo_text', label: 'Al-Moslem Logo', type: 'text', value: 'Al-Moslem App', options: { fontSize: 20, opacity: 0.5, fontWeight: 'bold' } },
    { id: 'copyright', label: 'Copyright', type: 'text', value: '© 2024 Al-Moslem', options: { fontSize: 16, opacity: 0.5 } },
    // Add image watermarks if available
];

export const ASPECT_RATIOS = [
    { id: '1:1', label: '1:1', width: 1080, height: 1080, icon: Square, desc: 'IG Feed Square' },
    { id: '16:9', label: '16:9', width: 1920, height: 1080, icon: Monitor, desc: 'YouTube / Desktop' },
    { id: '4:3', label: '4:3', width: 1440, height: 1080, icon: Monitor, desc: 'Classic 4:3' },
    { id: '9:16', label: '9:16', width: 1080, height: 1920, icon: RectangleHorizontal, desc: 'IG Story / TikTok' },
    { id: 'custom', label: 'Custom', width: 1080, height: 1080, icon: Layout, desc: 'Custom Size' },
];

export const FONTS = [
    { id: 'LPMQ Isep Misbah', name: 'LPMQ (Arabic)', family: 'LPMQ Isep Misbah' },
    { id: 'IndoPak', name: 'IndoPak (Arabic)', family: 'IndoPak' },
    { id: 'Utsmani', name: 'Utsmani (Arabic)', family: 'Utsmani' },
    { id: 'Inter', name: 'Inter', family: 'Inter' },
    { id: 'Roboto', name: 'Roboto', family: 'Roboto' },
    { id: 'Open Sans', name: 'Open Sans', family: 'Open Sans' },
    { id: 'Montserrat', name: 'Montserrat', family: 'Montserrat' },
    { id: 'Playfair Display', name: 'Playfair (Serif)', family: 'Playfair Display' },
    { id: 'Amiri', name: 'Amiri', family: 'Amiri' },
    { id: 'Scheherazade New', name: 'Scheherazade', family: 'Scheherazade New' },
];
