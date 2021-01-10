require("dotenv").config()

const createServer = require("./server")
const app = createServer()

app.listen(process.env.PORT)
console.log(`[app] : http://localhost:${process.env.PORT}`)