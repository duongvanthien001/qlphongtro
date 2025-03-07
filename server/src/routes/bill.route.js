const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const {
  authMiddleware,
  checkRoles,
} = require("../middlewares/auth.middleware");
const billController = require("../controllers/bill.controller");

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  billController.getList
);
router.get(
  "/current-user",
  authMiddleware,
  checkRoles(["tenant"]),
  (req, _res, next) => {
    req.query.tenant_id = req.user.tenant_id;
    next();
  },
  billController.getList
);
router.get(
  "/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  billController.getById
);
router.post(
  "/create",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  billController.create
);
router.put(
  "/update/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  billController.update
);
router.delete(
  "/delete/:id",
  authMiddleware,
  checkRoles(["admin"]),
  billController.delete
);

module.exports = router;
