const { executeQuery, sql } = require('../database');

let lastWinner = null; // In-memory store for the last winner

const gacha = async (req, res) => {
    try {
        // const { numgacha } = req.body;

        const query = 'SELECT * FROM "account" WHERE role = 0';
        const users = await executeQuery(query);

        if (users.length === 0) {
            throw new Error('No users found');
        }

        const winprizeQuery = 'SELECT accountid FROM "winprize"';
        const winprizeUsers = await executeQuery(winprizeQuery);
        const winprizeUserIds = winprizeUsers.map(user => ({
            accountid: user.accountid,
            id: user.id
        }));

        // Check if there are more than 3 records in the winprize table
        if (winprizeUserIds.length > 10) {
            throw new Error('Too many winners already, no more gacha allowed');
        }

        // Filter users to exclude those who have won a prize and those who have ungacha set to true
        const eligibleUsers = users.filter(user => !winprizeUserIds.includes(user.id) && user.ungacha !== true);

        if (eligibleUsers.length === 0) {
            throw new Error('No eligible users for gacha');
        }

        const randomUser = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];

        const insertQuery = 'INSERT INTO "winprize" (accountid, winprize) OUTPUT INSERTED.id VALUES (@accountid, 1)';
        const datawinprize = await executeQuery(insertQuery, { accountid: randomUser.id });

        // console.log('get winprize', datawinprize);
        const lastWinner = {
            idwinprize: datawinprize[0].id, // Include the id of the winprize record
            id: randomUser.id,
            // accountid: randomUser.id,
            winprize: 1,
            code: randomUser.code,
            username: randomUser.username,
            email: randomUser.email,
            phone: randomUser.phone
        };
        return lastWinner;
    } catch (error) {
        console.error('Error during gacha:', error);
        throw error; // Throw error instead of returning res.status().json()
    }
};


const viewGacha = async (req, res) => {
    try {
        if (!lastWinner && !winprize) {
            return res.status(404).json({
                result: 3,
                message: 'No winner found',
            });
        }

        return res.status(200).json({
            result: 1,
            message: 'Last winner fetched successfully',
            data: lastWinner, winprize,
        });
    } catch (error) {
        console.error('Error during viewGacha:', error);
        return res.status(500).json({
            result: 0,
            message: 'Error during viewGacha',
            error: error.message,
        });
    }
};

const deleteUserGacha = async (req, res) => {
    try {
        const Id = req.params.id;;
        const deleteQuery = 'DELETE FROM winprize WHERE id = @Id';
        await executeQuery(deleteQuery, { id: Id });
        return res.status(200).json({
            result: 1,
            message: 'Last winner deleted successfully',
            data: Id,
        });
    } catch (error) {
        console.error('Error during deleteUserGacha:', error);
        return res.status(500).json({
            result: 0,
            message: 'Error during deleteUserGacha',
            error: error.message,
        });
    }
};

const deleteMultipleGacha = async (req, res) => {
    try {
        await executeQuery('DELETE FROM winprize');
        return res.status(200).json({
            result: 1,
            message: 'All winners deleted successfully',
        });
    } catch (error) {
        console.error('Error during deleteMultipleGacha:', error);
        return res.status(500).json({
            result: 0,
            message: 'Error during deleteMultipleGacha',
            error: error.message,
        });
    }
};

module.exports = { gacha, viewGacha, deleteUserGacha, deleteMultipleGacha };
