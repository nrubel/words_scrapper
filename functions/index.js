const functions = require("firebase-functions")
const {info, error, log} = require("firebase-functions/lib/logger")
const admin = require("firebase-admin")
const axios = require('axios')
const puppeteer = require('puppeteer')
const {omit} = require('lodash')

admin.initializeApp();

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '512MB'
}

const HTTPS = functions.runWith(runtimeOpts).region(`us-central1`).https
const baseUrl = 'https://www.wordsapi.com'

exports.getWordResult = HTTPS.onCall(async (data, context) => {
  try {
    const {word, type} = data
    const words = admin.firestore().collection('words').doc(word)
    const doc = await words.get()
    let result, when, encrypted
    const url = w => `${baseUrl}/mashape/words/${w}?when=${when}&encrypted=${encrypted}`
    if (doc.data()) {
      info(`result from firestore: ${word}`)
      result = doc.data()
    } else {
      info(`result from wordsapi: ${word}`)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      await page.goto(baseUrl, {waitUntil: "load"})

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
      if (when && encrypted) {
        log(`submit word url`, url(word))
        const res = await axios.get(url(word))
        await words.set(res.data)
        result = res.data
      }

      await browser.close()
    }

    log(`desired data returned for word`, word)
    return {
      word,
      current: type === 'everything' ? result : result.results.map(r => r[type]).flat(100).filter(e => !!e),
      futureQuery: {
        when,
        encrypted,
        words: result.results.map(e => Object.values(omit(e, ['definition', 'examples']))
          .flat(2)).flat()
          .filter((v, i, s) => s.indexOf(v) === i)
      }
    }
  } catch (e) {
    error(e.details)
    return e.message
  }
})

exports.loopWords = HTTPS.onCall(async (data, context) => {
  try {
    const {word, when, encrypted} = data
    const words = admin.firestore().collection('words').doc(word)
    const doc = await words.get()
    let url = `${baseUrl}/mashape/words/${word}?when=${when}&encrypted=${encrypted}`
    if (!doc.data()) {
      info(`result from wordsapi: ${word}`)
      const res = await axios.get(url)
      await words.set(res.data)
    }

    return null
  } catch (e) {
    error(e.details)
    return e.message
  }
})
