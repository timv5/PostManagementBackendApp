const express = require("express");
const router = express.Router();
const DateControlController = require("../controllers/dateControl");

/*
*   ******************* ROUTES *******************
 */
router.get("/dateControl/:id", DateControlController.getDateControlById);
router.delete("/dateControl/:id", DateControlController.deleteDateControl);
router.put("/dateControl/:id", DateControlController.updateDateControl);
router.post("/dateControl", DateControlController.createDateControl);

module.exports = router;
