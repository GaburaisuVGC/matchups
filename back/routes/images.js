const express = require('express');
const puppeteer = require('puppeteer');

const router = express.Router();

router.get('/', async (req, res) => {
  const { pasteId } = req.query;
  const url = `https://pokebin.com/${pasteId}`;

  try {
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

    res.json(images);
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Failed to fetch Pokémon images' });
  }
});

module.exports = router;