const HttpError = require("../error/Error")

module.exports = {
  allProfiles(req, res, next) {
    try {
      const user = req.user

      if (!req.user.profiles) {
        throw new HttpError(400, 'Perfis de usuário não encontrado.')
      }
      
      res.json(user.profiles)
    } catch (e) {
      next(e)
    }
  }
}