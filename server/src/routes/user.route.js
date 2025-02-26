const { Router } = require("express");

const userController = require("../controllers/user.controller");
const asyncHandler = require("express-async-handler");
const { authMiddleware, checkRole } = require("../middlewares/auth.middleware");

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkRole(["owner"]),
  asyncHandler(userController.getList)
);
router.post("/create", asyncHandler(userController.create));
router.put("/update/:id", authMiddleware, asyncHandler(userController.update));
router.delete(
  "/delete/:id",
  authMiddleware,
  asyncHandler(userController.delete)
);

module.exports = router;
