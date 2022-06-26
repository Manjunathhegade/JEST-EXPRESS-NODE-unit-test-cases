// use module
// username : manju
// password : 9Za60cuHSKHy72eN
// port : 5000

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
let PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
const User = require("./routes/user.route")

// Set up mongoose connection
let mongoDB = process.env.MONGODB_URI;
mongoose.connect(
  "mongodb+srv://manju:<PASSWORD>@cluster0.tvixgrz.mongodb.net/users?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  }
);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
    res.status(200).send("User Server is up and running");
  });
  
app.use("/api/v1.0/user",User)

// app.listen(PORT, () => {
//     console.log("User Server Running on " + PORT);
//   });
  
// when jest runs
module.exports = app;