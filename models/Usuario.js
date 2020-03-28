//creamos el modelo, va a darle la estructura que tiene la base de datos, en mongodb se conoce como colecciones
const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    nombre : {
        type : String,
        required : true,
        trim: true
    },
    email:{
        type : String,
        required : true,
        trim: true, // para que no se guarde con espacio
        unique: true  // para que sea unico
    },
    password:{
        type : String,
        required : true,
        trim: true
    },
    registro:{
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Usuario' , UsuariosSchema); // le decimos a mongoose que vamos a registar el modelo usuario con el esquema usuarios 