const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const profileController = require('../controllers/profile-controller')
const profileRouter = express.Router()

profileRouter.get('/profiles', authMiddleware.authenticate, profileController.allProfiles)
profileRouter.get('/profiles/avatars', authMiddleware.authenticate, profileController.getAvatars)
profileRouter.post('/profiles', authMiddleware.authenticate, profileController.createProfile)
profileRouter.get('/profiles/:id', authMiddleware.authenticate, profileController.showProfile)
profileRouter.put('/profiles/:id', authMiddleware.authenticate, profileController.update)
profileRouter.delete('/profiles/:id', authMiddleware.authenticate, profileController.delete)
profileRouter.put('/profiles/avatar/:id', authMiddleware.authenticate, profileController.updateAvatarProfile)
profileRouter.post('/profiles/:id/favorite/:movieId/:type', authMiddleware.authenticate, profileController.saveInListReq)
profileRouter.delete('/profiles/:id/favorite/:movieId', authMiddleware.authenticate, profileController.deleteFromListReq)

module.exports = profileRouter