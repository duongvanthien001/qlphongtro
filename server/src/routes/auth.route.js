const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const asyncHandler = require("express-async-handler");

const router = Router();

router.post("/login", asyncHandler(authController.login));
router.post("/refresh-token", asyncHandler(authController.refreshToken));

module.exports = router;
