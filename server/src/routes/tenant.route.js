const { Router } = require("express");

const tenantController = require("../controllers/tenant.controller");
const asyncHandler = require("express-async-handler");
const {
  authMiddleware,
  checkRoles,
} = require("../middlewares/auth.middleware");

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(tenantController.getList)
);

module.exports = router;
