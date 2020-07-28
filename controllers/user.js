// config
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Mongo shemas
const User = require("../models/user");
const VerificationToken = require("../models/verificationToken");
const ForgottenPasswordToken = require("../models/forgottenPasswordToken");

// status config
const StatusConfig = require("../utils/endpointStatus");


const EMAIL_VERIFICATION_TOKEN_LINK = "http://localhost:4200/verify/email/";
const EMAIL_FORGOTTEN_PASS_TOKEN_LINK = "http://localhost:4200/auth/forgottenpass/email/";

/*
*   Short desc: Account deactivation
*   @body: userId
*   Desc: Find user by id and set isActivated to false
 */
exports.accountDeactivation = (req, res, next) => {
    if(!req.params.id){
        return res.status(400).json({
            message: 'No email specified'
        });
    }else{
        User.findById(req.params.id)
        .then(foundUser => {
            console.log(foundUser);
            // deactivate user
            foundUser.isActivated = false;

            // save user changes
            foundUser.save().then(result => {
                res.status(200).json({
                    message: 'User deactivated'
                });
            });

        })
        .catch(error => {
            res.status(500).json({
                message: 'User not found',
            });

        });
    }
};

/*
*   Resend email verification
*   Get email of user, find user, find token by user id and delete it (previous token must be deleted)
*   Generate new user token email verification,set verification date to now, set expiration date,
*   isVerified=false, set user id
*   Send email to the user with new link
 */
exports.resendEmailVerification = (req, res, next) => {
    if(!req.body.email){
        res.status(StatusConfig.clientError["400"].status).json(
            StatusConfig.clientError["400"].message
        );
    }else{
        // find user
        User.findOne({ email: req.body.email })
        .then(foundUser => {
            // find token by user id
            VerificationToken.deleteMany({ userId: foundUser._id });

            // generate new email token verification
            var authToken = generateToken(req.body.email);

            const verificationtoken = new VerificationToken({
                userId: foundUser._id,
                confirmationToken: authToken,
                isVerified: false,
                verificationDate: new Date(),
                expirationDate: new Date(),
            });

            // save verification token data
            verificationtoken.save()
            .catch(() => {
                res.status(StatusConfig.serverError["500"].status).json(
                    StatusConfig.serverError["500"].message
                );
            });

            // prepare email
            link = EMAIL_VERIFICATION_TOKEN_LINK + authToken;
            var mailOptions = prepareEmailOpitons(
                'pomocapps@gmail.com',
                'pomocapps@gmail.com',
                "Potrdite vaš email naslov",
                "Pozdravljeni,<br> Ponovno smo vam poslali potrditveni mail. Prosim potrdite vaš epoštni naslov s klikom na spodnjo povezavo.<br><a href="+link+">Povezava za potrditev email naslova</a>"
            );

            // send mail
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    res.status(StatusConfig.serverError["500"].status).json(
                        StatusConfig.serverError["500"].message
                    );
                }
            });
            res.status(StatusConfig.success["201"].status).json({
                message: StatusConfig.success["201"].message,
                user: savedUser
            });

        })
        .catch(() => {
            res.status(StatusConfig.clientError["404"].status).json(
                StatusConfig.clientError["404"].message
            );
        });

    }
};


/*
*   Reset password
*   Get token in body, find token in db, if exists, check if valid (not expired)
*   if not expired find user by id (from token), change password
 */
