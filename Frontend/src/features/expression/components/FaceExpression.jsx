import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";


export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const [expression, setExpression] = useState("Detecting...");
  const streamRef = useRef(null);



  useEffect(() => {


    init({ landmarkerRef, streamRef, videoRef });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "400px", borderRadius: "12px" }}
      />
      <h2>{expression}</h2>
      <button onClick={() => { detect({ landmarkerRef, videoRef, animationRef, setExpression }) }}>Detect Expression</button>
    </div>
  );
}