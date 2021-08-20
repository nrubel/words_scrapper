const getDataFromWordsApi = require("../components/wordsapi/get_data_by_scrap");
const {getCurrentData} = require("../components/wordsapi/returns");
const {info, error} = require("firebase-functions/lib/logger");
const {wordsApiCollection} = require("../utils/constent");

const getWordData = async ({data, admin}) => {
  try {
    const {word, type, collection} = data
    const words = admin.firestore().collection(collection || wordsApiCollection).doc(word)
    const doc = await words.get()
    if (doc.data()) {
      info(`result from firestore: ${word}`)
      return {word, current: getCurrentData({type, result: doc.data()})}
    } else {
      info(`result from wordsapi: ${word}`)
      return await getDataFromWordsApi({type, word, store: words})
    }
  } catch (e) {
    error(e.details)
    return e.message
  }
}

module.exports = getWordData