const express = require('express')
const app = express()
app.use(express.json()) //body parser
const studentrouter = require('./controllers/students_controller')
app.use('/', studentrouter)
app.listen(3000)