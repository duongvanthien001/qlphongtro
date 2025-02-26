const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const roomController = require("../controllers/room.controller");
const { authMiddleware, checkRole } = require("../middlewares/auth.middleware");

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkRole(["owner"]),
  asyncHandler(roomController.getList)
);
router.get(
  "/:id",
  authMiddleware,
  checkRole(["owner"]),
  asyncHandler(roomController.getById)
);
router.post(
  "/create",
  authMiddleware,
  checkRole(["owner"]),
  asyncHandler(roomController.create)
);
router.put(
  "/update/:id",
  authMiddleware,
  checkRole(["owner"]),
  asyncHandler(roomController.update)
);
router.delete(
  "/delete/:id",
  authMiddleware,
  checkRole(["owner"]),
  asyncHandler(roomController.delete)
);

module.exports = router;
