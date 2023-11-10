const express = require('express');
const router = express.Router();

/* Route de test */
router.get('/', function(req, res) {
  res.send('Serveur fonctionnel');
});

module.exports = router;
