import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import { useSongs } from "../../home/song.context";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   PASTE INTO FaceExpression.module.scss
───────────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400&display=swap');

:root {
  --pk: #ff2d9b;
  --cy: #00f0ff;
  --pu: #9b4dff;
  --bg: #060610;
}

/* ── page ── */
.fd-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  padding: 24px 16px 48px;
  gap: 0;
}

/* ── animated grid ── */
.fd-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,240,255,.038) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,240,255,.038) 1px, transparent 1px);
  background-size: 56px 56px;
  animation: gridDrift 22s linear infinite;
  pointer-events: none;
}
@keyframes gridDrift {
  0%   { background-position: 0 0; }
  100% { background-position: 56px 56px; }
}

/* ── aurora blobs ── */
.fd-aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.fd-aurora::before,
.fd-aurora::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
  animation: auroraFloat 9s ease-in-out infinite alternate;
}
.fd-aurora::before {
  width: 520px; height: 520px;
  background: radial-gradient(circle, rgba(255,45,155,.22), transparent 68%);
  top: -180px; left: -140px;
}
.fd-aurora::after {
  width: 440px; height: 440px;
  background: radial-gradient(circle, rgba(0,240,255,.18), transparent 68%);
  bottom: -160px; right: -100px;
  animation-delay: 4s;
}
@keyframes auroraFloat {
  0%   { transform: translate(0,0)    scale(1);    }
  100% { transform: translate(28px,36px) scale(1.08); }
}

/* ── particles ── */
.fd-particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  animation: particleRise linear infinite;
}
@keyframes particleRise {
  0%   { transform: translateY(100vh) scale(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: .5; }
  100% { transform: translateY(-60px) scale(1.2); opacity: 0; }
}

/* ── header ── */
.fd-header {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 32px;
  animation: fadeUp .8s cubic-bezier(.22,1,.36,1) both;
}
.fd-logo {
  font-family: 'Syne', sans-serif;
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 800;
  letter-spacing: -.02em;
  background: linear-gradient(135deg, var(--pk), var(--pu) 50%, var(--cy));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 10px rgba(255,45,155,.4));
}
.fd-subtitle {
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,.3);
  letter-spacing: .12em;
  text-transform: uppercase;
  margin-top: 4px;
}

/* ── camera card ── */
.fd-card {
  position: relative;
  z-index: 10;
  border-radius: 28px;
  padding: 18px;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,.08);
  box-shadow:
    0 0 0 1px rgba(0,240,255,.06),
    0 28px 70px rgba(0,0,0,.6),
    inset 0 1px 0 rgba(255,255,255,.06);
  animation: fadeUp .85s .1s cubic-bezier(.22,1,.36,1) both;
}

/* neon border glow ring */
.fd-card::before {
  content: '';
  position: absolute;
  inset: -1.5px;
  border-radius: 30px;
  background: linear-gradient(135deg, var(--pk), var(--pu) 50%, var(--cy));
  z-index: -1;
  opacity: .55;
  animation: borderPulse 3s ease-in-out infinite;
}
.fd-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 28px;
  background: var(--bg);
  z-index: -1;
}
@keyframes borderPulse {
  0%,100% { opacity: .45; filter: blur(0px); }
  50%      { opacity: .85; filter: blur(1.5px); }
}

/* ── video frame ── */
.fd-video-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  line-height: 0;
}

.fd-video {
  width: min(380px, 80vw);
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 16px;
  display: block;
  background: rgba(0,0,0,.5);
}

