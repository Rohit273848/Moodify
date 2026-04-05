import React, { useState } from "react";

/* ─────────────────────────────────────────────────────────
   Paste into SongCard.module.scss and swap to styles.xxx
───────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400&display=swap');

/* ── mood color map ── */
.sc-mood-happy    { --mc: #ffcc00; --ms: rgba(255,204,0,.18); }
.sc-mood-sad      { --mc: #4da6ff; --ms: rgba(77,166,255,.18); }
.sc-mood-angry    { --mc: #ff4d4d; --ms: rgba(255,77,77,.18); }
.sc-mood-calm     { --mc: #00f0c8; --ms: rgba(0,240,200,.18); }
.sc-mood-energetic{ --mc: #ff2d9b; --ms: rgba(255,45,155,.18); }
.sc-mood-romantic { --mc: #ff80b5; --ms: rgba(255,128,181,.18); }
.sc-mood-focused  { --mc: #9b4dff; --ms: rgba(155,77,255,.18); }
.sc-mood-default  { --mc: #00f0ff; --ms: rgba(0,240,255,.18); }

/* ── card shell ── */
.sc-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  transition:
    transform   0.32s cubic-bezier(0.22,1,0.36,1),
    border-color 0.28s ease,
    box-shadow  0.28s ease,
    background  0.28s ease;
  font-family: 'DM Sans', sans-serif;
  animation: scFadeIn 0.45s cubic-bezier(0.22,1,0.36,1) both;
  will-change: transform;
}

@keyframes scFadeIn {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}

.sc-card:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: var(--mc, #00f0ff);
  background: rgba(255,255,255,0.065);
  box-shadow:
    0 0 0 1px var(--mc, #00f0ff),
    0 0 24px var(--ms, rgba(0,240,255,.18)),
    0 12px 32px rgba(0,0,0,.55);
}

.sc-card.sc-active {
  border-color: var(--mc, #00f0ff);
  background: rgba(255,255,255,0.06);
  box-shadow:
    0 0 0 1px var(--mc, #00f0ff),
    0 0 28px var(--ms, rgba(0,240,255,.2)),
    0 8px 28px rgba(0,0,0,.5);
}

/* playing pulse ring */
.sc-card.sc-active::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 19px;
  border: 1px solid var(--mc, #00f0ff);
  opacity: 0;
  animation: scRing 2s ease-in-out infinite;
  pointer-events: none;
}
@keyframes scRing {
  0%   { transform: scale(1);    opacity: .5; }
  100% { transform: scale(1.04); opacity: 0; }
}

/* ── poster area ── */
.sc-poster-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  flex-shrink: 0;
}

.sc-poster-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.3s;
}

.sc-card:hover .sc-poster-wrap img,
.sc-card.sc-active .sc-poster-wrap img {
  transform: scale(1.06);
  filter: brightness(0.72) saturate(1.15);
}

/* poster placeholder */
.sc-poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  background: linear-gradient(
    135deg,
    rgba(255,45,155,0.18) 0%,
    rgba(155,77,255,0.14) 50%,
    rgba(0,240,255,0.12) 100%
  );
}

/* gradient scrim over poster */
.sc-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 35%,
    rgba(6,6,16,0.72) 75%,
    rgba(6,6,16,0.94) 100%
  );
}

/* overlay: play button centred on poster */
.sc-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s;
}
.sc-card:hover .sc-overlay,
.sc-card.sc-active .sc-overlay {
  opacity: 1;
}

.sc-play-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--mc, #00f0ff);
  box-shadow:
    0 0 0 4px rgba(255,255,255,0.1),
    0 0 20px var(--ms, rgba(0,240,255,.4)),
    0 4px 16px rgba(0,0,0,.6);
  transform: scale(0.82);
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}
.sc-card:hover .sc-play-btn,
.sc-card.sc-active .sc-play-btn {
  transform: scale(1);
}
.sc-play-btn:hover {
  box-shadow:
    0 0 0 5px rgba(255,255,255,0.15),
    0 0 30px var(--mc, #00f0ff),
    0 6px 20px rgba(0,0,0,.65);
}
.sc-play-btn svg {
  position: relative;
  z-index: 1;
}

/* ── bottom info strip ── */
.sc-info {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.sc-title {
  font-family: 'Syne', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  letter-spacing: -0.01em;
  transition: color 0.2s;
}
.sc-card:hover .sc-title,
.sc-card.sc-active .sc-title {
  color: #fff;
}

/* mood badge */
.sc-mood-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  padding: 3px 9px;
  border-radius: 100px;
  background: var(--ms, rgba(0,240,255,0.12));
  border: 1px solid rgba(255,255,255,0.08);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: capitalize;
  color: var(--mc, #00f0ff);
  transition: background 0.2s, border-color 0.2s;
}
.sc-card:hover .sc-mood-badge {
  border-color: var(--mc, #00f0ff);
  background: var(--ms, rgba(0,240,255,0.2));
}

/* mood dot */
.sc-mood-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--mc, #00f0ff);
  box-shadow: 0 0 5px var(--mc, #00f0ff);
  flex-shrink: 0;
}
.sc-card.sc-active .sc-mood-dot {
  animation: scDotPulse 1.5s ease-in-out infinite;
}
@keyframes scDotPulse {
  0%,100% { transform: scale(1);   opacity:1; }
  50%      { transform: scale(1.7); opacity:.5; }
}

/* ── active "now playing" bar at top ── */
.sc-now-playing {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--mc, #00f0ff), rgba(255,255,255,0.3));
  animation: scBarShift 3s linear infinite;
  background-size: 200% 100%;
  z-index: 2;
}
@keyframes scBarShift {
  0%   { background-position: 0% 0; }
  100% { background-position: 200% 0; }
}

/* ── waveform bars (active indicator) ── */
.sc-wave {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
  margin-left: auto;
  flex-shrink: 0;
}
.sc-wave span {
  display: block;
  width: 2.5px;
  border-radius: 2px;
  background: var(--mc, #00f0ff);
  opacity: 0.85;
  animation: scWave 0.9s ease-in-out infinite alternate;
}
.sc-wave span:nth-child(1){ height:5px;  animation-delay:0s;    }
.sc-wave span:nth-child(2){ height:10px; animation-delay:0.18s; }
.sc-wave span:nth-child(3){ height:7px;  animation-delay:0.06s; }
.sc-wave span:nth-child(4){ height:12px; animation-delay:0.24s; }
.sc-wave span:nth-child(5){ height:6px;  animation-delay:0.12s; }
@keyframes scWave {
  from { transform: scaleY(0.3); }
  to   { transform: scaleY(1);   }
}
`;

/* ── mood → CSS class helper ── */
const moodClass = (mood = "") => {
  const m = mood.toLowerCase().replace(/\s+/g, "");
  const known = ["happy","sad","angry","calm","energetic","romantic","focused"];
  return known.includes(m) ? `sc-mood-${m}` : "sc-mood-default";
};

/* ── icons ── */
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a0a18">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a0a18">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

/* ═══════════════════════════════════════
   SONG CARD COMPONENT
═══════════════════════════════════════ */
const SongCard = ({ song, onPlay, isActive = false, index = 0 }) => {
  const [imgError, setImgError] = useState(false);

  /* inject styles once */
  React.useEffect(() => {
    if (!document.getElementById("sc-styles")) {
      const tag = document.createElement("style");
      tag.id = "sc-styles";
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    onPlay?.(song);
  };

  return (
    <div
      className={[
        "sc-card",
        moodClass(song.mood),
        isActive ? "sc-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      style={{ animationDelay: `${index * 0.06}s` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
      aria-label={`Play ${song.title}`}
    >
      {/* ── active top bar ── */}
      {isActive && <div className="sc-now-playing" />}

      {/* ── poster ── */}
      <div className="sc-poster-wrap">
        {song.posterUrl && !imgError ? (
          <img
            src={song.posterUrl}
            alt={song.title}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="sc-poster-placeholder">🎵</div>
        )}

        {/* gradient scrim */}
        <div className="sc-scrim" />

        {/* play/pause overlay */}
        <div className="sc-overlay">
          <button className="sc-play-btn" onClick={handleClick} tabIndex={-1}>
            {isActive ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      </div>

      {/* ── bottom info ── */}
      <div className="sc-info">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div className="sc-title">{song.title}</div>
          {isActive && (
            <div className="sc-wave">
              <span /><span /><span /><span /><span />
            </div>
          )}
        </div>

        <div className="sc-mood-badge">
          <span className="sc-mood-dot" />
          {song.mood || "Unknown"}
        </div>
      </div>
    </div>
  );
};

export default SongCard;