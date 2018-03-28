var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var articuloSchema = new Schema({
    descripcion: { type: String, required: [true, 'La descripcion del articulo es necesaria'] },
    precio: { type: Number, required: [true, 'El precio es necesario'] },

    estado: { type: String, required: [true, 'El estado es necesario'] },

    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
});


module.exports = mongoose.model('Articulo', articuloSchema);