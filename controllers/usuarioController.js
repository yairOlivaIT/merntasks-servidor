const Usuario = require('../models/Usuario');
const bcryptjs = require('bcrypt');
//LAS REGLAS VAN EN EL ROUTING PERO EL RESULTADO SE LEE EN EL CONTROLADOR
//vamos a importar el resultado de la validadcion que hicimos en routes usuario
const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req ,res) => {
    //Revisar si hay errores
    const errores = validationResult(req); // si hay algun error lo retorna como un arreglo
    if(!errores.isEmpty()){
        // si tiene algun error entonces retorna
        return res.status(400).json({ errores: errores.array() });
    }

    // extraer email y password
    const { email , password } = req.body;

    try {
        //Revisar  que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });// si hay un usuario que tenga este email lo va retornar
        //si el usuario ya existe retorna error
        if(usuario){
            return res.status(400).json({ msg : 'El usuario ya existe'})
        }


        // crear el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        // un salt crea un hash unico
        const salt = await bcryptjs.genSalt(10);
        //reescribe el password ya hasheado
        usuario.password = await bcryptjs.hash(password,salt);


        //guarda el nuevo usuario
        await usuario.save();

        //Crear y firma el jsonwebtoken
        const payload = {
            usuario:{
                id: usuario.id
            }
        };

        //Firma el jsonwebtoken
        jwt.sign(payload, process.env.SECRETA,{
            //aqui le pasamo que este token va a expirar en una hora
            expiresIn: 360000 
        }, (error,token) => {
            if(error) throw error;

            // mensaje de confirmacion
            res.json({ token });
        });




        
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}