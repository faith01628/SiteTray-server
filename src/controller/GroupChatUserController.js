const { executeQuery, sql } = require('../database');
const { v4: uuidv4 } = require('uuid');

const getChatUser = async (req, res) => {
    try {
        const query = 'SELECT * FROM groupchatuser';
        const contentgroupchatuser = await executeQuery(query);
        res.status(200).json({
            result: 1,
            message: 'get content groupchatuser successfully',
            data: contentgroupchatuser
        });
    } catch (error) {
        console.error('Error fetching content groupchatuser:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content groupchatuser',
            error: error.message
        });
    }
}

const getUuidByAccountid = async (req, res) => {
    try {
        const { accountid } = req.body;
        const query = 'SELECT uuid FROM groupchatuser WHERE accountid = ?';
        const contentgroupchatuser = await executeQuery(query, [accountid]);
        res.status(200).json({
            result: 1,
            message: 'Get content groupchatuser successfully',
            data: contentgroupchatuser
        });
    } catch (error) {
        console.error('Error fetching content groupchatuser:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content groupchatuser',
            error: error.message
        });
    }
}

const getChatUserById = async (req, res) => {
    try {
        const { accountid } = req.body;
        const query = 'SELECT * FROM groupchatuser WHERE accountid = ?';
        const contentgroupchatuser = await executeQuery(query, [accountid]);
        res.status(200).json({
            result: 1,
            message: 'Get content groupchatuser successfully',
            data: contentgroupchatuser
        });
    } catch (error) {
        console.error('Error fetching content groupchatuser:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content groupchatuser',
            error: error.message
        });
    }
}
const createChatUser = async (req, res) => {
    try {

        const { accountid, name, link } = req.body;
        const img = req.file ? req.file.path : null;
        const uuid = uuidv4();

        if (!accountid || !link) {
            return res.status(400).json({
                result: 0,
                message: 'Missing required fields',
                data: []
            });
        }

        const query = `INSERT INTO groupchatuser ( accountid , name , link, img, uuid) VALUES ( ?, ?, ? , ?, ?)`;
        await executeQuery(query, [accountid, name, link, img, uuid]);

        res.status(200).json({
            result: 1,
            message: 'create content groupchatuser successfully',
            data: { accountid, name, link, img, uuid: uuid },
        });
    } catch (error) {
        console.error('Error creating content groupchatuser:', error);
        res.status(500).json({
            result: 0,
            message: 'Error creating content groupchatuser',
            error: error.message
        });
    }
}

const deleteChatUser = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM groupchatuser WHERE id = ?`;
        await executeQuery(query, [id]);
        res.status(200).json({
            result: 1,
            message: 'delete content groupchatuser successfully',
            data: { id },
        });
    } catch (error) {
        console.error('Error deleting content groupchatuser:', error);
        res.status(500).json({
            result: 0,
            message: 'Error deleting content groupchatuser',
            error: error.message
        });
    }
}

const updateChatUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountid, name, link } = req.body;
        const img = req.file ? req.file.path : null;

        const checkgroupchatuserQuery = `SELECT * FROM groupchatuser WHERE id = ?`;
        const existinggroupchatuser = await executeQuery(checkgroupchatuserQuery, [id]);

        if (!existinggroupchatuser || existinggroupchatuser.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'User not found',
                data: []
            });
        }

        const currentImg = existinggroupchatuser[0].img;

        // Use the existing image if no new image is uploaded
        const newImg = img || currentImg;

        const updateQuery = `
            UPDATE groupchatuser
            SET accountid = ?, name = ?, link = ?, img = ?
            WHERE id = ?
        `;
        const updateResult = await executeQuery(updateQuery, [accountid, name, link, newImg, id]);

        res.status(200).json({
            result: 1,
            message: 'groupchatuser updated successfully',
            data: updateResult,
        });
    } catch (error) {
        console.error('Error updating groupchatuser:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating groupchatuser',
            error: error.message,
        });
    }
};


module.exports = {
    getChatUser, getChatUserById, createChatUser, deleteChatUser, updateChatUser, getUuidByAccountid
};