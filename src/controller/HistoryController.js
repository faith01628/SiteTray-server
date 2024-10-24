const { executeQuery, sql } = require('../database');

const getContentHistory = async (req, res) => {
    try {
        const query = 'SELECT * FROM history';
        const contentHistory = await executeQuery(query);
        res.status(200).json({
            result: 1,
            message: 'get content history successfully',
            data: contentHistory
        });
    } catch (error) {
        console.error('Error fetching content history:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content history',
            error: error.message
        });
    }
}

const getHistoryById = async (req, res) => {
    try {
        const { accountid } = req.body;
        const query = 'SELECT * FROM history WHERE accountid = ?';
        const contentHistory = await executeQuery(query, [accountid]);
        // console.log(contentHistory);
        res.status(200).json({
            result: 1,
            message: 'Get content history successfully',
            data: contentHistory
        });
    } catch (error) {
        console.error('Error fetching content history:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content history',
            error: error.message
        });
    }
}
const createContentHistory = async (req, res) => {
    try {
        const { accountid, copycontent } = req.body;
        const query = `INSERT INTO history ( accountid , copycontent, pin) VALUES ( ?, ? , 0)`;
        await executeQuery(query, [accountid, copycontent]);
        console.log(copycontent, accountid);
        res.status(200).json({
            result: 1,
            message: 'create content history successfully',
            data: { accountid, copycontent },
        });
    } catch (error) {
        console.error('Error creating content history:', error);
        res.status(500).json({
            result: 0,
            message: 'Error creating content history',
            error: error.message
        });
    }
}

const deletehistory = async (req, res) => {
    try {
        const contentId = req.params.id;
        const query = `DELETE FROM history WHERE id = ?`;
        await executeQuery(query, [contentId]);
        res.status(200).json({
            result: 1,
            message: 'delete content history successfully',
            data: { contentId },
        });
    } catch (error) {
        console.error('Error deleting content history:', error);
        res.status(500).json({
            result: 0,
            message: 'Error deleting content history',
            error: error.message
        });
    }
}

const deleteMutipleHistory = async (req, res) => {
    try {
        const query = `DELETE FROM history WHERE pin = 0`;
        await executeQuery(query);
        res.status(200).json({
            result: 1,
            message: 'Deleted content history successfully',
        });
    } catch (error) {
        console.error('Error deleting content history:', error);
        res.status(500).json({
            result: 0,
            message: 'Error deleting content history',
            error: error.message
        });
    }
}



const Pin = async (req, res) => {
    try {
        const contentId = req.params.id;
        // const { pin } = req.body;

        const checkHistoryQuery = `SELECT * FROM history WHERE id = ?`;
        const existingHistory = await executeQuery(checkHistoryQuery, [contentId]);
        // console.log(existingHistory);

        if (!existingHistory || existingHistory.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'User not found',
                data: []
            });
        }

        const updateQuery = `
            UPDATE history
            SET pin = 1
            WHERE id = ?
        `;
        const updateResult = await executeQuery(updateQuery, [contentId]);

        res.status(200).json({
            result: 1,
            message: 'History updated successfully',
            data: [],
        });
    } catch (error) {
        console.error('Error updating history:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating history',
            error: error.message,
        });
    }
};

const unPin = async (req, res) => {
    try {
        const contentId = req.params.id;
        // const { pin } = req.body;

        const checkHistoryQuery = `SELECT * FROM history WHERE id = ?`;
        const existingHistory = await executeQuery(checkHistoryQuery, [contentId]);
        // console.log(existingHistory);

        if (!existingHistory || existingHistory.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'User not found',
                data: []
            });
        }

        const updateQuery = `
            UPDATE history
            SET pin = 0
            WHERE id = ?
        `;
        const updateResult = await executeQuery(updateQuery, [contentId]);

        res.status(200).json({
            result: 1,
            message: 'History updated successfully',
            data: [],
        });
    } catch (error) {
        console.error('Error updating history:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating history',
            error: error.message,
        });
    }
};

module.exports = {
    getContentHistory, getHistoryById, createContentHistory, deletehistory, deleteMutipleHistory, Pin, unPin
};