'use client';

import { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { useSettings } from '../context/SettingsContext';

export default function CookieConsentBanner() {
  const { t } = useSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Wait for 5 seconds (Loading Screen duration + buffer)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText={t('cookieAgree')}
      cookieName="qquran-cookie-consent"
      style={{ background: "#2D333B", borderTop: "1px solid #374151" }}
      buttonStyle={{ 
        color: "#fff", 
        background: "#10B981", 
        fontSize: "14px", 
        borderRadius: "8px",
        padding: "10px 20px",
        fontWeight: "600"
      }}
      expires={150}
      containerClasses="flex items-center justify-between gap-4 p-4 shadow-2xl z-[9999]"
      contentClasses="text-gray-300 text-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <span className="text-lg">🍪</span>
        <div>
          <span className="font-semibold text-white block sm:inline mr-2">{t('cookieTitle')}</span>
          {t('cookieDesc')}
        </div>
      </div>
    </CookieConsent>
  );
}
