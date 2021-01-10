const formParse = require('../lib/formParse')
const fs = require('fs')
const parse = require('csv-parse')
const prisma = require('../lib/prisma')

async function bulkDbImport(records) {
  const writes = []
  records.forEach((sale) => {
    writes.push(
      prisma.$executeRaw(
        `INSERT INTO "Sale" (user_name, age, height, gender, sale_amount, last_purchase_date) VALUES ($1, $2, $3, $4, $5, $6)`,
        sale.USER_NAME,
        Number(sale.AGE),
        Number(sale.HEIGHT),
        sale.GENDER,
        Number(sale.SALE_AMOUNT),
        new Date(sale.LAST_PURCHASE_DATE)
      )
    )
  })
  await prisma.$transaction(writes)
}

function processFile(file) {
  return new Promise((resolve, reject) => {
    let records = []
    const parser = fs.createReadStream(file).pipe(parse({ columns: true }))
    parser.on('readable', async function () {
      let record
      while ((record = parser.read())) {
        records.push(record)
        if (records.length === 1000) {
          await bulkDbImport(records)
          records = []
        }
      }
    })
    parser.on('error', function (err) {
      reject(err.message)
    })
    parser.on('end', async function () {
      await bulkDbImport(records)
      records = []
      resolve('DB Imported')
    })
  })
}

async function uploadSalesRecord (req, res, next) {
  const formData = await formParse(req)

  const csvTempFile = formData.files['']
  processFile(csvTempFile.path)

  res.json({ message: 'Uploaded CSV file' })
}

module.exports = uploadSalesRecord
