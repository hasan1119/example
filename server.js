//import packages
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// port
const port = process.env.PORT || 5000;

// initialize packages
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// root get api for tasting server
app.get("/", (req, res) => {
  res.send("server is running");
});

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dv4ff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// client connection and start query in database

async function run() {
  try {
    await client.connect();
    const database = client.db("Hotel_Booking");
    const hotel_collection = database.collection("Hotel");
    const order_collection = database.collection("Order");
    const blog_collection = database.collection("blog");

    // load all services: get api
    app.get("/services", async (req, res) => {
      const services = await hotel_collection.find({}).toArray();
      res.json(services);
    });

    //add a service: post api
    app.post("/addService", async (req, res) => {
      const service = req.body;
      const result = await hotel_collection.insertOne(service);
      res.json(result);
    });

    // load a single data: get api
    app.get("/sigleservice/:id", async (req, res) => {
      const id = req.params.id;
      const result = await hotel_collection.findOne({ _id: ObjectId(id) });
      res.json(result);

      // book a room
      app.post("/book", async (req, res) => {
        const book = req.body;
        const result = await order_collection.insertOne(book);
        res.json(result.insertedId);
      });
    });

    //load a specific user's all booked room
    app.get("/myorders/:email", async (req, res) => {
      const email = req.params.email;
      const services = await order_collection.find({ email }).toArray();
      res.send(services);
    });

    // load all booked room : get api
    app.get("/orders", async (req, res) => {
      const services = await order_collection.find({}).toArray();
      res.send(services);
    });

    // book a room
    app.delete("/deletion/:id", async (req, res) => {
      const id = req.params.id;
      const result = await order_collection.deleteOne({ _id: ObjectId(id) });
      res.json(result.deletedCount);
    });

    // confirmation: put api
    app.patch("/confirmation/:id", async (req, res) => {
      const id = req.params.id;
      const updateDoc = {
        $set: {
          status: "Confirmed",
        },
      };
      const result = await order_collection.updateOne(
        { _id: ObjectId(id) },
        updateDoc
      );
      res.json(result.modifiedCount);
    });

    // confirmation: put api
    app.get("/blogs", async (req, res) => {
      const result = await blog_collection.find({}).toArray();
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// listening to port
app.listen(port, () => {
  console.log("server is running", port);
});
