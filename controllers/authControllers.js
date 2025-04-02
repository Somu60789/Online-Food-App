const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const axios = require('axios');

// REGISTER
const registerController = async (req, res) => {
  try {
    const { userName, email, password, phone, address, answer } = req.body;
    //validation
    if (!userName || !email || !password || !address || !phone || !answer) {
      return res.status(500).send({
        success: false,
        message: 'Please Provide All Fields',
      });
    }
    // chekc user
    const exisiting = await userModel.findOne({ email });
    if (exisiting) {
      return res.status(500).send({
        success: false,
        message: 'Email Already Registerd please Login',
      });
    }
    //hashing password
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create new user
    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      address,
      phone,
      answer,
    });
    res.status(201).send({
      success: true,
      message: 'Successfully Registered',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error In Register API',
      error,
    });
  }
};

// LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validfatuion
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: 'Please PRovide EMail OR Password',
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User Not Found',
      });
    }
    //check user password  | compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: 'Invalid Credentials',
      });
    }
    // token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Fetch restaurant data
    const response = await axios.get(
      'http://localhost:8080/api/v1/resturant/getAll',
    );

    const restaurants = response.data.resturants;

    console.log(response.data.resturants);
    console.log('somu');

    res.status(200).render('landing', { user, restaurants });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error In Login API',
      error,
    });
  }
};

module.exports = { registerController, loginController };
