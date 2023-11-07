const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
    const token = req.headers["qurinom-token"];

    let verified;
    try {
        verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "jwt not provided",
            data: error
        })
    }
    if (verified) {
        console.log(verified);
        req.locals = verified;
        next();
    }
    else {
        return res.status(401).send({
            status: 401,
            message: "authentication failed"
        })
    }
}

module.exports = { Auth }