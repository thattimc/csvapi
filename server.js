const uploadSalesRecord = require('./api/uploadSalesRecord')
const viewSalesRecord = require('./api/viewSalesRecord')

const express = require("express")

function createServer() {
	const app = express()
	app.post('/sales/record', uploadSalesRecord)
	app.post('/sales/report', viewSalesRecord)
	return app
}

module.exports = createServer