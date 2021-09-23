import mongoose from 'mongoose';


const blogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        minLength: 10,
        maxLength: 50,
        trim: true,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        minLength: 50,
        trim: true,
        maxLength: 200,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    content: {
        type: String,
        minLength: 2000,
        required: true
    }
}, {
    timestamps: true
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;