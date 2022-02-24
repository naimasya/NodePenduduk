const express = require('express')
const router = express.Router()
const {checkToken} = require('../auth/tokenValidation')
const{
    getAllPenduduk,
    getPenduduk,
    postPenduduk,
    deletePenduduk,
    putPenduduk,
    registrasi,
    login
} = require('../controllers/pendudukController')

router.route('/:id').get(getPenduduk).put(putPenduduk).delete(deletePenduduk)
router.route('/').get(checkToken, getAllPenduduk).post(checkToken, postPenduduk)

router.post('/registrasi', registrasi)
router.post('/login', login)

module.exports = router
