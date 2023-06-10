import express from "express";

import * as controller from "../controllers/userSource.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/user-sources
router.get("/user-sources", middleware.auth, controller.index);
router.post("/user-source", middleware.auth, controller.store);
router.put("/user-source/:id", middleware.auth, controller.update);
router.delete("/user-source/:id", middleware.auth, controller.destroy);

export default router;
