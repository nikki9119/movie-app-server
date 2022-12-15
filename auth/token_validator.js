const { verify } = require('jsonwebtoken');

module.exports = {
    validateToken: (req, res, next) => {
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
    }
}