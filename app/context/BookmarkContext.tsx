'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ayat } from '../types';

export interface Bookmark {
  id: string; // format: surahNumber:ayatNumber
  surahNumber: number;
  surahName: string;
  ayatNumber: number;
  ayat: Ayat;
  timestamp: number;
}

export interface LastRead {
  surahNumber: number;
  surahName: string;
  ayatNumber: number;
  ayat: Ayat;
  timestamp: number;
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (surahNumber: number, surahName: string, ayat: Ayat) => void;
  removeBookmark: (surahNumber: number, ayatNumber: number) => void;
  clearBookmarks: () => void;
  isBookmarked: (surahNumber: number, ayatNumber: number) => boolean;
  lastRead: LastRead | null;
  lastReadHistory: LastRead[];
  setLastRead: (surahNumber: number, surahName: string, ayat: Ayat) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<LastRead | null>(null);
  const [lastReadHistory, setLastReadHistory] = useState<LastRead[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quran-bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Failed to parse bookmarks', e);
      }
    }

    const savedLastRead = localStorage.getItem('quran-last-read');
    if (savedLastRead) {
      try {
        setLastReadState(JSON.parse(savedLastRead));
      } catch (e) {
        console.error('Failed to parse last read', e);
      }
    }

    const savedHistory = localStorage.getItem('quran-last-read-history');
    if (savedHistory) {
      try {
        setLastReadHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse last read history', e);
      }
    } else if (savedLastRead) {
      // Migrate old single last read to history
      try {
        const oldLastRead = JSON.parse(savedLastRead);
        setLastReadHistory([oldLastRead]);
      } catch (e) {}
    }
  }, []);

  // Save to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Save to localStorage whenever lastRead changes
  useEffect(() => {
    if (lastRead) {
      localStorage.setItem('quran-last-read', JSON.stringify(lastRead));
    }
  }, [lastRead]);

  // Save history
  useEffect(() => {
    localStorage.setItem('quran-last-read-history', JSON.stringify(lastReadHistory));
  }, [lastReadHistory]);

  const addBookmark = (surahNumber: number, surahName: string, ayat: Ayat) => {
    const id = `${surahNumber}:${ayat.nomorAyat}`;
    if (bookmarks.some(b => b.id === id)) return;

    const newBookmark: Bookmark = {
      id,
      surahNumber,
      surahName,
      ayatNumber: ayat.nomorAyat,
      ayat,
      timestamp: Date.now(),
    };

    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const removeBookmark = (surahNumber: number, ayatNumber: number) => {
    const id = `${surahNumber}:${ayatNumber}`;
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const clearBookmarks = () => {
    setBookmarks([]);
  };

  const isBookmarked = (surahNumber: number, ayatNumber: number) => {
    return bookmarks.some(b => b.id === `${surahNumber}:${ayatNumber}`);
  };

  const setLastRead = (surahNumber: number, surahName: string, ayat: Ayat) => {
    const newLastRead = {
      surahNumber,
      surahName,
      ayatNumber: ayat.nomorAyat,
      ayat,
      timestamp: Date.now(),
    };

    setLastReadState(newLastRead);
    
    setLastReadHistory(prev => {
      // Remove duplicates (same surah and ayat)
      const filtered = prev.filter(item => 
        !(item.surahNumber === surahNumber && item.ayatNumber === ayat.nomorAyat)
      );
      // Add new to top, keep max 50
      return [newLastRead, ...filtered].slice(0, 50);
    });
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        clearBookmarks,
        isBookmarked,
        lastRead,
        lastReadHistory,
        setLastRead,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
}
