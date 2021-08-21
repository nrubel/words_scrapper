import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import loopWord from './components/wordsapi/loop_word';
import getWordData from "./controllers/get_word_data";

// Initialize Admin
admin.initializeApp();

// Declare HTTPS caller
const HTTPS = (memory: any = `128MB`) => functions.runWith({memory}).region(`us-central1`).https

// Functions
export const getWordResult = HTTPS(`512MB`).onCall(getWordData)
export const loopWords = HTTPS().onCall(loopWord)
