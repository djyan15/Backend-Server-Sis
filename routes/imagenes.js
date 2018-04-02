// Requires  --Importacion de librerias
var express = require('express');

// Inicializar variables -- aqui se usan las libnrerias


var app = express();

var fs = require('fs');
//Rutas req = requires res= response next para que continue a la otra instruccion.

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = `./uploads/${ tipo }/${ img }`;

    fs.exists(path, existe => {
        if (!existe) {
            path = './assets/img6.jpg';
        }
        res.sendfile(path);

    });


});

module.exports = app;