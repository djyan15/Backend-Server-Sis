// Requires  --Importacion de librerias
var express = require('express');
var mdAuth = require('../middlewares/autenticacion');
// Inicializar variables -- aqui se usan las libnrerias

var app = express();

// importar el esquema de la base de datos
var Cliente = require('../models/cliente');
// Rutas req = requires res= response next para que continue a la otra instruccion.
//====================================
// Obtener clientes
//=================================
app.get('/', (req, res, next) => {
    Cliente.find({}).exec((err, clientes) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR cargando clientes',
                errors: err,
            });
        }
        res.status(200).json({
            ok: true,
            clientes: clientes,
        });
    });
});

//====================================
// Actualizar clientes
//===================================

app.put('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Cliente.findById(id, (err, cliente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR al buscar cliente',
                errors: err,
            });
        }

        if (!articulo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente no existe',
                errors: { message: 'No existe un cliente con ese Id' },
            });
        }

        cliente.nombreComercial = body.nombreComercial;
        cliente.cedula = body.cedula;
        cliente.cuenta = body.cuenta;
        cliente.estado = body.estado;
        cliente.usuario = req.usuario._id;

        cliente.save((err, clienteGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERROR al actualizar cliente',
                    errors: err,
                });
            }

            res.status(200).json({
                ok: true,
                cliente: clienteGuardado,
                usuariotoken: req.usuario
            });
        });
    });
});

//====================================
// Crear clientes
//===================================
//
app.post('/', mdAuth.verificaToken, (req, res) => {
    var body = req.body;

    var cliente = new Cliente({
        nombreComercial: body.nombreComercial,
        cedula: body.cedula,
        cuenta: body.cuenta,
        estado: body.estado,
        usuario: body.usuario._id
    });

    cliente.save((err, clienteGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERROR al crear cliente',
                errors: err,
            });
        }
        res.status(201).json({
            ok: true,
            cliente: clienteGuardado,
            usuariotoken: req.usuario,
        });
    });
});
//====================================
// Eliminar clientes
//===================================

app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERROR al elimianr cliente',
                errors: err,
            });
        }
        if (!clienteBorrado) {
            return res
                .status(400)
                .json({
                    ok: false,
                    mensaje: 'El cliente con el id ' + id + 'no existe',
                    errors: { message: 'No existe un cliente con ese Id' },
                });
        }

        res.status(201).json({
            ok: true,
            cliente: clienteBorrado,
            usuariotoken: req.usuario,
        });
    });
});
module.exports = app;