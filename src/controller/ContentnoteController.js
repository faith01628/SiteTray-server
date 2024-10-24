const { executeQuery, sql } = require('../database');

const getContentNote = async (req, res) => {
    try {
        const query = 'SELECT * FROM contentnote';
        const contentHistory = await executeQuery(query);
        res.status(200).json({
            result: 1,
            message: 'get content contentnote successfully',
            data: contentHistory
        });
    } catch (error) {
        console.error('Error fetching content contentnote:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content contentnote',
            error: error.message
        });
    }
}

const getContentNoteById = async (req, res) => {
    try {
        const { noteid } = req.body;
        const query = 'SELECT * FROM contentnote WHERE noteid = ?';
        const contentHistory = await executeQuery(query, [noteid]);
        res.status(200).json({
            result: 1,
            message: 'Get content contentnote successfully',
            data: contentHistory
        });
    } catch (error) {
        console.error('Error fetching content contentnote:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching content contentnote',
            error: error.message
        });
    }
}
const createContentNote = async (req, res) => {
    try {
        const { noteid, contentnote } = req.body;

        console.log(noteid, contentnote);


        if (!noteid || !contentnote) {
            return res.status(400).json({
                result: 0,
                message: 'Missing required fields',
            });
        }

        const query = `INSERT INTO contentnote ( noteid , contentnote, important, checksuccess) VALUES ( ?, ? , 0, 0)`;
        await executeQuery(query, [noteid, contentnote]);
        res.status(200).json({
            result: 1,
            message: 'create content contentnote successfully',
            data: { noteid, contentnote, important: 0 },
        });
    } catch (error) {
        console.error('Error creating content contentnote:', error);
        res.status(500).json({
            result: 0,
            message: 'Error creating content contentnote',
            error: error.message
        });
    }
}

const deleteContentNote = async (req, res) => {
    try {
        const id = req.params.id;
        const query = `DELETE FROM contentnote WHERE id = ?`;
        await executeQuery(query, [id]);
        res.status(200).json({
            result: 1,
            message: 'delete content contentnote successfully',
            data: { id },
        });
    } catch (error) {
        console.error('Error deleting content contentnote:', error);
        res.status(500).json({
            result: 0,
            message: 'Error deleting content contentnote',
            error: error.message
        });
    }
}


const updateContent = async (req, res) => {
    try {
        const id = req.params.id;
        const { contentnote } = req.body;
        console.log(contentnote)
        const query = `UPDATE contentnote SET contentnote = ? WHERE id = ?`;
        await executeQuery(query, [contentnote, id]);
        res.status(200).json({
            result: 1,
            message: 'update content contentnote successfully',
            data: { id, contentnote },
        });
    } catch (error) {
        console.error('Error updating content contentnote:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating content contentnote',
            error: error.message
        });
    }
}

const PinContentNote = async (req, res) => {
    try {
        const id = req.params.id;
        const important = 1;

        const checkHistoryQuery = `SELECT * FROM contentnote WHERE id = ?`;
        const existingHistory = await executeQuery(checkHistoryQuery, [id]);
        // console.log(existingHistory);

        if (!existingHistory || existingHistory.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'User not found',
                data: []
            });
        }

        const updateQuery = `
            UPDATE contentnote
            SET important = ?
            WHERE id = ?
        `;
        const updateResult = await executeQuery(updateQuery, [important, id]);

        if (updateResult) {
            return res.status(200).json({
                result: 1,
                message: 'content updated successfully',
                data: [important, id],
            });
        } else {
            return res.status(400).json({
                result: 0,
                message: 'Error updating contentnote',
                data: [],
            });
        }
    } catch (error) {
        console.error('Error updating contentnote:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating contentnote',
            error: error.message,
        });
    }
};

const unPinContentNote = async (req, res) => {
    try {
        const id = req.params.id;
        const important = 0;

        const checkHistoryQuery = `SELECT * FROM contentnote WHERE id = ?`;
        const existingHistory = await executeQuery(checkHistoryQuery, [id]);
        // console.log(existingHistory);

        if (!existingHistory || existingHistory.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'User not found',
                data: []
            });
        }

        const updateQuery = `
            UPDATE contentnote
            SET important = ?
            WHERE id = ?
        `;
        const updateResult = await executeQuery(updateQuery, [important, id]);

        res.status(200).json({
            result: 1,
            message: 'content updated successfully',
            data: [],
        });
    } catch (error) {
        console.error('Error updating contentnote:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating contentnote',
            error: error.message,
        });
    }
};

