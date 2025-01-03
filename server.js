import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//CREATE USERS
app.post("/api/users", async (req, res) => {
  const user = req.body;
  if (!user.name || !user.password || !user.age || !user.gender) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all fields" });
  }
  if (user.age < 18) {
    return res
      .status(400)
      .json({ success: false, message: "User must be at least 18 years old" });
  }
  const passwordRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!passwordRegex.test(user.password)) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Password must contain at least one symbol",
      });
  }
  const newUsers = new User(user);
  try {
    await newUsers.save();
    res.status(201).json({ success: true, data: newUsers });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "This server has an error" });
  }
});

//SELECT USERS
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server has an Error" });
  }
});

//SELECT USERS BY ID
app.get("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const users = await User.findById(id);
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server has an Error" });
  }
});

//UPDATE USERS!!
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.findByIdAndUpdate(id, req.body);

    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (users.age < 18) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User must be at least 18 years old",
        });
    }
    const updatedProduct = await User.findById(id);
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server has an Error" });
  }
});

//DELETE USERS
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userID = await User.findByIdAndDelete(id);
    if (!userID) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: userID.name, message: "User deleted Successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server has an Error" });
  }
});

mongoose
  .connect(
    "mongodb+srv://franconabungwork:jNjiXMNYKcRMsC05@cluster0.7t3w3.mongodb.net/Node-api?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    //MONGODB
    console.log("Conntected to database!");
    //PORT
    app.listen(PORT, () => {
      console.log(`Listen on port: ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });
