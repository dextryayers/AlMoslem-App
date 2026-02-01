'use client';

import { AudioProvider } from './context/AudioContext';
import { SettingsProvider } from './context/SettingsContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SettingsProvider>
          <BookmarkProvider>
            <AudioProvider>
              {children}
            </AudioProvider>
          </BookmarkProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
