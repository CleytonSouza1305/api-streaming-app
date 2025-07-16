const HttpError = require("../error/Error")
const Profile = require("../models/Profile")
const uuid = require('uuid').v4

module.exports = {
  async allProfiles(req, res, next) {
    try {
      const user = req.user

      const profiles = await Profile.allProfiles(user.id)
      if (!profiles) {
        throw new HttpError(400, 'Perfis de usuário não encontrado.')
      }

      res.json(profiles)
    } catch (e) {
      next(e)
    }
  },

  async createProfile(req, res, next) {
    try {
      const profiles = req.user.profiles

      if (!profiles) {
        throw new HttpError(400, 'Perfis de usuário não encontrado.')
      }

      const dbDataProfiles = await Profile.allProfiles(req.user.id)
      if (dbDataProfiles.length >= 5) {
        console.log('igual a 5')
        throw new HttpError(400, 'Limite máximo de 5 perfis.')
      }

      const { profileName, isKid = false, profilePin = null} = req.body

      if (!profileName) {
        throw new HttpError(400, 'O nome de perfil é obrigatório.')
      }

      if (profilePin && profilePin.length !== 4) {
        throw new HttpError(400, 'A senha deve conter 4 números')
      }

      const profileId = uuid()

      const newProfile = await Profile.createProfile(profileId, req.user.id, profileName, isKid, profilePin)

      res.json(newProfile)

    } catch (e) {
      next(e)
    } 
  }
}