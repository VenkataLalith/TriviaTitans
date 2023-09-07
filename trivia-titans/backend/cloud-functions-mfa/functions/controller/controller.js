const mfaQuestionService = require('../services/mfaQuestionsService');

//Store all 3 questions answer after receiving it as body parameter
exports.storeUserQuestionResponse = async (req, res) => {
	try {
		const answersData = {
			userId: req.body.userId,
			a1: req.body.a1,
			a2: req.body.a2,
			a3: req.body.a3,
		};
		const response = await mfaQuestionService.storeUserQuestionResponse(
			answersData
		);

		res
			.status(200)
			.send({ message: 'User answers added in database', response });
	} catch (error) {
		res
			.status(500)
			.send({ message: 'User answers NOT added in database', error });
	}
};

//Valiate user details received as body parameter
exports.validateUserAnswer = async (req, res) => {
	try {
		try {
			const snapshot = await mfaQuestionService.validateAnswers(req.body);
			const answerObject = snapshot.docs.map((doc) => ({
				id: doc.userId,
				isValidated: true,
				...doc.data(),
			}));

			if (answerObject) {
				res
					.status(200)
					.send({ message: 'Answer matched!!!.', isValidated: true });
			}
		} catch (err) {
			res
				.status(404)
				.send({ message: 'Answer not matched!!!.', isValidated: false });
		}
	} catch (error) {
		res.status(500).send(error);
	}
};
