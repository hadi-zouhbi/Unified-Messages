import axios from 'axios'
import querystring from 'querystring'
import dotenv from 'dotenv'
import {XMLParser} from 'fast-xml-parser'
import jwt from "jsonwebtoken";

import User from '../models/User.js'


dotenv.config()

// Define params
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI

const googleOuthConsent = (req,res) => {
    const params = querystring.stringify({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://mail.google.com/",
        access_type: "offline",
        prompt: "consent"
    })

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}

const googleCallback = async (req, res) => {
    const { code } = req.query;

  try {
    // 1. Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, refresh_token } = tokenRes.data;

    // 2. Get user email from Google
    const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userEmail = userInfoRes.data.email;

    // 3. Find or create user in DB
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      user = new User({
        email: userEmail,
        googleRefreshToken: refresh_token,
        provider: "google",
      });
      await user.save();
    }

    // 4. Create your own app JWT accessToken
    const customAccessToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Set cookies
    res.cookie("accessToken", customAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 6. Redirect to dashboard
    // res.redirect(`${process.env.CLIENT_URL}/dashboard?gmailConnected=true`);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?gmailConnected=true`);
  } catch (error) {
    console.error("❌ Google login failed:", error);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
}

export {
    googleOuthConsent,
    googleCallback
}