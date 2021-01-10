const fs = require('fs')
const faker = require('faker')

function between(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function either(left, right) {
  return Math.random() < 0.5 ? left : right
}

function writeHugeSales(writer, encoding, callback) {
  let i = 100000
  let id = 0
  function write() {
    let ok = true
    do {
      i -= 1
      id += 1
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const age = between(18, 60)
      const height = between(100, 200)
      const gender = either('M', 'F')
      const saleAmount = between(30, 100000)
      const lastPurchaseDate = faker.date.between('2010-01-01', '2021-01-01')
      const data = `${firstName} ${lastName},${age},${height},${gender},${saleAmount},${lastPurchaseDate}\n`
      if (i === 0) {
        // call the callback for last record
        writer.write(data, encoding, callback)
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = writer.write(data, encoding)
      }
    } while (i > 0 && ok)
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write)
    }
  }
  write()
}

try {
  console.log('[seed] : running...')

  const writeSales = fs.createWriteStream('sales.csv')
  writeSales.write('USER_NAME,AGE,HEIGHT,GENDER,SALE_AMOUNT,LAST_PURCHASE_DATE\n', 'utf8')

  writeHugeSales(writeSales, 'utf-8', () => {
    writeSales.end()
    console.log('[seed] : success')
  })
} catch {
  throw new Error('failed to seed csv')
}
