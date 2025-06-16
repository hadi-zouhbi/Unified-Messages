import express from 'express'
import { googleCallback, googleOuthConsent } from '../controllers/googleAuthController.js'
import {fetchGmailMessages} from '../controllers/fetchGmailController.js'

const router = express.Router()

// Redirect user to Outh screen
router.get('/google' , googleOuthConsent)

// Google Callback
router.get('/google/callback' , googleCallback)

// Fetching Gmail Messages
router.get('/fetchGmailMessages', fetchGmailMessages)

export default router
