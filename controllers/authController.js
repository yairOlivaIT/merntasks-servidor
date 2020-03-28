const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
//LAS REGLAS VAN EN EL ROUTING PERO EL RESULTADO SE LEE EN EL CONTROLADOR
//vamos a importar el resultado de la validadcion que hicimos en routes usuario
const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req ,res) => {
    //Revisar si hay errores
    const errores = validationResult(req); // si hay algun error lo retorna como un arreglo
    if(!errores.isEmpty()){
        // si tiene algun error entonces retorna
        return res.status(400).json({ errores: errores.array() });
    }

    // extraer el email y el password
    const { email , password } = req.body;

    try {
        //revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if(!usuario){
            return res.status(400).json({ msg : 'El usuario no existe'});
        }

        //Revisar su password
        const passCorrecto = await bcryptjs.compare(password , usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg : 'Password Incorrecto'})
        }

        // si todo es correcto Crear y firma el jsonwebtoken
        const payload = {
            usuario:{
                id: usuario.id
            }
        };

        //Firma el jsonwebtoken
        jwt.sign(payload, process.env.SECRETA,{
            //aqui le pasamo que este token va a expirar en una hora
            expiresIn: 3600 
        }, (error,token) => {
            if(error) throw error;

            // mensaje de confirmacion
            res.json({ token });
        });


    } catch (error) {
        console.log(error);
    }
}

//Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req,res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');//con el select le decimos que el password no lo queremos que lo traiga
        res.json({usuario});
    } catch (error) { 
        console.log(error);
        res.status(500).json({msg : 'Hubo un error'});
    }
}