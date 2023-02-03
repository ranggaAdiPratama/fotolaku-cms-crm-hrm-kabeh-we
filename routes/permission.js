import express from "express";

import * as controller from "../controllers/permission.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/permissions
router.get(
  "/permissions",
  middleware.auth,
  controller.index
  );
  
// NOTE POST /api/permissions
router.post(
  "/permissions",
  middleware.auth,
  controller.store
);

// NOTE PUT /api/permissions/:id
router.put(
  "/permissions/:id",
  middleware.auth,
  controller.update
);

// NOTE DELETE /api/permissions/:id
router.delete(
  "/permissions/:id",
  middleware.auth,
  controller.destroy
);

export default router;