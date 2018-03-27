// Requires  --Importacion de librerias
var express = require('express');




// Inicializar variables -- aqui se usan las libnrerias

var app = express();



//Rutas req = requires res= response next para que continue a la otra instruccion.


app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente',
    });
});

module.exports = app;