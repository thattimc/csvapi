const createServer = require("./server")
const supertest = require("supertest")

const app = createServer()

test("View Sales Record with Single Date", async () => {
	const data = {
    date: "2019/02/01",
	}

	await supertest(app)
		.post("/sales/report")
		.send(data)
		.expect(200)
		.then(async (response) => {
			// Check the response
			expect(Array.isArray(response.body)).toBeTruthy()
			expect(response.body.length).toEqual(52)

			// Check the response data
			expect(response.body[0].id).toBe(8157)
			expect(response.body[0].userName).toBe('Rowan Predovic')
			expect(response.body[0].age).toBe(23)
			expect(response.body[0].height).toBe(197)
			expect(response.body[0].gender).toBe('F')
			expect(response.body[0].saleAmount).toBe(20265)
			expect(response.body[0].lastPurchaseDate).toBe('2019-02-01T04:44:27.000Z')
		})
})

test("View Sales Record with Date Range", async () => {
	const data = {
		startDate: "2019/02/01",
		endDate: "2019/03/01",
	}

	await supertest(app)
		.post("/sales/report")
		.send(data)
		.expect(200)
		.then(async (response) => {
			// Check the response
			expect(Array.isArray(response.body)).toBeTruthy()
			expect(response.body.length).toEqual(1155)

			// Check the response data
			expect(response.body[0].id).toBe(256)
			expect(response.body[0].userName).toBe('Lottie Emmerich')
			expect(response.body[0].age).toBe(45)
			expect(response.body[0].height).toBe(187)
			expect(response.body[0].gender).toBe('F')
			expect(response.body[0].saleAmount).toBe(81194)
			expect(response.body[0].lastPurchaseDate).toBe('2019-02-23T02:35:28.000Z')
		})
})

test("Start date must before end date", async () => {
	const data = {
		startDate: "2019/03/01",
		endDate: "2019/02/01",
	}

	await supertest(app)
		.post("/sales/report")
		.send(data)
		.expect(422)
		.then(async (response) => {
			// Check the response data
			expect(response.body.message).toBe('Start date must before end date')
		})		
})