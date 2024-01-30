/** @format */

import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupController = async (req, res) => {
  try {
    const userInfo = new userModel(req.body);
    const { email } = userInfo;

    const exisitinUser = await userModel.findOne({ email });

    if (exisitinUser) {
      return res.status(200).json({ message: "User already registered" });
    }

    const savedUser = await userInfo.save();
    res.status(200).json(savedUser);
  } catch (error) {
    console.error(error);
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ error: error });
  }
}; // end=>

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(200).json({ message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return res
        .status(200)
        .json({ message: "Email or Password Is Not Vailad" });
    }

    const tokenExists = req.cookies.token;
    if (tokenExists) {
      return res.status(200).json({ message: "Already logedin" });
    }

    const token = await jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({ message: "Login Succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const logoutController = async (req, res) => {
  try {
    const tokenExists = req.cookies.token;
    if (!tokenExists) {
      return res.status(200).json({ message: "Login Required" });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Logout Succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const updateController = async (req, res) => {
  try {
    const id = req.params.id;
    const toBrUpdateInfo = req.body;
    const existUser = await userModel.findById({ _id: id });
    if (!existUser) {
      return res.status(200).json({ message: "User Not Found" });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
