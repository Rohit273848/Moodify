import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────
   PASTE THIS INTO YOUR Home.module.scss (or a <style> tag)
   and swap className strings accordingly.
   All classNames are SCSS-friendly.
───────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400&display=swap');

  /* ── tokens ── */
  :root {
    --pink:   #ff2d9b;
    --cyan:   #00f0ff;
    --mid:    #9b4dff;
    --bg:     #060610;
    --glass:  rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
  }

  /* ── reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── page wrapper ── */
  .moodify-home {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--bg);
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── animated grid background ── */
  .moodify-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,240,255,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,240,255,0.045) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridDrift 20s linear infinite;
    pointer-events: none;
  }

  @keyframes gridDrift {
    0%   { background-position: 0 0; }
    100% { background-position: 60px 60px; }
  }

  /* ── radial aurora blobs ── */
  .moodify-aurora {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .moodify-aurora::before,
  .moodify-aurora::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.22;
    animation: auroraFloat 8s ease-in-out infinite alternate;
  }
  .moodify-aurora::before {
    width: 600px; height: 600px;
    background: radial-gradient(circle, var(--pink), transparent 70%);
    top: -160px; left: -100px;
  }
  .moodify-aurora::after {
    width: 500px; height: 500px;
    background: radial-gradient(circle, var(--cyan), transparent 70%);
    bottom: -140px; right: -80px;
    animation-delay: 3s;
  }

  @keyframes auroraFloat {
    0%   { transform: translate(0, 0)   scale(1);    opacity: 0.18; }
    100% { transform: translate(30px, 40px) scale(1.1); opacity: 0.28; }
  }

  /* ── floating particles ── */
  .moodify-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .particle {
    position: absolute;
    border-radius: 50%;
    opacity: 0;
    animation: particleFly linear infinite;
  }

  @keyframes particleFly {
    0%   { transform: translateY(100vh) scale(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
  }

  /* ── glass card ── */
  .moodify-card {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 64px 72px 56px;
    background: var(--glass);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--border);
    border-radius: 32px;
    box-shadow:
      0 0 0 1px rgba(0,240,255,0.06),
      0 32px 80px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.07);
    animation: cardReveal 1s cubic-bezier(0.22,1,0.36,1) both;
    max-width: 560px;
    width: 90vw;
  }

  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(40px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }

  /* ── badge ── */
  .moodify-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 14px 5px 10px;
    border-radius: 100px;
    background: rgba(255,45,155,0.1);
    border: 1px solid rgba(255,45,155,0.25);
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--pink);
    margin-bottom: 28px;
    animation: cardReveal 0.9s 0.15s cubic-bezier(0.22,1,0.36,1) both;
  }
  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--pink);
    box-shadow: 0 0 8px var(--pink);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1);   opacity: 1; }
    50%       { transform: scale(1.5); opacity: 0.5; }
  }

  /* ── logo / title ── */
  .moodify-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(52px, 9vw, 80px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, var(--pink) 0%, var(--mid) 45%, var(--cyan) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 28px rgba(255,45,155,0.45))
            drop-shadow(0 0 60px rgba(0,240,255,0.25));
    animation: titleGlow 4s ease-in-out infinite alternate, cardReveal 1s 0.1s cubic-bezier(0.22,1,0.36,1) both;
    margin-bottom: 16px;
  }

  @keyframes titleGlow {
    0%   { filter: drop-shadow(0 0 22px rgba(255,45,155,0.4))  drop-shadow(0 0 50px rgba(0,240,255,0.2)); }
    100% { filter: drop-shadow(0 0 40px rgba(255,45,155,0.75)) drop-shadow(0 0 80px rgba(0,240,255,0.45)); }
  }

  /* ── tagline ── */
  .moodify-tagline {
    font-size: 16px;
    font-weight: 300;
    color: rgba(255,255,255,0.48);
    letter-spacing: 0.04em;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 44px;
    animation: cardReveal 0.9s 0.25s cubic-bezier(0.22,1,0.36,1) both;
  }
  .moodify-tagline em {
    font-style: normal;
    color: rgba(255,255,255,0.78);
  }

  /* ── divider ── */
  .moodify-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border) 30%, var(--border) 70%, transparent);
    margin-bottom: 44px;
  }

  /* ── CTA button ── */
  .moodify-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 15px 40px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #fff;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    background: linear-gradient(135deg, var(--pink), var(--mid) 50%, var(--cyan));
    background-size: 200% 200%;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.12),
      0 0 24px rgba(255,45,155,0.45),
      0 0 48px rgba(0,240,255,0.2),
      0 8px 32px rgba(0,0,0,0.5);
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.3s ease,
                background-position 0.5s ease;
    animation:
      cardReveal 0.9s 0.4s cubic-bezier(0.22,1,0.36,1) both,
      btnShift 5s ease-in-out infinite;
    overflow: hidden;
    margin-bottom: 0;
  }

  .moodify-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.3s ease;
    border-radius: inherit;
  }

  .moodify-btn::after {
    content: '';
    position: absolute;
    top: -50%; left: -60%;
    width: 50%; height: 200%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transform: skewX(-20deg);
    transition: left 0.6s ease;
  }

  .moodify-btn:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.18),
      0 0 40px rgba(255,45,155,0.75),
      0 0 80px rgba(0,240,255,0.4),
      0 12px 40px rgba(0,0,0,0.5);
  }

  .moodify-btn:hover::after {
    left: 130%;
  }

  .moodify-btn:active {
    transform: translateY(0) scale(0.98);
  }

  @keyframes btnShift {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
  }

  /* ── btn icon ── */
  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px; height: 20px;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    flex-shrink: 0;
    font-size: 10px;
  }

  /* ── subtext below button ── */
  .moodify-subtext {
    margin-top: 20px;
    font-size: 12px;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.05em;
    animation: cardReveal 0.9s 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* ── bottom feature pills ── */
  .moodify-features {
    display: flex;
    gap: 10px;
    margin-top: 36px;
    animation: cardReveal 0.9s 0.6s cubic-bezier(0.22,1,0.36,1) both;
    flex-wrap: wrap;
    justify-content: center;
  }
  .feature-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 13px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 100px;
    font-size: 11.5px;
    color: rgba(255,255,255,0.38);
    letter-spacing: 0.04em;
    transition: border-color 0.3s, color 0.3s;
  }
  .feature-pill:hover {
    border-color: rgba(0,240,255,0.25);
    color: rgba(255,255,255,0.65);
  }
  .pill-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
  }
