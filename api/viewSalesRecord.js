const { endOfDay, startOfDay } = require('date-fns')
const formParse = require('../lib/formParse')
const isBefore = require('validator/lib/isBefore')
const isDate = require('validator/lib/isDate')
const prisma = require('../lib/prisma')


function validate({ date, startDate, endDate }, res) {
  if (!date && !(startDate && endDate)) {
    res.status(422).json({ message: 'Must provide either singe date or date range' }) 
  }

  if (date && !isDate(date)) {
    res.status(422).json({ message: 'Must provide valid date e.g 2021/01/17' }) 
  }

  if (startDate && !isDate(startDate)) {
    res.status(422).json({ message: 'Must provide valid date e.g 2021/01/17' }) 
  }

  if (endDate && !isDate(endDate)) {
    res.status(422).json({ message: 'Must provide valid date e.g 2021/01/17' }) 
  }

  if (startDate && endDate && !isBefore(startDate, endDate)) {
    res.status(422).json({ message: 'Start date must before end date' }) 
  }
}

function getFilter({ date, startDate, endDate }) {
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

async function viewSalesRecord(req, res, next) {
  const formData = await formParse(req)
  validate(formData.fields, res)

  const sales = await prisma.sale.findMany({
    where: getFilter(formData.fields),
  })
  
  res.json(sales)
}

module.exports = viewSalesRecord