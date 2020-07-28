const express = require("express");
const router = express.Router();
const JobCategoryController = require("../controllers/jobcategory");

/*
***************************ROUTES***********************************
*/
router.get("/jobcategory", JobCategoryController.getJobCategories);
router.get("/jobcategory/:id", JobCategoryController.getJobCategory);
router.delete("/jobcategory/:id", JobCategoryController.deleteJobCategory);
router.post("/jobcategory/", JobCategoryController.createJobCategory);
router.put("/jobcategory/:id", JobCategoryController.updateJobCategory);

module.exports = router;
