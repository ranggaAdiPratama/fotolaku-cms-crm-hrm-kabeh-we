import express from "express";

import * as controller from "../controllers/angle.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/angles
router.get("/angles", middleware.auth, controller.index);

export default router;
