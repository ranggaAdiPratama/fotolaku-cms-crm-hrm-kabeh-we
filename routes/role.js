import express from "express";

import * as controller from "../controllers/role.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/roles
router.get(
  "/roles",
  middleware.auth,
  controller.index
);

// NOTE POST /api/roles
router.post(
  "/roles",
  middleware.auth,
  controller.store
);

// NOTE PUT /api/roles/:id
router.put(
  "/roles/:id",
  middleware.auth,
  controller.update
);

// NOTE DELETE /api/roles/:id
router.delete(
  "/roles/:id",
  middleware.auth,
  controller.destroy
);

export default router;