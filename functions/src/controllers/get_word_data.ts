import getDataFromWordsApi from "../components/wordsapi/get_data_by_scrap"
import getCurrentData from "../components/wordsapi/returns"
import {info, error} from "firebase-functions/lib/logger"
import {document} from "../utils/constent"

interface model {
    word: string,
    type: string,
    collection: string
}

const getData: (data: model) => Promise<string | object> = async (data: model) => {
    try {
        const {word, type, collection} = data
        const doc = await document({collection, name: word}).get()
        if (doc.data()) {
            info(`result from firestore: ${word}`)
            return {word, current: getCurrentData({type, result: doc.data()})}
        } else {
            info(`result from wordsapi: ${word}`)
            return await getDataFromWordsApi({type, word})
        }
    } catch (e) {
        error(e.details)
        return e.message
    }
}

export default getData