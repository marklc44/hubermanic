const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app)
server.listen(3000, function() { console.log('Server started on port 3000') });
process.on('SIGINT', () => {
    wss.clients.forEach(function each(client) {
        client.close();
    });
    console.log('before server close')
    server.close(() => {
        console.log('before shutdown db')
        shutdownDB();
    });
});

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

    db.run(`INSERT INTO visitors (count, time)
        VALUES (${numClients}, datetime('now'))
    `);

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

/** End websockets */
/** Begin database */
// sqlite doesn't require a separate db server
// just an npm package
// in memory means the db will be destroyed when the server is restarted
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )
    `);
});

// never run sql directly, only with prepared statements or functions like this
function getCounts() {
    db.each('SELECT * FROM visitors', (err, row) => {
        console.log(row)
    });
}

function shutdownDB() {
    console.log('before get counts')
    getCounts();
    console.log('Shutting down db');
    db.close();
}