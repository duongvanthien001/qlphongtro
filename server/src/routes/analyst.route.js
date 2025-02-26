const { Router } = require("express");
const expressAsyncHandler = require("express-async-handler");
const analystController = require("../controllers/analyst.controller");

const router = Router();

router.get("/", expressAsyncHandler(analystController.getAnalyst));

module.exports = router;
