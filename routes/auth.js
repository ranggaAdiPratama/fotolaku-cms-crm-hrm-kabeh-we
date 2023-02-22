import express from "express";

import * as controller from "../controllers/auth.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE POST /api/auth/login
router.post("/login", controller.login);
router.get("/test", middleware.auth, controller.test);
// NOTE POST /api/auth/logout
router.post("/logout", middleware.auth, controller.logout);

export default router;
