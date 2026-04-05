import express from "express";
import dotenv from "dotenv";
import authRouter from "../routes/auth.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import songRouter from "../routes/song.routes.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
      origin: "https://moodify-my.vercel.app",
      credentials: true,
    })
  );

app.use("/api/auth", authRouter);
app.use("/api/songs",songRouter)

export default app;
