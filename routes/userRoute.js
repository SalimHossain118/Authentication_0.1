/** @format */

import express from "express";
import {
  signupController,
  login,
  logoutController,
  updateController,
} from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const route = express.Router();

// route.get("/", (req, res) => {
//   res.json("Hello");
// });

route.post("/signup", signupController);
route.post("/login", login);
route.get("/logout", logoutController);
route.put("/update/:id", authMiddleware, updateController);

export default route;
