import express from "express";

import * as controller from "../controllers/theme.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/themes
router.get("/themes", middleware.auth, controller.index);

export default router;
