// // Requires  --Importacion de librerias
// var express = require('express');

// // Inicializar variables -- aqui se usan las libnrerias

// var app = express();

// //Rutas req = requires res= response next para que continue a la otra instruccion.

// app.get('/', (req, res, next) => {
//     res.status(200).json({
//         ok: true,
//         mensaje: 'Peticion realizada correctamente',
//     });
// });

// module.exports = app;

// Requires  --Importacion de librerias
var express = require('express');

// Inicializar variables -- aqui se usan las libnrerias
var app = express();



var mdAuth = require('../middlewares/autenticacion');

// importar el esquema de la base de datos
var Pagos = require('../models/pagos');



// Rutas req = requires res= response next para que continue a la otra instruccion.
//====================================
// Obtener pagos
//=================================
app.get('/', (req, res, next) => {
    Pagos.find({})
        .exec((err, pagos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'ERROR cargando pagos',
                    errors: err,
                });
            }

            Pagos.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    pagos: pagos,
                    total: conteo
                });
            });


        });
});

//====================================
// Actualizar pagos
//===================================

app.put('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Pagos.findById(id, (err, pagos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR al buscar pagos',
                errors: err,
            });
        }

        if (!pagos) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El pago no existe',
                errors: { message: 'No existe un pago con ese Id' },
            });
        }

        pagos.descripcion = body.descripcion;
        pagos.cantidadDias = body.cantidadDias;
        pagos.estado = body.estado;
        pagos.usuario = req.usuario._id;

        pagos.save((err, pagosGuardados) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERROR al actualizar pagos',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                pagos: pagosGuardados,
                usuariotoken: req.usuario
            });
        });
    });
});

//====================================
// Crear pagos
//===================================
//
app.post('/', mdAuth.verificaToken, (req, res) => {
    var body = req.body;

    var pagos = new Pagos({
        descripcion: body.descripcion,
        cantidadDias: body.cantidadDias,
        estado: body.estado,
        usuario: req.usuario._id

    });

    pagos.save((err, pagosGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERROR al crear pagos',
                errors: err,
            });
        }
        res.status(201).json({
            ok: true,
            pagos: pagosGuardado,
            usuariotoken: req.usuario,
        });
    });
});
//====================================
// Eliminar articulo
//===================================

app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    Pagos.findByIdAndRemove(id, (err, pagosBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERROR al crear pagos',
                errors: err,
                pagos
            });
        }
        if (!pagosBorrado) {
            return res
                .status(400)
                .json({
                    ok: false,
                    mensaje: 'El pagos con el id ' + id + 'no existe',
                    errors: { message: 'No existe un pagos con ese Id' },
                });
        }

        res.status(201).json({
            ok: true,
            pagos: pagosBorrado,
            usuariotoken: req.usuario
        });
    });
});

module.exports = app;