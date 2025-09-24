import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDb from './config/dbConfig.js'
import cookieParser from 'cookie-parser'

// Auth Routes
import authRoutes from './routes/authRoutes.js'
import googleRoutes from './routes/googleRoutes.js'
import checkTokenRoute from './routes/checkTokenRoute.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// Connect to the db
connectDb()

// Middleware
app.use(cors({
    origin: "https://unifiedmessages.netlify.app/ ",
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

// Route
app.get('/' , (req,res) => {
    res.send("API IS RUNNING")
})

// Auth Routes
app.use('/api/auth', authRoutes)

// Google Routes
app.use('/api/auth', googleRoutes)

app.use('api/auth', checkTokenRoute)

// Run Server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}, Thank you`)
})