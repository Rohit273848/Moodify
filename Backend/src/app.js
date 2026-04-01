import express from "express";
import dotenv from "dotenv";
import router from "../routes/auth.routes.js"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", router);

export default app;