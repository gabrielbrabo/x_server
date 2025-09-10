// models/User.js
import mongoose from "mongoose";

const CurrentSession = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentSessionToken: { type: String, default: null } // 👈 aqui
});

export default mongoose.model("CurrentSession", CurrentSession);
