// Requires  --Importacion de librerias
var express = require('express');

// Inicializar variables -- aqui se usan las libnrerias
var app = express();



var mdAuth = require('../middlewares/autenticacion');

// importar el esquema de la base de datos
var Articulo = require('../models/articulo');



// Rutas req = requires res= response next para que continue a la otra instruccion.
//====================================
// Obtener articulos
//=================================
app.get('/', (req, res, next) => {
    Articulo.find({})
        .populate('usuario', 'nombre email')
        .exec((err, articulos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'ERROR cargando articulos',
                    errors: err,
                });
            }

            Articulo.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    articulos: articulos,
                    total: conteo
                });
            });


        });
});

//====================================
// Actualizar Articulos
//===================================

app.put('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Articulo.findById(id, (err, articulo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR al buscar usuario',
                errors: err,
            });
        }

        if (!articulo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El articulo no existe',
                errors: { message: 'No existe un articulo con ese Id' },
            });
        }

        articulo.descripcion = body.descripcion;
        articulo.precio = body.precio;
        articulo.estado = body.estado;
        articulo.usuario = req.usuario._id;

        articulo.save((err, articuloGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERROR al actualizar usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: articuloGuardado,
                usuariotoken: req.usuario
            });
        });
    });
});

//====================================
// Crear articulo
//===================================
//
app.post('/', mdAuth.verificaToken, (req, res) => {
    var body = req.body;

    var articulo = new Articulo({
        descripcion: body.descripcion,
        precio: body.precio,
        estado: body.estado,
        usuario: req.usuario._id

    });

    articulo.save((err, articuloGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERROR al crear articulo',
                errors: err,
            });
        }
        res.status(201).json({
            ok: true,
            articulo: articuloGuardado,
            usuariotoken: req.usuario,
        });
    });
});
//====================================
// Eliminar articulo
//===================================

app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    Articulo.findByIdAndRemove(id, (err, articuloBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERROR al crear articulo',
                errors: err,
            });
        }
        if (!articuloBorrado) {
            return res
                .status(400)
                .json({
                    ok: false,
                    mensaje: 'El articulo con el id ' + id + 'no existe',
                    errors: { message: 'No existe un articulo con ese Id' },
                });
        }

        res.status(201).json({
            ok: true,
            articulo: articuloBorrado,
            usuariotoken: req.usuario
        });
    });
});

module.exports = app;