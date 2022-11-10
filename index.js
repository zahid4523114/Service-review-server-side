const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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
  try {
    const photographyCollection = client
      .db("photography")
      .collection("photography-reviews");

    const reviewCollection = client.db("photography").collection("reviews");
    //add service
    app.post("/photographs", async (req, res) => {
      const service = req.body;
      const result = await photographyCollection.insertOne(service);
      res.send(result);
    });
    //get all data
    app.get("/photographs", async (req, res) => {
      const query = {};
      const cursor = photographyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //get limited data
    app.get("/photoCount", async (req, res) => {
      const query = {};
      const cursor = photographyCollection.find(query).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });
    //get data by id
    app.get("/photographs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await photographyCollection.findOne(query);
      res.send(result);
      //post review
      app.post("/reviews", async (req, res) => {
        const reviews = req.body;
        const result = await reviewCollection.insertOne(reviews);
        res.send(result);
      });
      //get review data
      app.get("/reviews", async (req, res) => {
        let query = {};
        //get data by query
        if (req.query.email) {
          query = {
            email: req.query.email,
          };
        }
        const cursor = reviewCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });
      //delete review
      app.delete("/reviews/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
      });
      //get single item
      app.get("/reviews/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewCollection.findOne(query);
        res.send(result);
      });
      //update review
      app.put("/reviews/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const option = { upsert: true };
        const review = req.body;
        const updateReview = {
          $set: {
            name: review.name,
            price: review.price,
            description: review.description,
            image: review.image,
          },
        };
        const result = await reviewCollection.updateOne(
          filter,
          updateReview,
          option
        );
        res.send(result);
      });
      //jwt
      // app.post("/jwt", (req, res) => {
      //   const user = req.body;
      //   const token = jwt.sign(user, process.env.ACCESS_TOKEN);
      //   res.send({ token });
      // });
      //get review by id
      // app.get("/reviews/:id", async (req, res) => {
      //   const id = req.params.id;
      //   const query = { id: id };
      //   const cursor = reviewCollection.find(query);
      //   const result = await cursor.toArray();
      //   res.send(result);
      // });
    });
  } finally {
  }
}

run().catch((err) => {
  console.log(err);
});

app.listen(port, () => {
  console.log(`the current running port is ${port}`);
});
