const User = require('../models/User');
const responseController = require('./response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const usernameExist = await User.findOne({ username: req.body.username });
        const emailExist = await User.findOne({ email: req.body.email });
        validationErrors = {}
        if (usernameExist) {
            validationErrors['username'] = 'Username already taken'
        }
        if (emailExist) {
            validationErrors['email'] = 'Email already taken'
        }
        if (usernameExist || usernameExist) {
            return responseController.errorResponse(res, 400, validationErrors);
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            fullname: req.body.fullname,
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        });
        const user = await newUser.save();

        sendToken(res, user)
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        console.log(user)
        if (user) {
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (passwordMatch) {
                return sendToken(res, user);
            }
        }

        responseController.errorResponse(res, 401, 'unauthorized');
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

// Generate JWT token and return it along with user data
const sendToken = (res, user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
    const userObj = user.toObject();
    userObj.token = token;
    responseController.succesResponse(res, userObj);
};