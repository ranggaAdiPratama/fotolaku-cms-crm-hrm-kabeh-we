import express from "express";

import * as controller from "../controllers/sales.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/sales
router.get("/sales", middleware.auth, controller.index);

export default router;
