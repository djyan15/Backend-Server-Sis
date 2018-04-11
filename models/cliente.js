var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var estadosValidos = {
    values: ['Activo', 'Inactivo'],
    message: '{VALUE} no es un estado permitido',
};

var uniqueValidator = require('mongoose-unique-validator');

var clienteSchema = new Schema({
    nombreComercial: { type: String, required: [true, 'El Nombre Comercial o Razón Social es necesario'] },
    cedula: { type: String, unique: true, required: [true, 'La cédula o RNC es necesaria'] },
    cuenta: { type: String, unique: true, required: [true, 'La cuenta debe ser suministrada'] },
    estado: { type: String, required: [true, 'El estado es necesario'], enum: estadosValidos },

    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
});

clienteSchema.plugin(uniqueValidator, { message: 'Existe un cliente con esa {PATH} ' });
module.exports = mongoose.model('Cliente', clienteSchema);