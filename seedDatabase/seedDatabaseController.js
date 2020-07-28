// UTILS
const bcrypt = require("bcrypt");

// MONGO COLLECTIONS/MONGOOSE SHEMAS
const DateControl = require("../models/dateControl");
const JobCategory = require("../models/jobcategory");
const Post = require("../models/post");
const PostNumber = require("../models/postnumber");
const Rate = require("../models/rate");
const User = require("../models/user");

// DATA
const PostNumberData = require("./data/postNumbersSeedData");
const JobCategoryData = require("./data/jobCategorySeedData");
const PostData = require("./data/postSeedData");
const DateControlData = require("./data/dateControlSeedData");
const RateData = require("./data/rateSeedData");
const UserData = require("./data/userSeedData");


// seed users
exports.seedUsers = (req, res, next) => {

    User.deleteMany({})
        .catch(error => {
            res.status(500).json({
                message: 'Deleting users failed!',
                error: error
            });
        });

    PostNumber.find({}).limit(UserData.userData.length)
        .then(postnumbers => {
            if (!postnumbers) {
                res.status(404).json({
                    message: 'cant get post numbers'
                });
            }
            return postnumbers;
        })
        .then(postnumbers => {

            // save postnumbers to users
            for (var key in UserData.userData) {
                var object = UserData.userData[key];
                var postNumbersToSave = postnumbers[key];
                // get user data
                const user = new User({
                    email: object.email,
                    password: object.password,
                    isVerified: object.isVerified,
                    confirmationToken: object.confirmationToken,
                    phone: object.phone,
                    name: object.name,
                    lastName: object.lastName,
                    workerAvg: object.workerAvg,
                    employeeAvg: object.employeeAvg,
                    postNumber: postNumbersToSave._id,
                    post: [],
                    rate: []
                });
                user.save();
            }

            res.status(200).json({
                message: 'Users seeded'
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Cant fetch postnumbers',
                error: error
            });
        });
};

// DB init seed ENDPOINT
exports.seedAllData = (req, res, next) => {

    /*
    ********************* POST NUMBERS ********************
    */

    Post.deleteMany({})
        .catch(error => {
            res.status(500).json({
                message: 'Deleting posts failed!',
                error: error
            });
        });


    /*
    * ******************** POST NUMBERS ********************
     */
    PostNumber.deleteMany({})
        .catch(error => {
            res.status(500).json({
                message: 'Deleting post numbers failed!',
                error: error
            });
        });

    for(var key in PostNumberData.postNumbersData) {
        var object = PostNumberData.postNumbersData[key];
        const postNumber = new PostNumber({
            number: object.number,
            city: object.city
        });
        postNumber.save()
            .catch(error => {
                res.status(500).json({
                    message: 'Creating a post failed'
                })
            });
    }

    /*
    * ******************** JOB CATEGORY ********************
     */
    JobCategory.deleteMany({})
        .catch(error => {
            res.status(500).json({
                message: 'Deleting job categories failed!',
                error: error
            });
        });

    for(var key in JobCategoryData.jobCategoryData) {
        var object = JobCategoryData.jobCategoryData[key];
        const jobCategory = new JobCategory({
            name: object.name,
            numberOfUsage: object.numberOfUsage
        });
        jobCategory.save()
            .catch(error => {
                res.status(500).json({
                    message: 'Creating a job category failed',
                    error: error
                })
            });
    }

    /*
    * ******************** JOB CATEGORY ********************
     */
    DateControl.deleteMany({})
        .catch(error => {
            res.status(500).json({
                message: 'Deleting date control failed!',
                error: error
            });
        });

    for(var key in DateControlData.dateControl) {
        var object = DateControlData.dateControl[key];
        const dateControl = new DateControl({
            dateTimeFrom: object.dateTimeFrom,
            dateTimeTo: object.dateTimeTo,
            dateTimeCreated: object.dateTimeCreated,
            dateTimeEdited: object.dateTimeEdited
        });
        dateControl.save()
            .catch(error => {
                res.status(500).json({
                    message: 'Creating a date control failed',
                    error: error
                })
            });
    }

    /*
    * ******************** RATE ********************
    */
    Rate.deleteMany({})
        .catch(error => {
            res.status(500).json({
                message: 'Deleting rates failed!',
                error: error
            });
        });

    for(var key in RateData.rateData) {
        var object = RateData.rateData[key];
        const rate = new Rate({
            workerRate: object.workerRate,
            employeeRate: object.employeeRate
        });
        rate.save()
            .catch(error => {
                res.status(500).json({
                    message: 'Creating a rates failed',
                    error: error
                })
            });
    }

    /*
    * RETURN 200 IF EVERYTHING OK
     */
    res.status(200).json({
        message: 'Database seeded'
    });
};

