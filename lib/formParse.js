const formidable = require('formidable')

function formParse(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm()
    form.uploadDir = './'
    form.keepExtensions = true
    form.maxFileSize = 2000 * 1024 * 1024
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve({ fields, files })
    })
  })
}

module.exports = formParse
