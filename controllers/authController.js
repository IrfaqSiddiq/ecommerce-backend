const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const SECRET_KEY = process.env.SECRET_KEY; // Use a secure environment variable in production

// Regular expression for email validation
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Regular expression for phone validation (simple validation for 10 digits)
const phoneRegex = /^[0-9]{10}$/;

const AuthController = {
  signup: async (req, res) => {
    const { name, phone, email, password } = req.body;

    // Validate email using regex
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate phone number using regex
    if (!phone || !phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ error: "Invalid phone number format. Must be 10 digits." });
    }

    // You can add more validations (e.g., password length) if needed
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create(name, phone, email, hashedPassword);
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    const isSecureConnection = process.env.IS_SECURE_CONNECTION;
    try {
      const user = await UserModel.findByUsername(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "365d",
      });

      // Save token to database
      await UserModel.saveToken(token, user.id);

      res
        .cookie("token", token, {
          httpOnly: false, // Prevents JavaScript access
          secure: false,
          maxAge: 3600000, // Cookie expires after 1 hour (same as JWT expiry)
        })
        .status(200)
        .json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = AuthController;
