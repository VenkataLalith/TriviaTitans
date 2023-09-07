const express = require('express');
const router = express.Router();
const mfaQuestionsController = require('../controller/controller');

//Store MFA questions answer in firestore collection
router.post(
	'/storeUserAnswer',
	mfaQuestionsController.storeUserQuestionResponse
);

//Verify MFA question answer from database and respond to frontend
router.post('/validateUserAnswer', mfaQuestionsController.validateUserAnswer);
module.exports = { router };
