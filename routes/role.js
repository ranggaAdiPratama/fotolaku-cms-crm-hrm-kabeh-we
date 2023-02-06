import express from "express";

import * as controller from "../controllers/role.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/roles
router.get(
  "/roles",
  middleware.auth,
  middleware.checkPermission("view role and permission"),
  controller.index
);
// NOTE GET /api/role/:id
router.get(
  "/role/:id",
  middleware.auth,
  middleware.checkPermission("view role and permission"),
  controller.show
);
// NOTE POST /api/roles
router.post(
  "/roles",
  middleware.auth,
  middleware.checkPermission("add role and permission"),
  controller.store
);
// NOTE PUT /api/roles/:id
router.put(
  "/role/:id",
  middleware.auth,
  middleware.checkPermission("update role and permission"),
  controller.update
);
// NOTE DELETE /api/roles/:id
router.delete(
  "/role/:id",
  middleware.auth,
  middleware.checkPermission("delete role and permission"),
  controller.destroy
);

export default router;
