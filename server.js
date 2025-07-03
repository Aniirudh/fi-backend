// backend/server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
require("dotenv").config();

const corsOptions = {
  origin: process.env.FRONTEND_API_BASE_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Log incoming requests
app.use((req, res, next) => {
  console.log("Request Headers:", req.headers);
  next();
});

const JWT_SECRET = process.env.JWT_SECRET;

app.post("/auth", (req, res) => {
  const { username } = req.body;
  const userType = username === "type1user" ? "type_1" : "type_2";

  const token = jwt.sign({ user_type: userType }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Use lax for client-side redirects
  });

  res.json({ token, user_type: userType });
});

app.get("/profile", (req, res) => {
  const token = req.cookies.token;
  console.log("COOKIES:", req.cookies, "Token:", token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("DECODED:", decoded);
    res.json({ user_type: decoded.user_type });
  } catch (error) {
    console.log("JWT Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(3001, () => console.log("Backend server running on port 3001"));
