const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const { User } = require('../models');
let jwt = require('jsonwebtoken')

function generateToken (id) {
    return jwt.sign(
        {id: id}, 
        // we use a global variable here as a key
        process.env.JWT_SECRET,
        // 3eme arg - pas obligatoire; passe tout ce qu'on veut de la liste existante en ojbet
        // {
        //     expiresIn: 3600
        // }          
    )
}

/* Route de test */
router.get('/', function(req, res) {
  res.send('Serveur fonctionnel');
});

router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Validate input
        if (!email || !password || !name) {
            return res.status(400).send("All fields are required");
        }

        if (password.length < 8) {
            return res.status(400).send("Password must be at least 8 characters long");
        }

        // 12 iterations to hash
        const hashedPassword = await bcrypt.hash(password, 12);

        // create a new user 
        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            name: name
        });

        res.status(201)
        res.json({ message: "User created successfully" });
    } catch (error) {
        res.status(500)
        res.send("Error during user creation: " + error.message);
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            res.status(400)
            res.json({ message: "All fields are obligatory"});
            return;
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            res.status(400)
            res.json({ message: "MDP ou email invalide" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(400)
            res.json({ message: "MDP ou email invalide" });
            return;
        }

        // remove password from the user object before sending it in the response
        delete user.password;

        res.json({
            token: generateToken(user.id),
            user
        });
    } catch (error) {
        res.status(500)
        res.send("Error while connecting: " + error);
    }
});





/**
 * router.post('/login', (req, res) => {
    const body = req.body

    if (!body.email || !body.password) {
        res.status(400)
        res.send("Tous les deux champs sont obligatoires")
        return
    }

    sqlQuery(`SELECT * FROM user WHERE email="${body.email}"`, result => {
        if (result.length === 0) {
            res.status(400)
            res.send("MDP ou email invalide")
            return
        }

        const user = result[0]

        bcrypt.compare(body.password, user.password).then(isOk => {
            if (!isOk) {
                res.status(400)
                res.send("MDP ou email invalide")
            } else {
            
                delete user.password
                
                return res.json({
                    "token": generateToken(user.id),   
                    "user": user
                })
            }
        })
    })
})
 */



module.exports = router;
