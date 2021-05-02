//Importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Users from "./dbUsers.js";
import Pusher from "pusher";
import cors from "cors";

//App Config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1196537",
  key: "d5551d6108637900eea0",
  secret: "f83331834050f705af4c",
  cluster: "mt1",
  useTLS: true,
});

//Middleware
app.use(express.json());
app.use(cors());

//DB Config
const connection_url =
  "mongodb+srv://imatoria:Matoria1@whatsapp-cluster.am69g.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Pusher
const db = mongoose.connection;

db.once("open", () => {
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        byUserId: messageDetails.byUserId,
        toUserId: messageDetails.toUserId,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
      });
    } else {
      console.log("Error triggered pusher");
    }
  });
});

//API Routes
app.get("/", (req, res) => res.status(200).send("Hello World"));

app.get("/messages/by/:byUserId/to/:toUserId", (req, res) => {
  const byUserId = req.params.byUserId;
  const toUserId = req.params.toUserId;

  Messages.find({
    $and: [
      { byUserId: { $in: [byUserId, toUserId] } },
      { toUserId: { $in: [byUserId, toUserId] } },
    ],
  })
    .sort({ timestamp: "asc" })
    .exec((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
});

app.get("/message/latest/:byUserId/to/:toUserId", (req, res) => {
  const byUserId = req.params.byUserId;
  const toUserId = req.params.toUserId;

  Messages.findOne({
    $and: [
      { byUserId: { $in: [byUserId, toUserId] } },
      { toUserId: { $in: [byUserId, toUserId] } },
    ],
  })
    .sort({ timestamp: "desc" })
    .exec((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
});

app.get("/message/latest/:byUserId", (req, res) => {
  const byUserId = req.params.byUserId;

  Messages.findOne({ byUserId: byUserId })
    .sort({ timestamp: "desc" })
    .exec((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/user/login", (req, res) => {
  const { email, password } = req.body;
  Users.findOne({ email: email, password: password }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/users/all", (req, res) => {
  Users.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

//Listen
app.listen(port, () => console.log(`Listening on localhost: ${port}`));
