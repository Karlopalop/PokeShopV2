const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

// Crear un servidor Express
const app = express();

// Configurar JSON Server
const apiServer = jsonServer.create();
const router = jsonServer.router('mock-api-data.json');
const middlewares = jsonServer.defaults();

apiServer.use(middlewares);
apiServer.use(router);

// Servir los archivos estáticos de Angular
app.use(express.static(__dirname + '/dist/pokeshop'));

// Redirigir todas las rutas al index.html de Angular
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/pokeshop/index.html'));
});

// Inicia el servidor de JSON en una ruta específica
app.use('/api', apiServer);

// Inicia el servidor principal en el puerto especificado por Heroku o en el puerto 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
