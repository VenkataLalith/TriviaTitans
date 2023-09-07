const functions = require('firebase-functions');
const { userCollection } = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Api endpoint to store user details in firestore collection
app.post('/store_users', async (req, res) => {
	try {
		const userId = req.body.userId;
		const profileDetails = req.body.profileDetails;
		const gameHistory = req.body.gameHistory;
		const status = 'offline';
		const admin = 'false';

		const userCollectionRef = await userCollection.doc(userId);
		const response = userCollectionRef.set({
			userId,
			profileDetails,
			gameHistory,
			status,
			admin,
		});
		res.status(200).send('User data stored in database');
	} catch (err) {
		res.status(404).send('error storing user data!!');
	}
});

exports.storeUser = functions.https.onRequest(app);
