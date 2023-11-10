// Ce fichier contient les middleware relatif à l'authentification

function authenticateUser(req, res, next){
    console.log("L'utilisateur est-il connecté ?");
    next();
}

module.exports = {
    authenticateUser: authenticateUser
}