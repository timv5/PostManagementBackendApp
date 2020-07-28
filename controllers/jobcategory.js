const JobCategory = require('../models/jobcategory');

// status config
const StatusConfig = require("../utils/endpointStatus");

/*
***************************GET REQUEST***********************************
*/
exports.getJobCategories = (req, res, next) => {
    const jobCategoryQuery = JobCategory.find();
    let fetchedJobCategory;
    jobCategoryQuery
    .then(documents => {
        fetchedJobCategory = documents;
        return JobCategory.countDocuments();
    })
    .then(count => {
        res.status(StatusConfig.success["200"].status).json({
            message: StatusConfig.success["200"].message,
            jobcategories: fetchedJobCategory,
            maxJobCategory: count
        });
    })
    .catch(() => {
        res.status(StatusConfig.serverError["500"].status).json(StatusConfig.serverError["500"].message);
    });
};

/*
***************************GET REQUEST***********************************
  BY ID
*/
exports.getJobCategory = (req, res, next) => {
    JobCategory.findById(req.params.id).then(jobcategory => {
        if (jobcategory) {
            res.status(StatusConfig.success["200"].status).json({
                message: StatusConfig.success["200"].message,
                jobcategory: jobcategory
            });
        } else {
            res.status(StatusConfig.clientError["404"].status).json(
                StatusConfig.clientError["404"].message
            );
        }
    })
    .catch(error => {
        res.status(StatusConfig.serverError["500"].status).json(
            StatusConfig.serverError["500"].message
        );
    });
};

/*
***************************DELETE REQUEST***********************************
*/
exports.deleteJobCategory = (req, res, next) => {
    JobCategory.deleteOne({_id: req.params.id})
        .then(result => {
            if (result.n > 0) {
                res.status(StatusConfig.success["200"].status).json(
                    StatusConfig.success["200"].message
                );
            } else {
                res.status(StatusConfig.clientError["404"].status).json(
                    StatusConfig.clientError["404"].message
                );
            }
        })
        .catch(() => {
            res.status(StatusConfig.serverError["500"].status).json(
                StatusConfig.serverError["500"].message
            );
        });
};

/*
***************************POST REQUEST***********************************
*/
exports.createJobCategory = (req, res, next) => {
    const joCatAdded = new JobCategory({
        name: req.body.name,
        numberOfUsage: req.body.numberOfUsage
    });
    joCatAdded.save()
    .then(createdJobCategory => {
        res.status(StatusConfig.success["201"].status).json({
            message: StatusConfig.success["201"].message,
            rateRes: {
                id: createdJobCategory._id,
                name: createdJobCategory.name,
                numberOfUsage: createdJobCategory.numberOfUsage
            }
        });
    })
    .catch(() => {
        res.status(StatusConfig.serverError["500"].status).json(
            StatusConfig.serverError["500"].message
        );
    });
};

/*
***************************PUT/UPDATE REQUEST***********************************
*/
exports.updateJobCategory = (req, res, next) => {
    const jobCatUpdate = new JobCategory({
        _id: req.params.id,
        name: req.body.name,
        numberOfUsage: req.body.numberOfUsage
    });
    JobCategory.updateOne({_id: req.params.id}, jobCatUpdate).then(result => {
        if (result.n > 0) {
            res.status(StatusConfig.success["200"].status).json({
                message: StatusConfig.success["200"].message,
                rate: rate
            });
        } else {
            res.status(StatusConfig.clientError["404"].status).json(
                StatusConfig.clientError["404"].message
            );
        }
    })
    .catch(() => {
        res.status(StatusConfig.serverError["500"].status).json(
            StatusConfig.serverError["500"].message
        );
    });
};
