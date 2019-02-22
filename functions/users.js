// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");

exports.users = functions.https.onRequest((req, res) => {
  const documentName = "users";
  const reqMethod = req.method;
  switch (reqMethod) {
    case "GET":
      return admin
        .firestore()
        .collection(documentName)
        .get()
        .then(snapshot => {
          let arrayR = snapshot.docs.map(doc => {
            var json = doc.data();
            json.manager = json.manager._path.segments[1];
            return json;
          });
          return res.status(200).json(arrayR).send;
        });
    default:
      return res.status(200).send("NOT GET");
  }
});

exports.manager = functions.https.onRequest((req, res) => {
  const documentName = "users";
  const reqMethod = req.method;
  const email = req.query.email;

  return getManagerId(email)
    .then(userDetails => {
      return admin
        .firestore()
        .collection(documentName)
        .doc(userDetails.manager)
        .get();
    })
    .then(
      doc =>
        res.status(200).json(doc.data().firstName + " " + doc.data().lastName)
          .send
    )
    .catch(error => res.status(500).send(error));
});

function getManagerId(email) {
  return new Promise((resolve, reject) => {
    const documentName = "users";
    var selectedUser = admin
      .firestore()
      .collection(documentName)
      .where("email", "==", email)
      .get()
      .then(snapshot => {
        let array = snapshot.docs.map(doc => {
          var json = doc.data();
          json.manager = json.manager._path.segments[1];
          return json;
        });
        return array[0];
      })
      .catch(error => {
        reject(error);
      });
    resolve(selectedUser);
  });
}
