const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const { User, Role } = require('../models');
let jwt = require('jsonwebtoken')

function generateToken(id) {
    return jwt.sign(
        { id: id },
        // we use a global variable here as a key
        process.env.JWT_SECRET,
        // token might expire 
        // {
        //     expiresIn: 3600
        // }          
    )
}

/* Route de test */
router.get('/', function (req, res) {
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

        // by default, user should have role id 2 (== client), 1 == admin
        // will probably conditionally fix it later...
        const role = await Role.findByPk(2);

        if (!role) {
            return res.status(500).send("Role not found");
        }

        // we create a user-client 
        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            name: name,
            RoleId: role.id // Assign the RoleId to the user
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
            res.json({ message: "All fields are obligatory" });
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

module.exports = router;
