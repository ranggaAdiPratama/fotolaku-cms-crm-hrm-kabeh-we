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
// NOTE PUT /api/project/assign/:id
router.put(
  "/project/assign/:id",
  middleware.auth,
  middleware.checkPermission("view all SP card"),
  controller.assign
);

export default router;
