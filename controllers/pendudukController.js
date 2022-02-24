'usestrict'

const bcrtypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')

const secret = '#$*&%^&@#($(@'

function hashPassword(password){
    const salt = bcrtypt.genSaltSync(10)
    return bcrtypt.hashSync(password, salt)
}
module.exports = {
    getAllPenduduk: (req, res) => {
        let sql = 'SELECT * FROM penduduk'
        db.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Internal server error'
                })
            } else {
                if (result.length > 0) {
                    res.status(200).json({
                        message: 'All Penduduk',
                        data: result
                    })
                } else {
                    res.status(404).json({
                        message: 'No penduduk found'
                    })
                }
            }
        })
    },

    getPenduduk : (req, res) => {
        const id = req.params.id

        let sql = `SELECT * FROM penduduk WHERE id = ${id}`
        db.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Internal server error'
                })
            } else {
                if (result.length > 0) {
                    res.status(200).json({
                        message: 'Detail Penduduk by ID ' + id,
                        data: result
                    })
                } else {
                    res.status(404).json({
                        message: 'Penduduk not found'
                    })
                }
            }
        })
    },
    postPenduduk : (req, res) => {
        const { nama, alamat } = req.body
        const dataNewPenduduk = {
            nama,
            alamat
        }

        let sql = `INSERT INTO penduduk SET ?`
        db.query(sql, dataNewPenduduk, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Internal server error'
                })
            } else {
                res.status(201).json({
                    message: 'New penduduk has been created',
                    data: {
                        id: result.insertId,
                        ...dataNewPenduduk
                    }
                })
            }
        })
    },
    deletePenduduk : (req, res) => {
        const { id } = req.params

        let sql = `DELETE FROM penduduk WHERE id = ${id}`
        db.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Internal server error'
                })
            } else {
                res.status(200).json({
                    message: 'Penduduk has been deleted'
                })
            }
        })
    },
    putPenduduk : (req, res) => {
        const { id } = req.params
        const { nama, alamat } = req.body

        let sql = `UPDATE penduduk SET nama = '${nama}', alamat = '${alamat}' WHERE id = ${id}`
        db.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Internal server error'
                })
            } else {
                res.status(200).json({
                    message: 'Penduduk has been updated',
                    data: {
                        id,
                        nama,
                        alamat
                    }
                })
            }
        })
    },
    registrasi:(req, res) =>{
        const{
            nama,
            email,
            password
        } = req.body
        if(!nama, !email || !password) res.status(402).json({message: 'nama,email,password harus diisi'})
        return db.query('insert into akun set ?', {nama, email, password:hashPassword(password)}, (err, result)=>{
            if(err) return res.status(500).json({err})
            return res.json({message: 'registrasi berhasil', data:result})
        })
    },
    login:(req, res)=>{
        const{
            email,
            password
        }=req.body
        if(!email || !password) res.status(402).json({message: 'email, password harus diisi'})
        return db.query('select * from akun where email = ?', email, (err, result) =>{
            if(err) return res.status(500).json({err})
            const user = result[0]
            if(typeof user === 'unfined') return res.status(401).json({message:'user tidak ditemukan'})
            if(!bcrtypt.compareSync(password, user.password)) return res.status(401).json({message:'email atau password tidak sesuai'})

            const token = jwt.sign({data:user}, secret)
            return res.json({message: 'login berhasil menggunakna token dibawwah ini untuk mengakses endpoint private lain', token})
        })
    }
}