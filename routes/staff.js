import express from "express";

import * as controller from "../controllers/staff.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/models
router.get("/staffs", middleware.auth, controller.index);

export default router;
