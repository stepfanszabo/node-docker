const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const axios = require('axios')
const cheerio = require('cheerio')

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('../config/config')

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL)
        .then(() => console.log("Succesfully connected to Mongo DB"))
        .catch((err) => {
            console.log(err)
            console.log("Connecting to DB...")
            setTimeout(connectWithRetry, 5000)
        })
}

connectWithRetry()

var corsOptions = {
  origin: "http://localhost:8081"
};
app.enable("trust proxy")
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to stefan application." });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});