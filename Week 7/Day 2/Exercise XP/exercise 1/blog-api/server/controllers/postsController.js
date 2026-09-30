const postModel = require("../models/postModel");

const getPosts = async (req, res) => {
    try {
        const posts = await postModel.getAllPosts();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get posts" });
    }
};

const getPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await postModel.getPostById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get post" });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const [newPost] = await postModel.createPost({
            title,
            content
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create post" });
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const [updatedPost] = await postModel.updatePost(id, {
            title,
            content
        });

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update post" });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await postModel.deletePost(id);

        if (deleted === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete post" });
    }
};

module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
};