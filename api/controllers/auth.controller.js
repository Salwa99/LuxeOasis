import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import {errorHandler} from '../utils/error.js'
import jwt from "jsonwebtoken";

export const signup = async(req, res, next) => {
  // Extract username, email, and password from request body
  const { username, email, password } = req.body;
  // Hash the password using bcrypt, 10 is the number of salt rounds
  const hashedPassword = bcryptjs.hashSync(password, 10);
  // Create a new user instance with hashed password
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    // Save the new user to the database
    await newUser.save();
    // Send a success response
    res.status(201).json("User created successfully!");
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

export const signin = async(req, res, next) => {
  // Extract email, and password from request body
  const { email, password } = req.body;

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
    const { password: pass, ...restInfo } = validUser._doc;
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

export const google = async(req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if(user){
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const {password: pass, ...restInfo} = user._doc;
      res.cookie('access_token', token, {httpOnly: true}).status(200).json(restInfo);
    }
    else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo});
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...restInfo } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(restInfo);
    }
    
  } catch (error) {
    next(error);
  }
}