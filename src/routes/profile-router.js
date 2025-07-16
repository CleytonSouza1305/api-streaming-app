const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const profileController = require('../controllers/profile-controller')
const profileRouter = express.Router()

profileRouter.get('/profiles', authMiddleware.authenticate, profileController.allProfiles)
profileRouter.post('/profiles', authMiddleware.authenticate, profileController.createProfile)
profileRouter.put('/profiles/:id', authMiddleware.authenticate, profileController.update)

module.exports = profileRouter