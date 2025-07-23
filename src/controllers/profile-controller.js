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
        throw new HttpError(400, 'Limite máximo de 5 perfis.')
      }

      const { profileName, isKid = false, profilePin = null} = req.body

      if (!profileName) {
        throw new HttpError(400, 'O nome de perfil é obrigatório.')
      }

      if (profilePin && profilePin.length !== 4) {
        throw new HttpError(400, 'A senha deve conter 4 números')
      }

      const newProfile = await Profile.createProfile(uuid(), req.user.id, profileName, isKid, profilePin)

      res.json(newProfile)

    } catch (e) {
      next(e)
    } 
  },

  async update(req, res, next) {
    try {
      const { id } = req.params

      const profileData = await Profile.profileById(id)

      if (!profileData) {
        throw new HttpError(404, 'Perfil não encontrado.')
      }

      const profile = new Profile(profileData)
      if (req.user.id !== profile.userId) {
        throw new HttpError(400, 'Atualização impedida.')
      }

      const { profileName, profilePin, isKid } = req.body

      const updatedData = {}

      if (profileName && profileName.length < 3) {
         throw new HttpError(400, 'Formato de nome de perfil está inválido. Deve conter ao menos 3 caracteres.')
      } else {
        updatedData.profileName = profileName
      }

      if (profilePin) {
        if (profilePin.length !== 4) {
        throw new HttpError(400, 'Formato de pin inválido. Deve conter 4 caracteres.')
        } else {
          updatedData.profilePin = profilePin
        }
      }
      if (isKid && typeof isKid !== 'boolean') {
        throw new HttpError(400, `O campo isKid  deve ser um boolean.`)
      } else {
        updatedData.isKid = isKid
      }

      await Profile.updateProfile(id, updatedData)
      res.json({ message: 'Atualização feita com sucesso!' })

    } catch (e) {
      next(e)
    }
  },

  async showProfile(req, res, next) {
    try {
     const { id } = req.params

      const profile = await Profile.profileById(id)
      if (!profile) {
        throw new HttpError(404, 'Perfil não encontrado.')
      } 

      res.json(profile)
    } catch (e) {
      next(e)
    }
  },

  async delete(req, res, next) {
    const { id } = req.params

    const profile = await Profile.profileById(id)

    if (!profile) {
      throw new HttpError(404, 'Perfil não encontrado.')
    }

    if (req.user.id !== profile.user_id) {
      console.log(req.user.id)
      console.log(profile.id)
      throw new HttpError(403, 'Erro ao deletar perfil.')
    }

    await Profile.deleteProfile(id)
    res.json({ message: 'Perfil deletado com sucesso' })
  }
}