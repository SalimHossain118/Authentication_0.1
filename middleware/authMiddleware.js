/** @format */

import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  const id = req.params.id;

  try {
    if (!token) {
      return res.status(401).json({ message: "Login required" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decodedToken.userId;

    if (id !== decodedToken.userId) {
      return res.status(400).json({ message: "Access Denied" });
    }

    // If everything is fine, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
