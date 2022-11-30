const express = require("express");
const Router = express.Router();

Router.get("/list", (req, res) => {
    res.send("Hello");
});

Router.put("/add", (req, res) => {

});

Router.post("/edit", (req, res) => {

});

Router.delete("/delete", (req, res) => {

});

module.exports = Router;