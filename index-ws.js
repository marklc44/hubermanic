const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app)
server.listen(3000, function() { console.log('Server started on port 3000') });

/** Begin websockets */
const WebSocketServer = require('ws').Server;

// attach websocket to the existing server
const wss = new WebSocketServer({server: server});

// when there's a connection, so some stuff based on the state of the connection
// open, close, error states
// broadcast is a custom function added to the websocket server to write to all connected clients
// added directly to the server oject as a property instead of to the prototype
// because there will only ever be one instance of this object, so no need to share
// methods from the prototype
wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size;
    console.log('Clients connected: ', numClients);

    wss.broadcast(`Current visitors ${numClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server');
    }

    ws.on('close', function close() {
        wss.broadcast(`A client has disconnected`);
        console.log('A client has disconnected');
    });
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
}