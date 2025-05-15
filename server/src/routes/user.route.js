const { Router } = require("express");

const userController = require("../controllers/user.controller");
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
  asyncHandler(userController.getList)
);
router.get("/me", authMiddleware, asyncHandler(userController.getCurrent));
router.get(
  "/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(userController.getById)
);
router.post(
  "/create",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(userController.create)
);
router.put(
  "/update/me",
  authMiddleware,
  asyncHandler(userController.updateProfile)
);
router.put(
  "/update/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(userController.update)
);
router.put(
  "/change-password",
  authMiddleware,
  asyncHandler(userController.changePassword)
);
router.delete(
  "/delete/:id",
  authMiddleware,
  checkRoles(["admin"]),
  asyncHandler(userController.delete)
);

module.exports = router;
