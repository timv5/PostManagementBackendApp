const express = require("express");
const router = express.Router();
const PostNumberController = require("../controllers/postnumber");

/*
***************************ROUTES***********************************
*/
router.get("/postnumber", PostNumberController.getPostNumbers);
router.get("/postnumber/:id", PostNumberController.getPostNumber);
router.delete("/postnumber/:id", PostNumberController.deletePostNumber);
router.post("/postnumber/", PostNumberController.createPostNumber);
router.put("/postnumber/:id", PostNumberController.updatePostNumber);

module.exports = router;
