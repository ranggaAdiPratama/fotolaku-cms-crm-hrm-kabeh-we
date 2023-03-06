import express from "express";

import * as controller from "../controllers/project.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/projects
router.get(
  "/projects",
  middleware.auth,
  middleware.checkPermission("view all SP card"),
  controller.index
);
// NOTE GET /api/project/status
router.get(
  "/project/status",
  middleware.auth,
  middleware.checkPermission("view all SP card"),
  controller.statusList
);
// NOTE PUT /api/project/assign/:id
router.put(
  "/project/assign/:id",
  middleware.auth,
  middleware.checkPermission("view all SP card"),
  controller.assign
);
// NOTE PUT /api/project/status/:id
router.put(
  "/project/status/:id",
  middleware.auth,
  middleware.checkPermission("view all SP card"),
  controller.statusUpdate
);

export default router;