exports.resetPassword = (req, res, next) => {
    if(!req.params.token){
        res.status(StatusConfig.clientError["400"].status).json(
            StatusConfig.clientError["400"].message
        );
    }
    ForgottenPasswordToken.findOne({ confirmationToken: req.params.token })
    .then(foundToken => {
        // check if token is valid
        let timeDiffInSeconds = (new Date() - foundToken.verificationDate) / 1000;
        if(timeDiffInSeconds > 3600) {
            res.status(StatusConfig.clientError["401"].status).json(
                StatusConfig.clientError["401"].message
            );
        }else {

            bcrypt.hash(req.body.password, 10)
            .then(hashPassword => {
                // find user
                User.findById(foundToken.userId)
                    .then(userFound => {

                        // change password
                        userFound.password = hashPassword;

                        // set token to be verified
                        foundToken.isVerified = true;

                        // save token changes
                        foundToken.save()
                        .catch(() => {
                            res.status(StatusConfig.serverError["500"].status).json(
                                StatusConfig.serverError["500"].message
                            );
                        });

                        // save user changes
                        userFound.save()
                        .then(result => {
                            res.status(StatusConfig.success["200"].status).json({
                                message: StatusConfig.success["200"].message,
                                user: result
                            });
                        });

                    })
                    .catch(() => {
                        res.status(StatusConfig.serverError["404"].status).json(
                            StatusConfig.serverError["404"].message
                        );
                    });
            });
        }
    })
    .catch(() => {
        res.status(StatusConfig.serverError["404"].status).json(
            StatusConfig.serverError["404"].message
        );
    });
};


/*
 *  Forgotten password
 *  Find user by email, generate token, send email to user with link to reset password
 */
exports.forgottenPasswordSendEmail = (req, res, next) => {
    // check if user with specifiend email exists
    if(!req.body.email) {
        res.status(StatusConfig.serverError["400"].status).json(
            StatusConfig.serverError["400"].message
        );
    }
    // find user
    User.findOne({ email: req.body.email })
    .then(foundUser => {

        // generate token
        var token = generateToken(req.body.email);

        // set link where user can reset password
        link = EMAIL_FORGOTTEN_PASS_TOKEN_LINK + token;

        // prepare email options
        var mailOptions = prepareEmailOpitons(
            'ADD YOUR EMAIL',
            'ADD YOUR EMAIL',
            "Password update",
            "<br> Please click link for password update.<br><a href="+link+">Update password</a>"
        );

        const forgottenPasswordToken = new ForgottenPasswordToken({
            userId: foundUser._id,
            confirmationToken: token,
            isVerified: false,
            expirationDate: new Date(),
        });

        // save verification token data
        forgottenPasswordToken.save().catch(() => {
            res.status(StatusConfig.serverError["500"].status).json(
                StatusConfig.serverError["500"].message
            );
        });

        // send mail
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                res.status(StatusConfig.serverError["500"].status).json(
                    StatusConfig.serverError["500"].message
                );
            }
        });

        res.status(StatusConfig.serverError["201"].status).json(
            StatusConfig.serverError["201"].message
        );


    })
    .catch(() => {
        res.status(StatusConfig.serverError["404"].status).json(
            StatusConfig.serverError["404"].message
        );
    });
};

/*
*   Verify user email
*   Find token, update token to be verified, calculate expiration date - if OK update user to be verified
 */
exports.verifyEmail = (req, res, next) => {
    if(!req.params.confirmationToken){
        res.status(StatusConfig.serverError["400"].status).json(
            StatusConfig.serverError["400"].message
        );
    }else{
        VerificationToken.findOne({confirmationToken: req.params.confirmationToken}).then(tokenResult => {
            if (!tokenResult) {
                res.status(StatusConfig.serverError["404"].status).json(
                    StatusConfig.serverError["404"].message
                );
            }

            // check if token is valid - expired
            let timeDiffInSeconds = (new Date() - tokenResult.verificationDate) / 1000;
            if(timeDiffInSeconds > 3600) {
                res.status(StatusConfig.serverError["401"].status).json(
                    StatusConfig.serverError["401"].message
                );
            }else{

                // update verification token data
                tokenResult.isVerified = true;
                tokenResult.verificationDate = new Date();

                // update token
                tokenResult.save().then(savedToken => {
                    // fetch user and update
                    User.findById(savedToken.userId).then(userResult => {
                        if (!userResult) {
                            res.status(StatusConfig.serverError["404"].status).json(
                                StatusConfig.serverError["404"].message
                            );
                        }
                        // update user
                        userResult.isVerified = true;
                        // save changes
                        userResult.save().then(result => {
                            res.status(StatusConfig.success["201"].status).json({
                                message: StatusConfig.success["201"].message,
                                user: result
                            });
                        });
                    }).catch(() => {
                        res.status(StatusConfig.serverError["500"].status).json(
                            StatusConfig.serverError["500"].message
                        );
                    });
                })
                .catch(() => {
                    res.status(StatusConfig.serverError["500"].status).json(
                        StatusConfig.serverError["500"].message
                    );
                });
            }
        })
        .catch(() => {
            res.status(StatusConfig.serverError["500"].status).json(
                StatusConfig.serverError["500"].message
            );
        });
    }
};


