const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');
// Crea proyectos
//api /proyectos
router.post('/',
    auth,
    [
        check('nombre','El nombre de proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
)

//obtener todos ls proyectos
router.get('/',
    auth,

    proyectoController.obtenerProyectos
)

//actualizar prouyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre','El nombre de proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//actualizar prouyecto via ID
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);
module.exports = router;