import { useEffect } from 'react';
import { useT } from '@/i18n';
import { fmtTime, useAudio } from '@/hooks/useAudio';
import { usePrayerStore } from '@/store/prayerStore';
import { useProgressStore } from '@/store/progressStore';
import type { RecitationId } from '@/content/types';
import { Icon } from '@/components/ui/Icon';

const SPEEDS = [0.75, 1, 1.25];

/**
 * Accessible audio player: play / pause / replay, progress (seekable), playback
 * speed and an animated waveform. Shows "Audio coming soon" until a verified
 * recording is listed in the audio manifest — never placeholder audio.
 */
export function RecitationPlayer({ id, file, onEnded }: { id: RecitationId; file?: string; onEnded?: () => void }) {
  const t = useT();
  const { status, playing, time, duration, play, pause, replay, seek, setOnEnd } = useAudio(file);
  const rate = usePrayerStore((s) => s.audioRate);
  const setRate = usePrayerStore((s) => s.setAudioRate);
  const markRecitation = useProgressStore((s) => s.markRecitation);
  const ready = status === 'ready';

  useEffect(() => setOnEnd(onEnded ?? null), [onEnded, setOnEnd]);

  return (
    <div className="rounded-xl border hairline bg-ink/40 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            markRecitation(id);
            if (playing) pause();
            else play();
          }}
          aria-label={playing ? t('recitation.pause') : t('recitation.play')}
          className="grid h-11 w-11 place-items-center rounded-full border border-emerald-glow/40 bg-emerald/40 text-ivory transition-colors hover:bg-emerald/60 disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-dim"
        >
          <Icon name={playing ? 'pause' : 'play'} size={18} />
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            markRecitation(id);
            replay();
          }}
          aria-label={t('recitation.replay')}
          className="grid h-9 w-9 place-items-center rounded-full text-ivory-2 hover:bg-ivory/5 disabled:text-dim"
        >
          <Icon name="replay" size={17} />
        </button>
        <div className={`wave ${playing ? 'playing' : ''}`} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="min-w-[8rem] flex-1">
          {ready ? (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={time}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label={t('recitation.progress')}
                className="h-1 w-full accent-[var(--color-emerald-glow)]"
              />
              <span className="shrink-0 text-xs tabular-nums text-muted">
                {fmtTime(time)} / {fmtTime(duration)}
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted" role="note">
              <span className="font-medium text-ivory-2">{status === 'error' ? t('recitation.audioError') : t('recitation.audioSoon')}</span>
              {status !== 'error' && <span className="hidden sm:inline"> · {t('recitation.audioSoonBody')}</span>}
            </p>
          )}
        </div>
        <div className="seg" role="radiogroup" aria-label={t('recitation.speed')}>
          {SPEEDS.map((s) => (
            <button key={s} type="button" role="radio" aria-checked={rate === s} onClick={() => setRate(s)} disabled={!ready} className="!px-2 !text-[0.7rem] disabled:opacity-50">
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
