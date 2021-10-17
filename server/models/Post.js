const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true,
        max: 500
    },
    image: {
        type: String,
        default: [null]
    },
    likes: {
        type: Number,
        default: 0
    },
    likesBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    viewedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);