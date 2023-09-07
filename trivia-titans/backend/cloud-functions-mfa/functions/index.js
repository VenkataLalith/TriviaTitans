const functions = require('firebase-functions');
const { router } = require('./routes/routes');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

exports.app = functions.https.onRequest(app);
