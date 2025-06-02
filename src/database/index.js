require('dotenv').config()

const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

async function query(queryString, params, callback) {
  return pool.query(queryString, params, callback)
}

module.exports = { query }