// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const axios = require('axios')
// const app = express()
// app.use(cors({ origin: true }))
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.createTest = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin
    .firestore()
    .collection('gta')
    .add({ original: original })
    .then(
      writeResult => {
        return res.status(200).send("sasindran")
      });
});

exports.users = functions.https.onRequest((req, res) => {
  const documentName = "users"
  const reqMethod = req.method
  switch (reqMethod) {
    case "GET":
      return admin
        .firestore()
        .collection(documentName)
        .get()
        .then(snapshot => {
          let arrayR = snapshot.docs.map(doc => {
            var json=doc.data()
            json.manager=json.manager._path.segments[1]
            return json
          });
          return res.status(200).json(arrayR).send;
        })
    default:
      return res.status(200).send("NOT GET")
  }
});

function getManagerId(email){
  return new Promise((resolve,reject) => {
    const documentName = "users"
  var selectedUser =  admin
    .firestore()
    .collection(documentName)
    .where("email" , "==", email)
    .get()
    .then(snapshot => {
      let array = snapshot.docs.map(doc => {
        var json=doc.data()
        json.manager=json.manager._path.segments[1]
        return json
      });
      return array[0]
    })
    .catch(error => {reject(error)})
    resolve(selectedUser)
  })
}

exports.manager = functions.https.onRequest((req, res) => {
  const documentName = "users"
  const reqMethod = req.method
  const email = req.query.email
  
  return getManagerId(email)
  .then(userDetails => {
    return admin
    .firestore()
    .collection(documentName)
    .doc(userDetails.manager)
    .get()
  })
  .then(doc => res.status(200).json(doc.data().firstName + " " + doc.data().lastName).send)
  .catch(error => res.status(500).send(error))

});

// ----------  Nissan Core ---------- //
exports.nivacore = functions.https.onRequest((req, res) => {
  console.log(req.body)
   axios.post(`http://ec2-3-88-208-191.compute-1.amazonaws.com:3000/hook`,{"input":"Order biriyani"})
   .then(res => {
     console.log(res)
     return res.status(200).send(res)
   })
   .catch(err => {
     console.log(err)
     return res.status(500).send(err)
   })

});



// ---------- Agents Data base ---------- //
exports.activeAgents = functions.https.onRequest((req,res) => {
  const reqMethod = req.method
  switch (reqMethod) {
    case "GET":
      return admin
        .database()
        .ref('/agents')
        .once('value')
        .then(snapshot => {
          let array =[];
          snapshot.forEach(item => {
            var itemVal = item.val();
            if(itemVal.enabled){
            array.push(itemVal)
            }
          })
          return res.status(200).json(array).send;
        })
    default:
      return res.status(200).send("NOT GET")
  }
})


