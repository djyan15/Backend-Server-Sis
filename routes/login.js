// Requires  --Importacion de librerias
var express = require('express');

// Importar el by cryte
var bcrypt = require('bcryptjs');

// Inicializar variables -- aqui se usan las libnrerias
var app = express();

var SEED = require('../config/config').SEED;
//importar jwt
var jwt = require('jsonwebtoken');
// importar el esquema de la base de datos
var Usuario = require('../models/usuario');


app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err

            });
        }
        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err,
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err,
            });
        }
        //Creacion de token!!!
        usuarioDb.password = ':)';
        var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 }); // 4 horas


        res
            .status(200)
            .json({
                ok: true,
                usuario: usuarioDb,
                token: token,
                id: usuarioDb._id,
                menu: obtenerMenu(usuarioDb.role),
            });
    });


});

function obtenerMenu(ROLE) {

    var menu = [{
            titulo: 'Menu',
            icono: 'mdi mdi-menu',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard', icono: 'mdi mdi-view-dashboard' },
                // { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Gráficas', url: '/graficas1', icono: 'mdi mdi-chart-bar' },
                // { titulo: 'Promesas', url: '/promesas' },
                // { titulo: 'rxjs', url: '/rxjs' },
            ],
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-settings-box',
            submenu: [
                { titulo: 'Articulos', url: '/articulos', icono: 'mdi mdi-archive' },
                // { titulo: 'Usuarios', url: '/usuarios', icono: 'mdi mdi-account-box' },
                // { titulo: 'Condiciones de Pagos', url: '/pagos', icono: 'mdi mdi-account-card-details' },
                // { titulo: 'Clientes', url: '/clientes', icono: 'mdi mdi-account-circle' },
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios', icono: 'mdi mdi-account-box' }, { titulo: 'Condiciones de Pagos', url: '/pagos', icono: 'mdi mdi-account-card-details' }, { titulo: 'Clientes', url: '/clientes', icono: 'mdi mdi-account-circle' });
        // return menu;

    }
    // 

    return menu;
}
module.exports = app;