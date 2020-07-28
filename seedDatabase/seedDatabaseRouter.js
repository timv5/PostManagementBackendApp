const express = require("express");
const router = express.Router();
const SeedDatabaseControlController = require("./seedDatabaseController");

/*
*   ******************* ROUTES *******************
 */
router.get("/seeddatabase", SeedDatabaseControlController.seedAllData);
router.get("/seedusers", SeedDatabaseControlController.seedUsers);

module.exports = router;
