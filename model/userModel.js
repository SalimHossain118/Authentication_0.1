/** @format */

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      {
        validator: function (email) {
          const emailRex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          return emailRex.test(email);
        },
        message: "Email Format Is Invalid",
      },
    ],
  },
  password: {
    type: String,
    required: true,
    validate: [
      {
        validator: function (password) {
          return password.length >= 8;
        },
        message: "Passwords must be at least 8 characters",
      },
    ],
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: [
      {
        validator: function (confirmPassword) {
          return confirmPassword === this.password;
        },
        message: "Password does not match",
      },
    ],
  },
});

userSchema.pre("save", async function (next) {
  const userInfo = this;
  if (!userInfo.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userInfo.password, salt);
    userInfo.password = hashedPassword;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    return (this.confirmPassword = undefined);
  }
  next();
});

export default mongoose.model("User", userSchema);
