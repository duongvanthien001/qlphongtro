const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const roomController = require("../controllers/room.controller");
const {
  authMiddleware,
  checkRoles,
} = require("../middlewares/auth.middleware");

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(roomController.getList)
);
router.get(
  "/current-user",
  authMiddleware,
  checkRoles(["tenant"]),
  (req, _res, next) => {
    req.query.tenant_id = req.user.tenant_id;
    next();
  },
  asyncHandler(roomController.getList)
);
router.get(
  "/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(roomController.getById)
);
router.post(
  "/create",
  authMiddleware,
  checkRoles(["admin"]),
  asyncHandler(roomController.create)
);
router.put(
  "/update/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(roomController.update)
);
router.delete(
  "/delete/:id",
  authMiddleware,
  checkRoles(["admin"]),
  asyncHandler(roomController.delete)
);

module.exports = router;
