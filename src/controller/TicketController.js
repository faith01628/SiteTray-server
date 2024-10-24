const { executeQuery, sql } = require('../database');

const getTicker = async (req, res) => {
    try {
        const query = 'SELECT * FROM ticker';
        const ticker = await executeQuery(query);
        if (ticker.length === 0) {
            throw new Error('No ticker');
        }

        res.status(200).json({
            result: 1,
            message: 'Get data ticker successfully',
            data: ticker,
        });

    } catch (error) {
        console.error('Error during gacha:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching data ticker',
            error: error.message,
        });
        throw error; // Throw error instead of returning res.status().json()

    }
}

const updateTicker = async (req, res) => {
    try {
        const tickerId = req.params.id;
        const { titleticker, dayticker, imageticker, title1, title2, content1, content2 } = req.body;

        const checkUserQuery = 'SELECT * FROM "ticker" WHERE id = @tickerId';
        const existingUser = await executeQuery(checkUserQuery, { tickerId });

        if (!existingUser || existingUser.length === 0) {
            return res.status(404).json({
                result: 3,
                message: 'Ticker not found',
            });
        }

        if (!titleticker || !dayticker || !imageticker || !title1 || !title2 || !content1 || !content2) {
            return res.status(400).json({
                result: 2,
                message: 'Missing information. Please provide all required fields.',
            });
        }

        const updateQuery = `
            UPDATE "ticker"
            SET titleticker = @titleticker, dayticker = @dayticker, imageticker = @imageticker,
                title1 = @title1, title2 = @title2, content1 = @content1, content2 = @content2
            WHERE id = @tickerId
        `;
        await executeQuery(updateQuery, {
            tickerId,
            titleticker,
            dayticker,
            imageticker,
            title1,
            title2,
            content1,
            content2,
        });

        res.status(200).json({
            result: 1,
            message: 'Ticker updated successfully',
            data: { tickerId, titleticker, dayticker, imageticker, title1, title2, content1, content2 },
        });
    } catch (error) {
        console.error('Error updating ticker:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating ticker',
            error: error.message,
        });
    }
}

module.exports = { getTicker, updateTicker };
