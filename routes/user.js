import express from "express";

import * as controller from "../controllers/user.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/users
router.get(
  "/users",
  middleware.auth,
  middleware.checkPermission("view user"),
  controller.index
);
// NOTE GET /api/user/:id
router.get(
  "/user/:id",
  middleware.auth,
  middleware.checkPermission("view user"),
  controller.show
);
// NOTE POST /api/user
router.post("/user", controller.store);
// NOTE PUT /api/user/:id
router.put(
  "/user/:id",
  middleware.auth,
  // middleware.checkPermission("update user"),
  controller.update
);
// NOTE DELETE /api/user/:id
router.delete(
  "/user/:id",
  middleware.auth,
  middleware.checkPermission("delete user"),
  controller.destroy
);

export default router;
