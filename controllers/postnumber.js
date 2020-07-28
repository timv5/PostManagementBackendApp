//import shema
const PostNumber = require('../models/postnumber');

// status config
const StatusConfig = require("../utils/endpointStatus");

/*
***************************GET REQUEST***********************************
*/
exports.getPostNumbers = (req, res, next) => {
    const postQuery = PostNumber.find()
        .catch(() => {
            res.status(StatusConfig.clientError["404"].status).json(
                StatusConfig.clientError["404"].message
            );
        });
    let fetchedPosts;
    postQuery
    .then(documents => {
        fetchedPosts = documents;
        return PostNumber.countDocuments()
            .catch(() => {
                res.status(StatusConfig.clientError["404"].status).json(
                    StatusConfig.clientError["404"].message
                );
            });
    })
    .then(count => {
        res.status(StatusConfig.success["200"].status).json({
            message: StatusConfig.success["200"].message,
            posts: fetchedPosts,
            maxPosts: count
        });
    })
    .catch(() => {
        res.status(StatusConfig.serverError["500"].status).json(
            StatusConfig.serverError["500"].message
        );
    });
};

/*
***************************GET REQUEST***********************************
  BY ID
*/
exports.getPostNumber = (req, res, next) => {
    PostNumber.findById(req.params.id).then(postNumber => {
        if (postNumber) {
            res.status(StatusConfig.success["200"].status).json({
                message: StatusConfig.success["200"].message,
                postNumber: postNumber
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

/*
***************************DELETE REQUEST***********************************
*/
exports.deletePostNumber = (req, res, next) => {
    PostNumber.deleteOne({_id: req.params.id})
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
exports.createPostNumber = (req, res, next) => {
    const postNumber = new PostNumber({
        city: req.body.city,
        number: req.body.number
    });
    postNumber.save()
        .then(createdPostNumber => {
            res.status(StatusConfig.success["201"].status).json({
                message: StatusConfig.success["201"].message,
                postNum: {
                    id: createdPostNumber._id,
                    city: createdPostNumber.city,
                    number: createdPostNumber.number
                }
            });
        })
    .catch(() => {
        res.status(StatusConfig.serverError["500"].status).json(
            StatusConfig.serverError["500"].message
        )
    });
};

/*
***************************PUT/UPDATE REQUEST***********************************
*/
exports.updatePostNumber = (req, res, next) => {
    const postNum = new PostNumber({
        _id: req.params.id,
        city: req.body.city,
        number: req.body.number
    });
    PostNumber.updateOne({_id: req.params.id}, postNum).then(result => {
        if (result.n > 0) {
            res.status(StatusConfig.success["201"].status).json(
                StatusConfig.success["201"].message
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
