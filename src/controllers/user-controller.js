const HttpError = require('../error/Error')
const User = require('../models/User')

const uuid = require('uuid').v4
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, phone } = req.body

      if (typeof name !== 'string' || name.length < 2) {
        throw new HttpError(400, `O nome está inválido`)
      }

      const verifyFullName = name.split(' ')

      if (verifyFullName.length < 2) {
        throw new HttpError(400, `Formato de nome inválido.`)
      }

      if (typeof email !== 'string' || email.trim() === '') {
        throw new HttpError(400, 'Formato de email inválido')
      }

      const existUser = await User.findByEmail(email)
      if (existUser) throw new HttpError(404, 'Usuário já existente.')

      if (typeof password !== 'string' || password.length < 8) {
        throw new HttpError(400, 'A senha deve ter 8 ou mais caractéres.')
      }

      const encryptedPass = bcrypt.hashSync(password, 10)
      
      if (typeof phone !== 'string' || phone.trim() === '') {
        throw new HttpError(400, 'O telefone é obrigatório.')
      }

      const newUser = await User.createAccount({ id: uuid(), email, password: encryptedPass, name, phone })

      res.status(201).json(newUser)
    } catch (e) {
      next(e)
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body

      if (typeof email !== 'string' || email.trim() === '') {
        throw new HttpError(400, 'Formato de email inválido')
      }

      const existUser = await User.findByEmail(email)
      if (!existUser) throw new HttpError(404, 'Usuário não encontrado.')

      const isValidPass = bcrypt.compareSync(password, existUser.password)
      if (!isValidPass) throw new HttpError(400, 'Credenciais inválidas.')
      
      const payload = { id: existUser.id, username: existUser.username, email: existUser.email }

      const token = jsonwebtoken.sign(payload, process.env.JWT_KEY, { expiresIn: '7d' })

      res.status(200).json({ token })
    } catch (e) {
      next(e)
    }
  },

  showAll: async (req, res) => {
    const { page = 1, limit = 10, search, role = 'user', isActive } = req.query
    const users = await User.allUsers({ page, limit, search, role, isActive })
    res.json(users)
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params

      const existsUser = await User.findById(id)
      if (!existsUser) {
        throw new HttpError(404, 'Usuário não encontrado.')
      }

      if (req.user.id !== id && req.user.role !== 'admin') {
        throw new HttpError(403, 'Impedido de atualizar usuário.')
      }

      const { email, password, name, phone } = req.body
      let updatedUser = {}

      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new HttpError(400, 'Formato de email inválido')
        } else {
          updatedUser.email = email
        }
      }

      if (phone !== undefined) {
        if (typeof phone !== 'string' || phone.trim() === '') {
          throw new HttpError(400, 'O telefone está inválido.')
        } else {
          updatedUser.phone = phone
        }
      }

      if (name !== undefined) {
        if (typeof name !== 'string' || name.length < 2) {
          throw new HttpError(400, `O nome está inválido`)
        } else {
          const verifyFullName = name.split(' ')

          if (verifyFullName.length < 2) {
            throw new HttpError(400, `Formato de nome inválido.`)
          } else {
            updatedUser.name = name
          }
        }
      }

      if (phone !== undefined) {
        if (typeof phone !== 'string' || ph.length < 8) {
          throw new HttpError(400, 'Formato de senha inválido')
        } else {
          updatedUser.password = password
        }
      }

      const updatedUserInfo = await User.updateUser(id, updatedUser)
      res.json(updatedUserInfo)

    } catch (e) {
      next(e)
    }
  },

  delete: async (req, res) => {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) {
      throw new HttpError(404, 'Usuário não encontrado.')
    }

    await User.deleteUser(id)
    res.json({ message: 'Usuário deletado com sucesso!' })
  },

  userById: async (req, res, next) => {
    try {
      const { id } = req.params

      const user = await User.findById(id)

      if (!user) {
        throw new HttpError(404, 'Usuário não encontrado.')
      }

      res.json(user)
    } catch (e) {
      next(e)
    }
  }
}