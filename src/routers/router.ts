import { Router } from "express";
import { postUserName } from "../controllers/controller.js";

const router = Router();

router.post("/battle", postUserName);
//router.get("/ranking", getRanking);

export default router;