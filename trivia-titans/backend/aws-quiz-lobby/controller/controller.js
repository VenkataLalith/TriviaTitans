const axios = require('axios');

//Fetch all details from Another lambda function and responf to frontend.
exports.getAllQuiz = async (req, res) => {
	try {
		const response = await axios.get(
			'https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/list_quizzes'
		);
		res.status(200).send(response.data);
	} catch (error) {
		res.status(500).send(error);
	}
};

// Fetch details for quiz with given difficulty and category and respond to front-end
exports.getQuizWithFilter = async (req, res) => {
	const difficulty = req.params.difficulty;
	const category = req.params.category;

	const api =
		'https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/list_quizzes/' +
		difficulty +
		'/' +
		category;
	try {
		const response = await axios.get(api);

		res.status(200).send(response.data);
	} catch (error) {
		res.status(500).send(error);
	}
};

// Fetch quiz by given ID as request parameter and respond details of that quiz to frontend
exports.getQuizById = async (req, res) => {
	const quizId = req.params.id;
	try {
		const response = await axios.get(
			'https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/list_quizzes'
		);
		const quizzesArray = response.data.quizzes;

		const quiz = quizzesArray.find((q) => q.quiz_id === quizId);

		if (quiz) {
			res.status(200).send(quiz);
		} else {
			res.status(404).json({ message: 'Quiz not found' });
		}
	} catch (error) {
		res.status(500).send(error);
	}
};
