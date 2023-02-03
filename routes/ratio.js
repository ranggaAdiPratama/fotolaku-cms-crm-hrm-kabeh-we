import express from "express";

import * as controller from "../controllers/ratio.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/ratios
router.get("/ratios", middleware.auth, controller.index);

export default router;
