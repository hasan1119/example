//import packages
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
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
    console.log("client connected");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// listening to port
app.listen(port, () => {
  console.log("server is running", port);
});
