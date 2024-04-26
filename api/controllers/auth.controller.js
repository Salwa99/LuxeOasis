import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import {errorHandler} from '../utils/error.js'
import jwt from "jsonwebtoken";

export const signup = async(req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});

    try {
         await newUser.save();
         res.status(201).json("User created successfully!");
    } catch (error) {
        next(error);
    }
};

export const signin = async(req, res, next) => {
    const {email, password} = req.body;

    try {
      // Check if user exists
      const validUser = await User.findOne({ email });
      if (!validUser) return next(errorHandler(404, "User not found"));
      // Validate password
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
      // Generate JWT token
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      // Eliminate the password from the response
      const {password: pass, ...restInfo} = validUser._doc;
      // Set token as a cookie (optional, can be sent in the response body instead)
      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 3600000,
          secure: true,
          sameSite: "strict",
        })
        .status(200)
        .json(restInfo); // Send user details along with the token
    } catch (error) {
        next(error);
    }
}