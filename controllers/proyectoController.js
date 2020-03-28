const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req,res) => {

    //Revisar si hay errores
    const errores = validationResult(req); // si hay algun error lo retorna como un arreglo
    if(!errores.isEmpty()){
        // si tiene algun error entonces retorna
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guarda el creador via jsonwebtoken 
        proyecto.creador = req.usuario.id;

        // guardamos el proyecto
        proyecto.save();
        res.json(proyecto);   
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtiene todos los proyectos del usuario actual

exports.obtenerProyectos = async (req ,res)=>{
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado:-1 }); // lo que esta haciendo el sort es que me ordena o me los devuelve con los proyectos creados ultimos en primer lugar
        res.json({ proyectos });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}


// Actualiza un proyecto

exports.actualizarProyecto = async (req , res) => {

    //Revisar si hay errores
    const errores = validationResult(req); // si hay algun error lo retorna como un arreglo
    if(!errores.isEmpty()){
        // si tiene algun error entonces retorna
        return res.status(400).json({ errores: errores.array() });
    }

    //extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {}; // este va hacer que el nuevo proyecto que va reescribir el anterior
    
    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar el id
        let proyecto = await Proyecto.findById(req.params.id);
        //Si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg : 'Proyecto no encontrado'});
        }
        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
            //401 con algo esta prohibido
        }
        //actualizar
        proyecto = await Proyecto.findOneAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, {new: true });

        res.json({proyecto});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//eliminar un proyecto por su id
exports.eliminarProyecto = async (req,res) => {
    try {
        //Revisar el id
        let proyecto = await Proyecto.findById(req.params.id);
        //Si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg : 'Proyecto no encontrado'});
        }
        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
            //401 con algo esta prohibido
        }
        
        await Tarea.deleteMany({ proyecto : req.params.id});
        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id}) // pasa que en mongoo pone _id por eso el id asi
        
        res.json({msg : 'Proyecto eliminado'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}