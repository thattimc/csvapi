import { NextFunction, Request, Response } from "express"
import { endOfDay, startOfDay } from 'date-fns'

import formParse from '../lib/formParse'
import isBefore from 'validator/lib/isBefore'
import isDate from 'validator/lib/isDate'
import prisma from '../../src/lib/prisma'

type TValidate = {
  date?: string
  startDate?: string
  endDate?: string
}

function validate({ date, startDate, endDate }: TValidate) {
  if (!date && !(startDate && endDate)) {
    throw new Error('Must provide either singe date or date range')
  }

  if (date && !isDate(date)) {
    throw new Error('Must provide valid date e.g 2021/01/17')
  }

  if (startDate && !isDate(startDate)) {
    throw new Error('Must provide valid date e.g 2021/01/17')
  }

  if (endDate && !isDate(endDate)) {
    throw new Error('Must provide valid date e.g 2021/01/17')
  }

  if (startDate && endDate && !isBefore(startDate, endDate)) {
    throw new Error('Start date must before end date')
  }
}

function getFilter({ date, startDate, endDate }: TValidate) {
  let filter
  if (date) {
    filter = {
      AND: [
        {
          lastPurchaseDate: {
            gte: startOfDay(new Date(date)),
          },
        },
        {
          lastPurchaseDate: {
            lte: endOfDay(new Date(date)),
          },
        },
      ],
    }
  } else if (startDate && endDate) {
    filter = {
      AND: [
        {
          lastPurchaseDate: {
            gte: new Date(startDate),
          },
        },
        {
          lastPurchaseDate: {
            lte: new Date(endDate),
          },
        },
      ],
    }
  }
  return filter
}

export async function viewSalesRecord(req: Request, res: Response, next: NextFunction) {
  const formData = await formParse(req)
  validate(formData.fields)

  const sales = await prisma.sale.findMany({
    where: getFilter(formData.fields),
  })
  
  res.json(sales)
}
