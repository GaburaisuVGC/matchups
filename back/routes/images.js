const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');

const router = express.Router();

router.get('/', async (req, res) => {
  const { pasteId } = req.query;
  const url = `https://pokebin.com/${pasteId}`;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the images to load
    await page.waitForSelector('.img-pokemon');

    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.img-pokemon')).map(img => img.src);
    });

    await browser.close();

    res.json(images);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Pokémon images' });
  }
});

module.exports = router;