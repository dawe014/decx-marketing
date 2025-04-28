const express = require('express');
const router = express.Router();
// const { login } = require("../../../controllers/authcontroller");

// import connectDB from "../../../config/database";

router.post('/login', async (req, res) => {
    try {
      await connectDB()
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Check if verified
      if (!user.isVerified) {
        return res.status(401).json({ message: "Please verify your email first" });
      }
  
      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );
  
      // Store refresh token
      user.refreshToken = refreshToken;
      user.lastLogin = Date.now();
      await user.save();
  
      // Set secure cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      res.json({
        message: "Login successful",
        userId: user._id,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  });

