// //Requires  --Importacion de librerias
// var express = require('express');

// //Inicializar variables -- aqui se usan las libnrerias

// var app = express();

// // Rutas req = requires res= response next para que continue a la otra instruccion.

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
var Facturar = require('../models/facturacion');



// Rutas req = requires res= response next para que continue a la otra instruccion.
//====================================
// Obtener facturas
//=================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Facturar.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email img')
        .populate('pago')
        .populate('articulo')
        .populate('cliente')
        .exec((err, factura) => {
            if (err) {
                return res.status(500).json({ ok: false, mensaje: 'ERROR cargando facturas', errors: err });
            }

            Facturar.count({}, (err, conteo) => {
                res.status(200).json({ ok: true, factura: factura, total: conteo });
            });
        });
});

//====================================
// Actualizar facturas
//===================================

app.put('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Facturar.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('pagos')
        .populate('articulo')
        .populate('cliente')
        .exec((err, factura) => {
            if (err) {
                return res.status(500).json({ ok: false, mensaje: 'ERROR al buscar factura', errors: err });
            }

            if (!factura) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        mensaje: 'El factura no existe',
                        errors: { message: 'No existe una factura con ese Id' },
                    });
            }
            factura.pago = body.pago;
            factura.cliente = body.cliente;
            factura.fecha = body.fecha;
            factura.comentario = body.comentario;
            factura.articulo = body.articulo;
            factura.cantidad = body.cantidad;
            factura.precio = body.precio;
            factura.comision = body.comision;
            factura.estado = body.estado;
            factura.usuario = req.usuario._id;

            factura.save((err, facturaGuardada) => {
                if (err) {
                    return res.status(400).json({ ok: false, mensaje: 'ERROR al actualizar factura', errors: err });
                }

                res.status(200).json({ ok: true, factura: facturaGuardada, usuariotoken: req.usuario });
            });
        });
});

//====================================
// Crear facturas
//===================================
//
app.post('/', mdAuth.verificaToken, (req, res) => {
    var body = req.body;

    var factura = new Facturar({
        pago: body.pago,
        cliente: body.cliente,
        fecha: body.fecha,
        comentario: body.comentario,
        articulo: body.articulo,
        cantidad: body.cantidad,
        precio: body.precio,
        comision: body.comision,
        estado: body.estado,
        usuario: req.usuario._id,
    });

    factura.save((err, facturaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERROR al crear factura',
                errors: err,
            });
        }
        res.status(201).json({
            ok: true,
            factura: facturaGuardada,
            usuariotoken: req.usuario,
        });
    });
});
//====================================
// Eliminar articulo
//===================================

app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    Facturar.findByIdAndRemove(id, (err, facturaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERROR al borrar factura',
                errors: err,
            });
        }
        if (!facturaBorrada) {
            return res
                .status(400)
                .json({
                    ok: false,
                    mensaje: 'La factura con el id ' + id + 'no existe',
                    errors: { message: 'No existe una factura con ese Id' },
                });
        }

        res.status(201).json({
            ok: true,
            factura: facturaBorrada,
            usuariotoken: req.usuario
        });
    });
});

module.exports = app;