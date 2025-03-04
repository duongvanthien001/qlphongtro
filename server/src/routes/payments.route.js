const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const {
  authMiddleware,
  checkRoles,
} = require("../middlewares/auth.middleware");
const paymentController = require("../controllers/payment.controller");

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  paymentController.getList
);
router.post(
  "/create",
  authMiddleware,
  checkRoles(["admin"]),
  asyncHandler(paymentController.create)
);
router.put(
  "/update/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(paymentController.update)
);
router.delete(
  "/delete/:id",
  authMiddleware,
  checkRoles(["admin"]),
  asyncHandler(paymentController.delete)
);

module.exports = router;