/* scanning line */
.fd-scan {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    rgba(0,240,255,.7) 30%,
    rgba(0,240,255,1) 50%,
    rgba(0,240,255,.7) 70%,
    transparent
  );
  box-shadow: 0 0 12px rgba(0,240,255,.8), 0 0 24px rgba(0,240,255,.4);
  animation: scanLine 3.5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes scanLine {
  0%   { top: 0%; opacity: 0; }
  5%   { opacity: 1; }
  95%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* corner brackets */
.fd-corners {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.fd-corners::before,
.fd-corners::after {
  content: '';
  position: absolute;
  width: 22px; height: 22px;
  border-color: var(--cy);
  border-style: solid;
  opacity: .9;
  animation: cornerGlow 3s ease-in-out infinite alternate;
}
.fd-corners::before {
  top: 8px; left: 8px;
  border-width: 2px 0 0 2px;
  border-radius: 5px 0 0 0;
}
.fd-corners::after {
  bottom: 8px; right: 8px;
  border-width: 0 2px 2px 0;
  border-radius: 0 0 5px 0;
}
@keyframes cornerGlow {
  0%   { opacity: .5; filter: drop-shadow(0 0 3px var(--cy)); }
  100% { opacity: 1;  filter: drop-shadow(0 0 8px var(--cy)); }
}

/* extra corners (pseudo can only do 2) */
.fd-corner-tr,
.fd-corner-bl {
  position: absolute;
  width: 22px; height: 22px;
  pointer-events: none;
  animation: cornerGlow 3s 1.5s ease-in-out infinite alternate;
}
.fd-corner-tr {
  top: 8px; right: 8px;
  border-top: 2px solid var(--cy);
  border-right: 2px solid var(--cy);
  border-radius: 0 5px 0 0;
  opacity: .9;
}
.fd-corner-bl {
  bottom: 8px; left: 8px;
  border-bottom: 2px solid var(--cy);
  border-left: 2px solid var(--cy);
  border-radius: 0 0 0 5px;
  opacity: .9;
}

/* ── emotion display ── */
.fd-emotion-wrap {
  position: relative;
  z-index: 10;
  margin-top: 28px;
  text-align: center;
  min-height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: fadeUp .8s .25s cubic-bezier(.22,1,.36,1) both;
}
.fd-emotion-chip {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: rgba(255,255,255,.3);
  padding: 3px 12px;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 100px;
  background: rgba(255,255,255,.03);
}

.fd-emotion-text {
  font-family: 'Syne', sans-serif;
  font-size: clamp(28px, 6vw, 42px);
  font-weight: 700;
  letter-spacing: -.02em;
  background: linear-gradient(135deg, var(--pk), var(--pu) 50%, var(--cy));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: emotionGlow 3s ease-in-out infinite alternate, emotionIn .4s cubic-bezier(.22,1,.36,1);
  filter: drop-shadow(0 0 16px rgba(255,45,155,.5));
  line-height: 1.1;
}
@keyframes emotionGlow {
  0%   { filter: drop-shadow(0 0 12px rgba(255,45,155,.4)) drop-shadow(0 0 24px rgba(0,240,255,.2)); }
  100% { filter: drop-shadow(0 0 24px rgba(255,45,155,.75)) drop-shadow(0 0 48px rgba(0,240,255,.45)); }
}
@keyframes emotionIn {
  from { opacity: 0; transform: translateY(8px) scale(.96); }
  to   { opacity: 1; transform: none; }
}

/* confidence dots */
.fd-dots {
  display: flex;
  gap: 5px;
  margin-top: 2px;
}
.fd-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(0,240,255,.25);
  transition: background .4s, box-shadow .4s;
}
.fd-dot.active {
  background: var(--cy);
  box-shadow: 0 0 6px var(--cy);
}

/* ── detect button ── */
.fd-btn {
  position: relative;
  z-index: 10;
  margin-top: 30px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 44px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #fff;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  background: linear-gradient(135deg, var(--pk), var(--pu) 50%, var(--cy));
  background-size: 200% 200%;
  box-shadow:
    0 0 0 1px rgba(255,255,255,.1),
    0 0 20px rgba(255,45,155,.5),
    0 0 44px rgba(0,240,255,.2),
    0 8px 28px rgba(0,0,0,.5);
  transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s;
  animation: fadeUp .8s .35s cubic-bezier(.22,1,.36,1) both, btnShift 5s ease-in-out infinite;
  overflow: hidden;
}
.fd-btn::after {
  content: '';
  position: absolute;
  top: -50%; left: -65%;
  width: 45%; height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
  transform: skewX(-22deg);
  transition: left .6s ease;
}
.fd-btn:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow:
    0 0 0 1px rgba(255,255,255,.16),
    0 0 36px rgba(255,45,155,.8),
    0 0 72px rgba(0,240,255,.4),
    0 12px 36px rgba(0,0,0,.55);
}
.fd-btn:hover::after { left: 135%; }
.fd-btn:active { transform: scale(.97); }
.fd-btn:disabled {
  opacity: .5;
  cursor: not-allowed;
  transform: none;
}
@keyframes btnShift {
  0%,100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

/* btn icon ring */
.fd-btn-icon {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
  animation: iconSpin 4s linear infinite;
}
@keyframes iconSpin {
  to { transform: rotate(360deg); }
}
.fd-btn.detecting .fd-btn-icon {
  border-color: rgba(255,255,255,.7);
  animation: iconSpin .8s linear infinite;
}

/* ── status pill ── */
.fd-status {
  position: relative;
  z-index: 10;
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px 5px 10px;
  border-radius: 100px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  font-size: 11px;
  color: rgba(255,255,255,.35);
  letter-spacing: .05em;
  animation: fadeUp .8s .45s cubic-bezier(.22,1,.36,1) both;
}
.fd-status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(0,240,255,.4);
  animation: statusPulse 2s ease-in-out infinite;
}
.fd-status-dot.live {
  background: var(--cy);
  box-shadow: 0 0 7px var(--cy);
}
@keyframes statusPulse {
  0%,100% { transform: scale(1); opacity:.8; }
  50%      { transform: scale(1.5); opacity:.4; }
}

