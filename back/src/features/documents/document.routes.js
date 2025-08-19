const express = require('express');
const router = express.Router();
const documentController = require('./document.controller');

// Route for decoding a document
router.get('/decode', documentController.getDecodedDocument);

// Route for encoding a document
router.post('/encode', documentController.createEncodedDocument);

module.exports = router;
