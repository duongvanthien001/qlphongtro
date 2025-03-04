const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const {
  authMiddleware,
  checkRoles,
} = require("../middlewares/auth.middleware");
const maintenancesController = require("../controllers/maintenances.controller");

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(maintenancesController.getList)
);

router.post(
  "/create",
  authMiddleware,
  checkRoles(["admin", "staff", "tenant"]),
  asyncHandler(maintenancesController.create)
);

router.put(
  "/update/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(maintenancesController.update)
);

router.delete(
  "/delete/:id",
  authMiddleware,
  checkRoles(["admin"]),
  asyncHandler(maintenancesController.delete)
);

module.exports = router;
