import express from "express";

import * as controller from "../controllers/userActivity.js";
import * as middleware from "../middleware.js";

const router = express.Router();
// NOTE GET /api/user-activities
router.get("/user-activities", middleware.auth, controller.index);
// NOTE GET /api/user-activities
router.post("/user-activities", middleware.auth, controller.filter);

export default router;
