//importar mongoose

var mongoose = require('mongoose');

// importar validacion de unique
var uniqueValidator = require('mongoose-unique-validator');
// definir esquema se puede llamar la funcion directamente

// ROLES validos
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE}  no es un rol permitido'

};


var Schema = mongoose.Schema;


var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }

});
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);