// models/token.model.js

import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true, // Prevent duplicates
  },
}, { timestamps: true });

const Token = mongoose.model('Token', tokenSchema);
export {Token}