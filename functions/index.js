"use strict";

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");

const axios = require("axios");
// const app = express()
// app.use(cors({ origin: true }))
admin.initializeApp();

exports.users = require("./users");

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.createTest = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin
    .firestore()
    .collection("gta")
    .add({ original: original })
    .then(writeResult => {
      return res.status(200).send("sasindran");
    });
});

// ----------  Nissan Core ---------- //
exports.nivacore = functions.https.onRequest((req, res) => {
  console.log(req.body);
  axios
    .post(`http://ec2-3-88-208-191.compute-1.amazonaws.com:3000/hook`, {
      input: "Order biriyani"
    })
    .then(res => {
      console.log(res);
      return res.status(200).send(res);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send(err);
    });
});

// ---------- Agents Data base ---------- //
exports.activeAgents = functions.https.onRequest((req, res) => {
  const reqMethod = req.method;
  switch (reqMethod) {
    case "GET":
      return admin
        .database()
        .ref("/agents")
        .once("value")
        .then(snapshot => {
          let array = [];
          snapshot.forEach(item => {
            var itemVal = item.val();
            if (itemVal.enabled) {
              array.push(itemVal);
            }
          });
          return res.status(200).json(array).send;
        });
    default:
      return res.status(200).send("NOT GET");
  }
});
