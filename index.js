const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.j5z5yuh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const photographyCollection = client
    .db("photography")
    .collection("photography-reviews");

  app.get("/photographs", async (req, res) => {
    const query = {};
    const cursor = photographyCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
  });
}

run().catch((err) => {
  console.log(err);
});

app.listen(port, () => {
  console.log(`the current running port is ${port}`);
});
