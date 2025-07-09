const { query } = require('../database')
const HttpError = require('../error/Error')
const uuid = require('uuid').v4

class User {
  constructor(row) {
    this.id = row.id 
    this.email = row.email
    this.password = row.password
    this.name = row.name
    this.username = row.username
    this.phone = row.phone
    this.plan = row.plan
    this.planExpiry = row.plan_expiry
    this.language = row.language
    this.isActive = row.is_active
    this.role = row.role
    this.createdAt = row.created_at
    this.updatedAt = row.updated_at
  }

  static async allUsers() {
    const data = await query(
      `SELECT * FROM users`
    )

    const response = data.rows.map((row) => new User(row))
    return response
  }

  static async createAccount({ id, email, password, name, phone }) {
    try {
      const nickname = name.split(' ')
      let reformatedName

      if (nickname.length > 2) {
        reformatedName = `${nickname[0]} ${nickname[1]} ${nickname[2][0]}.`
      } else {
        reformatedName = `${nickname[0]} ${nickname[1]}`
      }

      const now = new Date();
      const expiryYear = now.getFullYear() + 1;
      const expiryDate = new Date(expiryYear, now.getMonth(), now.getDate()).toLocaleString()

      await query(`
        INSERT INTO users (id, email, password, name, username, phone, plan_expiry)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [id, email, password, name, reformatedName, phone, expiryDate])
      

      const profileId = uuid()
      await query(
        `INSERT INTO profiles (id, profile_name, user_id)
         VALUES ($1, $2, $3)`, [profileId, reformatedName, id])

      const response = await query(`SELECT * FROM users WHERE id = $1`, [id])

      return response.rows[0]
    } catch (e) {
      throw new HttpError(400, `Erro ao criar usuário, motivo: ${e.message}`)
    }
  }

  static async findByEmail(email) {
    try {
      console.log('[findByEmail] buscando email:', email)
      const data = await query(`SELECT * FROM users WHERE email = $1`, [email])
      const response = data.rows[0]
      return response
    } catch (e) {
      console.error('[findByEmail] erro ao buscar:', e)
      throw new HttpError(400, `Erro ao buscar usuário, motivo: ${e.message}`)
    }
  }

  static async findById(id) {
    try {
      const data = await query(`SELECT * FROM users WHERE id = $1`, [id])
      const response = data.rows[0]

      if (!response) {
        return
      }

      const profileData = await query(`SELECT * FROM profiles WHERE user_id = $1`, [id])

      response.profiles = profileData.rows
      return response
    } catch (e) {
      throw new HttpError(400, `Erro ao buscar usuário, motivo: ${e.message}`)
    }
  }

  static async updateUser(id, updatedUser) {
    try {
      if (updatedUser.email) {
        await query(`
          UPDATE users
          SET email = $1
          WHERE id = $2`,
          [updatedUser.email, id])
      }

      if (updatedUser.password) {
        await query(`
          UPDATE users
          SET password = $1
          WHERE id = $2`,
          [updatedUser.password, id])
      }

      if (updatedUser.name) {
        const name = updatedUser.name
        const nickname = name.split(' ')
        let reformatedName

        if (nickname.length > 2) {
          reformatedName = `${nickname[0]} ${nickname[1]} ${nickname[2][0]}.`
        } else {
          console.log('oi')
          reformatedName = `${nickname[0]} ${nickname[1]}`
        }

        await query(`
          UPDATE users
          SET name = $1,
          username = $2
          WHERE id = $3`,
          [name, reformatedName, id])
      }

      if (updatedUser.phone) {
         await query(`
          UPDATE users
          SET phone = $1,
          WHERE id = $2`,
          [updatedUser.phone, id])
      }

      const result = await query(`SELECT * FROM users WHERE id = $1`, [id])
      return result.rows[0]
    } catch (e) {
      throw new HttpError(400, `Erro ao atualizar usuário, motivo: ${e.message}`)
    }
  }

  static async deleteUser(id) {
    await query(`DELETE FROM users WHERE id = $1`, [id])
  }
}

module.exports = User