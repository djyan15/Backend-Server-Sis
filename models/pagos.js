var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var estadosValidos = {
    values: ['Activo', 'Inactivo'],
    message: '{VALUE} no es un estado permitido',
};

var pagosSchema = new Schema({
    descripcion: { type: String, required: [true, 'La descripcion del articulo es necesaria'] },
    cantidadDias: { type: Number, required: [true, 'El tiempo es necesario'] },

    estado: { type: String, required: [true, 'El estado es necesario'], enum: estadosValidos },

    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
});

module.exports = mongoose.model('Pagos', pagosSchema);