require('./database/db-sync')
require('dotenv').config()
const express = require('express')
const authRouter = require('./routes/auth-router')
const errorMiddleware = require('./middleware/error-middleware')
const cors = require('cors')
const app = express()

app.use(express.json())

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/auth', authRouter)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando em:\nhttp://localhost:${PORT}`))

