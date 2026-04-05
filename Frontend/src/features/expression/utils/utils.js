import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";



export const init = async ({ landmarkerRef, streamRef, videoRef }) => {
    // ✅ Load model
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
        }
    );

    // ✅ Start camera
    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = streamRef.current;
    videoRef.current.muted = true;
    await videoRef.current.play();

};



export const detect = ({ landmarkerRef,
    videoRef,
    animationRef,
    setExpression,
    fetchSongs,
    hasFetchedRef,
    navigate,
}) => {

    if (
        !landmarkerRef?.current ||
        !videoRef?.current ||
        !animationRef ||
        !setExpression
    ) return;

    const mapMood = (exp) => {
        if (exp.includes("Happy")) return "Happy";
        if (exp.includes("Sad")) return "Sad";
        if (exp.includes("Angry")) return "Angry";
        if (exp.includes("Surprise")) return "Surprise";
        return "neutral";
    };

    if (!landmarkerRef.current || !videoRef.current) return;

    const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
    );

    // ✅ Safe check
    if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;

        const getScore = (name) =>
            blendshapes.find((b) => b.categoryName === name)?.score || 0;

        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen = getScore("jawOpen");
        const browUp = getScore("browInnerUp");
        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");

        let currentExpression = "😐 Neutral";

        if (smileLeft > 0.5 && smileRight > 0.5) {
            currentExpression = "😊 Happy";
        }
        else if (jawOpen > 0.6 && browUp > 0.5) {
            currentExpression = "😲 Surprise";
        }
        else if (
            (getScore("browDownLeft") > 0.3 &&
                getScore("browDownRight") > 0.3) ||
            (getScore("eyeSquintLeft") > 0.4 &&
                getScore("eyeSquintRight") > 0.4)
        ) {
            currentExpression = "😡 Angry";
        }
        else if (frownLeft > 0.01 && frownRight > 0.01) {
            currentExpression = "😢 Sad";
        }

        setExpression(currentExpression);

        // ✅ ADD THIS RIGHT BELOW setExpression
        if (!hasFetchedRef.current && fetchSongs) {
            const mood = mapMood(currentExpression);
            fetchSongs(mood);
            hasFetchedRef.current = true;

            cancelAnimationFrame(animationRef.current);
            if (navigate) {
                navigate("/songs");
              }
        }

    } else {
        setExpression("No face detected");
    }

    animationRef.current = requestAnimationFrame(() =>
        detect({
            landmarkerRef,
            videoRef,
            animationRef,
            setExpression,
            fetchSongs,
            hasFetchedRef,
        })
    );
};