const { listModelo, listCableModem } = require('../../data/initDataBases.json')

const initDDBB = async (connection) => {
  await connection.dropDatabase()
  await connection.synchronize()
  await connection
    .createQueryBuilder()
    .insert()
    .into('modelo')
    .values(listModelo)
    .execute()

  await connection
    .createQueryBuilder()
    .insert()
    .into('cableModem')
    .values(listCableModem)
    .execute()
}

module.exports = {
  initDDBB
}
