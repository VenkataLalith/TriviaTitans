const express = require('express');
const router = express.Router();
const Controller = require('../controller/controller');

//Route to fetch all available quizes in quiz database
router.get('/all_quiz', Controller.getAllQuiz);

//Route to filter  quiz with parameters received as request parameters
router.get('/all_quiz/:difficulty/:category', Controller.getQuizWithFilter);

//Route to fetch particiular quiz from quizes in quiz database with quiz id given as parameter
router.get('/all_quiz/:id', Controller.getQuizById);

module.exports = { router };
