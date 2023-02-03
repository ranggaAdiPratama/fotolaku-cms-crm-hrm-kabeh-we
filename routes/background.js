import express from "express";

import * as controller from "../controllers/background.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/backgrounds
router.get("/backgrounds", middleware.auth, controller.index);

export default router;
