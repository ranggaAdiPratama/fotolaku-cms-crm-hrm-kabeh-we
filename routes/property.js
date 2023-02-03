import express from "express";

import * as controller from "../controllers/property.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/properties
router.get("/properties", middleware.auth, controller.index);

export default router;
