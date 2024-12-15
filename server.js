const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('api/mock-api-data.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(process.env.PORT || 3000, () => {
  console.log('JSON Server is running');
});