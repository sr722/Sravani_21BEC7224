// Establish WebSocket connection
const socket = new WebSocket('ws://localhost:8080');

// WebSocket Event Handlers
socket.onopen = () => {
    console.log('Connected to the server');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle game state update and render it on the board
    console.log(data);
    updateGameBoard(data);
};

socket.onclose = () => {
    console.log('Disconnected from the server');
};

socket.onerror = (error) => {
    console.error('WebSocket Error: ', error);
};

// Function to send move command to the server
function sendMove(character, position) {
    const move = { character, ...position };
    socket.send(JSON.stringify(move));
}

// Function to update game board based on server data
function updateGameBoard(data) {
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = ''; // Clear previous board

    data.board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            if (cell) {
                cellElement.textContent = cell; // Display character
            }
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;
            boardElement.appendChild(cellElement);
        });
    });
}

// Variable to track the selected character
let selectedCharacter = null;

// Handle user clicks on the game board
document.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('cell')) {
        const row = target.dataset.row;
        const col = target.dataset.col;

        if (selectedCharacter) {
            // Make a move
            const position = { row, col };
            sendMove(selectedCharacter, position);
            selectedCharacter = null; // Deselect character after moving
            // Optionally clear highlighting or update UI
        } else {
            // Select a character (example logic)
            selectedCharacter = `Character at row ${row}, col ${col}`;
            console.log(`Selected character: ${selectedCharacter}`);
            // Highlight the selected character or show possible moves
            highlightSelectedCell(row, col); // Custom function to handle UI updates
        }
    }
});

// Function to highlight the selected cell
function highlightSelectedCell(row, col) {
    const boardElement = document.getElementById('game-board');
    const cells = boardElement.getElementsByClassName('cell');
    
    Array.from(cells).forEach(cell => {
        cell.classList.remove('highlight'); // Remove previous highlights
    });
    
    // Find the selected cell and add a highlight class
    const selectedCell = Array.from(cells).find(cell =>
        cell.dataset.row === row && cell.dataset.col === col
    );
    
    if (selectedCell) {
        selectedCell.classList.add('highlight');
    }
}
