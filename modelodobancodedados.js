const mongoose = require('mongoose');

const usuarioRifa = mongoose.Schema({
    nome: { type: String },
    codigo: { type: String },
    pago: { type: String }
    }, { versionKey: false });
module.exports.usuarioRifa = mongoose.model('usuarioRifa', usuarioRifa);