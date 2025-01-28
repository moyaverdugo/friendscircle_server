import express from 'express';
import knex from '../db/knex.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch My Dashboard posts
        const myPosts = await knex('posts')
            .join('users', 'posts.post_createuser', 'users.user_id')
            .where({ post_createuser: userId, post_status: 'active' })
            .select('posts.*', 'users.user_name as user_name');

        // Fetch New Posts
        const newPosts = await knex('posts')
            .leftJoin('post_user_accepts', function () {
                this.on('posts.post_id', 'post_user_accepts.post_id')
                    .andOn('post_user_accepts.user_id', knex.raw('?', [userId]));
            })
            .where('posts.post_status', 'active')
            .andWhere(function () {
                this.whereNull('post_user_accepts.post_user_response')
                    .orWhereNotIn('post_user_accepts.post_user_response', ['reject', 'dismiss']);
            })
            .andWhere('posts.post_createuser', '!=', userId)
            .select('posts.*');

        // Fetch Past Posts
        const pastPosts = await knex('posts')
            .where('post_createuser', userId)
            .andWhere('post_duedate', '<', knex.fn.now())
            .select('*');

        res.status(200).json({ myPosts, newPosts, pastPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching dashboard data.' });
    }
});

export default router;