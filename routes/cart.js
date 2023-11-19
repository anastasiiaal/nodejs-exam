const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { authentificationMiddleware } = require('../middlewares/auth')
const Cart = require('../models/Cart')
const Product = require('../models/Product')

router.use(authentificationMiddleware);

router.get('/', function (req, res) {
    res.send('Serveur fonctionnel');
});

// ___________________________________________________________________
// router to get the cart by its id
router.get('/:id', async (req, res) => {
    // we get user's id from request object & cart id from url params
    const userId = req.user.id;
    const cartId = req.params.id;

    try {
        const cart = await Cart.findByPk(cartId, {
            where: {
                UserId: userId
            },
            include: {
                model: Product,
                attributes: ["title", "price"],
                through: {
                    attributes: ["quantity"]
                }
            }
        })

        if (cart) {
            let totalPrice = 0;
            // we get total price of contents of the cart
            cart.Products.forEach(product => {
                const productQuantity = product.ProductCart.quantity || 1;
                totalPrice += product.price * productQuantity;
            });

            totalPrice = parseFloat(totalPrice.toFixed(2));

            const response = {
                cart,
                totalPrice
            };

            res.status(200);
            res.json(response);
        } else {
            res.status(404);
            res.json({ message: "Cart not found" });
        }
    } catch (error) {
        res.status(500);
        res.send("Error while getting cart: " + error.message);
    }
})

module.exports = router;