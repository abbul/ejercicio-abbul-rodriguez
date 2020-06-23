const validModelo = (arrayJSON) => {
  if (arrayJSON instanceof Array === false) {
    return { code: 'not-array', error: 'Debe ser un Array de Objetos', body: 'JSON con errores' }
  }
  const buffer = arrayJSON.map((one, i) => {
    const result = { posicion: i, faltantes: [] }
    if (!Object.prototype.hasOwnProperty.call(one, 'modelo')) {
      result.faltantes.push('modelo')
    }
    if (!Object.prototype.hasOwnProperty.call(one, 'version_software')) {
      result.faltantes.push('version_software')
    }
    if (!Object.prototype.hasOwnProperty.call(one, 'direccion_mac')) {
      result.faltantes.push('direccion_mac')
    }
    if (!Object.prototype.hasOwnProperty.call(one, 'ip')) {
      result.faltantes.push('ip')
    }

    return (result.faltantes.length > 0) ? result : undefined
  })

  const newArray = buffer.filter(row => row !== undefined)
  if (newArray.length > 0) {
    return { code: 'error_in_structure', error: 'Algunos objectos no cumplen la estructura', body: buffer }
  }

  return undefined
}

module.exports = {
  validModelo
}
