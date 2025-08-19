const integrationService = require('./integration.service');

const getPokemonImages = async (req, res) => {
    const { pasteId } = req.query;
    if (!pasteId) {
        return res.status(400).send({ error: 'A pasteId query parameter is required.' });
    }

    try {
        const images = await integrationService.fetchPokemonImages(pasteId);
        res.json(images);
    } catch (error) {
        console.error('Failed to fetch Pokémon images:', error);
        res.status(500).send({ error: 'Failed to fetch Pokémon images' });
    }
};

const createPaste = async (req, res) => {
    const { paste } = req.body;
    if (!paste) {
        return res.status(400).json({ error: 'Paste content is required' });
    }

    try {
        const result = await integrationService.createPokebinPaste(paste);
        res.json(result);
    } catch (error) {
        console.error('Error creating paste:', error);
        res.status(500).json({ error: 'Failed to create paste' });
    }
};

module.exports = {
    getPokemonImages,
    createPaste,
};
