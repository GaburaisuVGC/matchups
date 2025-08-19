const puppeteer = require('puppeteer');
const axios = require('axios');

const fetchPokemonImages = async (pasteId) => {
    const url = `https://pokebin.com/${pasteId}`;
    const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(),
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.img-pokemon');

    const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.img-pokemon')).map(img => img.src);
    });

    await browser.close();
    return images;
};

const createPokebinPaste = async (paste) => {
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
        validateStatus: (status) => (status >= 200 && status < 300) || status === 302,
    });

    let pasteId = '';
    const location = response.headers.location;
    if (response.status === 302 && location) {
        const locationMatch = location.match(/\/([^/]+)\/?$/);
        if (locationMatch && locationMatch[1]) {
            pasteId = locationMatch[1];
        }
    }

    if (!pasteId) {
        throw new Error('Could not extract paste ID from response');
    }

    return {
        pasteId,
        url: `https://pokebin.com/${pasteId}`
    };
};


module.exports = {
    fetchPokemonImages,
    createPokebinPaste,
};
