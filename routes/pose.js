import express from "express";

import * as controller from "../controllers/pose.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/poses
router.get("/poses", middleware.auth, controller.index);

export default router;
