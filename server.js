const express = require("express");
const bodyparser = require("body-parser");

const MoviesRoute = require("./routes/movies");
const UserRoute = require("./routes/user");
let port = process.env.PORT || 3000;

var app = express();

app.use(bodyparser.json());
app.use("api/movies", MoviesRoute);
app.use("/api/user", UserRoute);

app.listen(port, () => console.log(`movie-app-server listening on port: ${port}`));