const { Router } = require("express");

const router = Router();

router.use("/analyst", require("./analyst.route"));
router.use("/rooms", require("./room.route"));
router.use("/auth", require("./auth.route"));
router.use("/users", require("./user.route"));
router.use("/services", require("./service.route"));
router.use("/maintenances", require("./maintenances.route"));
router.use("/contracts", require("./contract.route"));
router.use("/bills", require("./bill.route"));
router.use("/payments", require("./payments.route"));

module.exports = router;
