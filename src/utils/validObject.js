const validCableModems = (arrayJSON) => {
  if (arrayJSON instanceof Array === false) {
    return { code: 'not-array', error: 'Debe ser un Array de Objetos', body: 'JSON con errores' }
  }

  const buffer = arrayJSON.map((one, i) => {
    const resultValid = validCableModem(one)
    if (resultValid !== undefined) {
      return { position: i, faltantes: resultValid }
    }
    return undefined
  })

  const newArray = buffer.filter(row => row !== undefined)
  if (newArray.length > 0) {
    return { code: 'error_in_structure', error: 'Algunos objectos no cumplen la estructura', body: buffer }
  }
}

const validCableModem = (json) => {
  const errores = []
  if (!Object.prototype.hasOwnProperty.call(json, 'modelo')) {
    errores.push('modelo')
  }
  if (!Object.prototype.hasOwnProperty.call(json, 'version_software')) {
    errores.push('version_software')
  }
  if (!Object.prototype.hasOwnProperty.call(json, 'direccion_mac')) {
    errores.push('direccion_mac')
  }
  if (!Object.prototype.hasOwnProperty.call(json, 'ip')) {
    errores.push('ip')
  }
  return (errores.length > 0) ? errores : undefined
}

module.exports = {
  validCableModems,
  validCableModem
}
