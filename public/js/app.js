const form = document.querySelector(`#getWord`)
const res = document.querySelector('.res')


// Add a new request
form.addEventListener('submit', async e => {
  e.preventDefault();
  try{
    console.info(`submitted value:`, form.word.value, `and type: `, form.type.value)
    res.textContent = `loading`

    const functions = firebase.app().functions(`us-central1`)
    const addRequest = functions.httpsCallable('getWordResult');
    const result = await addRequest({
      type: form.type.value,
      word: form.word.value,
    })
    res.textContent = result.data.word ? JSON.stringify(result.data, undefined, 2) : result.data.toString()
  }catch (e) {
    console.log(e)
    res.textContent = e
    setTimeout(() => {
      res.textContent = ''
    }, 3000)
  }
});