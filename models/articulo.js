var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var estadosValidos = {
    values: ['Activo', 'Inactivo'],
    message: '{VALUE} no es un estado permitido',
};


var articuloSchema = new Schema({
    descripcion: { type: String, required: [true, 'La descripcion del articulo es necesaria'] },
    precio: { type: Number, required: [true, 'El precio es necesario'] },
    img: { type: String, required: false },
    estado: { type: String, required: [true, 'El estado es necesario'], enum: estadosValidos },

    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
});


module.exports = mongoose.model('Articulo', articuloSchema);