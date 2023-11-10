const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Product, Tag, Categories } = require('../models');

router.get('/', function (req, res) {
    res.send('Liste des produits');
});

// ___________________________________________________________________
// route to get all products to show them in catalog (with pagination)
router.get('/all', async function (req, res) {
    // here we manage pagination: 
    // 1. we get "page" key from query or set to 1 if not provided
    // 2. we choose quantity per page
    // 3. we count the offset to use in query
    const page = req.query.page || 1;
    const productsPerPage = 2;
    const offset = (page - 1) * productsPerPage;

    // here we manage categories / tags
    // if we provide key "cat", we can can only see products whose category's id is provided
    const category = req.query.cat
    let whereClause
    if (category) {
        whereClause= {
            id: category
        }
    }

    const products = await Product.findAll({
        attributes: ['id', 'title', 'price'],
        where: {
            // where stock is greater than 0; out of stock won't be seen
            stock: {
                [Op.gt]: 0
            },
        },
        include: [{
            model: Tag,
            attributes: ['id', 'name'],
            through: {
                attributes: []
            },
            where: whereClause
        }],
        offset: offset,
        limit: productsPerPage,
    })

    if (products) {
        try {
            res.status(200)
            res.json(products)
        } catch (exception) {
            res.status(500)
            res.json("Error while fetching :" + exception)
        }
    } else {
        res.status(404)
        res.json({ message: "Products not found" })
    }

});

// ___________________________________________________________________
// route to get single product and all its information + its tag
router.get('/:id', function (req, res) {
    const id = req.params.id
    Product.findByPk(id, {
        include: [{
            model: Tag,
            attributes: ['name'],
            through: {
                attributes: []
            }
        }]
    }).then(product => {
        if (product) {
            // if product out of stock - can't visit its page
            if (product.stock > 0) {
                res.status(200);
                res.json(product);
            } else {
                res.status(200);
                res.json({ message: "Product out of stock" });
            }
        } else {
            res.status(404);
            res.json({ message: "Product not found" });
        }
    }).catch(error => {
        res.status(500)
        res.json({ error: "Internal Server Error" });
    });
})

// ___________________________________________________________________
// route to create new product + add its tags
router.post('/', async function (req, res) {
    const { title, price, description, stock, tagIds } = req.body;

    try {
        const product = await Product.create({
            title: title,
            price: price,
            description: description,
            stock: stock,
        })

        // if tags ids are given NOT inside of an array, make it an array
        const tagIdsArray = Array.isArray(tagIds) ? tagIds : [tagIds];
        if (tagIdsArray.length > 0) {
            const tags = await Tag.findAll({
                where: {
                    id: tagIdsArray
                }
            });

            // here we create association with with provided tags
            await product.addTags(tags);
        }

        res.status(201)
        res.json({ message: "Product created successfully" })
    } catch (exception) {
        res.status(500)
        res.send("Something went wrong: " + exception)
    }
});

// ___________________________________________________________________
// route to delete a product
router.delete('/:id', async function (req, res) {
    const id = req.params.id
    const product = await Product.findByPk(id)

    if (product) {
        try {
            await product.destroy();
            res.json({ message: "Product deleted successfully" })
            res.status(204)
        } catch (exception) {
            res.status(500)
            res.send("Error while deletion: " + exception)
        }
    } else {
        res.status(404)
        res.send("Product you want to delete was not found")
    }
})

// ___________________________________________________________________
// route to modify a product
router.patch('/:id', async function (req, res) {
    // get the :id from what we try to reach in url
    const id = req.params.id
    const { title, price, description, stock, tagIds } = req.body

    try {
        const product = await Product.findByPk(id)

        if (product) {
            const body = {
                title: title,
                price: price,
                description: description,
                stock: stock,
            }

            for (let key in body) {
                if (body[key] == undefined) {
                    delete body[key]
                }
            }

            // we update product attributes to save the later
            product.set(body)

            // we set new tags (if they are provided)
            if (tagIds && tagIds.length > 0) {
                const tags = await Tag.findAll({
                    where: {
                        id: tagIds
                    }
                });
                await product.setTags(tags);
            }

            try {
                await product.save()
                res.status(200)
                res.json({ message: "Task modified successfully" })
            } catch (exception) {
                res.status(500)
                res.json("Error while modifying: " + exception)
            }
        } else {
            res.status(404)
            res.send("Product you want to modify was not found")
        }
    } catch (error) {
        res.status(500)
        res.json("Error while finding the product: " + error);
    }
})


module.exports = router;
