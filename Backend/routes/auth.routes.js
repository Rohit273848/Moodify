import express from "express";
import Controller from "../controllers/auth.controller.js";
import {authUser} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.get("/get-me", authUser, Controller.getme);

export default router;