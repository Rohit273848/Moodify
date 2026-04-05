import React, { useState } from "react";
import { useSongs } from "../song.context";
import SongCard from "../components/SongCard";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "../components/MusicPlayer";

/* ─────────────────────────────────────────
   PASTE INTO Songs.module.scss
───────────────────────────────────────── */
const PAGE_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400&display=swap');

.songs-page {
  min-height: 100vh;
  background: #060610;
  color: #fff;
  padding: 32px 24px;
  padding-bottom: 110px; /* clears fixed player */
  font-family: 'DM Sans', sans-serif;
}

/* ── header row ── */
.songs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 12px;
}

.songs-mood-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.songs-mood-chip {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: rgba(255,255,255,.38);
  padding: 4px 12px;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 100px;
  background: rgba(255,255,255,.03);
}

.songs-mood-title {
  font-family: 'Syne', sans-serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -.02em;
  background: linear-gradient(90deg, #fff 50%, rgba(255,255,255,.4));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.songs-detect-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: rgba(255,255,255,.7);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 100px;
  background: rgba(255,255,255,.04);
  cursor: pointer;
  transition: border-color .25s, color .25s, background .25s, transform .2s;
  backdrop-filter: blur(8px);
}
.songs-detect-btn:hover {
  border-color: rgba(0,240,255,.35);
  color: #fff;
  background: rgba(0,240,255,.06);
  transform: translateY(-1px);
}

/* ── song count ── */
.songs-count {
  font-size: 12px;
  color: rgba(255,255,255,.25);
  letter-spacing: .05em;
  margin-bottom: 16px;
}

/* ── song grid ── */
.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

/* empty state */
.songs-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 14px;
  color: rgba(255,255,255,.25);
  font-size: 14px;
  letter-spacing: .04em;
  text-align: center;
}
.songs-empty-icon {
  font-size: 40px;
  filter: grayscale(1) opacity(.4);
}
`;

const Songs = () => {
  const { songs, mood } = useSongs();
  const navigate = useNavigate();

  // track current index for next/prev
  const [currentIndex, setCurrentIndex] = useState(null);

  const currentSong = currentIndex !== null ? songs[currentIndex] : null;

  // inject page styles once
  React.useEffect(() => {
    if (!document.getElementById("songs-page-styles")) {
      const tag = document.createElement("style");
      tag.id = "songs-page-styles";
      tag.textContent = PAGE_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const handlePlay = (song) => {
    const idx = songs.findIndex((s) => s._id === song._id);
    setCurrentIndex(idx !== -1 ? idx : 0);
  };

  const handleNext = () => {
    if (currentIndex !== null && currentIndex < songs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="songs-page">
      {/* ── header ── */}
      <div className="songs-header">
        <div className="songs-mood-label">
          <span className="songs-mood-chip">Your mood</span>
          <h1 className="songs-mood-title">{mood || "Mixed"}</h1>
        </div>

        <button
          className="songs-detect-btn"
          onClick={() => navigate("/detect")}
        >
          ↺ Detect Again
        </button>
      </div>

      {/* ── count ── */}
      {songs.length > 0 && (
        <p className="songs-count">
          {songs.length} track{songs.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* ── song grid ── */}
      <div className="songs-grid">
        {songs.length === 0 ? (
          <div className="songs-empty">
            <span className="songs-empty-icon">🎵</span>
            <p>No songs found for this mood</p>
          </div>
        ) : (
          songs.map((song, i) => (
            <SongCard
              key={song._id}
              song={song}
              isActive={currentIndex === i}
              onPlay={() => handlePlay(song)}
            />
          ))
        )}
      </div>

      {/* ── custom music player (fixed bottom) ── */}
      <MusicPlayer
        song={currentSong}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={currentIndex !== null && currentIndex < songs.length - 1}
        hasPrev={currentIndex !== null && currentIndex > 0}
      />
    </div>
  );
};

export default Songs;