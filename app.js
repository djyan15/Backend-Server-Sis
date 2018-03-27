// Requires  --Importacion de librerias
var express = require('express');

// Establecer la libreria para la conexion con mongoose
var mongoose = require('mongoose');


// Inicializar variables -- aqui se usan las libnrerias

var app = express();


// Conexion a la base de datos Y si no esta la crea

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');


});

//Rutas req = requires res= response next para que continue a la otra instruccion.

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});




// Escuchar peticiones
//primero el nombre del archivo luego listen, luego el puerto y si queremos que muestre un mensaje lo otro
app.listen(4000, () => {
    console.log('Express server puerto 4000: \x1b[32m%s\x1b[0m', 'online');

});