/*
***************************POST REQUEST create user***********************************
*/
exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            var authToken = generateToken(req.body.email);
            link = EMAIL_VERIFICATION_TOKEN_LINK + authToken;
            var mailOptions = prepareEmailOpitons(
                'YOUR SERVER EMAIL',
                req.body.emailTo,
                "Confirm your email address",
                "Please confirm your email address by clicking below link<br><a href="+link+">Verify your email address</a>"
            );

            // get host url
            const url = req.protocol + '://' + req.get('host');

            // check if user has image
            let saveImage = "";
            if (req.file && req.file.filename) {
                saveImage = url + '/images/' + req.file.filename;
            }

            // prepare user data
            const user = new User({
                email: req.body.email,
                password: hash,
                isVerified: false,
                phone: req.body.phone,
                name: req.body.name,
                lastName: req.body.lastName,
                workerAvg: req.body.workerAvg,
                employeeAvg: req.body.employeeAvg,
                postNumber: req.body.postNumber,
                post: req.body.post,
                rate: req.body.rate,
                imagePath: saveImage,
                isActivated: true
            });
            // save user data
            user.save()
                .then(savedUser => {

                    // prepare data for verification token
                    const verificationtoken = new VerificationToken({
                        userId: savedUser._id,
                        confirmationToken: authToken,
                        isVerified: false,
                        verificationDate: new Date(),
                        expirationDate: new Date(),
                    });

                    // save verification token data
                    verificationtoken.save()
                    .catch(() => {
                        res.status(StatusConfig.serverError["500"].status).json(
                            StatusConfig.serverError["500"].message
                        );
                    });

                    // send mail
                    smtpTransport.sendMail(mailOptions, function (error, response) {
                        if (error) {
                            res.status(StatusConfig.serverError["500"].status).json(
                                StatusConfig.serverError["500"].message
                            );
                        }
                    });
                    res.status(StatusConfig.success["201"].status).json({
                        message: StatusConfig.success["201"].message,
                        user: savedUser
                    });
                })
                .catch(() => {
                    res.status(StatusConfig.serverError["500"].status).json(
                        StatusConfig.serverError["500"].message
                    );
                });
        });
};
    /*
    *   Short desc: User login
    *   @body: email
    *   @return: 201 OK
    *   Description: Find user, if exists, check if valid, then check password, if correct return JWT token.
    *   If user isnt valid, delete verification token and create new one, then send verification email
    */
