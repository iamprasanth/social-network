const User = require('../models/User');
const Post = require('../models/Post');
const responseController = require('./response');

// Get all post of a user
exports.getAllUserPost = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .populate('followers')
            .populate('followings');
        const posts = await Post.find({ userId: user._id })
            .sort([['createdAt', -1]])
            .populate('userId');

        return responseController.succesResponse(res, { posts, user });
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

// Create a new post
exports.create = async (req, res) => {
    try {
        const file = req.files.file;
        const newPostData = {};
        if (file) {
            const fileName = Date.now() + file.name;
            const destination = process.env.PROJECT_ROOT + process.env.FRONTEND_POSTS_STORAGE + fileName;
            try {
                const fileMove = await moveFileAsync(file, destination);
                newPostData['image'] = fileName;
            } catch (err) {
                return responseController.errorResponse(res, 500, err.message);
            }
        }
        newPostData['userId'] = req.body.userId;
        newPostData['description'] = req.body.description;
        const newPost = new Post(newPostData);
        const postSave = await newPost.save();

        responseController.succesResponse(res, postSave);
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

// Get a single post of a user
exports.getOnePost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.postId)
            .sort([['comments.createdAt', -1]])
            .populate('comments.userId')
            .populate('userId');

        return responseController.succesResponse(res, post);
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

// Update a post
exports.update = async (req, res) => {
    try {
        const posts = await Post.findByIdAndUpdate(
            req.body.id,
            req.body,
            { new: true }
        );

        return responseController.succesResponse(res, posts);
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

// Delete a post
exports.delete = async (req, res) => {
    try {
        const posts = await Post.findOneAndRemove(
            { _id: req.body.postId, userId: req.body.userId }
        );

        return responseController.succesResponse(res, "post deleted successfully");
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

// Like / DisLike a post
exports.like = async (req, res) => {
    try {
        const post = await Post.findById(req.body.postId);
        if (post) {
            var message;
            if (!post.likesBy.includes(req.body.userId)) { // Like
                await post.update(
                    {
                        $inc: { likes: 1 },
                        $addToSet: { likesBy: req.body.userId }
                    },
                );
                message = 'liked';
            } else { // DisLike
                await post.update(
                    {
                        $inc: { likes: -1 },
                        $pull: { likesBy: req.body.userId }
                    },
                );
                message = 'disliked';
            }
            return responseController.succesResponse(res, message);
        }

        return responseController.succesResponse(res, "Post id not valid");
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

// create a comment under a post
exports.createComment = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $push: {
                    comments: {
                        userId: req.body.userId,
                        comment: req.body.comment
                    }
                }
            },
            { new: true }
        ).populate('comments.userId');
        Post.updateMany({}, { $push: { "comments": { $each: [], $sort: { createdAt: -1 } } } })

        return responseController.succesResponse(res, post);
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

// Delete a comment under a post
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $pull: { comments: { _id: req.body.commentId } }
            },
            { new: true }
        );
        return responseController.succesResponse(res, post);
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

// Get all posts for user's timeline
exports.getTimeLine = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        // Get Unviewed posts of users who are followed by current users
        console.log(currentUser.followings)
        const posts = await Post.find(
            {
                // Get all posts of users followed by current user
                'userId': { $in: currentUser.followings },
                // Get all post not viewd by current user
                'viewedBy': { $nin: [req.params.userId] }
            },
        ).sort([['createdAt', -1]]).populate('userId').populate('viewedBy');

        return responseController.succesResponse(res, posts);
    } catch (err) {
        responseController.errorResponse(res, 500, err.message);
    }
};

const moveFileAsync = (file, destination) => {
    return new Promise((resolve, reject) => {
        console.log(file)
        file.mv(destination, (data, error) => {
            if (error) {
                return reject(error);
            }
            return resolve(data)
        })
    })
}
