//import shema
const Rate = require('../models/rate');

// status config
const StatusConfig = require("../utils/endpointStatus");


/*
***************************GET REQUEST***********************************
*/
exports.getRates = (req, res, next) => {
    let fetchedRate;
    Rate.find()
    .then(documents => {
        fetchedRate = documents;
        return Rate.countDocuments();
    })
    .then(count => {
        res.status(StatusConfig.success["200"].status).json({
            message: StatusConfig.success["200"].message,
            rates: fetchedRate,
            maxRates: count
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
exports.getRate = (req, res, next) => {
    Rate.findById(req.params.id).then(rate => {
        if (rate) {
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

/*
***************************POST REQUEST***********************************
*/
exports.createRate = (req, res, next) => {
    const rate = new Rate({
        user: req.params.id,
        workerRate: req.body.workerRate,
        employeeRate: req.body.employeeRate
    });
    rate.save()
    .then(createdRate => {
        res.status(StatusConfig.success["201"].status).json({
            message: StatusConfig.success["201"].message,
            rateRes: {
                id: createdRate._id,
                user: createdRate.user,
                workerRate: createdRate.workerRate,
                employeeRate: createdRate.employeeRate
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
***************************DELETE REQUEST***********************************
*/
exports.deleteRate = (req, res, next) => {
    Rate.deleteOne({_id: req.params.id})
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
***************************PUT/UPDATE REQUEST***********************************
*/
exports.updateRate = (req, res, next) => {
    const rate = new Rate({
        _id: req.params.id,
        user: req.body.id,
        workerRate: req.body.workerRate,
        employeeRate: req.body.employeeRate
    });
    Rate.updateOne({_id: req.params.id}, rate)
    .then(result => {
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
