import React, { useRef, useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
   PASTE INTO MusicPlayer.module.scss  (or keep as injected <style>)
───────────────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400&display=swap');

:root {
  --mp-pink:     #ff2d9b;
  --mp-cyan:     #00f0ff;
  --mp-purple:   #9b4dff;
  --mp-bg:       rgba(8, 8, 20, 0.82);
  --mp-glass:    rgba(255,255,255,0.045);
  --mp-border:   rgba(255,255,255,0.09);
  --mp-h:        82px;
}

/* ── wrapper fixed bar ── */
.mp-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 9999;
  height: var(--mp-h);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 20px;
  background: var(--mp-bg);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border-top: 1px solid var(--mp-border);
  box-shadow:
    0 -1px 0 rgba(255,45,155,.18),
    0 -24px 60px rgba(0,0,0,.55),
    inset 0 1px 0 rgba(255,255,255,.05);
  animation: mpSlideUp .45s cubic-bezier(.22,1,.36,1) both;
  font-family: 'DM Sans', sans-serif;
}

@keyframes mpSlideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

/* top neon accent line */
.mp-bar::before {
  content: '';
  position: absolute;
  top: -1px; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--mp-pink) 25%, var(--mp-purple) 50%, var(--mp-cyan) 75%, transparent 100%);
  opacity: .75;
  animation: lineShift 5s linear infinite;
  background-size: 200% 100%;
}

@keyframes lineShift {
  0%   { background-position: 0% 0; }
  100% { background-position: 200% 0; }
}

/* ── thumbnail ── */
.mp-thumb {
  position: relative;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.1);
  box-shadow: 0 0 14px rgba(255,45,155,.35), 0 4px 16px rgba(0,0,0,.5);
}
.mp-thumb img {
    position:relative;
    z-index:2;

  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
.mp-thumb-placeholder {
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255,45,155,.2), rgba(0,240,255,.12));
  font-size: 22px;
}
.mp-thumb-spin {
  position: absolute;
  z-index: 1;
  inset: -3px;
  border-radius: 13px;
  border: 1.5px solid transparent;
  background: linear-gradient(var(--mp-bg), var(--mp-bg)) padding-box,
              linear-gradient(135deg, var(--mp-pink), var(--mp-cyan)) border-box;
  animation: thumbSpin 6s linear infinite;
}
@keyframes thumbSpin {
  to { transform: rotate(360deg); }
}

/* ── song info ── */
.mp-info {
  flex: 0 0 180px;
  min-width: 0;
  overflow: hidden;
}
.mp-title {
  font-family: 'Syne', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: linear-gradient(90deg, #fff 60%, rgba(255,255,255,.4));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 6px rgba(255,255,255,.25));
  animation: titleGlow 3s ease-in-out infinite alternate;
}
@keyframes titleGlow {
  0%   { filter: drop-shadow(0 0 4px rgba(255,45,155,.3)); }
  100% { filter: drop-shadow(0 0 12px rgba(0,240,255,.5)); }
}
.mp-artist {
  font-size: 11px;
  font-weight: 300;
  color: rgba(255,255,255,.38);
  margin-top: 3px;
  letter-spacing: .03em;
}

/* ── center controls ── */
.mp-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

/* control buttons row */
.mp-controls {
  display: flex;
  align-items: center;
  gap: 18px;
}

/* ── skip buttons ── */
.mp-skip {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: rgba(255,255,255,.45);
  transition: color .2s, transform .2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mp-skip:hover { color: rgba(255,255,255,.85); transform: scale(1.12); }

/* ── play / pause button ── */
.mp-play-btn {
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--mp-pink), var(--mp-purple) 50%, var(--mp-cyan));
  box-shadow:
    0 0 0 1px rgba(255,255,255,.1),
    0 0 16px rgba(255,45,155,.55),
    0 0 32px rgba(0,240,255,.22),
    0 4px 14px rgba(0,0,0,.5);
  transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s;
  overflow: hidden;
  flex-shrink: 0;
}
.mp-play-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0);
  border-radius: 50%;
  transition: background .2s;
}
.mp-play-btn:hover {
  transform: scale(1.1);
  box-shadow:
    0 0 0 1px rgba(255,255,255,.15),
    0 0 28px rgba(255,45,155,.8),
    0 0 55px rgba(0,240,255,.42),
    0 6px 20px rgba(0,0,0,.55);
}
.mp-play-btn:active { transform: scale(.95); }

/* ripple on click */
.mp-play-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(255,255,255,.18);
  opacity: 0;
  transform: scale(0);
  transition: none;
}
.mp-play-btn.ripple::after {
  animation: ripple .45s ease-out forwards;
}
@keyframes ripple {
  to { transform: scale(2.2); opacity: 0; }
}

.mp-play-icon {
  position: relative;
  z-index: 1;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .15s;
}

/* ── progress row ── */
.mp-progress-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 520px;
}
.mp-time {
  font-size: 10.5px;
  font-weight: 300;
  color: rgba(255,255,255,.32);
  letter-spacing: .04em;
  flex-shrink: 0;
  min-width: 32px;
  font-variant-numeric: tabular-nums;
}
.mp-time.end { text-align: right; }

/* progress track */
.mp-progress {
  position: relative;
  flex: 1;
  height: 3px;
  border-radius: 3px;
  background: rgba(255,255,255,.1);
  cursor: pointer;
  overflow: visible;
  transition: height .2s;
}
.mp-progress:hover { height: 5px; }

