'Access-Control-Allow-Origin'

const express = require('express');

const app = express.Router();
// const mycollection = require("../schema/datamodel");

app.get("", (req, res) => {
    res.send("Welcome to my express js ")
});

app.get('/test', (req, res) => {
    res.send("External routing is working");
});

module.exports = app;