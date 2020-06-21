/*

document.getElementById("btn_form").addEventListener('click', (ev)=> {

    const formData = new FormData();
    const inputFile = document.querySelector("#file_json");

    formData.append('file_json', inputFile.files[0]);

    const init = {
        method: "POST",
        body : formData
    }
    fetch("/verify-json",init)
    .then(res => res.json())
    .catch(err => console.log('err >> ', err))
    .then(res => {
        message.innerHTML = res.message
        console.log('res :>> ', res);
    })
})
*/

document.getElementById('btn_form').addEventListener('click', (ev) => {
  const formData = new FormData()
  const inputFile = document.querySelector('#file_json')

  formData.append('file_json', inputFile.files[0])
  formData.append('maker', document.querySelector('#input_maker').value)

  request('/verify-json', 'POST', formData)
    .then(res => console.log('res >> ', res))
    .catch(err => console.log('err :>> ', err))
})

/**
 *
 * @param {String} url Es el endpoint que vamos a consumir.
 * @param {String} method Es el metodo del endpoint. GET - POST - PUT - DELETE
 * @param {Object|undefined} data Es la informacion que enviaremos al servidor
 */
function request (url, method, data) {
  const init = {
    method: method
  }

  if (method === 'POST' || method === 'POST') {
    if (data instanceof FormData) {
      init.body = data
    } else {
      init.headers = {
        'Content-Type': 'application/json'
      }
      init.body = JSON.stringify(data)
    }
  }

  return new Promise((resolve, reject) => {
    fetch(url, init)
      .then(res => res.json())
      .catch(err => reject(err))
      .then(res => {
        message.innerHTML = res.message
        resolve(res)
      })
  })
}
