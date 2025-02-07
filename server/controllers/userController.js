const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require("../models/user.model");
const JWT = require('jsonwebtoken');

//register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "email is required",
      });
    }
    if (!password || password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "password is required and 8 character long",
      });
    }
    //existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User Already Registered With This Email",
      });
    }
    //hashed password
    const hashedPassword = await hashPassword(password);

    //save user
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res.status(201).send({
      success: true,
      message: "Registration Successful, please login",
    });
  } catch (error) {
    console.error('Error in Register API:', error);
    return res.status(500).send({
      success: false,
      message: "Error in Register API",
      error: error.message || error,
    });
  }
};

//login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Email or Password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found",
      });
    }

    //match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //jwt TOKEN GENERATOR
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).send({
      success: true,
      message: "Login Successful",
      token,
      data: user,
    });
  } catch (error) {
    console.error('Error in Login API:', error);
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
      error: error.message || error,
    });
  }
};

const updateUserControll = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!password || password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "password is required and 8 character long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updateUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "User Updated Successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Update User API",
      error: error.message || error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserControll,
};