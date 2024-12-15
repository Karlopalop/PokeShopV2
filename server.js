const express = require('express');
const path = require('path');
const jsonServer = require('json-server');

const app = express();
const jsonServerRouter = jsonServer.create();
const jsonServerMiddlewares = jsonServer.defaults();
const jsonRouter = jsonServer.router('mock-api-data.json');

jsonServerRouter.use(jsonServerMiddlewares);
jsonServerRouter.use(jsonRouter);

app.use(express.static('./dist/pokeshop'));
app.use('/api', jsonServerRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/pokeshop/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});