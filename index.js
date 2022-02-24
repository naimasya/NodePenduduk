
'use strict'

//inisialisasi
const express = require("express")

//implementasi
const app = express()
app.use(express.json())

//menghubungkan ke database
const db = require('./db')
db.connect(error => {
    if(error) throw error
    console.log ("Mysql Connected")
})

//endpoint
app.get("/", (req,res) => {
    res.send({
        message: "Berhasil Menjalankan GET",
        data:{
            description: "Endpoint ini menampilkan data"
        }
    })
})

app.use("/penduduk", require('./routes/pendudukRoutes'))

const port = 8000;
app.listen(port, () => console.log (`App sudah berjalan ${port}`))