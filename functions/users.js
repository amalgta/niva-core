``; // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");

exports.gta = functions.https.onRequest((req, res) => {
  const documentName = "users";
  const reqMethod = req.method;
  const isNameOnly = req.query.isNameOnly;

  // query firestore based on user
  var transactions = admin.firestore().collection(documentName);
  transactions
    .get()
    .then(userSnapshot => {
      var employees = new Array();
      userSnapshot.forEach(doc => {
        doc
          .data()
          .manager.get()
          .then(app => {
            jsonObject = doc.data();
            jsonObject.manager = app.data();
            employees.push(jsonObject);
          });
      });
      console.log("Employee  ", employees);
      return employees;
    })
    .catch(err => {
      console.log("Error getting transactions", err);
    })
    .then(accountbalance => {
      res
        .status(200)
        .json(accountbalance)
        .send();
    })
    .catch(err => {
      console.log("Error sending response", err);
    });
});

exports.all = functions.https.onRequest((req, res) => {
  const documentName = "users";
  const reqMethod = req.method;
  const isNameOnly = req.query.isNameOnly;
  if (isNameOnly) console.log("isNameOnly", isNameOnly);
  return admin
    .firestore()
    .collection(documentName)
    .get()
    .then(snapshot => {
      let arrayR = snapshot.docs.map(doc => {
        if (!isNameOnly) {
          var json = doc.data();
          json.ppp = json.manager
            .get()
            .then(snapshot => {
              var thisManager =
                snapshot.data().firstName + " " + snapshot.data().lastName;
              console.log("GTA", thisManager);
              return thisManager;
            })
            .catch(error => {
              reject(error);
            });
          return json;
        } else {
          var json = {
            name: doc.data().firstName + " " + doc.data().lastName
          };
          return json;
        }
      });
      return res.status(200).json(arrayR).send;
    });
});

exports.allOnlyName = functions.https.onRequest((req, res) => {
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
            console.log("doc", doc);
          });
          return res.status(200).json(arrayR).send;
        });
    default:
      return res.status(200).send("NOT GET");
  }
});

exports.byName = functions.https.onRequest((req, res) => {
  const documentName = "users";
  const reqMethod = req.method;
  const name = req.query.name;

  return new Promise((resolve, reject) => {
    var selectedUser = admin
      .firestore()
      .collection(documentName)
      .get()
      .then(snapshot => {
        let array = snapshot.docs.map(doc => {
          return doc.data();
        });
        return array;
      })
      .catch(error => {
        reject(error);
      });
    resolve(selectedUser);
  })
    .then(json => res.status(200).json(json).send)
    .catch(error => {
      console.log("error", error);
      res.status(500).send(error);
    });
});

exports.manager = functions.https.onRequest((req, res) => {
  const documentName = "users";
  const reqMethod = req.method;
  const email = req.query.email;

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
  })
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
``;
