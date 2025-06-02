const HttpError = require("../error/Error")
const jwt = require('jsonwebtoken')
const User = require("../models/User")

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const headerToken = req.headers.authorization
      if (!headerToken) {
        throw new HttpError(401, 'Token inválido.') 
      }

      const token = headerToken.split(" ")[1]
      const encryptedUser = jwt.verify(token, process.env.JWT_KEY)
      
      const user = await User.findById(encryptedUser.id)
      if (!user) {
        throw new HttpError(404, 'Usuário não encontrado.')
      }
  
      req.isAutorizated = true
      req.user = user
      
      next()
    } catch (e) {
      next(e)
    }
  },

  safeRouter: async (req, res, next) => {
    try {
      if (!req.isAutorizated) {
        throw new HttpError(401, 'Acesso não autorizado.')
      }
      
      next()
    } catch (e) {
      next(e)
    }
  },

  onlyAdmin: async (req, res, next) => {
    try {
      if (!req.isAutorizated) {
        throw new HttpError(401, 'Acesso não autorizado.')
      }

      if (req.user.role !== 'admin') {
        throw new HttpError(401, `Usuário ${req.user.name} não permitido.`)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
