const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    dateOfBirth: {
        type: Date
    },
    profilePicture: {
        type: String,
        default: ''
    },
    coverPicture: {
        type: String,
        default: ''
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    about: {
        type: String,
        max: 100
    },
    relationships: {
        type: Number,
        enum: [1, 2, 3]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);