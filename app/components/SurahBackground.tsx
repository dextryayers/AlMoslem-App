'use client';

import { useSettings } from '../context/SettingsContext';
import { useEffect, useState } from 'react';

export default function SurahBackground() {
  const { backgroundImage, backgroundOpacity } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !backgroundImage) return null;

  return (
    <div 
      className="fixed inset-0 z-[-1] pointer-events-none transition-opacity duration-500"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        opacity: backgroundOpacity
      }}
    />
  );
}
