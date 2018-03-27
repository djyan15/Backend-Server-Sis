// Requires  --Importacion de librerias
var express = require('express');

// Importar el by cryte
var bcrypt = require('bcryptjs');

// Inicializar variables -- aqui se usan las libnrerias
var app = express();

var SEED = require('../config/config').SEED;
//importar jwt
var jwt = require('jsonwebtoken');
// importar el esquema de la base de datos
var Usuario = require('../models/usuario');


app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err

            });
        }
        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err,
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err,
            });
        }
        //Creacion de token!!!
        usuarioDb.password = ':)';
        var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 }); // 4 horas


        res.status(200).json({
            ok: true,
            usuario: usuarioDb,
            token: token,
            id: usuarioDb._id
        });
    });


});

module.exports = app;