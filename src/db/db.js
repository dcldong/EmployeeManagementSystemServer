const mysql = require('mysql');
const config = require('./mysql_config');
const conn = mysql.createConnection(config.mysql);

conn.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('mysql 连接成功');
});

let query = (sql, params) => {
    return new Promise((resolve, reject) => {
        conn.query(sql, params, (error, result, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}
//关闭连接
//conn.end();
module.exports = { conn, query };