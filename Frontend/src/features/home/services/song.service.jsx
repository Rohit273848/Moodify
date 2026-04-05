import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const getSongsByMood = async (mood) => {
  try {
    const res = await API.get(`/songs?mood=${mood}`);
    console.log("Fetched songs:", res.data);
    
    return res.data.songs;
  } catch (error) {
    console.error(error);
    return [];
  }
};