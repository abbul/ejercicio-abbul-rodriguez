
document.getElementById('btn_form').addEventListener('click', sendFile)

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
        document.querySelector('#message').innerHTML = res.message
        resolve(res)
      })
  })
}

function sendFile (e) {
  const formData = new FormData()
  const inputFile = document.querySelector('#file_json')
  formData.append('file_json', inputFile.files[0])
  formData.append('maker', document.querySelector('#input_maker').value)
  deleteAllChildrens('tbody')
  request('/verify-json', 'POST', formData)
    .then(res => {
      if (res.type !== 'success') {
        if (res.code === 'error_in_structure') {
          //
          // Mostrar los registros que no cumplen con la estructura esperada
          //
        }
        return null
      }
      const { body: elements } = res
      elements.forEach((element, i) => {
        const button = document.createElement('button')
        button.textContent = 'Agregar'
        button.id = `btn_${i}`
        button.addEventListener('click', function () {
          sendCableModem(this)
        })
        addRow('tbody', [
          element.direccion_mac,
          element.ip,
          element.modelo,
          element.version_software,
          button
        ], `tr_${i}`)
      })
      document.querySelector('#tableJSON').style.display = 'block'
    })
    .catch(err => console.log('err :>> ', err))
}

function addRow (tbodyID, row, rowID) {
  const tbody = document.querySelector(`#${tbodyID}`)
  const tr = document.createElement('tr')
  tr.id = rowID

  row.forEach(column => {
    const td = document.createElement('td')
    column instanceof Object ? td.insertAdjacentElement('beforeend', column) : td.textContent = `${column}`
    tr.insertAdjacentElement('beforeend', td)
  })
  tbody.insertAdjacentElement('beforeend', tr)
}

function sendCableModem (element) {
  const id = element.id.substring(4)
  const tr = document.querySelector(`#tr_${id}`)

  const data = {
    obj_cable_modem: {
      direccion_mac: tr.children[0].innerHTML,
      ip: tr.children[1].innerHTML,
      modelo: tr.children[2].innerHTML,
      version_software: tr.children[3].innerHTML
    }
  }
  request('/cable-modem', 'POST', data)
    .then(res => {
      if (res.type !== 'success') {
        return null
      }
      deleteRow('tbody', tr)
    })
    .catch(err => console.log('err :>> ', err))
}

function deleteRow (tbodyID, row) {
  document.querySelector(`#${tbodyID}`).removeChild(row)
}

function deleteAllChildrens (nodeID) {
  const parent = document.getElementById(`${nodeID}`)
  while (parent.firstChild) {
    parent.firstChild.remove()
  }
  return null
}