/* ── shared fadeUp ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

/* ── PARTICLES ── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: Math.random() * 2.5 + 1.5,
  left: Math.random() * 100,
  delay: Math.random() * 14,
  dur: Math.random() * 10 + 12,
  color: ["#ff2d9b", "#00f0ff", "#9b4dff"][i % 3],
}));

/* ── EMOTION → emoji ── */
const EMOJI = {
  happy: "😊", sad: "😢", angry: "😠", surprised: "😲",
  fearful: "😨", disgusted: "🤢", neutral: "😐",
  "detecting...": "🔍", "waiting...": "⏳",
};

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
export default function FaceExpression() {
  const navigate = useNavigate();

  const videoRef      = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef  = useRef(null);
  const streamRef     = useRef(null);
  const hasFetchedRef = useRef(false);

  const [expression, setExpression] = useState("Detecting...");
  const [isDetecting, setIsDetecting] = useState(false);
  const [cameraLive, setCameraLive]   = useState(false);

  const { fetchSongs } = useSongs();

  /* inject styles */
  useEffect(() => {
    if (!document.getElementById("fd-styles")) {
      const tag = document.createElement("style");
      tag.id = "fd-styles";
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  /* init camera */
  useEffect(() => {
    init({ landmarkerRef, streamRef, videoRef });
    const v = videoRef.current;
    if (v) {
      const onPlay = () => setCameraLive(true);
      v.addEventListener("play", onPlay);
      return () => v.removeEventListener("play", onPlay);
    }
  }, []);

  /* cleanup on unmount */
  useEffect(() => () => {
    cancelAnimationFrame(animationRef.current);
    landmarkerRef.current?.close();
    videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
  }, []);

  const handleDetect = () => {
    hasFetchedRef.current = false;
    setIsDetecting(true);

    detect({
      landmarkerRef,
      videoRef,
      animationRef,
      setExpression: (val) => {
        setExpression(val);
        if (val !== "Detecting..." && val !== "Waiting...") {
          setIsDetecting(false);
        }
      },
      fetchSongs,
      hasFetchedRef,
      navigate,
    });
  };

  /* confidence dots: pulse 1-5 based on detection state */
  const dotCount = isDetecting ? 5 : expression !== "Detecting..." ? 4 : 1;
  const emoji = EMOJI[expression.toLowerCase()] || "🎭";

  return (
    <div className="fd-page">
      {/* bg layers */}
      <div className="fd-grid" />
      <div className="fd-aurora" />

      {/* particles */}
      {PARTICLES.map(p => (
        <span
          key={p.id}
          className="fd-particle"
          style={{
            width: p.size, height: p.size,
            left: `${p.left}%`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* logo header */}
      <div className="fd-header">
        <div className="fd-logo">Moodify</div>
        <div className="fd-subtitle">AI · Mood Detection</div>
      </div>

      {/* camera card */}
      <div className="fd-card">
        <div className="fd-video-wrap">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="fd-video"
          />

          {/* scan line */}
          <div className="fd-scan" />

          {/* corner brackets */}
          <div className="fd-corners" />
          <div className="fd-corner-tr" />
          <div className="fd-corner-bl" />
        </div>
      </div>

      {/* detected emotion */}
      <div className="fd-emotion-wrap">
        <div className="fd-emotion-chip">Detected Mood</div>
        <div
          key={expression}           /* re-triggers animation on change */
          className="fd-emotion-text"
        >
          {emoji} {expression}
        </div>
        <div className="fd-dots">
          {[1,2,3,4,5].map(i => (
            <div
              key={i}
              className={`fd-dot${i <= dotCount ? " active" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* detect button */}
      <button
        className={`fd-btn${isDetecting ? " detecting" : ""}`}
        onClick={handleDetect}
        disabled={isDetecting}
      >
        <span className="fd-btn-icon">⬡</span>
        {isDetecting ? "Scanning..." : "Detect Mood"}
      </button>

      {/* status pill */}
      <div className="fd-status">
        <span className={`fd-status-dot${cameraLive ? " live" : ""}`} />
        {cameraLive ? "Camera Live" : "Initialising Camera..."}
      </div>
    </div>
  );
}