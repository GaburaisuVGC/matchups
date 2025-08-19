const express = require('express');
const router = express.Router();
const integrationController = require('./integration.controller');

router.get('/parse-pokebin', integrationController.getPokemonImages);
router.post('/create-paste', integrationController.createPaste);

module.exports = router;
