import express from "express";

import * as controller from "../controllers/invoice.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/invoice/{number}
router.get(
  "/invoice/:number",
  middleware.auth,
  middleware.checkPermission("add crud card"),
  controller.show
);
// NOTE POST /api/invoice
router.post(
  "/invoice",
  middleware.auth,
  middleware.checkPermission("add crud card"),
  controller.store
);

export default router;
