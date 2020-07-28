const DateControl = require("../models/dateControl");

// status config
const StatusConfig = require("../utils/endpointStatus");

/*
*   ************* GET ***************
 */
exports.getDateControlById = (req, res, next) => {
    if(!req.params.id){
        res.status(StatusConfig.clientError["400"].status).json(
            StatusConfig.clientError["400"].message
        );
    }else{
        DateControl.findById(req.params.id).then(dateControl => {
            if(dateControl) {
                res.status(StatusConfig.success["200"].status).json({
                    message: StatusConfig.success["200"].message,
                    dateControl: dateControl
                });
            }else {
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
    }
};

exports.getDateControlByPostId = (req, res, next) => {
    if(!req.params.id){
        res.status(StatusConfig.clientError["400"].status).json(
            StatusConfig.clientError["400"].message
        );
    }else {
        DateControl.findOne({postId: req.params.id})
        .then(dateControl => {
            if (dateControl) {
                return res.status(StatusConfig.success["200"].status).json({
                    message: StatusConfig.success["200"].message,
                    postDateControl: dateControl
                });
            } else {
                return res.status(StatusConfig.clientError["404"].status).json(
                    StatusConfig.clientError["404"].message
                );
            }
        })
        .catch(() => {
            res.status(StatusConfig.serverError["500"].status).json(
                StatusConfig.serverError["500"].message
            );
        })
    }
};

/*
*   ******************* DELETE ********************
 */
exports.deleteDateControl = (req, res, next) => {
    if(!req.params.id){
        res.status(StatusConfig.clientError["400"].status).json(
            StatusConfig.clientError["400"].message
        );
    }else {
        DateControl.deleteOne({_id: req.params.id})
        .then(result => {
            if (result.n > 0) {
                res.status(StatusConfig.success["200"].status).json({
                    message: StatusConfig.success["200"].message
                });
            } else {
                res.status(StatusConfig.success["404"].status).json(
                    StatusConfig.success["404"].message
                );
            }
        })
        .catch(() => {
            res.status(StatusConfig.clientError["500"].status).json(
                StatusConfig.clientError["500"].message
            );
        });
    }
};

/*
***************************PUT/UPDATE REQUEST***********************************
*/
exports.updateDateControl = (req, res, next) => {
    const dateControlModel = new DateControl({
        _id: req.params.id,
        dateTimeFrom: req.body.dateTimeFrom,
        dateTimeTo: req.body.dateTimeTo,
        dateTimeCreated: req.body.dateTimeCreated,
        dateTimeEdited: req.body.dateTimeEdited
    });

    DateControl.updateOne({_id: req.params.id}, dateControlModel).then(result => {
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

/*
***************************POST REQUEST***********************************
*/
exports.createDateControl = (req, res, next) => {
    const dateControlModel = new DateControl({
        dateTimeFrom: req.body.dateTimeFrom,
        dateTimeTo: req.body.dateTimeTo,
        dateTimeCreated: req.body.dateTimeCreated,
        dateTimeEdited: req.body.dateTimeEdited
    });
    dateControlModel.save()
        .then(createdDateControl => {
            res.status(StatusConfig.success["201"].status).json({
                message: StatusConfig.success["201"].message,
                dateControlRes: {
                    id: createdDateControl._id,
                    dateTimeFrom: createdDateControl.dateTimeFrom,
                    dateTimeTo: createdDateControl.dateTimeTo,
                    dateTimeCreated: createdDateControl.dateTimeCreated,
                    dateTimeEdited: createdDateControl.dateTimeEdited
                }
            });
        })
    .catch(() => {
        res.status(StatusConfig.serverError["500"].status).json(
            StatusConfig.serverError["500"].message
        )
    });
};
