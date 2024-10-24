const mysql = require('mysql');
require('dotenv').config();

const UserDatbase = process.env.USER_NAME_DATABASE;
const HostDatbase = process.env.HOST_DATABASE;
const PasswordDatbase = process.env.PASSWORD_DATABASE;

const config = {
    host: HostDatbase, // Thay bằng địa chỉ host của bạn
    user: UserDatbase, // Tên người dùng MySQL
    password: PasswordDatbase, // Mật khẩu MySQL
    database: 'sql_izm_transtec', // Tên cơ sở dữ liệu MySQL
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
                return;
            }
            resolve(results);
        });
    });
};


module.exports = {
    executeQuery,
};
