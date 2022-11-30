const express = require("express");
const bodyparser = require("body-parser");

const MoviesRoute = require("./routes/movies");



var app = express();

app.use(bodyparser.json());
app.use("/movies", MoviesRoute);

app.listen(8080);