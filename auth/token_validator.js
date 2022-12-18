const { verify } = require('jsonwebtoken');
const databasePool = require('../database/connection');

module.exports = {
    validateAccessToken: (req, res, next) => {
        let token = req.get("Authorization");
        if(token) {
            token = token.slice(7);
            verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if(err) {
                    console.log(err);
                    res.status(401).send({
                        status: "Failure",
                        message: "Invalid token",
                        errormessage: err.message
                    });
                } else {
                    req.body.username = decoded.username;
                    next();
                }
            });
        } else {
            res.status(401).send({
                status: "Failure",
                message: "Unauthorized user"
            });
        }
    },

    validateRefreshToken: (req, res, next) => {
        let token = req.get("Authorization");
        if(token) {
            token = token.slice(7);
            verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if(err) {
                    console.log(err);
                    res.status(401).send({
                        status: "Failure",
                        message: "Invalid token",
                        errormessage: err.message
                    });
                } else {
                    let tokenArray = [];
                    databasePool.query(`SELECT token FROM tokens WHERE username='${decoded.username}'`, (err, rows) => {
                        if(err) {
                            console.log(err);
                            res.status(500).send({
                                status: "Error",
                                errormessage: err
                            });
                        }
                        rows.forEach(obj => {
                            tokenArray.push(obj.token);
                        });
                        if(tokenArray.includes(token)){
                            req.body.username = decoded.username;
                            next();
                        } else {
                            res.status(401).send({
                                status: "Failure",
                                message: "Unauthorized user"
                            })
                        }
                    });
                }
            });
        } else {
            res.status(401).send({
                status: "Failure",
                message: "Unauthorized user"
            });
        }
    },

    removeRefreshToken: (req, res, next) => {
        let token = req.get("Authorization");
        if(token) {
            token = token.slice(7);
            verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if(err) {
                    console.log(err);
                    res.status(401).send({
                        status: "Failure",
                        message: "Invalid token",
                        errormessage: err.message
                    });
                } else {
                    let tokenArray = [];
                    databasePool.query(`SELECT token FROM tokens WHERE username='${decoded.username}'`, (err, rows) => {
                        if(err) {
                            console.log(err);
                            res.status(500).send({
                                status: "Error",
                                errormessage: err
                            });
                        }
                        rows.forEach(obj => {
                            tokenArray.push(obj.token);
                        });
                        if(tokenArray.includes(token)){
                            databasePool.query(`DELETE FROM tokens WHERE token='${token}'`, (err, rows) => {
                                if(err) {
                                    console.log(err);
                                    res.status(500).send({
                                        status: "Error",
                                        errormessage: err
                                    });
                                } else {
                                    next();
                                }
                            });
                        } else {
                            res.status(400).send({
                                status: "Failure",
                                message: "Token already invalidated"
                            })
                        }
                    });
                }
            });
        }
    }
}