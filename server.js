const express = require("express");
const bodyparser = require("body-parser");

const MoviesRoute = require("./routes/movies");
let port = process.env.PORT || 3000;

var app = express();

app.use(bodyparser.json());
app.use("/movies", MoviesRoute);

app.listen(port, () => console.log(`movie-app-server listening on port: ${port}`));