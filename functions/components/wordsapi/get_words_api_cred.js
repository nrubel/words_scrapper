const puppeteer = require('puppeteer')
const {wordsApi} = require(`../../utils/endpoints`)

const getWordsApiCred = async () => {
  let when, encrypted
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(wordsApi, {waitUntil: "load"})

  const scripts = await page.$$eval('script', els => els.map((e) => e.textContent))
  scripts
    .filter((e) => e !== '')[0]
    .trim()
    .split(` = `)
    .slice(1)
    .join('')
    .split(`'`)
    .forEach((e, i) => {
      if (i === 1) when = e;
      if (i === 3) encrypted = e;
    })
  await browser.close()

  return {when, encrypted}
}

module.exports = getWordsApiCred