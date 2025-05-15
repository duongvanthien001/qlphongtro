const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const {
  authMiddleware,
  checkRoles,
} = require("../middlewares/auth.middleware");
const contractController = require("../controllers/contract.controller");

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(contractController.getList)
);
router.get(
  "/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(contractController.getById)
);
router.post(
  "/create",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(contractController.create)
);
router.put(
  "/update/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(contractController.update)
);
router.delete(
  "/delete/:id",
  authMiddleware,
  checkRoles(["admin"]),
  asyncHandler(contractController.delete)
);

module.exports = router;
