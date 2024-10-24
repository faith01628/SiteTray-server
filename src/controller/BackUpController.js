const express = require('express');
const router = express.Router();
const { executeQuery, sql } = require('../database');


const createBackUp = async (req, res) => {
    try {
        const { uuid } = req.body;
        const linkbackup = req.file ? req.file.path : null;

        // const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

        // console.log(req.file);


        // console.log('Request Body:', req.body);
        console.log('Uploaded File:', JSON.stringify(req.file));



        const checkUuid = `SELECT uuid FROM groupchatuser WHERE uuid = ?`;
        const check = await executeQuery(checkUuid, [uuid]);

        if (check.length > 0) {

            if (!linkbackup) {
                return res.status(400).json({
                    result: 0,
                    message: 'Missing required fields',
                });
            } else {
                const query = `UPDATE groupchatuser SET  linkbackup = ? WHERE uuid = ?`;
                const backup = await executeQuery(query, [linkbackup, uuid]);
                if (backup.affectedRows > 0) {
                    res.status(200).json({
                        result: 1,
                        message: 'backup data successfully',
                        data: backup,
                    });
                } else {
                    res.status(404).json({
                        result: 0,
                        message: 'backup data unsuccessfully',
                        data: backup,
                    });
                }
            }
        } else {
            res.status(404).json({
                result: 0,
                message: 'uuid không tồn tại',
                data: check,
            })
        };
    } catch (error) {
        console.error('Error creating content contentnote:', error);
        res.status(500).json({
            result: 0,
            message: 'Error creating content contentnote',
            error: error.message
        });
    }
}

module.exports = {
    createBackUp,
}