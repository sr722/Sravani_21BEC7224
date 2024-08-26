const WebSocket = require('ws');
const Game = require('./gameLogic'); // Import game logic
const server = new WebSocket.Server({ port: 8080 });

let clients = [];
let game = new Game(); // Initialize game instance

server.on('connection', (ws) => {
    console.log('New client connected');
    clients.push(ws);
    ws.on('message', (message) => {
        console.log('Received message:', message);
        const data = JSON.parse(message);
        // Process game move and update game state
        if (data.character && data.direction) {
            game.move(data.character, data.direction);
            const gameState = { board: game.board, turn: game.turn };
            broadcast(gameState);
        }
    });
});

function broadcast(data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

console.log('WebSocket server is running on ws://localhost:8080');
