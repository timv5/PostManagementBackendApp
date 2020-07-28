const express = require("express");
const router = express.Router();
const RateController = require("../controllers/rate");

/*
***************************ROUTES***********************************
*/
router.get("/rate", RateController.getRates);
router.get("/rate/:id", RateController.getRate);
router.post("/rate/:id", RateController.createRate);
router.delete("/rate/:id", RateController.deleteRate);
router.put("/rate/:id", RateController.updateRate);

module.exports = router;
