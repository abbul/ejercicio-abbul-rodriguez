module.exports = {
  name: 'modelo',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    nombre: {
      type: 'varchar'
    },
    fabricante: {
      type: 'varchar'
    },
    version_software: {
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
    cableModems: {
      type: 'one-to-many',
      target: 'cableModem',
      inverseSide: 'modelo'
    }
  }
}
