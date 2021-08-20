const {info, error} = require("firebase-functions/lib/logger")
const {wordsApi} = require(`../../utils/endpoints`)
const {wordsApiCollection} = require(`../../utils/constent`)
const axios = require(`axios`).default

const loopWord = async (data, admin) => {
  try {
    const {word, when, encrypted} = data
    const words = admin.firestore().collection(wordsApiCollection).doc(word)
    const doc = await words.get()
    let url = `${wordsApi}/mashape/words/${word}?when=${when}&encrypted=${encrypted}`
    if (!doc.data()) {
      info(`result from wordsapi: ${word}`)
      const res = await axios.get(url)
      await words.set(res.data)
    }
  } catch (e) {
    error(e.details)
  }
  return null
}

module.exports = loopWord