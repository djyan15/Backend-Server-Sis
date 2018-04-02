// Requires  --Importacion de librerias
var express = require('express');

// Inicializar variables -- aqui se usan las libnrerias

var app = express();
var Articulo = require('../models/articulo');
var Cliente = require('../models/cliente');
var Factura = require('../models/facturacion');
var Pagos = require('../models/pagos');
var Usuario = require('../models/usuario');


//==========================================
// Busqueda general 
// =========================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'articulo':
            promesa = buscarArticulos(busqueda, regex);
            break;
        case 'cliente':
            promesa = buscarClientes(busqueda, regex);
            break;

        case 'facturacion':
            promesa = buscarFacturas(busqueda, regex);
            break;

        case 'pagos':
            promesa = buscarPagos(busqueda, regex);

            break;

        case 'usuario':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'No cumple con los criterios de busqueda'
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    });




});





//==========================================
// Busqueda general 
// =========================================
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarArticulos(busqueda, regex),
            buscarClientes(busqueda, regex),
            buscarPagos(busqueda, regex),
            buscarUsuarios(busqueda, regex),
            buscarFacturas(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                articulo: respuestas[0],
                clientes: respuestas[1],
                pagos: respuestas[2],
                usuarios: respuestas[3],
                facturas: respuestas[4]
            });
        })




});

function buscarArticulos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Articulo.find({ descripcion: regex })
            .populate('usuario', 'nombre email')
            .exec((err, articulo) => {
                if (err) {

                    reject('Error al cargar articulo', err);
                } else {
                    resolve(articulo);
                }
            });
    });
}

function buscarClientes(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Cliente.find({ nombreComercial: regex })
            .populate('usuario', 'nombre email')
            .exec((err, cliente) => {
                if (err) {
                    reject('Error al cargar cliente', err);
                } else {
                    resolve(cliente);
                }
            });
    });
}

function buscarPagos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Pagos.find({ descripcion: regex })
            .populate('usuario', 'nombre email')
            .exec(
                (err, pagos) => {
                    if (err) {
                        reject('Error al cargar los pagos', err);
                    } else {
                        resolve(pagos);
                    }
                });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }




            })
    });
}

function buscarFacturas(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Factura.find({ estado: regex })
            .populate('usuario', 'nombre email')
            .populate('pago')
            .populate('cliente')
            .populate('articulo')
            .exec((err, facturas) => {
                if (err) {
                    reject('Error al cargar facturas', err);
                } else {
                    resolve(facturas);
                }
            });
    });
}

module.exports = app;