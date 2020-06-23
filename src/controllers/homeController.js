'use strict'
const fs = require('fs')
const path = require('path')
const viewPath = path.join(__dirname, '..\\view')
const { getRepository } = require('typeorm')
const uploadsPath = path.join(__dirname, '..\\..\\uploads')
const multer = require('multer')
const { responseJSON } = require('../utils/responseJSON')
const cableModem = require('../entity/cableModem')
const { validModelo } = require('../utils/validObject')

const home = async (req, res, next) => {
  const file = await fs.readFileSync(`${viewPath}\\index.html`, 'utf8')
  return res.send(file)
}

const verifyJSON = async (req, res) => {
  const upload = multer().single('file_json')
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(200).json({
        message: 'peticion sin multipart',
        code: 'error-form'
      })
    } else if (err) {
      return res.status(200).json({
        message: 'peticion sin multipart',
        code: 'error-form-2'
      })
    } else if (!req.file) {
      return res.status(200).json({
        message: 'Archivo no encontrado',
        code: 'error-file'
      })
    }

    if (req.file.mimetype !== 'application/json') {
      return res.status(200).json({
        message: 'Archivo no es un JSON',
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
      const resultJSON = validModelo(jsonFile)
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

      await fs.writeFileSync(`${uploadsPath}\\buffer_json.json`, bufferFile)

      const error = []

      jsonFile.map(json => {
        const result = listCM.find(sql => sql.modelo.id === json.modelo && sql.modelo.version_software === json.version_software && sql.direccion_mac === json.direccion_mac && sql.ip === json.ip)
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

  /*
  const result = await parseRequest(req)

  if (result.code === "failure") {
    return res.status(200).json({
      "message" : "peticion sin multipart",
      "code" : "error-form"
    })
  }

  const {files} = result

  console.log('files :>> ', files);
  if (!files.file_json) {
    return res.status(200).json({
      "message" : "sin archivo file_json",
      "code" : "error-file"
    })
  }

  const dataFile = await fs.readFileSync(files.file_json.path,'utf8')
    return res.status(200).json({
      "message" : "Solicitud procesada",
      "code" : "success"
    })

    */
}

const createModelo = async (req, res) => {
  return res.status(200).json({
    message: 'peticion sin multipart',
    code: 'error-form-2'
  })
}

module.exports = {
  home,
  verifyJSON,
  createModelo
}
