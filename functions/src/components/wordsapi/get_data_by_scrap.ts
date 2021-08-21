import getWordsApiCred from "./get_words_api_cred"
import {omit} from "lodash"
import axios from "axios"
import {wordsApi} from "../../utils/endpoints"
import {document, wordsApiCollection} from "../../utils/constent"
import getCurrentData from "./returns"
import {log} from "firebase-functions/lib/logger"

interface model{
  word: string,
  type: string,
}

const getDataFromWordsApi: (d: model) => Promise<any> = async ({word, type}) => {
  const {when, encrypted} = await getWordsApiCred()
  const url = `${wordsApi}/mashape/words/${word}?when=${when}&encrypted=${encrypted}`
  log(`submit word url`, url)

  const res = await axios.get(url)
  await document({collection: wordsApiCollection, name: word}).set(res.data)

  return {
    word,
    current: getCurrentData({type, result: res.data}),
    futureQuery: {
      when,
      encrypted,
      words: res.data.results.map((e: any) => Object.values(omit(e, ['definition', 'examples']))
        .flat(2)).flat()
        .filter((v: string, i: number, s: string) => s.indexOf(v) === i)
    }
  }
}

export default getDataFromWordsApi