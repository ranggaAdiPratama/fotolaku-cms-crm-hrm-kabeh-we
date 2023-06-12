import express from "express";

import * as controller from "../controllers/followUpNotification.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/notification/follow-up
router.get("/notification/follow-up", middleware.auth, controller.index);
// NOTE POST /api/notification/follow-up/:id
router.post("/notification/follow-up/:id", middleware.auth, controller.done);

export default router;
