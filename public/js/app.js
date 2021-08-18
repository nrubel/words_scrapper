const form = document.querySelector(`#getWord`)
const formEl = document.getElementById(`getWord`)
const res = document.querySelector('.res')

// Add a new request
form.addEventListener('submit', async e => {
  e.preventDefault();
  let futureQuery;
  const functions = firebase.app().functions(`us-central1`)
  try {
    console.info(`submitted value:`, form.word.value, `and type: `, form.type.value)
    res.textContent = `loading`
    for(const el of formEl.elements){
      el.setAttribute('disabled', 'disabled')
    }

    const addRequest = functions.httpsCallable('getWordResult');
    const result = await addRequest({
      type: form.type.value,
      word: form.word.value,
    })
    if (result.data.word) {
      futureQuery = result.data.futureQuery
    }
    res.textContent = result.data.word ? JSON.stringify(result.data.current, undefined, 2) : result.data.toString()
  } catch (e) {
    console.log(e)
    res.textContent = e
    setTimeout(() => {
      res.textContent = ''
    }, 3000)
  } finally {
    for(const el of formEl.elements){
      el.removeAttribute('disabled')
    }
    const {when, encrypted, words} = futureQuery || {}
    if(!!futureQuery && !!when && !!encrypted){
      const fQuery = functions.httpsCallable('loopWords')
      words.forEach(word => {
        fQuery({
          when, encrypted, word
        })
      })
    }
  }
});