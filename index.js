const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();

const uri = process.env.DB_PATH;

app.use(cors());
app.use(bodyParser.json());
let client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// database connection:
// get all data about provided services
app.get("/services", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("doctorPortal").collection("services");
    collection.find().toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});

//get all appointments data for doctors
app.get("/allAppointments", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("doctorPortal").collection("appointments");
    collection.find().toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});

// for doctors ro see appointments for a specific date
app.get("/dailyAppointment/:appointmentDate", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("doctorPortal").collection("appointments");
    collection.find(req.params).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});

//for doctors to update prescription
app.put("/updatePrescription", (req, res) => {
  const id = req.body.id;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("doctorsPortal").collection("appointments");
    collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { prescription: req.body.prescription } },
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        }
      }
    );
    client.close();
  });
});

//for doctors to update visit status
app.put("/dailyAppointment/updateVisit", (req, res) => {
  const id = req.body.id;

  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("doctorPortal").collection("appointments");
    collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { visited: true } },
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        }
      }
    );
    client.close();
  });
});

// how to post all provided services data to server for patient
app.post("/addServices", (req, res) => {
  const service = req.body;

  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("doctorPortal").collection("services");
    collection.insert(service, (err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});

// book appointment option for patient
app.post("/bookAppointment", (req, res) => {
  const appointmentDetails = req.body;

  appointmentDetails.bookingDate = new Date();
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("doctorPortal").collection("appointments");
    collection.insertOne(appointmentDetails, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
    client.close();
  });
});

const port = process.env.PORT || 3003;
app.listen(port, () => console.log("Listen to port 3003"));
