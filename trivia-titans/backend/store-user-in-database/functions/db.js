const firebase = require('firebase');
require('firebase/app');

require('firebase/firestore');

//Firbase database configuration to fetch and store data in given collection
const firebaseConfig = {
	apiKey: 'AIzaSyBeFVvVs6eJzSM9yGE0HEBzb3J-L7D2Vp4',
	authDomain: 'trivia-titans-392121.firebaseapp.com',
	projectId: 'trivia-titans-392121',
	storageBucket: 'trivia-titans-392121.appspot.com',
	messagingSenderId: '598256017288',
	appId: '1:598256017288:web:3e5d84b53604849ef1243d',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userCollection = db.collection('user-data');

module.exports = { userCollection };
