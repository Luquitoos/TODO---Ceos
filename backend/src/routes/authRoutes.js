import express from 'express'
import { signup, signin, getUserById, logout } from '../controllers/authController.js'
import { checkToken } from '../middlewares/authMiddleware.js'
import { validateRequest, authValidationRules } from '../middlewares/validationMiddleware.js'

const router = express.Router()

router.post('/register', authValidationRules.signup, validateRequest, signup)
router.post('/login', authValidationRules.signin, validateRequest, signin)
router.get('/user/:id', checkToken, getUserById)
router.post('/logout', logout)

export default router