import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrayerStore } from '@/store/prayerStore';

/**
 * Audio architecture.
 *
 * Recordings live in /public/audio and are only used when listed in
 * /public/audio/manifest.json:  { "available": ["fatiha.mp3", ...] }
 * Nothing is fetched until a recitation with a listed file is played, so no audio
 * is downloaded up front and missing files never produce errors or fake audio.
 */
let manifestPromise: Promise<Set<string>> | null = null;

function loadManifest(): Promise<Set<string>> {
  manifestPromise ??= fetch(`${import.meta.env.BASE_URL}audio/manifest.json`, { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : { available: [] }))
    .then((j: { available?: string[] }) => new Set(j.available ?? []))
    .catch(() => new Set<string>());
  return manifestPromise;
}

export type AudioStatus = 'checking' | 'unavailable' | 'ready' | 'error';

export function useAudio(file?: string) {
  const rate = usePrayerStore((s) => s.audioRate);
  const [status, setStatus] = useState<AudioStatus>(file ? 'checking' : 'unavailable');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const onEnd = useRef<(() => void) | null>(null);

  useEffect(() => {
    let alive = true;
    setPlaying(false);
    setTime(0);
    setDuration(0);
    if (!file) {
      setStatus('unavailable');
      return;
    }
    setStatus('checking');
    loadManifest().then((set) => {
      if (alive) setStatus(set.has(file) ? 'ready' : 'unavailable');
    });
    return () => {
      alive = false;
      audio.current?.pause();
      audio.current = null;
    };
  }, [file]);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = rate;
  }, [rate]);

  const ensure = useCallback(() => {
    if (audio.current || !file) return audio.current;
    const a = new Audio(`${import.meta.env.BASE_URL}audio/${file}`);
    a.preload = 'auto';
    a.playbackRate = rate;
    a.addEventListener('timeupdate', () => setTime(a.currentTime));
    a.addEventListener('loadedmetadata', () => setDuration(a.duration || 0));
    a.addEventListener('play', () => setPlaying(true));
    a.addEventListener('pause', () => setPlaying(false));
    a.addEventListener('ended', () => {
      setPlaying(false);
      onEnd.current?.();
    });
    a.addEventListener('error', () => {
      setStatus('error');
      setPlaying(false);
    });
    audio.current = a;
    return a;
  }, [file, rate]);

  const play = useCallback(() => {
    if (status !== 'ready') return;
    const a = ensure();
    a?.play().catch(() => setPlaying(false));
  }, [ensure, status]);

  const pause = useCallback(() => audio.current?.pause(), []);

  const replay = useCallback(() => {
    if (status !== 'ready') return;
    const a = ensure();
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => setPlaying(false));
  }, [ensure, status]);

  const seek = useCallback((t: number) => {
    if (audio.current) audio.current.currentTime = t;
  }, []);

  const setOnEnd = useCallback((fn: (() => void) | null) => {
    onEnd.current = fn;
  }, []);

  return { status, playing, time, duration, play, pause, replay, seek, setOnEnd };
}

export function fmtTime(s: number) {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
