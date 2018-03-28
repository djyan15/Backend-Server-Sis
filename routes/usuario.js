// Requires  --Importacion de librerias
var express = require('express');

// Importar el bycrypt 
var bcrypt = require('bcryptjs');

// Inicializar variables -- aqui se usan las libnrerias
var app = express();

//importar jwt
var jwt = require('jsonwebtoken');

var mdAuth = require('../middlewares/autenticacion');

// importar el esquema de la base de datos
var Usuario = require('../models/usuario');


//Rutas req = requires res= response next para que continue a la otra instruccion.
//====================================
// Obtener Usuario
//=================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role').exec(

        (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'ERROR cargando usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });



});



//====================================
// Actualizar Usuario
//===================================

app.put('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR al buscar usuario',
                errors: err

            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese Id' }

            });

        }


        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERROR al actualizar usuario',
                    errors: err

                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuariotoken: req.usuario
            });
        });


    });




});

//====================================
// Crear Usuario
//===================================
//
app.post('/', mdAuth.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res
                .status(400)
                .json({
                    ok: false,
                    mensaje: 'ERROR al crear usuario',
                    errors: err
                });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });
});
//====================================
// Eliminar Usuario
//===================================

app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERROR al eliminar usuario',
                errors: err,
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese Id' },
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioBorrado,
            usuariotoken: req.usuario,
        });
    });
});



module.exports = app;