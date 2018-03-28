// Requires  --Importacion de librerias
var express = require('express');

// Inicializar variables -- aqui se usan las libnrerias

var app = express();
var Articulo = require('../models/articulo');

//Rutas req = requires res= response next para que continue a la otra instruccion.

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    buscarArticulos(busqueda, regex).then(articulo => {

        res.status(200).json({
            ok: true,
            articulo: articulo
        });
    });

});

function buscarArticulos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Articulo.find({ descripcion: regex }, (err, articulo) => {
            if (err) {

                reject('Error al cargar articulo', err);
            } else {
                resolve(articulo);
            }

        });


    });



}


module.exports = app;