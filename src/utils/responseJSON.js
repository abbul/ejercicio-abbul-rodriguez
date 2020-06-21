/**
 *
 * @param {Boolean} type Resume si la accion es correcta o erronea
 * @param {String} code Es un codigo interno del error. Sirve para los Unit Test
 * @param {String} message Un mensaje describiendo el error, para que lo utilicen en el front-end
 * @param {Object} body Es la entidad/es o informacion que se solicita
 */
const responseJSON = (type, code, message, body) => {
  return {
    type: type ? 'success' : 'failure',
    code,
    message,
    body
  }
}
module.exports = {
  responseJSON
}
