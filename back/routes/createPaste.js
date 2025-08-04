const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { paste } = req.body;

        if (!paste) {
            return res.status(400).json({ error: 'Paste content is required' });
        }

        const dataStructure = {
            encrypted: false,
            data: {
                title: "",
                author: "",
                notes: "",
                format: "",
                rental: "",
                content: paste
            }
        };

        const base64Data = Buffer.from(JSON.stringify(dataStructure), 'utf8').toString('base64');

        const formData = new URLSearchParams();
        formData.append('title', '');
        formData.append('author', '');
        formData.append('rental', '');
        formData.append('format', '');
        formData.append('notes', '');
        formData.append('password', '');
        formData.append('paste', paste); 
        formData.append('data', base64Data);

        const response = await axios.post('https://pokebin.com/create', formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            maxRedirects: 0,
            validateStatus: function (status) {
                return (status >= 200 && status < 300) || status === 302;
            }
        });

        let pasteId = '';
        
        if (response.status === 302 && response.headers.location) {
            const locationMatch = response.headers.location.match(/\/([^/]+)\/?$/);
            if (locationMatch && locationMatch[1]) {
                pasteId = locationMatch[1];
            }
        }

        if (pasteId) {
            res.json({ 
                pasteId,
                url: `https://pokebin.com/${pasteId}`
            });
        } else {
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            res.status(500).json({ error: 'Could not extract paste ID from response' });
        }

    } catch (error) {
        console.error('Error creating paste:', error);
        
        if (error.response && error.response.status === 302) {
            const location = error.response.headers.location;
            if (location) {
                const locationMatch = location.match(/\/([^/]+)\/?$/);
                if (locationMatch && locationMatch[1]) {
                    const pasteId = locationMatch[1];
                    return res.json({ 
                        pasteId,
                        url: `https://pokebin.com/${pasteId}`
                    });
                }
            }
        }
        
        if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', error.response.data);
            console.log('Response headers:', error.response.headers);
        }
        
        res.status(500).json({ error: 'Failed to create paste' });
    }
});

module.exports = router;
