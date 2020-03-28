// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');
// Crea un usuario
//api /usuarios
router.post('/',
//aqui agregamos todas nuestras reglas de validadcion
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),// aqui revisa que el nombre no este vacio
        check('email', 'Agrega un email válido').isEmail(),//revisa que tenga un '@' y un dominio valido
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6}) 
    ],
    usuarioController.crearUsuario
);

module.exports = router;