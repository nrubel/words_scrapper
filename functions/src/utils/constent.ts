import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";

export const wordsApiCollection: string = `words`
export const oxfordCollection: string = `oxford`
export const runtimeOpts: object = {
    timeoutSeconds: 300,
    memory: '512MB'
}

export const document: (m: documentFuncModel) => firestore.DocumentData =
    ({collection = wordsApiCollection, name}) => admin.firestore().collection(collection).doc(name)