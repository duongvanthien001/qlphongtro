const { Router } = require("express");

const router = Router();

router.use("/analyst", require("./analyst.route"));
router.use("/rooms", require("./room.route"));
router.use("/auth", require("./auth.route"));
router.use("/users", require("./user.route"));
router.use("/tenants", require("./tenant.route"));

module.exports = router;
