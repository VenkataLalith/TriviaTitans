const express = require('express');
const app =express();
app.use(express.json());
const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: 'serverless-kova',
    keyFilename: './serverless-kova-1d0a58907240.json',
  });

const cors = require('cors');
app.use(
  cors({
    origin: '*'
  })
  );


app.post('/updateUserData',async(req,res) => {
   await updateData(db,req.body);
    res.end()
})

app.post('/setUserData',async(req,res)=>{
  await setData(db,req.body);
  res.end();
})

app.get('/getUserData',async(req,res)=>{
  const docRef = db.collection('users').doc(req.query.user);
  const data = await docRef.get();
  console.log("kovaconsole"+req.query.user);
  if(!data.exists){
    console.log("No such document!");
  }
  else{
    res.send(data.data());
    console.log("document data:",data.data());
  }
})

async function updateData(db,data) {
  const docRef = db.collection('users').doc(data.docName);
  await docRef.update(data.profileDetails);
  }
async function setData(db,data){
  const docRef = db.collection('users').doc(data.docName);
  await docRef.set(data.wholeData);
}

exports.hey = app