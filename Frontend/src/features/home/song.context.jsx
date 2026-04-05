import { createContext, useContext, useState } from "react";
import { getSongsByMood } from "./services/song.service";

const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [mood, setMood] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSongs = async (detectedMood) => {
    setMood(detectedMood);
    setLoading(true);

    const data = await getSongsByMood(detectedMood);
    setSongs(data);

    setLoading(false);
  };

  return (
    <SongContext.Provider value={{ mood, songs, loading, fetchSongs }}>
      {children}
    </SongContext.Provider>
  );
};

export const useSongs = () => useContext(SongContext);