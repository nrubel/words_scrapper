const getWordsApiCred = require("./get_words_api_cred");
const {omit} = require("lodash");
const {get} = require("axios");
const {wordsApi} = require("../../utils/endpoints");
const {getCurrentData} = require("./returns");
const {log} = require("firebase-functions/lib/logger");

const getDataFromWordsApi = async ({word, type, store}) => {
  const {when, encrypted} = await getWordsApiCred()
  const url = w => `${wordsApi}/mashape/words/${w}?when=${when}&encrypted=${encrypted}`
  log(`submit word url`, url(word))

  const res = await get(url(word))
  await store.set(res.data)

  return {
    word,
    current: getCurrentData({type, result: res.data}),
    futureQuery: {
      when,
      encrypted,
      words: res.data.results.map(e => Object.values(omit(e, ['definition', 'examples']))
        .flat(2)).flat()
        .filter((v, i, s) => s.indexOf(v) === i)
    }
  }
}

module.exports = getDataFromWordsApi