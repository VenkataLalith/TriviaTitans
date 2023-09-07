// Importing required modules and setting up the Express application.
const express = require('express');
const app = express();
app.use(express.json()); // Enable parsing of JSON data in the request body.
const Firestore = require('@google-cloud/firestore'); // Importing the Firestore library.

// Configuring Firestore with project ID and service account key.
const db = new Firestore({
    projectId: 'trivia-titans-392121',
    keyFilename: './serverless-kova-1d0a58907240.json',
});

const cors = require('cors');
app.use(
    cors({
        origin: '*'
    })
);

// Endpoint to update user data in the Firestore database.
app.post('/updateUserData', async (req, res) => {
    await updateData(db, req.body);
    res.end();
});

// Endpoint to set user data in the Firestore database.
app.post('/setUserData', async (req, res) => {
    await setData(db, req.body);
    res.end();
});

// Endpoint to get user data from the Firestore database based on the 'user' query parameter.
app.get('/getUserData', async (req, res) => {
    const docRef = db.collection('user-data').doc(req.query.user);
    const data = await docRef.get();
    console.log("kovaconsole" + req.query.user);
    if (!data.exists) {
        console.log("No such document!");
    } else {
        res.send(data.data());
        console.log("document data:", data.data());
    }
});

// Function to update user data in the Firestore collection 'user-data'.
async function updateData(db, data) {
    const docRef = db.collection('user-data').doc(data.docName);
    await docRef.update(data.profileDetails);
}

// Function to set user data in the Firestore collection 'user-data'.
async function setData(db, data) {
    const docRef = db.collection('user-data').doc(data.docName);
    await docRef.set(data.wholeData);
}

// Exporting the Express app to be used as a serverless function.
exports.hey = app;
