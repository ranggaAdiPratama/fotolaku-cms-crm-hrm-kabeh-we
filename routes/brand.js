import express from "express";

import * as controller from "../controllers/brand.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/brands
router.get("/brands", middleware.auth, controller.index);

export default router;
