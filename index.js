const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor

const app = express();


//Conectar a la base de datos
conectarDB();


//Habilitar cors
app.use(cors());
// Habiliar express.json
// nos va a permitir leer datos que el usuario coloque
app.use(express.json({ extended : true }));

// puerto de la app , si no eiste PORT le asigna el puerto 4000
const port = process.env.PORT || 4000; 


// Importar rutas
app.use('/api/usuarios' , require('./routes/usuarios'));
app.use('/api/auth' , require('./routes/auth'));
app.use('/api/proyectos' , require('./routes/proyectos'));
app.use('/api/tareas' , require('./routes/tareas'));



// arrancar la app
app.listen(port , '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});

