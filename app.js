// Requires  --Importacion de librerias
var express = require('express');
var bodyParser = require('body-parser');

// Establecer la libreria para la conexion con mongoose
var mongoose = require('mongoose');


// Inicializar variables -- aqui se usan las libnrerias

var app = express();
// COrs 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();

});

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Importar rutas
var uploadRoutes = require('./routes/upload');
var appRoutes = require('./routes/app');
var imagenesRoutes = require('./routes/imagenes');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var articuloRoutes = require('./routes/articulo');
var clienteRoutes = require('./routes/cliente');
var busquedaRoutes = require('./routes/busqueda');
var pagosRoutes = require('./routes/pagos');
var facturacionRoutes = require('./routes/facturacion');
// Conexion a la base de datos Y si no esta la crea

mongoose.connection.openUri('mongodb://localhost:27017/SistFacturacion', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');


});







//Rutas req = requires res= response next para que continue a la otra instruccion.

app.use('/usuario', usuarioRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/pagos', pagosRoutes);
app.use('/facturacion', facturacionRoutes);
app.use('/articulo', articuloRoutes);
app.use('/img', imagenesRoutes);
app.use('/cliente', clienteRoutes);
app.use('/upload', uploadRoutes);
app.use('/login', loginRoutes);


app.use('/', appRoutes);






// Escuchar peticiones
//primero el nombre del archivo luego listen, luego el puerto y si queremos que muestre un mensaje lo otro
app.listen(4000, () => {
    console.log('Express server puerto 4000: \x1b[32m%s\x1b[0m', 'online');

});