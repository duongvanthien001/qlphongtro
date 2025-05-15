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

router.get(
  "/current",
  authMiddleware,
  checkRoles(["tenant"]),
  (req, _res, next) => {
    req.query.tenant_id = req.user.tenant_id;
    next();
  },
  asyncHandler(maintenancesController.getList)
);

router.get(
  "/:id",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  asyncHandler(maintenancesController.getById)
);

router.post(
  "/create",
  authMiddleware,
  checkRoles(["tenant"]),
  (req, res, next) => {
    req.body.tenant_id = req.user.tenant_id;
    next();
  },
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
