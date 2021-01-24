const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        uppercase: true

    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;