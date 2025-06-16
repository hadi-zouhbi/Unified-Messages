import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/checkToken", async (req, res) => {
   try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ loggedIn: false });
    }

    // Get user from token or DB
    const user = await User.findOne({ googleRefreshToken: token });

    if (!user) {
      return res.status(401).json({ loggedIn: false });
    }

    return res.status(200).json({
      loggedIn: true,
      user: { email: user.email }
    });
  } catch (error) {
    console.log("CheckToken Error:", error);
    return res.status(500).json({ loggedIn: false });
  }
});

export default router;
