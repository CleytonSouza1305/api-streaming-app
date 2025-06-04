const express = require('express')
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middleware/auth-middleware')
const authRouter = express.Router()

authRouter.post('/register', userController.register)
authRouter.post('/login', userController.login)
authRouter.get('/users', authMiddleware.authenticate, authMiddleware.safeRouter, authMiddleware.onlyAdmin, userController.showAll)
authRouter.get('/users/:id', authMiddleware.authenticate, authMiddleware.safeRouter, userController.userById)
authRouter.put('/update/:id', authMiddleware.authenticate, authMiddleware.safeRouter, userController.update)
authRouter.delete('/delete/:id', authMiddleware.authenticate, authMiddleware.safeRouter, authMiddleware.onlyAdmin, userController.delete)

module.exports = authRouter