const express = require('express');
const router = express.Router();
const { executeQuery, sql } = require('../database');
const { v4: uuidv4 } = require('uuid');

const getUserData = async (req, res) => {
    try {
        const query = 'SELECT * FROM account';
        const userData = await executeQuery(query);

        res.status(200).json({
            result: 1,
            message: 'Get user data successfully',
            data: userData,
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({
            result: 0,
            message: 'Error fetching user data',
            error: error.message,
        });
    }
};


const createUser = async (req, res) => {
    try {
        const { username, phone, email, address, password } = req.body;

        console.log(req.body);



        // Generate a unique code
        const generateCode = () => {
            const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            let randomString = '';
            for (let i = 0; i < 8; i++) {
                randomString += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return randomString;
        };

        let code;
        let codeExists = true;

        // Ensure the generated code is unique
        while (codeExists) {
            code = generateCode();
            const checkCodeQuery = 'SELECT * FROM account WHERE code = ?';
            const existingCode = await executeQuery(checkCodeQuery, [code]);
            if (existingCode.length === 0) {
                codeExists = false;
            }
        }

        const checkUserQuery = 'SELECT * FROM account';
        const existingUser = await executeQuery(checkUserQuery);

        let userNameExists = false;
        let emailExists = false;


        for (let user of existingUser) {
            if (user.username === username) {
                userNameExists = true;
                break;
            }
            if (user.email === email) {
                emailExists = true;
                break;
            }
        }

        if (!username || !email || !password) {
            return res.status(400).json({
                result: 2,
                message: 'Missing information. Please provide all required fields.',
            });
        } else if (emailExists) {
            return res.status(400).json({
                result: 2,
                message: 'This email already exists',
            });
        } else {
            const insertQuery = `
            INSERT INTO account (username, phone, email, address, code, role, edit, ungacha, password)
            VALUES (?, ?, ?, ?, ?, 0, 1, 0, ?)
        `;
            await executeQuery(insertQuery, [username, phone || null, email, address || null, code, password]);

            const getLastIdQuery = 'SELECT LAST_INSERT_ID() as id';
            const result = await executeQuery(getLastIdQuery);
            const newUserId = result[0].id;

            // Lấy các đoạn chat mặc định
            const getChatQuery = 'SELECT * FROM groupchat';
            const defaultChats = await executeQuery(getChatQuery);
            const uuid = uuidv4();

            // Chèn các đoạn chat mặc định vào bảng chat_user
            for (let chat of defaultChats) {
                const insertChatQuery = `
                    INSERT INTO groupchatuser (accountid, name, link, img ,uuid)
                    VALUES (?, ?, ?, ?, ?)
                `;
                await executeQuery(insertChatQuery, [newUserId, chat.name, chat.link, chat.img, uuid]);
            }

            res.status(201).json({
                result: 1,
                message: 'User created successfully',
                data: { id: newUserId, username, phone, email, address, code },
            });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            result: 0,
            message: 'Error creating user',
            error: error.message,
        });
    }
};


const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const query = 'SELECT * FROM account WHERE id = ?';
        const userData = await executeQuery(query, [userId]);

        if (userData.length > 0) {
            res.status(200).json({
                result: 1,
                message: 'Get user by ID successfully',
                data: userData,
            });
        } else {
            res.status(404).json({
                result: 3,
                message: 'User not found',
            });
        }
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({
            result: 0,
            message: 'Error getting user by ID',
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const getUserQuery = 'SELECT * FROM account WHERE id = ?';
        const userData = await executeQuery(getUserQuery, [userId]);

        if (userData.length === 0) {
            return res.status(404).json({
                result: 3,
                message: 'User not found',
            });
        }

        const checktokenQuery = 'SELECT * FROM token WHERE accountid = ?';
        const existingToken = await executeQuery(checktokenQuery, [userId]);
        const deleteTokenQuery = 'DELETE FROM token WHERE accountid = ?';
        await executeQuery(deleteTokenQuery, [userId]);


        const checkUserQuery = 'SELECT * FROM history WHERE accountid = ?';
        const existingUser = await executeQuery(checkUserQuery, [userId]);
        const deleteHistoryQuery = 'DELETE FROM history WHERE accountid = ?';
        await executeQuery(deleteHistoryQuery, [userId]);


        const deleteQuery = 'DELETE FROM account WHERE id = ?';
        await executeQuery(deleteQuery, [userId]);

        res.status(200).json({
            result: 1,
            message: 'Delete user successfully',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            result: 0,
            message: 'Error deleting user',
            error: error.message,
        });
    }
};

const deleteSignup = async (req, res) => {
    try {
        const userId = req.params.id;

        const getUserQuery = 'SELECT * FROM account WHERE id = ?';
        const userData = await executeQuery(getUserQuery, [userId]);

        if (userData.length === 0) {
            return res.status(404).json({
                result: 3,
                message: 'User not found',
            });
        }

        const deleteQuery = 'DELETE FROM account WHERE id = ?';
        await executeQuery(deleteQuery, [userId]);

        res.status(200).json({
            result: 1,
            message: 'Delete user successfully',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            result: 0,
            message: 'Error deleting user',
            error: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, phone, code, email, address } = req.body;

        const checkUserQuery = 'SELECT * FROM account WHERE id = ?';
        const existingUser = await executeQuery(checkUserQuery, [userId]);

        const query = 'SELECT * FROM account';
        const userData = await executeQuery(query);

        let userNameExists = false;
        let emailExists = false;
        let editExists = false;

        for (let user of existingUser) {
            if (user.id === userId) {
                if (user.username === username && user.email === email) {
                    userNameExists = false;
                    emailExists = false;
                    break;
                }
            } else {
                for (let user of userData) {
                    if (user.id === userId) {
                        continue; // Skip the user being edited
                    }
                    if (user.username === username) {
                        userNameExists = true;
                    }
                    if (user.email === email) {
                        emailExists = true;
                    }

                    // If all conflicts are found, no need to check further
                    if (userNameExists && emailExists && codeExists) {
                        break;
                    }
                }
            }
        }


        if (!existingUser || existingUser.length === 0) {
            return res.status(404).json({
                result: 3,
                message: 'User not found',
            });
        }

        if (!username || !phone || !email) {
            return res.status(400).json({
                result: 2,
                message: 'Missing information. Please provide all required fields.',
            });
        } else if (editExists) {
            return res.status(400).json({
                result: 2,
                message: 'The user no longer has permission to edit again',
            });
        } else if (userNameExists) {
            return res.status(400).json({
                result: 2,
                message: 'This username already exists',
            });
        } else if (emailExists) {
            return res.status(400).json({
                result: 2,
                message: 'This email already exists',
            });
        }

        const updateQuery = `
            UPDATE account
            SET username = ?, phone = ?, code = ?,
                email = ?, address = ?,
                role = 0, edit = 0, ungacha = 0
            WHERE id = ?
        `;
        await executeQuery(updateQuery, [
            username,
            phone,
            code,
            email,
            address,
            userId,
        ]);

        res.status(200).json({
            result: 1,
            message: 'User updated successfully',
            data: { id: userId, username, phone, code, email, address },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating user',
            error: error.message,
        });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, phone, code, email, address, edit } = req.body;

        // console.log(userId, username, phone, code, email, address, edit);

        const checkUserQuery = 'SELECT * FROM account WHERE id = ?';
        const existingUser = await executeQuery(checkUserQuery, [userId]);

        let userNameExists = false;
        let emailExists = false;

        for (let user of existingUser) {
            if (user.username === username) {
                userNameExists = true;
                break;
            }
            if (user.email === email) {
                emailExists = true;
                break;
            }
        }

        if (!existingUser || existingUser.length === 0) {
            return res.status(404).json({
                result: 3,
                message: 'User not found',
            });
        }

        if (!username || !phone || !email) {
            return res.status(400).json({
                result: 2,
                message: 'Missing information. Please provide all required fields.',
            });
        } else if (userNameExists) {
            return res.status(400).json({
                result: 2,
                message: 'This username already exists',
            });
        } else if (emailExists) {
            return res.status(400).json({
                result: 2,
                message: 'This email already exists',
            });
        }

        const updateQuery = `
            UPDATE account
            SET username = ?, phone = ?, code = ?,
                email = ?, address = ?,
                role = 0, edit = ?, ungacha = 0
            WHERE id = ?
        `;
        await executeQuery(updateQuery, [
            username,
            phone,
            code,
            email,
            address,
            edit,
            userId,
        ]);

        res.status(200).json({
            result: 1,
            message: 'User updated successfully',
            data: { id: userId, username, phone, code, email, address },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            result: 0,
            message: 'Error updating user',
            error: error.message,
        });
    }
};


// của dự án trước dự án này không dùng tới

// const updateSignup = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const { username, phone, code, email, address, edit } = req.body;

//         const checkUserQuery = 'SELECT * FROM account WHERE id = ?';
//         const existingUser = await executeQuery(checkUserQuery, [userId]);

//         if (!existingUser || existingUser.length === 0) {
//             return res.status(404).json({
//                 result: 3,
//                 message: 'User not found',
//             });
//         }

//         if (!username || !phone || !email || !address || !code) {
//             return res.status(400).json({
//                 result: 2,
//                 message: 'Missing information. Please provide all required fields.',
//             });
//         }

//         const updateQuery = `
//             UPDATE account
//             SET username = ?, phone = ?, code = ?,
//                 email = ?, address = ?,
//                 role = 0, edit = 1, ungacha = 0
//             WHERE id = ?
//         `;
//         await executeQuery(updateQuery, {
//             userId,
//             username,
//             phone,
//             code,
//             email,
//             address,
//             edit,
//         });

//         res.status(200).json({
//             result: 1,
//             message: 'User updated successfully',
//             data: { id: userId, username, phone, code, email, address },
//         });
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).json({
//             result: 0,
//             message: 'Error updating user',
//             error: error.message,
//         });
//     }
// };

// const ungacha = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const { ungacha } = req.body;
//         const checkUserQuery = 'SELECT * FROM account WHERE id = ?';
//         const existingUser = await executeQuery(checkUserQuery, [userId]);

//         if (!existingUser || existingUser.length === 0) {
//             return res.status(404).json({
//                 result: 3,
//                 message: 'User not found',
//             });
//         }

//         const updateQuery = `
//         UPDATE account
//         SET  ungacha = 1
//         WHERE id = ?
//     `;
//         await executeQuery(updateQuery, {
//             userId,
//             ungacha,
//         });

//         res.status(200).json({
//             result: 1,
//             message: 'User updated successfully',
//             data: { id: userId, ungacha: ungacha },
//         });

//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).json({
//             result: 0,
//             message: 'Error updating user',
//             error: error.message,
//         });
//     }
// };

// const unLockgacha = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const { ungacha } = req.body;
//         const checkUserQuery = 'SELECT * FROM account WHERE id = ?';
//         const existingUser = await executeQuery(checkUserQuery, [userId]);

//         if (!existingUser || existingUser.length === 0) {
//             return res.status(404).json({
//                 result: 3,
//                 message: 'User not found',
//             });
//         }

//         const updateQuery = `
//         UPDATE account
//         SET  ungacha = 0
//         WHERE id = ?
//     `;
//         await executeQuery(updateQuery, {
//             userId,
//             ungacha,
//         });

//         res.status(200).json({
//             result: 1,
//             message: 'User updated successfully',
//             data: { id: userId, ungacha: ungacha },
//         });

//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).json({
//             result: 0,
//             message: 'Error updating user',
//             error: error.message,
//         });
//     }
// };

module.exports = {
    getUserData,
    createUser,
    getUserById,
    deleteUser,
    deleteSignup,
    updateUser,
    updateAdmin,
    // updateSignup,
    // ungacha,
    // unLockgacha,
};
