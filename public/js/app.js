const form = document.querySelector(`#getWord`)
const res = document.querySelector('.res')


// Add a new request
form.addEventListener('submit', async e => {
  e.preventDefault();
  try{
    console.info(`sumitted value:`, form.word.value)
    res.textContent = `loading`

    const functions = firebase.functions()
    const addRequest = functions.httpsCallable('getWordResult');
    const result = await addRequest(form.word.value)
    res.textContent = result.data.word ? JSON.stringify(result.data, undefined, 2) : result.data.toString()
  }catch (e) {
    console.log(e)
    res.textContent = e
    setTimeout(() => {
      res.textContent = ''
    }, 3000)
  }
});