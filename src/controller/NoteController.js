const { executeQuery, sql } = require('../database');

const getNote = async (req, res) => {
    try {
        const query = 'SELECT * FROM note';
        const contentNode = await executeQuery(query);
        res.status(200).json({
            result: 1,
            message: 'get content note successfully',
            data: contentNode
        });
    } catch (error) {
        console.error('Error fetching content note:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content note',
            error: error.message
        });
    }
}

const getNoteById = async (req, res) => {
    try {
        const { accountid } = req.body;
        const query = 'SELECT * FROM note WHERE accountid = ?';
        const contentNode = await executeQuery(query, [accountid]);
        res.status(200).json({
            result: 1,
            message: 'Get content note successfully',
            data: contentNode
        });
    } catch (error) {
        console.error('Error fetching content note:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content note',
            error: error.message
        });
    }
}
const createNote = async (req, res) => {
    try {
        const { accountid, title } = req.body;
        const query = `INSERT INTO note ( accountid , title) VALUES ( ?, ? )`;
        await executeQuery(query, [accountid, title]);
        res.status(200).json({
            result: 1,
            message: 'create content note successfully',
            data: { accountid, title },
        });
    } catch (error) {
        console.error('Error creating content note:', error);
        res.status(500).json({
            result: 0,
            message: 'Error creating content note',
            error: error.message
        });
    }
}

const deleteNote = async (req, res) => {
    try {
        const id = req.params.id;
        const query = `DELETE FROM note WHERE id = ?`;
        await executeQuery(query, [id]);
        // const statuss = res.status();

        // console.log(statuss, 'id', id);

        res.status(200).json({
            result: 1,
            message: 'delete content note successfully',
            data: { id },
        });
    } catch (error) {
        console.error('Error deleting content note:', error);
        res.status(500).json({
            result: 0,
            message: 'Error deleting content note',
            error: error.message
        });
    }
}

const updateNode = async (req, res) => {
    try {
        const id = req.params.id;
        const { accountid, title } = req.body;

        const checkNodeQuery = `SELECT * FROM note WHERE id = ?`;
        const existingNode = await executeQuery(checkNodeQuery, [id]);
        // console.log(existingNode);

        if (!existingNode || existingNode.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'User not found',
                data: []
            });
        }

        const updateQuery = `
            UPDATE note
            SET accountid = ?, title = ?
            WHERE id = ?
        `;
        const updateResult = await executeQuery(updateQuery, [accountid, title, id]);

        res.status(200).json({
            result: 1,
            message: 'History updated successfully',
            data: updateResult,
        });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating note',
            error: error.message,
        });
    }
};

module.exports = {
    getNote, getNoteById, createNote, deleteNote, updateNode
};