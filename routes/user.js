const express = require("express");
const Router = express.Router();
const connection = require('../database/connection');

Router.put("/register", (req, res) => {
    const { username, password } = req.body;
        if(username && password) {
            connection.query(`INSERT INTO user(username, password) VALUES('${username}', '${password}')`, (err, rows, fields) => {
                if(!err) {
                    res.status(201).send({
                        status: "Success",
                        info: rows
                    });
                }
                else {
                    if(err.code === "ER_DUP_ENTRY") {
                        res.status(400).send({
                            status: "Failure",
                            message: `User '${username}' already exists`
                        });
                    }
                    else{
                        console.log(err);
                        res.status(500).send({
                            status: "Failure",
                            message: err.sqlMessage
                        });
                    }
                }
            });
        }
    }
);

Router.post("/login", (req, res) => {

});

Router.post("/logout", (req, res) => {

});

module.exports = Router;