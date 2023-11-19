const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { authentificationMiddleware } = require('../middlewares/auth')

router.use(authentificationMiddleware);

router.get('/', function(req, res) {
    res.send('Serveur fonctionnel');
});




module.exports = router;