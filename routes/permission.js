import express from "express";

import * as controller from "../controllers/permission.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/permissions
router.get(
  "/permissions",
  middleware.auth,
  middleware.checkPermission("view role and permission"),
  controller.index
);

// NOTE GET /api/permission/:id
router.get(
  "/permission/:id",
  middleware.auth,
  middleware.checkPermission("view role and permission"),
  controller.show
);

// NOTE POST /api/permission
router.post(
  "/permission",
  middleware.auth,
  middleware.checkPermission("add role and permission"),
  controller.store
);

// NOTE PUT /api/permission/:id
router.put(
  "/permission/:id",
  middleware.auth,
  middleware.checkPermission("update role and permission"),
  controller.update
);

// NOTE DELETE /api/permission/:id
router.delete(
  "/permission/:id",
  middleware.auth,
  middleware.checkPermission("delete role and permission"),
  controller.destroy
);

export default router;
