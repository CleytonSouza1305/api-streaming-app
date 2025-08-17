const { query } = require("../database")
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
    const { id } = req.params;

    const profileData = await Profile.profileById(id);

    if (!profileData) {
      throw new HttpError(404, 'Perfil não encontrado.');
    }

    const profile = new Profile(profileData);

    if (req.user.id !== profile.userId) {
      throw new HttpError(400, 'Atualização impedida.');
    }

    const { profileName, profilePin, isKid } = req.body;
    const updatedData = {};

    if (profileName !== undefined) {
      if (profileName.length < 3) {
        throw new HttpError(400, 'Formato de nome de perfil está inválido. Deve conter ao menos 3 caracteres.');
      }
      updatedData.profileName = profileName;
    }

    if (profilePin !== undefined && profilePin !== null && profilePin !== '') {
      if (profilePin.length !== 4) {
        throw new HttpError(400, 'Formato de PIN inválido. Deve conter 4 caracteres.');
      }
      updatedData.profilePin = profilePin;
    } else {
      updatedData.profilePin = null;
    }

    if (typeof isKid === 'boolean') {
      updatedData.isKid = isKid;
    }

    if (Object.keys(updatedData).length === 0) {
      throw new HttpError(400, 'Nenhum dado válido para atualizar.');
    }

    await Profile.updateProfile(id, updatedData);
    res.json({ message: 'Atualização feita com sucesso!' });

  } catch (e) {
    next(e);
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
      throw new HttpError(403, 'Erro ao deletar perfil.')
    }

    await Profile.deleteProfile(id)
    res.json({ message: 'Perfil deletado com sucesso' })
  },

  async getAvatars(req, res,next) {
    try {
      const avatars = await Profile.allAvatars()
      res.json(avatars)
    } catch (e) {
      next(e)
    }
  },

  async updateAvatarProfile(req, res, next) {
    try {
      const { id } = req.params

      const profile = await Profile.profileById(id)
      if (!profile) {
        throw new HttpError(404, 'Perfil não encontrado.')
      }

      const { avatarId } = req.body

      const avatar = await Profile.avatarById(avatarId)
      if (!avatar) {
        throw new HttpError(404, 'Avatar inválido.')
      }

      if (req.user.id !== profile.user_id) {
        throw new HttpError(400, 'Você não pode atualizar esse perfil.')
      }

      await Profile.updateAvatarProfile(id, avatarId)
      res.json(avatar)

    } catch (e) {
      next(e)
    }
  },

  async saveInListReq(req, res, next) {
    try {
      const { id, movieId, type } = req.params

      const existsProfile = await Profile.profileById(id)
      if (!existsProfile) {
        throw new HttpError(404, 'Perfil não encontrado.')
      }

      if (req.user.id !== existsProfile.user_id) {
        throw new HttpError(403, "Forbidden: you are not allowed to modify another user's data.")
      }

      if (!type) {
         throw new HttpError(400, "O tipo do filme é obrigatório.")
      }

      const addToList = await Profile.saveInList(id, Number(movieId), type)

      res.json(addToList)
    } catch (e) {
      next(e)
    }
  }
}