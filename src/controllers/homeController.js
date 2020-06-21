'use strict'
const fs = require('fs')
const path = require('path')
const viewPath = path.join(__dirname, '..\\view')
const { getRepository } = require('typeorm')
const uploadsPath = path.join(__dirname, '..\\..\\uploads')
const multer = require('multer')
const { responseJSON } = require('../utils/responseJSON')
const cableModem = require('../entity/cableModem')

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

    const { maker } = req.body
    if (!maker) {
      return res.json(responseJSON(false, 'parameters', 'Debe ingresar un fabricante', ['maker']))
    }
    const listModelo = await getRepository('modelo').createQueryBuilder('modelo')
      .where('modelo.fabricante= :arg_maker', { arg_maker: maker })
      .leftJoinAndSelect('modelo.cableModems', 'cableModem')
      .getMany()

    if (listModelo.length < 1) {
      return res.json(responseJSON(false, 'maker_not_found', 'Fabricante no existe', []))
    }

    const bufferFile = req.file.buffer
    const jsonFile = JSON.parse(bufferFile.toString())
    await fs.writeFileSync(`${uploadsPath}\\buffer_json.json`, bufferFile)

    const listDataSql = listModelo.map((one) => {
      return { nombre: one.nombre, fabricante: one.fabricante, version_software: one.version_software }
    })

    const error = []
    jsonFile.map(json => {
      const result = listDataSql.find(sql => sql.nombre === json.nombre && sql.fabricante === json.fabricante && sql.version_software === json.version_software)
      if (!result) {
        error.push(json)
      }
    })

    return res.json(responseJSON(true, 'file-OK', 'Solicitud Procesada', error))
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

module.exports = {
  home,
  verifyJSON
}
