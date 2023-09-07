const { mfaAnswerCollection } = require('../database/database');

//Store MFA question answers by calling firebase document store data methods
exports.storeUserQuestionResponse = async (userQuestionResponse) => {
	const uniqueUserId = userQuestionResponse.userId;
	const docRef = mfaAnswerCollection.doc(uniqueUserId);
	return await docRef.set(userQuestionResponse);
};

//Validate received question answers by comparing it with actual values in firestore database
exports.validateAnswers = async (req) => {
	const userId = req.userId;
	const answer = req.answer;
	const answerId = req.answerId;

	let query = mfaAnswerCollection.where('userId', '==', userId);

	if (answerId === 'a1') {
		query = query.where('a1', '==', answer);
	} else if (answerId === 'a2') {
		query = query.where('a2', '==', answer);
	} else if (answerId === 'a3') {
		query = query.where('a3', '==', answer);
	}

	const querySnapshot = await query.get();

	if (querySnapshot.empty) {
		// Return null if answer not found in firestore database
		return null;
	} else {
		//return answer snapshot if found in database
		return querySnapshot;
	}
};
