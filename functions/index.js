const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require('axios')
const puppeteer = require('puppeteer');

admin.initializeApp();

exports.getWordResult = functions.region(`us-central1`).https.onCall(async (word, context) => {
  try{
    const words = admin.firestore().collection('words').doc(word)
    const doc = await words.get()
    if(doc.data()) {
      console.log(`result from firestore`)
      return doc.data()
    }
    else{
      console.log(`result from wordsapi`, word)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      const baseUrl = 'https://www.wordsapi.com'

      await page.goto(baseUrl, {waitUntil: "load"})

      let when, encrypted
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
      if(when && encrypted) {
        const res = await axios.get(`${baseUrl}/mashape/words/${word}?when=${when}&encrypted=${encrypted}`)
        await words.set(res.data)
        return res.data
      }

      await browser.close()
    }
  }catch (e) {
    console.error(e.details)
    return e.message
  }
})