`;

// Particle data
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size:  Math.random() * 3 + 1.5,
  left:  Math.random() * 100,
  delay: Math.random() * 12,
  dur:   Math.random() * 10 + 10,
  color: i % 3 === 0 ? "#ff2d9b" : i % 3 === 1 ? "#00f0ff" : "#9b4dff",
}));

const FEATURES = [
  { dot: "#ff2d9b", label: "Mood Detection" },
  { dot: "#00f0ff", label: "AI Curated" },
  { dot: "#9b4dff", label: "Real-time Sync" },
];

const Home = () => {
  const navigate = useNavigate();
  const styleRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("moodify-home-styles")) {
      const tag = document.createElement("style");
      tag.id = "moodify-home-styles";
      tag.textContent = css;
      document.head.appendChild(tag);
      styleRef.current = tag;
    }
    return () => styleRef.current?.remove();
  }, []);

  return (
    <div className="moodify-home">
      {/* Grid */}
      <div className="moodify-grid" />

      {/* Aurora blobs */}
      <div className="moodify-aurora" />

      {/* Floating particles */}
      <div className="moodify-particles">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              width:  p.size,
              height: p.size,
              left:   `${p.left}%`,
              background: p.color,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
              animationDuration: `${p.dur}s`,
              animationDelay:    `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Glass card */}
      <div className="moodify-card">
        {/* Live badge */}
        <div className="moodify-badge">
          <span className="badge-dot" />
          Now Playing · AI Radio
        </div>

        {/* Title */}
        <h1 className="moodify-title">Moodify</h1>

        {/* Tagline */}
        <p className="moodify-tagline">
          <em>Feel your mood.</em> Hear your music.
        </p>

        {/* Divider */}
        <div className="moodify-divider" />

        {/* CTA */}
        <button
          className="moodify-btn"
          onClick={() => navigate("/detect")}
        >
          <span className="btn-icon">▶</span>
          Start Detecting
        </button>

        {/* Sub-hint */}
        <p className="moodify-subtext">No setup required · Free forever</p>

        {/* Feature pills */}
        <div className="moodify-features">
          {FEATURES.map((f) => (
            <span className="feature-pill" key={f.label}>
              <span
                className="pill-dot"
                style={{ background: f.dot, boxShadow: `0 0 6px ${f.dot}` }}
              />
              {f.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;