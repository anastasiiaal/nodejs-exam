const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const { User } = require('../models');

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


module.exports = router;