const PinCheckSuccess = async (req, res) => {
    try {
        const id = req.params.id;
        const checksuccess = 1;

        const checkHistoryQuery = `SELECT * FROM contentnote WHERE id = ?`;
        const existingHistory = await executeQuery(checkHistoryQuery, [id]);
        // console.log(existingHistory);

        if (!existingHistory || existingHistory.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'User not found',
                data: []
            });
        }

        const updateQuery = `
            UPDATE contentnote
            SET checksuccess = ?
            WHERE id = ?
        `;
        const updateResult = await executeQuery(updateQuery, [checksuccess, id]);

        res.status(200).json({
            result: 1,
            message: 'content updated successfully',
            data: [],
        });
    } catch (error) {
        console.error('Error updating contentnote:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating contentnote',
            error: error.message,
        });
    }
};

const unCheckSuccess = async (req, res) => {
    try {
        const id = req.params.id;
        const checksuccess = 0;

        const checkHistoryQuery = `SELECT * FROM contentnote WHERE id = ?`;
        const existingHistory = await executeQuery(checkHistoryQuery, [id]);
        // console.log(existingHistory);

        if (!existingHistory || existingHistory.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'User not found',
                data: []
            });
        }

        const updateQuery = `
            UPDATE contentnote
            SET checksuccess = ?
            WHERE id = ?
        `;
        const updateResult = await executeQuery(updateQuery, [checksuccess, id]);

        res.status(200).json({
            result: 1,
            message: 'content updated successfully',
            data: [],
        });
    } catch (error) {
        console.error('Error updating contentnote:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating contentnote',
            error: error.message,
        });
    }
};

const getContentImportant = async (req, res) => {
    try {
        const { accountid } = req.body;

        // Truy vấn để lấy tất cả noteid từ note dựa trên accountid
        const notesQuery = 'SELECT id FROM note WHERE accountid = ?';
        const notes = await executeQuery(notesQuery, [accountid]);

        if (!notes || notes.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'Notes not found for this account',
                data: []
            });
        }

        const noteIds = notes.map(note => note.id);

        if (noteIds.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'No note IDs found for this account',
                data: []
            });
        }

        // Chuyển đổi noteIds thành chuỗi có dạng '1,2,3'
        const noteIdsString = noteIds.join(',');

        // Truy vấn để lấy tất cả contentnote quan trọng dựa trên noteid
        const contentNotesQuery = `
            SELECT * FROM contentnote 
            WHERE noteid IN (${noteIdsString}) 
            AND important = 1
        `;
        const importantContentNotes = await executeQuery(contentNotesQuery);

        if (!importantContentNotes || importantContentNotes.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'Important content notes not found for this account',
                data: []
            });
        }

        res.status(200).json({
            result: 1,
            message: 'Important content notes found successfully',
            data: importantContentNotes,
        });
    } catch (error) {
        console.error('Error finding important content notes:', error);
        res.status(500).json({
            result: 0,
            message: 'Error finding important content notes',
            error: error.message,
        });
    }
};


const getContentCheckSuccess = async (req, res) => {
    try {
        const { accountid } = req.body;

        // Truy vấn để lấy tất cả noteid từ note dựa trên accountid
        const notesQuery = 'SELECT id FROM note WHERE accountid = ?';
        const notes = await executeQuery(notesQuery, [accountid]);

        if (!notes || notes.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'Notes not found for this account',
                data: []
            });
        }

        const noteIds = notes.map(note => note.id);

        if (noteIds.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'No note IDs found for this account',
                data: []
            });
        }

        // Chuyển đổi noteIds thành chuỗi có dạng '1,2,3'
        const noteIdsString = noteIds.join(',');

        // Truy vấn để lấy tất cả contentnote quan trọng dựa trên noteid
        const contentNotesQuery = `
            SELECT * FROM contentnote 
            WHERE noteid IN (${noteIdsString}) 
            AND checksuccess = 1
        `;
        const importantContentNotes = await executeQuery(contentNotesQuery);

        if (!importantContentNotes || importantContentNotes.length === 0) {
            return res.status(404).json({
                result: 3,
                error: 'Important content notes not found for this account',
                data: []
            });
        }

        res.status(200).json({
            result: 1,
            message: 'Important content notes found successfully',
            data: importantContentNotes,
        });
    } catch (error) {
        console.error('Error finding important content notes:', error);
        res.status(500).json({
            result: 0,
            message: 'Error finding important content notes',
            error: error.message,
        });
    }
};

module.exports = {
    getContentNote, getContentNoteById, createContentNote, deleteContentNote, updateContent,
    PinContentNote, unPinContentNote, PinCheckSuccess, unCheckSuccess, getContentImportant,
    getContentCheckSuccess
};