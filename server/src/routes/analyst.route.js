const { Router } = require("express");
const expressAsyncHandler = require("express-async-handler");
const analystController = require("../controllers/analyst.controller");
const {
  checkRoles,
  authMiddleware,
} = require("../middlewares/auth.middleware");

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkRoles(["admin", "staff"]),
  expressAsyncHandler(analystController.getAnalyst)
);

module.exports = router;
