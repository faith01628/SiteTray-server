const { executeQuery, sql } = require('../database');

const getchat = async (req, res) => {
    try {
        const query = 'SELECT * FROM groupchat';
        const contentgroupchat = await executeQuery(query);
        res.status(200).json({
            result: 1,
            message: 'get content groupchat successfully',
            data: contentgroupchat
        });
    } catch (error) {
        console.error('Error fetching content groupchat:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content groupchat',
            error: error.message
        });
    }
}

const getChatById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM groupchat WHERE id = ?';
        const contentgroupchat = await executeQuery(query, [id]);
        // console.log(contentgroupchat);
        res.status(200).json({
            result: 1,
            message: 'Get content groupchat successfully',
            data: contentgroupchat
        });
    } catch (error) {
        console.error('Error fetching content groupchat:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content groupchat',
            error: error.message
        });
    }
}
const createChat = async (req, res) => {
    try {
        const { name, link } = req.body;
        const img = req.file ? req.file.path : null;

        const query = `INSERT INTO groupchat ( name , link, img) VALUES ( ?, ? , ?)`;
        await executeQuery(query, [name, link, img]);

        res.status(200).json({
            result: 1,
            message: 'create content groupchat successfully',
            data: { name, link, img },
        });
    } catch (error) {
        console.error('Error creating content groupchat:', error);
        res.status(500).json({
            result: 0,
            message: 'Error creating content groupchat',
            error: error.message
        });
    }
}

const deleteChat = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM groupchat WHERE id = ?`;
        await executeQuery(query, [id]);
        res.status(200).json({
            result: 1,
            message: 'delete content groupchat successfully',
            data: { id },
        });
    } catch (error) {
        console.error('Error deleting content groupchat:', error);
        res.status(500).json({
            result: 0,
            message: 'Error deleting content groupchat',
            error: error.message
        });
    }
}

const updateChat = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, link } = req.body;
        const img = req.file ? req.file.path : null;

        const checkgroupchatQuery = `SELECT * FROM groupchat WHERE id = ?`;
        const existinggroupchat = await executeQuery(checkgroupchatQuery, [id]);

        if (!existinggroupchat || existinggroupchat.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'User not found',
                data: []
            });
        }

        const updateQuery = `
            UPDATE groupchat
            SET name = ?, link = ?, img = ?
            WHERE id = ?
        `;
        const updateResult = await executeQuery(updateQuery, [name, link, img, id]);

        res.status(200).json({
            result: 1,
            message: 'groupchat updated successfully',
            data: updateResult,
        });
    } catch (error) {
        console.error('Error updating groupchat:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating groupchat',
            error: error.message,
        });
    }
};

module.exports = {
    getchat, getChatById, createChat, deleteChat, updateChat
};