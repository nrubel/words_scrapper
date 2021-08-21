const form = document.querySelector(`#getWord`)
const formEl = document.getElementById(`getWord`)
const res = document.querySelector('.res')
const functions = firebase.app().functions(`us-central1`)
const addRequest = functions.httpsCallable('getWordResult');
const fQuery = functions.httpsCallable('loopWords')

// Add a new request
form.addEventListener('submit', async e => {
  e.preventDefault();
  const word = form.word.value.trim(),
    type = form.type.value.trim()
  let futureQuery;
  try {
    res.textContent = `loading`
    for(const el of formEl.elements){
      el.setAttribute('disabled', 'disabled')
    }

    const result = await addRequest({type, word})
    if (result.data.word) {
      futureQuery = result.data.futureQuery
    }
    res.textContent = result.data.word ? JSON.stringify(result.data.current, undefined, 2) : result.data.toString()
  } catch (e) {
    res.textContent = e
    setTimeout(() => res.textContent = '', 3000)
  } finally {
    for(const el of formEl.elements){
      el.removeAttribute('disabled')
    }
    const {when, encrypted, words} = futureQuery || {}
    if(!!futureQuery && !!when && !!encrypted){
      words.forEach(word => fQuery({when, encrypted, word}))
    }
  }
});