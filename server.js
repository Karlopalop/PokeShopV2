const express = require('express');
const path = require('path');
const jsonServer = require('json-server');

const app = express();

// Servir Angular desde el directorio de construcción
app.use(express.static(__dirname + '/dist/pokeshop'));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/pokeshop/index.html'));
});

// Configurar y servir `json-server`
const router = jsonServer.router('mock-api-data.json');
const middlewares = jsonServer.defaults();
const jsonPort = process.env.JSON_PORT || 3001; // Puerto para json-server
app.use('/api', middlewares, router); // Sirviendo datos JSON en /api
router.listen(jsonPort, () => {
  console.log(`JSON Server running on port ${jsonPort}`);
});

// Configurar el puerto de la aplicación principal
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Servidor Angular corriendo en el puerto ${port}`);
});
