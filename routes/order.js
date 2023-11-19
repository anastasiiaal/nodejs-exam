const express = require('express');
const router = express.Router();
const { authentificationMiddleware } = require('../middlewares/auth')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')

router.use(authentificationMiddleware);

// ___________________________________________________________________
// router to create a new oredr out of shopping cart
router.post('/', authentificationMiddleware, async (req, res) => {
    // we get user's id and all other information passed in req body (such as address)
    const userId = req.user.id;
    const data = req.body;

    try {
        const cart = await Cart.findOne({
            where: {
                UserId: userId
            },
            include: [
                {
                    model: Product,
                    attributes: ["title", "price"],
                    through: {
                        attributes: ["quantity"]
                    }
                }
            ]
        })

        if (cart) {
            let totalPrice = 0;
            // we get total price of contents of the cart
            cart.Products.forEach(product => {
                const productQuantity = product.ProductCart.quantity || 1;
                totalPrice += product.price * productQuantity;
            });
            totalPrice = parseFloat(totalPrice.toFixed(2));

            const order = Order.create({
                UserId: userId,
                // CartId: cart.id,
                address: data.address,
                total_price: totalPrice
            })

            if (order) {
                const destroyedCart = await Cart.destroy({
                    where: {
                        id: cart.id,
                        UserId: userId
                    }
                })

                if (destroyedCart) {
                    res.status(200);
                    res.json({ message: "Thank you! Your order has been passed successfully." });
                } else {
                    res.status(500);
                    res.json({ message: "Problem while trying to delete the cart" });
                }
            } else {
                res.status(500);
                res.json({ message: "Could not process the order" });
            }
        }
    } catch (error) {
        res.status(500);
        res.send("Error while passing order: " + error.message);
    }
})

module.exports = router;
