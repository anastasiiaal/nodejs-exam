const jwt = require("jsonwebtoken")
const { User } = require("../models/User")

function authenticateUser(req, res, next){
    console.log("L'utilisateur est-il connecté ?");
    next();
}

// function that does the user authentification by checking the auth token
async function authentificationMiddleware (req, res, next) {

    const authHeader = req.headers.authorization;
    console.log("authHeader === ");
    console.log(authHeader);


    if (authHeader && authHeader.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            console.log(decoded);
            if(err) {
                res.status(401)
                if(err.name === "TokenExpiredError") {
                    res.send("Token expired")
                } else {
                    res.send("Invalid token")
                }
                return;
            }

            try {
                (async () => {
                    await User.findByPk(decoded.id)
                        .then(
                            (user) => {
                                if (!user) {
                                    res.status(401)
                                    res.send("Non authorized")
                                    return;
                                }
                                delete user.dataValues.password
                                // req.user = user.toJSON();
                                req.user = user;
                                next();
                            }
                        ).catch((error) => {
                            res.status(404);
                            res.send("Error while authentification: " + error);
                        });
                })();
            } catch (err) {
                res.status(401);
                res.send("Access Denied");
            }
        });
    } else {
        res.status(401);
        res.json({ message: "Access not authorized: token issue" });
    }
}

module.exports = {
    authenticateUser,
    authentificationMiddleware
}