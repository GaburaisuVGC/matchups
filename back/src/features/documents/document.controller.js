const documentService = require('./document.service');

const getDecodedDocument = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).send({ error: 'Document ID is required' });
    }

    try {
        const documentData = await documentService.getDecodedDocument(id);
        res.json(documentData);
    } catch (error) {
        console.error(error);
        // More specific error checking can be done here if needed
        if (error.name === 'NoSuchKey') {
            return res.status(404).send({ error: 'Document not found' });
        }
        res.status(500).send({ error: 'Failed to decode document' });
    }
};

function base64UrlSafeEncode(data) {
    return data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const createEncodedDocument = async (req, res) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).send({ error: 'Request body cannot be empty' });
    }

    try {
        const documentId = await documentService.createAndEncodeDocument(data);
        const safeId = base64UrlSafeEncode(documentId);
        res.send({ id: safeId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to encode document' });
    }
};

module.exports = {
    getDecodedDocument,
    createEncodedDocument,
};
