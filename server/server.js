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
const allowedOrigins = [
    "https://unifiedmessages.netlify.app",
    "http://localhost:5173"
]
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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

app.use('/api/auth', checkTokenRoute)

// Run Server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}, Thank you`)
})