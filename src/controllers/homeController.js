'use strict'
const fs = require('fs')
const path = require('path')
const viewPath = path.join(__dirname, '..\\view')
const { getRepository } = require('typeorm')
const uploadsPath = path.join(__dirname, '..\\..\\uploads')
const multer = require('multer')
const { responseJSON } = require('../utils/responseJSON')
const { validCableModems } = require('../utils/validObject')

const home = async (req, res, next) => {
  const file = await fs.readFileSync(`${viewPath}\\index.html`, 'utf8')
  return res.send(file)
}

const verifyJSON = async (req, res) => {
  const upload = multer().single('file_json')
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(200).json({
        message: 'No es un Archivo',
        code: 'error-form'
      })
    } else if (err) {
      return res.status(200).json({
        message: 'No es un Archivo',
        code: 'error-form-2'
      })
    } else if (!req.file) {
      return res.status(200).json({
        message: 'Archivo no adjuntado',
        code: 'error-file'
      })
    }

    if (req.file.mimetype !== 'application/json') {
      return res.status(200).json({
        message: 'El archivo debe ser en formato JSON',
        code: 'not-json'
      })
    }

    try {
      const { maker } = req.body
      if (!maker) {
        return res.json(responseJSON(false, 'parameters', 'Debe ingresar un fabricante', ['maker']))
      }

      const bufferFile = req.file.buffer
      const jsonFile = JSON.parse(bufferFile.toString())
      const resultJSON = validCableModems(jsonFile)
      if (resultJSON) {
        return res.json(responseJSON(false, resultJSON.code, resultJSON.error, resultJSON.body))
      }

      const listCM = await getRepository('cableModem').createQueryBuilder('cableModem')
        .select([
          'cableModem.id',
          'cableModem.direccion_mac',
          'cableModem.ip',
          'modelo.id',
          'modelo.nombre',
          'modelo.version_software'
        ])
        .innerJoin('cableModem.modelo', 'modelo')
        .where('modelo.fabricante= :arg_maker', { arg_maker: maker })
        .getMany()

      if (listCM.length < 1) {
        return res.json(responseJSON(false, 'maker_not_found', 'Fabricante no existe', []))
      }

      await fs.writeFileSync(`${uploadsPath}\\${new Date().getTime()}.json`, bufferFile)

      const error = []

      jsonFile.map(json => {
        const result = listCM.find(sql => sql.modelo.nombre === json.modelo && sql.modelo.version_software === json.version_software && sql.direccion_mac === json.direccion_mac && sql.ip === json.ip)
        if (!result) {
          error.push(json)
        }
      })

      return res.json(responseJSON(true, 'file-OK', 'Solicitud Procesada', error))
    } catch (error) {
      console.log('error.message :>> ', error.message)
      return res.json(responseJSON(false, 'error-internal', 'Error del Servidor', []))
    }
  })
}

const createCableModem = async (req, res) => {
  const { obj_cable_modem: objCableModem } = req.body

  if (!objCableModem) {
    return res.json(responseJSON(false, 'parameters', 'CableModem no enviado', ['obj_cable_modem']))
  }

  const modelo = await getRepository('modelo').createQueryBuilder('modelo')
    .where('modelo.nombre= :arg_modelo AND modelo.version_software= :arg_versionSoftware ', { arg_modelo: objCableModem.modelo, arg_versionSoftware: objCableModem.version_software })
    .getOne()

  if (!modelo) {
    return res.json(responseJSON(false, 'modelo-error', 'Modelo o version de software erroneos'))
  }

  try {
    const cableModem = await getRepository('cableModem').save({
      direccion_mac: objCableModem.direccion_mac,
      ip: objCableModem.ip,
      modelo: modelo,
      is_status: true,
      created_at: new Date(
        new Date().toLocaleString('es-AR', {
          timeZone: 'America/Argentina/Buenos_Aires'
        })
      )
    })

    return res.status(201).json(responseJSON(true, 'created', 'CableModem Creado', cableModem))
  } catch (error) {
    console.error('error.message :>> ', error.message)
    return res.json(responseJSON(false, 'error-internal', 'Error Interno'))
  }
}

module.exports = {
  home,
  verifyJSON,
  createCableModem
}
