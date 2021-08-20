const functions = require("firebase-functions")
const admin = require("firebase-admin")
const loopWord = require("./components/wordsapi/loop_word")
const getWordData = require("./controllers/get_word_data");
const {runtimeOpts} = require("./utils/options");

// Initialize Admin
admin.initializeApp();

// Declare HTTPS caller
const HTTPS = functions.runWith(runtimeOpts).region(`us-central1`).https

// Functions
exports.getWordResult = HTTPS.onCall((data) => getWordData({data, admin}))
exports.loopWords = HTTPS.onCall((data) => loopWord(data, admin))
