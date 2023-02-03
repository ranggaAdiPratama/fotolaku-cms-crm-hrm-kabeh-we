import express from "express";

import * as controller from "../controllers/permission.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/roles
router.get(
  "/permissions",
  middleware.auth,
  controller.index
);

export default router;