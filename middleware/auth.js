const jwt = require('jsonwebtoken');
//tenemos que enviar el token y validarlo si pertenece a este proyecto

module.exports = function(req,res,next){
    // Leer el token del header
    const token = req.header('x-auth-token');

    // Revisar si no hay token
    if(!token){
        return res.status(401).json({msg: 'No hay Token, permiso no válido'});
    }

    // validar el token
    try {
        const cifrado = jwt.verify(token,process.env.SECRETA);//verify nos permite verificar el token,verificamos el token y pasamos el segundo parametro que es la palabra secreta que esta en variables envirioment
        req.usuario = cifrado.usuario;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Token no válido'});
    }

}