const express = require('express');
const router = express.Router();
const { executeQuery, sql } = require('../database');

const getWinPrize = async (req, res) => {
    try {
        const query = 'SELECT w.*, a.username, a.email, a.phone, a.code FROM "winprize" w JOIN "account" a ON w.accountid = a.id';
        const winprizeData = await executeQuery(query);

        res.status(200).json({
            result: 1,
            message: 'Get user win prize data successfully',
            data: winprizeData,
        });
    } catch (error) {
        console.error('Error fetching user win prize data:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching user win prize data',
            error: error.message,
        });
    }
};

module.exports = {
    getWinPrize,
};
