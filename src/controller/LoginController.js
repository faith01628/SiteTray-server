const express = require('express');
const router = express.Router();
const { generateToken } = require('../auth');
const { executeQuery, sql } = require('../database');

async function saveOrUpdateToken(accountid, token) {
    const checkQuery = `SELECT * FROM token WHERE accountid = ?`;
    const existingToken = await executeQuery(checkQuery, accountid);

    if (existingToken.length === 0) {
        const insertQuery = `
            INSERT INTO token (accountid, token, status)
            VALUES (?, ?, 1)
        `;
        await executeQuery(insertQuery, [accountid, token]);
    } else {
        const updateQuery = `
            UPDATE token
            SET token = ?, status = 1
            WHERE accountid = ?
        `;
        await executeQuery(updateQuery, [token, accountid]);
    }
}

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Kiểm tra xem email có được cung cấp hay không
//         if (!email) {
//             return res.status(400).json({
//                 result: 2,
//                 message: 'Missing required fields: email',
//             });
//         }

//         // Tìm kiếm người dùng dựa trên email
//         const query = 'SELECT * FROM account WHERE email = ?';
//         const params = [email];
//         const user = await executeQuery(query, params);

//         // Kiểm tra xem người dùng có tồn tại hay không
//         if (user.length === 0) {
//             return res.status(404).json({
//                 result: 3,
//                 message: 'User not found',
//             });
//         }

//         const foundUser = user[0];

//         // Kiểm tra mật khẩu
//         if (!password) {
//             return res.status(400).json({
//                 result: 2,
//                 message: 'Missing required fields: password',
//             });
//         }

//         // So sánh mật khẩu
//         if (foundUser.password === password) {
//             const token = generateToken(foundUser);
//             await saveOrUpdateToken(foundUser.id, token);
//             const roleData = foundUser.role;

//             return res.status(200).json({
//                 result: 1,
//                 message: 'Login successful',
//                 data: { user: foundUser, token, role: roleData },
//             });
//         } else {
//             return res.status(404).json({
//                 result: 3,
//                 message: 'Wrong password',
//             });
//         }
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({
//             result: 0,
//             message: 'Error during login',
//             error: error.message,
//         });
//     }
// };

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                result: 2,
                message: 'Missing required fields: email and password',
            });
        }

        const query = 'SELECT * FROM account WHERE email = ?';
        const params = [email];
        const user = await executeQuery(query, params);

        if (user.length === 0) {
            return res.status(404).json({
                result: 3,
                message: 'User not found',
            });
        }

        const foundUser = user[0];

        // In ra toàn bộ thông tin người dùng để kiểm tra
        // console.log('Found user:', foundUser);

        if (foundUser.password === password) {
            const token = generateToken(foundUser);
            await saveOrUpdateToken(foundUser.id, token);

            // Chuyển đổi roleData nếu là Buffer hoặc kiểu dữ liệu khác
            let roleData = foundUser.role;

            // Kiểm tra nếu roleData là Buffer
            if (Buffer.isBuffer(roleData)) {
                roleData = roleData.readUInt8(0);
            } else if (typeof roleData !== 'number') {
                // Nếu roleData không phải là số, thử chuyển đổi thành số
                roleData = parseInt(roleData, 10);
            }

            // console.log('Processed role:', roleData); // In ra role sau khi xử lý

            if (roleData === 1) { // admin
                return res.status(200).json({
                    result: 1,
                    message: 'Login successful',
                    data: { user: foundUser, token, role: roleData },
                });
            } else if (roleData === 0) { // user
                return res.status(200).json({
                    result: 1,
                    message: 'Login successful',
                    data: { user: foundUser, token, role: roleData },
                });
            } else {
                return res.status(403).json({
                    result: 4,
                    message: 'Unknown role',
                });
            }
        } else {
            return res.status(404).json({
                result: 3,
                message: 'Wrong password',
            });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            result: 0,
            message: 'Error during login',
            error: error.message,
        });
    }
};



module.exports = {
    login
};
