const mysql = require('mysql')

//koneksi
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tes_db"
})

module.exports = db;