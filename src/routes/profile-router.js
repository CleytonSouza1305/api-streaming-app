const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const profileController = require('../controllers/profile-controller')
const profileRouter = express.Router()

profileRouter.get('/profiles', authMiddleware.authenticate, profileController.allProfiles)
profileRouter.post('/profile/create', authMiddleware.authenticate, profileController.createProfile)

module.exports = profileRouter