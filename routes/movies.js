const express = require("express");
const Router = express.Router();

const { validateToken } = require('../auth/token_validator')
const databasePool = require('../database/connection');

Router.get("/list", validateToken, (req, res) => {
    const requestBody = req.body;
    databasePool.query(
        `SELECT movie.moviename, 
        CAST(CONCAT('[', GROUP_CONCAT(json_quote(castname) ORDER BY castname SEPARATOR ','), ']') AS JSON) AS cast,
        movie.genre, movie.rating, movie.releasedate
        FROM movie INNER JOIN moviecast ON movie.moviename = moviecast.moviename AND movie.username = moviecast.username
        WHERE movie.username='${requestBody.username}'
        GROUP BY movie.moviename, movie.rating, movie.genre, movie.releasedate;`,
    (err, rows, fields) => {
        if(!err) {
            res.status(200).send({
                status: "Success",
                movies: rows
            });
        } else {
            console.log(err);
            res.status(500).send({
                status: "Error",
                message: err
            });
        }
    });
});

Router.put("/add", validateToken, (req, res) => {
    const requestBody = req.body;
    let concatenatedCast = "";
    requestBody.cast.forEach(c => {
        concatenatedCast+= `('${c}', '${requestBody.moviename}', '${requestBody.username}'),`;
    });
    databasePool.query(
        `INSERT INTO movie (moviename, rating, genre, releasedate, username) VALUES ('${requestBody.moviename}', ${requestBody.rating}, '${requestBody.genre}', '${requestBody.releasedate}', '${requestBody.username}');
         INSERT INTO moviecast (castname, moviename, username) VALUES ${concatenatedCast.slice(0, -1)};`,
    (err, rows, fields) => {
        if(!err) {
            console.log(`Added movie ${requestBody.moviename} for user ${requestBody.username}`);
            res.status(201).send({
                status: "Success",
                info: rows
            });
        } else {
            console.log(err);
            res.status(500).send({
                status: "Error",
                message: err
            });
        }
    });
});

Router.post("/edit", validateToken, (req, res) => {
    // const requestBody = req.body;
    // databasePool.query(
    //     `UPDATE movie
    //      SET `
    // )
});

Router.delete("/delete", validateToken, (req, res) => {
    const requestBody = req.body;
    databasePool.query(
        `DELETE FROM movie WHERE username='${requestBody.username}' AND moviename='${requestBody.moviename}';
         DELETE FROM moviecast WHERE username='${requestBody.username}' AND moviename='${requestBody.moviename}'`, 
    (err, rows, fields) => {
        if(!err) {
            console.log(`Deleted movie ${requestBody.moviename} for user ${requestBody.username}`);
            res.status(200).send({
                status: "Success",
                info: rows
            });
        } else {
            console.log(err);
            res.status(500).send({
                status: "Error",
                message: err
            });
        }
    });
});

module.exports = Router;