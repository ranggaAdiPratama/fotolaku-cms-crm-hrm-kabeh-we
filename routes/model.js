import express from "express";

import * as controller from "../controllers/model.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/models
router.get("/models", middleware.auth, controller.index);
// NOTE POST /api/model/:id
router.post("/model/:id", middleware.auth, controller.updateDetail);

export default router;
