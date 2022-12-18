const express = require("express");
const { sign } = require('jsonwebtoken');
const { genSaltSync, compareSync, hashSync } = require('bcrypt');

const databasePool = require('../database/connection');
const { validateRefreshToken, removeRefreshToken } = require("../auth/token_validator");

const Router = express.Router();

Router.put("/register", (req, res) => {
    const { username, password } = req.body;
    const salt = genSaltSync(10);
    saltedPassword = hashSync(password, salt);
    if(username && password) {
        databasePool.query(`INSERT INTO user(username, password) VALUES('${username}', '${saltedPassword}')`, (err, rows, fields) => {
            if(!err) {
                console.log(`Registration successful for user ${username} `);
                res.status(201).send({
                    status: "Success",
                    info: rows
                });
            }
            else {
                console.log(`Registration failure for user ${username}: ${err}`);
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
});

Router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if(username && password) {
        databasePool.query(`SELECT username, password from user where username='${username}'`, (err, rows, fields) => {
            if(err) {
                console.log(err);
                res.status(500).send({
                    status: "Error",
                    message: err
                });
            }
            if(!rows.length) {
                res.status(401).send({
                    status: "Failure",
                    message: "Invalid user or password"
                })
            }
            let user = rows[0];
            const result = compareSync(password, user.password);
            if(result) {
                console.log(`Login successful for user ${username}`)
                res.password = undefined;
                const accesstoken = sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: "10m"
                });
                const refreshtoken = sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET)
                databasePool.query(`INSERT INTO tokens (username, token) VALUES ('${username}', '${refreshtoken}')`);
                res.status(200).send({
                    status: "Success",
                    message: "Login successful",
                    authToken: accesstoken,
                    refreshToken: refreshtoken
                });
            } else {
                res.status(401).send({
                    status: "Failure",
                    message: "Invalid user or password"
                })
            }
        });
    }
});

Router.get("/token", validateRefreshToken, (req, res) => {
    const accesstoken = sign({ username: req.body.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m"
    });
    res.status(200).send({
        status: "Success",
        username: req.body.username,
        accessToken: accesstoken
    });
});

Router.post("/logout", removeRefreshToken, (req, res) => {
    res.status(200).send({
        status: "Success",
        message: "Logout successful"
    });
});

module.exports = Router;