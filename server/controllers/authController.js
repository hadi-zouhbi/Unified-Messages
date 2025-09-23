import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '../utils/token.js'
import jwt from 'jsonwebtoken'

const signUp = async (req , res) => {
const {email, password} = req.body

// Check if email and password are provided
if(!email || !password) {
    return res.status(400).json({message: 'Email and password are required.'})
}

try {
    // Checking if user already exists
    const existingUser = await User.findOne({email})
    if(existingUser) {
        return res.status(400).json({message: "User already exists"})
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Creating a new user
    const newUser = new User({
        email,
        hashedPassword
    })

    // Saving the user to db 
    await newUser.save()

    // Response
    res.status(201).json({message: "User Created Successfully"})
} catch (error) {
    console.log(`Error Occured In SignUP---- ${error}`)
}
}

const login = async (req, res) => {
    const{email, password} = req.body
    if(!email || !password) {
        return res.status(400).json({message: "Email and password are required."})
    }

    try {
        // Checking if user already exists in db
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "Invalid email or password."})
        }

        // Comparing password to database
        const isMatch = await bcrypt.compare(password, user.hashedPassword)
        if(!isMatch) {
            return res.status(400).json({message: "Invalid email or password."})
        }

        // Generate the tokens
        let accessToken = generateAccessToken(user._id)
        let refreshToken = generateRefreshToken(user._id)

        // Storing refresh token in a cookie
        res.cookie("refreshToken" , refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days in ms
        })

        // Send the token
        res.status(200).json({
            message: "Login Successful",
            accessToken
        })

    } catch (error) {
        console.log(`Error to Login --- ${error}`)
        res.status(500).json({message: "Server error"})
    }
}

// route to refresh token after access token is expired
const refreshToken = (req, res) => {
    const token = req.body

    if(!token) {
        return res.status(401).json({message: "No refresh token provided"})
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        const newAccessToken = generateAccessToken(decoded.userId)

        res.json({
            accessToken: newAccessToken
        })

    } catch (error) {
        return res.status(403).json({message: "Invalid refresh token"})
    }
}

// Route to check token to update the authContext isLogged in if there is a token
const checkAccessToken = (req, res) => {
    const token = req.cookies.accessToken;

  if (!token) {
    return res.json({ loggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({
      loggedIn: true,
      user: {
        email: decoded.email,
        id: decoded.id,
      },
    });
  } catch (err) {
    return res.json({ loggedIn: false });
  }
}

// Route to logout
const logout = (req,res) => {
    // Clearing the cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict"
    })

    res.status(200).json({
        message: "Logged Out Successfully"
    })
}

export {signUp, login, refreshToken, logout, checkAccessToken}