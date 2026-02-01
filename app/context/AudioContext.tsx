'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';

type Qari = '01' | '02' | '03' | '04' | '05' | '06';

export const QARI_LIST = [
  { id: '01', name: 'Abdullah Al-Juhany' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim' },
  { id: '03', name: 'Abdurrahman As-Sudais' },
  { id: '04', name: 'Ibrahim Al-Dossari' },
  { id: '05', name: 'Misyari Rasyid Al-Afasy' },
  { id: '06', name: 'Yasser Al-Dosari' },
];

interface AudioContextType {
  isPlaying: boolean;
  currentAudioSrc: string | null;
  activeId: string | null;
  selectedQari: Qari;
  playAudio: (src: string, id?: string) => void;
  pauseAudio: () => void;
  setQari: (qari: Qari) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  setPlaylist: (urls: string[]) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedQari, setSelectedQari] = useState<Qari>('05'); // Default Misyari
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<string[]>([]);
  const currentSrcRef = useRef<string | null>(null);
  const isPlayingRef = useRef(false);
  const pathname = usePathname();

  // Sync refs with state
  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    currentSrcRef.current = currentAudioSrc;
  }, [currentAudioSrc]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Stop audio on route change (navigation)
  useEffect(() => {
    // We only want to stop audio if we are navigating away from a playing context.
    // However, the requirement is "saat sudah keluar dari surah nya maka audio otomatis mati".
    // This implies any navigation should stop the audio.
    // Checking if audio exists and is playing before stopping.
    if (audioRef.current && !audioRef.current.paused) {
      pauseAudio();
      // Optionally reset playlist or current source if we want a complete "stop"
      // setCurrentAudioSrc(null); 
    }
  }, [pathname]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.playbackRate = playbackSpeed;
    
    // Handle auto-play next track
    audioRef.current.onended = () => {
      const currentSrc = currentSrcRef.current;
      const currentPlaylist = playlistRef.current;
      
      if (currentSrc && currentPlaylist.length > 0) {
        const currentIndex = currentPlaylist.indexOf(currentSrc);
        if (currentIndex !== -1 && currentIndex < currentPlaylist.length - 1) {
          const nextSrc = currentPlaylist[currentIndex + 1];
          // We can't call playAudio directly if it's not stable or depends on state in a way that matters.
          // But here we just need to set src and play.
          if (audioRef.current) {
             audioRef.current.src = nextSrc;
             audioRef.current.play();
             setCurrentAudioSrc(nextSrc);
             setIsPlaying(true);
             return;
          }
        }
      }
      setIsPlaying(false);
      setCurrentAudioSrc(null);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Removed redundant effect for onended re-binding
  // useEffect(() => { ... }, [playlist, currentAudioSrc]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const playAudio = useCallback((src: string, id?: string) => {
    if (!audioRef.current) return;

    if (currentSrcRef.current === src && isPlayingRef.current) {
      // If clicking same audio that is playing, pause it
      pauseAudio();
      return;
    }

    if (id) {
      setActiveId(id);
    }

    if (currentSrcRef.current !== src) {
      audioRef.current.src = src;
      setCurrentAudioSrc(src);
    }

    audioRef.current.play();
    setIsPlaying(true);
  }, [pauseAudio]);

  const setQari = useCallback((qari: Qari) => {
    setSelectedQari(qari);
    // Stop audio if changing qari
    pauseAudio();
    setCurrentAudioSrc(null);
    setActiveId(null);
  }, [pauseAudio]);

  const handleSetPlaybackSpeed = useCallback((speed: number) => setPlaybackSpeed(speed), []);
  const handleSetVolume = useCallback((vol: number) => setVolume(vol), []);
  const handleSetPlaylist = useCallback((urls: string[]) => setPlaylist(urls), []);

  const value = useMemo(() => ({
    isPlaying,
    currentAudioSrc,
    activeId,
    selectedQari,
    playAudio,
    pauseAudio,
    setQari,
    playbackSpeed,
    setPlaybackSpeed: handleSetPlaybackSpeed,
    volume,
    setVolume: handleSetVolume,
    setPlaylist: handleSetPlaylist,
  }), [
    isPlaying,
    currentAudioSrc,
    activeId,
    selectedQari,
    playAudio,
    pauseAudio,
    setQari,
    playbackSpeed,
    handleSetPlaybackSpeed,
    volume,
    handleSetVolume,
    handleSetPlaylist
  ]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
