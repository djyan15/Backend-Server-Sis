// Requires  --Importacion de librerias
var express = require('express');

var fs = require('fs');


var fileUpload = require('express-fileupload');
//const app = express();

var Usuario = require('../models/usuario');
var Articulo = require('../models/articulo');


var app = express();
// default options
app.use(fileUpload());



//Rutas req = requires res= response next para que continue a la otra instruccion.

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;


    var tiposValidos = ['usuarios', 'articulos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valido',
            errors: { message: 'TTipo de coleccion no valido' },
        });

    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debo seleccionar una imagen' },
        });
    }

    // Obtener nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    // var nombreCortado = 'skasdikaskda';
    var extensionArchivo = nombreCortado[nombreCortado.length - 1]

    // Extensiones validas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        res.status(400)
            .json({
                ok: false,
                mensaje: 'Extension no valida',
                errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') + '' + archivo }
            });
    }
    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // mover el archivo a una direcion

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res
                    .status(400)
                    .json({
                        ok: true,
                        mensaje: 'Usuario no existe',
                        errors: { message: 'Usuario no existe' },
                    });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';

                return res
                    .status(200)
                    .json({
                        ok: true,
                        mensaje: ' de usuario actualizada',
                        usuario: usuarioActualizado,
                    });
            });
        });
    }
    if (tipo === 'articulos') {

        Articulo.findById(id, (err, articulo) => {

            if (!articulo) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        mensaje: 'El articulo no existe',
                        errors: { message: 'Articulo no existe' },
                    });
            }

            var pathViejo = './uploads/articulos/' + articulo.img;
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            articulo.img = nombreArchivo;

            articulo.save((err, articuloAct) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al actualizar imagen',
                        errors: err
                    });
                }

                return res
                    .status(200)
                    .json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        articulo: articuloAct,
                    });
            });
        });

    }


}


module.exports = app;