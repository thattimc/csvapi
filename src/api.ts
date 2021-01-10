import { NextFunction, Request, Response } from "express"

import formidable from 'formidable'
import fs from 'fs'
import parse from 'csv-parse'
import prisma from '../src/lib/prisma'

type TRecord = {
  USER_NAME: string
  AGE: string
  HEIGHT: string
  GENDER: string
  SALE_AMOUNT: string
  LAST_PURCHASE_DATE: string
}

type TFormParse = {
  fields: formidable.Fields
  files: formidable.Files
}

async function bulkDbImport(records: TRecord[]) {
  const writes: Promise<any>[] = []
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

function processFile(file: string) {
  return new Promise((resolve, reject) => {
    let records: TRecord[] = []
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
    parser.on('error', function (err: Error) {
      reject(err.message)
    })
    parser.on('end', async function () {
      await bulkDbImport(records)
      records = []
      resolve('DB Imported')
    })
  })
}

function formParse(req: Request): Promise<TFormParse> {
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

export async function uploadSalesRecord (req: Request, res: Response, next: NextFunction) {
  const formData = await formParse(req)

  const csvTempFile = formData.files[''] as formidable.File
  processFile(csvTempFile.path)
    
  res.json({ message: 'ok' })
}
