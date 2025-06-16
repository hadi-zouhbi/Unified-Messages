import express from 'express'
import { signUp, login, refreshToken, logout, checkAccessToken } from '../controllers/authController.js'

const router = express.Router()

// Sign-Up route
router.post('/createNewUser', signUp)

// Login Route
router.post('/login' , login)

// Refresh Token route
router.post('/refresh-token' , refreshToken)

// Logout
router.post('/logout', logout)

router.get('/checkToken', checkAccessToken)

export default router