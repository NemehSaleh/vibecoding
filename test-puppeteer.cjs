const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
app.use(express.static('dist'));
const server = app.listen(3002, async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('response', response => {
      if (!response.ok()) console.log('404 URL:', response.url());
    });
    await page.goto('http://localhost:3002/');
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
});
