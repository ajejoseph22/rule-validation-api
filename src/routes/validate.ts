import express from "express";
import validate from "../controllers/validate";

const router = express.Router();

router.post("/", validate);

export default router;
