
document.getElementById('btn_form').addEventListener('click', (ev) => {
  const formData = new FormData()
  const inputFile = document.querySelector('#file_json')

  formData.append('file_json', inputFile.files[0])
  formData.append('maker', document.querySelector('#input_maker').value)

  request('/verify-json', 'POST', formData)
    .then(res => {
      if (res.type !== 'success') {
        if (res.code === 'error_in_structure') {
          alert(res.body)
        }
        return null
      }
      const { body: elements } = res
      elements.forEach((element, i) => {
        const button = document.createElement('button')
        button.textContent = 'Agregar'
        button.id = `btn_${i}`
        button.addEventListener('click', function () {
          sendModelo(this)
        })
        addRow('tbody', [
          element.direccion_mac,
          element.ip,
          element.modelo,
          element.version_software,
          button
        ])
      })
      document.querySelector('#tableJSON').style.display = 'block'
    })
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

function addRow (tbodyID, row) {
  const tbody = document.querySelector(`#${tbodyID}`)
  const tr = document.createElement('tr')

  row.forEach(column => {
    const td = document.createElement('td')
    column instanceof Object ? td.insertAdjacentElement('beforeend', column) : td.textContent = `${column}`
    tr.insertAdjacentElement('beforeend', td)
  })
  tbody.insertAdjacentElement('beforeend', tr)
}

function sendModelo (element) {
  const position = element.id.substring(4)
  const tr = document.querySelector('#tbody').children[position]
  const data = {
    direccion_mac: tr.children[0].innerHTML,
    ip: tr.children[1].innerHTML,
    modelo: tr.children[2].innerHTML,
    version_software: tr.children[3].innerHTML
  }
  request('/modelo', 'POST', data)
    .then(res => {
      deleteRow('tbody', tr)
    })
    .catch(err => console.log('err :>> ', err))
}

function deleteRow (tbodyID, row) {
  document.querySelector(`#${tbodyID}`).removeChild(row)
}
