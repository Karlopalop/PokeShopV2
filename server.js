const jsonServer = require('json-server');
const express = require('express');
const path = require('path');

const app = express(); // Usamos app como el servidor principal
const router = jsonServer.router('mock-api-data.json');
const middlewares = jsonServer.defaults();

// Configuración de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Servir la aplicación Angular desde la carpeta "dist"
app.use(express.static(path.join(__dirname, 'dist/pokeshop')));

// JSON Server como middleware en "/api"
app.use('/api', middlewares, router);

// Redirigir todas las rutas al index.html de Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/pokeshop/index.html'));
});

// Puerto configurado por Heroku o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Escucha del servidor principal
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
