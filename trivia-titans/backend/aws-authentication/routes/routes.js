const express = require('express');
const router = express.Router();
const Controller = require('../controller/controller');

//User Authentication Routes

//Create user route --> Create user in cognito user pool with given details
router.post('/create_user', Controller.createUser);

//Verify user email address --> Use cognito method to verify userId with verification code
router.post('/verifyEmail', Controller.verifyEmail);

//Login user --> Login user with given details
router.post('/login', Controller.userLogin);

//Signout user --> Signut user with given email id and access tocken
router.post('/signout', Controller.signout);

//Verify Cognito Access tocken --> Verify received access token and response accordingly
router.post('/verifyAccessToken', Controller.verifyUserAccessToken);

//Verify user logged in with Social media accounts such as Facebook and Google
router.post('/verifyUserWithoutCode', Controller.verifyEmailWithoutOTP);

//Forgot password --> Send forgot password verification code to user
router.post('/forgot_password', Controller.forgotUserPassword);

//Confirm password --> Set new passwword for user with given verification code and new pasword
router.post('/confirm_password', Controller.confirmUserPasswordReset);

module.exports = { router };
