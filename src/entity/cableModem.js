module.exports = {
  name: 'cableModem',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    direccion_mac: {
      type: 'varchar'
    },
    is_status: {
      type: 'bool'
    },
    created_at: {
      type: 'datetime'
    }
  },
  relations: {
    modelo: {
      type: 'many-to-one',
      target: 'modelo',
      joinColumn: true
    }
  }
}