exports.userLogin = (req, res, next) => {
    if(!req.body.email){
        res.status(StatusConfig.serverError["400"].status).json(
            StatusConfig.serverError["400"].message
        );
    }else{
        let fetchedUser;
        User.findOne({email: req.body.email})
        .then(user => {
            // check if user exists
            if (!user) {
                res.status(StatusConfig.serverError["401"].status).json(
                    StatusConfig.serverError["401"].message
                );
            }
            // if user is not verified
            else if (!user.isVerified) {

                // find token by user id and delete it
                VerificationToken.deleteMany({ userId: user._id });

                // generate new email token verification
                var authToken = generateToken(req.body.email);

                const verificationtoken = new VerificationToken({
                    userId: user._id,
                    confirmationToken: authToken,
                    isVerified: false,
                    verificationDate: new Date(),
                    expirationDate: new Date(),
                });

                // save verification token data
                verificationtoken.save().catch(error => {
                    res.status(StatusConfig.serverError["500"].status).json(
                        StatusConfig.serverError["500"].message
                    );
                });

                link = EMAIL_VERIFICATION_TOKEN_LINK + authToken;
                var mailOptions = prepareEmailOpitons(
                    'YOUR SERVER EMAIL',
                    req.body.emailTo,
                    "Confirm your email address",
                    "Please confirm your email address by clicking below link. <br><a href="+link+">Verify your email address</a>"
                );

                // send mail
                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        res.status(StatusConfig.serverError["500"].status).json(
                            StatusConfig.serverError["500"].message
                        );
                    }
                });
                res.status(StatusConfig.success["201"].status).json({
                    message: StatusConfig.success["201"].message,
                    user: savedUser
                });
            }

            // check if user is not activated
            if(!user.isActivated){
                // activate user
                user.isActivated = true;

                // save changes
                user.save()
                    .catch(error => {
                        res.status(404).json({
                            message: 'User cannot be activated'
                        });
                    });
            }

            // save user so we can use it in a next then block
            fetchedUser = user;
            // check pass - return boolean
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {
            // if pass was correct
            if (!result) {
                res.status(StatusConfig.serverError["401"].status).json(
                    StatusConfig.serverError["401"].message
                );
            }
            // if everything correct create json web token
            // args: data, secret by your choice, properties
            const token = jwt.sign({
                email: fetchedUser.email,
                userId: fetchedUser._id
            }, process.env.JWT_KEY, {
                expiresIn: "1h"
            });
            res.status(StatusConfig.success["200"].status).json({
                token: token,
                expiresIn: "3600",
                userId: fetchedUser._id
            });
        })
        .catch(() => {
            res.status(StatusConfig.serverError["401"].status).json(
                StatusConfig.serverError["401"].message
            );
        });
    }
};

/*
***************************DELETE REQUEST***********************************
*/
exports.deleteUser = (req, res, next) => {
    if(!req.params.id){
        res.status(StatusConfig.serverError["400"].status).json(
            StatusConfig.serverError["400"].message
        );
    }
    User.deleteOne({_id: req.params.id})
    .then(result => {
        if (result.n > 0) {
            res.status(StatusConfig.serverError["200"].status).json(
                StatusConfig.serverError["200"].message
            );
        } else {
            res.status(StatusConfig.serverError["401"].status).json(
                StatusConfig.serverError["401"].message
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
*   ************************** EDIT USER ***************************
 */
exports.updateUser = (req, res, next) => {

    // get path from request
    let imagePath = req.body.image;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }

    // set user data
    const user = new User({
        _id: req.body.id,
        email: req.body.email,
        isVerified: true,
        phone: req.body.phone,
        name: req.body.name,
        lastName: req.body.lastName,
        postNumber: req.body.postNumber,
        imagePath: imagePath
    });

    User.updateOne({_id: req.params.id}, user).then(updatedUser => {
        if (updatedUser.n > 0) {
            res.status(StatusConfig.serverError["200"].status).json(
                StatusConfig.serverError["200"].message
            );
        } else {
            res.status(StatusConfig.serverError["401"].status).json(
                StatusConfig.serverError["401"].message
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
*   ************* GET ***************
 */
exports.getUserById = (req, res, next) => {
    User.findById(req.params.id).then(user => {
        if (user) {
            res.status(StatusConfig.success["200"].status).json(user);
        } else {
            res.status(StatusConfig.serverError["404"].status).json(
                StatusConfig.serverError["404"].message
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
*************************** EMAIL UTILS *******************
 */

var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'ADD YOUR EMAIL',
        clientId: 'ADD YOURS',
        clientSecret: 'ADD YOURS',
        refreshToken: 'ADD YOURS',
        accessToken: 'ADD YOURS'
    }
});

/*
*   HELPER METHODS
*/
function generateToken(email){
    var seed = crypto.randomBytes(20);
    return crypto.createHash('sha1').update(seed + email).digest('hex');
}

function prepareEmailOpitons(emailFrom, emailTo, subject, html) {
    return {
        from : emailFrom,
        to : emailTo,
        subject : subject,
        html : html
    };
}

