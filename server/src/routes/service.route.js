const { Router } = require("express");
const serviceController = require("../controllers/service.controller");
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
  asyncHandler(serviceController.getList)
);

router.get(
  "/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(serviceController.getById)
);

router.post(
  "/create",
  authMiddleware,
  checkRoles(["admin"]),
  asyncHandler(serviceController.create)
);

router.put(
  "/update/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(serviceController.update)
);

router.delete(
  "/delete/:id",
  authMiddleware,
  checkRoles(["admin"]),
  asyncHandler(serviceController.delete)
);

module.exports = router;
