import express from 'express';
import knex from '../db/knex.js';
import { format } from 'date-fns';

const router = express.Router();

// Helper function to handle errors
const handleError = (res, error, message) => {
    console.error(error);
    res.status(500).json({ message });
};

// Route to create a new post
router.post('/', async (req, res) => {
    const { shortTitle, selectedTab, requestType, description, dueDate, files, shareWith, user } = req.body;
    const postCategory = selectedTab.toLowerCase();
    const postSharedWith = shareWith.length ? shareWith.join(', ') : 'everybody';
    const formattedDueDate = format(new Date(dueDate + 'T00:00:00'), 'yyyy-MM-dd');

    if (!user) return res.status(401).json({ message: 'Unauthorized: User not authenticated' });

    try {
        const [newPostId] = await knex('posts').insert({
            post_status: 'active',
            post_createuser: user,
            post_category: postCategory,
            post_type: requestType,
            post_title: shortTitle,
            post_description: description,
            post_duedate: formattedDueDate,
            post_sharedwith: postSharedWith,
        });

        res.status(201).json({ message: 'Post created successfully', postId: newPostId });
    } catch (error) {
        handleError(res, error, 'An error occurred while creating the post');
    }
});

// Route to fetch post details
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await knex('posts').where('post_id', postId).first();
        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ post });
    } catch (error) {
        handleError(res, error, 'An error occurred while fetching the post details');
    }
});

// Route to update a post
router.put('/:postId', async (req, res) => {
    const { postId } = req.params;
    const { post_title, post_description, post_duedate, post_image } = req.body;

    try {
        const updatedRows = await knex('posts')
            .where('post_id', postId)
            .update({
                post_title,
                post_description,
                post_duedate,
                post_image,
            });

        if (!updatedRows) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        handleError(res, error, 'An error occurred while updating the post');
    }
});

// Route to delete a post
router.delete('/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const deletedRows = await knex('posts').where('post_id', postId).del();

        if (!deletedRows) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        handleError(res, error, 'An error occurred while deleting the post');
    }
});

export default router;