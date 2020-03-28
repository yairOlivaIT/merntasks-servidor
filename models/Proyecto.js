const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId, //de esta forma cada usuario tiene su propio id
        ref: 'Usuario' //con esto hacemos la referencia del id de arriba de donde lo tomamos de usuario que creamos antes en el Schema
    },
    creado:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Proyecto',ProyectoSchema);
