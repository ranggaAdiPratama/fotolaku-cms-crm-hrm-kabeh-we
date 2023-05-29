import express from "express";

import * as controller from "../controllers/userSource.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/user-sources
router.get("/user-sources", middleware.auth, controller.index);

export default router;
