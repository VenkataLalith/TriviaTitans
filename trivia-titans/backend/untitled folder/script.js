const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'serverless-kova',
  keyFilename: 'E:/Dalhousie/Class Summer (may-aug)/Serverless-5410/project/csci5410-summer-23-sdp28/trivia-titans/backend/serverless-kova-1d0a58907240.json',
});

async function quickstartAddData(db) {
    // [START firestore_setup_dataset_pt1]
    const docRef = db.collection('users').doc('alovelace');
  
    await docRef.set({
      first: 'Ada',
      last: 'Lovelace',
      born: 1815
    });
    // [END firestore_setup_dataset_pt1]
  
    // [START firestore_setup_dataset_pt2]
    const aTuringRef = db.collection('users').doc('aturing');
  
    await aTuringRef.set({
      'first': 'Alan',
      'middle': 'Mathison',
      'last': 'Turing',
      'born': 1912
    });
    // [END firestore_setup_dataset_pt2]
  }
  quickstartAddData(db);