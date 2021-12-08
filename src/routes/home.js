const express = require('express');
const router = express.Router();
const axios = require('axios').default;

router.post('/welcome', async(req, res) => {
    const { txtusuario, txtpassword } = req.body;
    const response = await validateCredentials(txtusuario, txtpassword);
    if (response) {
        res.render('dashboard/dashboard', {
            data: response.data
        });
    } else {
        res.render('login/login', {
            action: 'Datos incorrectos',
            class: 'action-message'
        });
    }
});

const validateCredentials = async(usuario, password) => {
    const r = await axios.post('http://localhost:4000/admin/make/validate/', {
            usuario,
            password
        }
    ).then(r => {
        return r.data;
    }).catch(r => {
        return null;
    });
    return (r) ? r : false;
};

module.exports = router;