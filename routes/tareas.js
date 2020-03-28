const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// crea una tarea
// api/tareas
router.post('/',
    auth,
    [
        check('nombre','El Nombre es obligatorio').not().isEmpty(),
        check('proyecto','El Proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// obtener las tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//actualizar tarea via ID
router.put('/:id',
    auth,
    [
        check('nombre','El nombre de la tarea es obligatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
);

//eliminar tarea via ID
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;