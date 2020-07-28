const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const UserController = require("../controllers/user");
const exctractFile = require("../middleware/file");

/*
***************************ROUTES***********************************
*/
router.post("/signup", exctractFile, UserController.createUser);
router.post("/login", UserController.userLogin);
router.delete("/user/:id", checkAuth, UserController.deleteUser);
router.put("/user/:id", checkAuth, exctractFile, UserController.updateUser);
router.get("/user/:id", checkAuth, exctractFile, UserController.getUserById);
router.get("/verify/:confirmationToken", UserController.verifyEmail);
router.post("/resend/email", UserController.resendEmailVerification);
router.post("/forgottenpass", UserController.forgottenPasswordSendEmail);
router.post("/forgottenpass/confirm/:token", UserController.resetPassword);
router.get("/deactivate/account/:id", UserController.accountDeactivation);


module.exports = router;
