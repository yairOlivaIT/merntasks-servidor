const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')
// Crea una nueva tarea
exports.crearTarea = async (req , res) => {

    //Revisar si hay errores
    const errores = validationResult(req); // si hay algun error lo retorna como un arreglo
    if(!errores.isEmpty()){
        // si tiene algun error entonces retorna
        return res.status(400).json({ errores: errores.array() });
    }

   

    try {
         //extraer el proyecto y comprobar que existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
    
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
            //401 con algo esta prohibido
        }
        //Creamos la tarea
        const tarea = new Tarea(req.body);
        //guarda la tarea
        await tarea.save();
        res.json(tarea);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');    
    }
}

// Obtiene las tareas por proyectos
exports.obtenerTareas = async (req,res) => {
    
    try {
        
        //extraer el proyecto
        const { proyecto } = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg : 'No autorizado'});
        }

        // obtener las tareas por proyectos
        const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json({ tareas });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarTarea = async (req,res) => {
    //   //Revisar si hay errores
    //   const errores = validationResult(req); // si hay algun error lo retorna como un arreglo
    //   if(!errores.isEmpty()){
    //       // si tiene algun error entonces retorna
    //       return res.status(400).json({ errores: errores.array() });
    //   }
  
      try {
        //extraer el proyecto
        const { proyecto, nombre, estado } = req.body;

        //Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg : 'Tarea no encontrada'});
        }
        //Extraer Proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
      
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg : 'No autorizado'});
        }

        //Crear un objeto con la nueva informacion
        const nuevaTarea = {}; // este va hacer que la nueva tarea  va reescribir el anterior
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        
        //actualizar
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id },  nuevaTarea , {new: true });
  
        res.json({tarea});

      } catch (error) {
          console.log(error);
          res.status(500).send('Error en el servidor');
      }
}

exports.eliminarTarea = async (req,res) => {
   try {
       //extraer el proyecto
       const { proyecto } = req.query;
        //Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg : 'Tarea no encontrada'});
        }
        //Extraer Proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
    
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg : 'No autorizado'});
        }

        await Tarea.findOneAndRemove({_id: req.params.id});

        res.json({msg: 'Tarea Eliminada'});
   } catch (error) {
       console.log(error);
       res.status(500).send('Hubo un error');       
   }
}