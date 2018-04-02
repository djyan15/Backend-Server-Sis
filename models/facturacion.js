var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estadosValidos = {
    values: ['Pagada', 'Pendiente'],
    message: '{VALUE} no es un estado permitido'

}



var facturacionSchema = new Schema({
    pago: { type: Schema.Types.ObjectId, ref: 'Pagos' },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
    fecha: { type: Date, required: [true, 'La fecha debe ser suministrada'] },
    comentario: { type: String, required: false },
    articulo: { type: Schema.Types.ObjectId, ref: 'Articulo' },
    cantidad: { type: Number, required: [true, 'La cantidad debe ser especificada'] },
    precio: { type: Number, required: [true, 'El precio es necesario'] },
    comision: { type: Number, required: [true, 'El porciento de comision debe ser suministrado'] },
    estado: { type: String, required: [true, 'El estado es necesario'], enum: estadosValidos },

    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
});

module.exports = mongoose.model('Facturacion', facturacionSchema);