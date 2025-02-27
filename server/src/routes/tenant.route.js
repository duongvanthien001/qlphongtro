const { Router } = require("express");

const tenantController = require("../controllers/tenant.controller");
const asyncHandler = require("express-async-handler");
const { authMiddleware, checkRole } = require("../middlewares/auth.middleware");

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkRole(["owner"]),
  asyncHandler(tenantController.getAll)
);

module.exports = router;
