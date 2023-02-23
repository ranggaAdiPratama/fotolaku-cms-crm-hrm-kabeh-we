import express from "express";

import * as controller from "../controllers/module.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/modules
router.get(
  "/modules",
  middleware.auth,
  controller.index
);

export default router;