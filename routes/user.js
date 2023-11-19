const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const { User, Role, Order } = require('../models');
let jwt = require('jsonwebtoken')

function generateToken(id) {
    return jwt.sign(
        { id: id },
        // we use a global variable here as a key
        process.env.JWT_SECRET,
        // token expires in 30 days if user doesn't connect via borne
        {
            expiresIn: '30d'
        }          
    )
}

// ___________________________________________________________________
// router to get a list of all users
router.get('/all', async (req, res) => {
    try {
        const users = await User.findAll({
            // when getting a list of users, we only want to have some information, like id, name, email and ..
            attributes: ['id', 'name', 'email'],
            // .. their role (id + title of role, e.g. 'client' or 'admin')
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'title']
                }
            ]
        })

        if (users) {
            res.json(users);
            res.status(200);
        } else {
            res.status(404);
            res.json({ message: "Users not found" });
        }
    } catch (error) {
        res.status(500)
        res.json("Error while getting a list of users: " + error.message);
    }
})

// ___________________________________________________________________
// sign up of a new user (with role of normal user == client)
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

// ___________________________________________________________________
// log in of user
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

// ___________________________________________________________________
// router allowing to get information about a particular user: his id, name, email and total sum of his orders
router.get('/:id', async (req, res) => {
    let userId = req.params.id;

    try {
        const user = await User.findByPk(userId, {
            // we also include Order to get the total sum of all orders user has so far
            include: [
                {
                    model: Order,
                    attributes: ['total_price']
                }
            ]
        })
        if (user) {
            // we get the total order sum, or 0, if no order passed yet
            const totalOrderSum = user.Orders.reduce((sum, order) => sum + (order.total_price || 0), 0);

            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                totalOrderSum: totalOrderSum
            };

            res.json(userData);
            res.status(200);
        } else {
            res.status(404)
            res.send("User was not found")
        }
    } catch (error) {
        res.status(500)
        res.json("Error while trying to access the user: " + error.message);
    }
})

module.exports = router;
