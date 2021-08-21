import * as axios from "axios";
import {info, error} from "firebase-functions/lib/logger";
import {wordsApi} from '../../utils/endpoints'
import {document, wordsApiCollection} from "../../utils/constent"

interface dataModel{
  word: string,
  when: string,
  encrypted: string,
}

const loopWord: (data: dataModel) => Promise<void> = async (data) => {
  try {
    const {word, when, encrypted} = data
    const words = document({collection: wordsApiCollection, name: word})
    const doc = await words.get()
    let url: string = `${wordsApi}/mashape/words/${word}?when=${when}&encrypted=${encrypted}`
    if (!doc.data()) {
      info(`result from wordsapi: ${word}`)
      const res: any = await axios.default.get(url)
      await words.set(res.data)
    }
  } catch (e) {
    error(e.details)
  }
}

export default loopWord