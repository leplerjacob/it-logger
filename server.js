const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const path = require('path')
const port = process.env.PORT || 5000;


server.use(router);
server.listen(port);

if(process.env.NODE_ENV === 'production') {

    server.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'public', 'index.html')));

}