.mp-progress-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--mp-pink), var(--mp-purple) 50%, var(--mp-cyan));
  box-shadow: 0 0 8px rgba(255,45,155,.6), 0 0 16px rgba(0,240,255,.3);
  transition: width .1s linear;
  min-width: 3px;
}

.mp-progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px rgba(255,45,155,.8), 0 0 2px rgba(0,0,0,.5);
  opacity: 0;
  transition: opacity .2s;
  pointer-events: none;
}
.mp-progress:hover .mp-progress-thumb { opacity: 1; }

/* ── right side: volume ── */
.mp-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mp-vol-icon {
  color: rgba(255,255,255,.38);
  cursor: pointer;
  transition: color .2s;
  flex-shrink: 0;
  display: flex;
}
.mp-vol-icon:hover { color: rgba(255,255,255,.8); }

/* volume slider */
.mp-volume {
  -webkit-appearance: none;
  appearance: none;
  width: 80px;
  height: 3px;
  border-radius: 3px;
  background: rgba(255,255,255,.1);
  outline: none;
  cursor: pointer;
}
.mp-volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--mp-pink), var(--mp-cyan));
  box-shadow: 0 0 8px rgba(255,45,155,.7);
  cursor: pointer;
  transition: transform .2s;
}
.mp-volume::-webkit-slider-thumb:hover { transform: scale(1.3); }
.mp-volume::-moz-range-thumb {
  width: 11px; height: 11px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--mp-pink), var(--mp-cyan));
  box-shadow: 0 0 8px rgba(255,45,155,.7);
  cursor: pointer;
}

/* page bottom padding so content isn't hidden behind the player */
.mp-page-offset {
  padding-bottom: calc(var(--mp-h) + 16px) !important;
}

/* ── responsive ── */
@media (max-width: 600px) {
  .mp-info { flex: 0 0 120px; }
  .mp-right { display: none; }
  .mp-bar { padding: 0 14px; gap: 12px; }
  .mp-thumb { width: 42px; height: 42px; }
}
`;

/* ── helpers ── */
const fmt = (s) => {
  if (isNaN(s) || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/* ── SVG icons ── */
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const SkipNextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
  </svg>
);
const SkipPrevIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);
const VolumeIcon = ({ muted }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    {muted ? (
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    ) : (
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    )}
  </svg>
);

/* ═══════════════════════════════════════════════════
   MUSIC PLAYER COMPONENT
═══════════════════════════════════════════════════ */
const MusicPlayer = ({ song, onNext, onPrev, hasNext, hasPrev }) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const btnRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [ripple, setRipple] = useState(false);

  // inject styles once
  useEffect(() => {
    if (!document.getElementById("mp-styles")) {
      const tag = document.createElement("style");
      tag.id = "mp-styles";
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    return () => {};
  }, []);

  // auto-play when song changes
  useEffect(() => {
    if (!song) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = song.url;
    audio.volume = volume;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [song]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  };
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };
  const handleEnded = () => {
    setIsPlaying(false);
    if (hasNext) onNext?.();
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    // ripple
    setRipple(false);
    setTimeout(() => setRipple(true), 10);
    setTimeout(() => setRipple(false), 460);

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    setMuted(next);
    audio.muted = next;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!song) return null;

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        style={{ display: "none" }}
      />

      {/* Player bar */}
      <div className="mp-bar">

     
        {/* Thumbnail */}
        <div className="mp-thumb">
          <div className="mp-thumb-spin" />
          {song.posterUrl ? (
            <img
            src={song.posterUrl}
            alt={song.title}
            onError={(e) => (e.target.src = "/fallback.png")}
          />
          ) : (
            <div className="mp-thumb-placeholder">🎵</div>
          )}
        </div>

        {/* Song info */}
        <div className="mp-info">
          <div className="mp-title">{song.title}</div>
          <div className="mp-artist">{song.artist || "Moodify"}</div>
        </div>

        {/* Center: controls + progress */}
        <div className="mp-center">
          <div className="mp-controls">
            <button
              className="mp-skip"
              onClick={onPrev}
              disabled={!hasPrev}
              style={{ opacity: hasPrev ? 1 : 0.3 }}
              title="Previous"
            >
              <SkipPrevIcon />
            </button>

            <button
              ref={btnRef}
              className={`mp-play-btn${ripple ? " ripple" : ""}`}
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
            >
              <span className="mp-play-icon">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </span>
            </button>

            <button
              className="mp-skip"
              onClick={onNext}
              disabled={!hasNext}
              style={{ opacity: hasNext ? 1 : 0.3 }}
              title="Next"
            >
              <SkipNextIcon />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mp-progress-row">
            <span className="mp-time">{fmt(currentTime)}</span>

            <div
              className="mp-progress"
              ref={progressRef}
              onClick={handleProgressClick}
            >
              <div
                className="mp-progress-fill"
                style={{ width: `${progress}%` }}
              />
              <div
                className="mp-progress-thumb"
                style={{ left: `${progress}%` }}
              />
            </div>

            <span className="mp-time end">{fmt(duration)}</span>
          </div>
        </div>

        {/* Right: volume */}
        <div className="mp-right">
          <span className="mp-vol-icon" onClick={toggleMute}>
            <VolumeIcon muted={muted} />
          </span>
          <input
            type="range"
            className="mp-volume"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={handleVolume}
          />
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;