// Display Conroller
const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector('#message').innerHTML = message;
    }
    return { renderMessage }
})();
// Gameboard
const Gameboard = (() => {
    let gameboard = ['', '', '', '', '', '', '', '', ''];

    // render 
    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            const className = square === "X" ? "x" : square === "O" ? "o" : "";
            boardHTML += `<div class="cell ${className}" id="square-${index}">${square}</div>`
        });
        document.querySelector('#gameboard').innerHTML = boardHTML;

        // squares
        const squares = document.querySelectorAll('.cell');
        squares.forEach((square) => {
            square.addEventListener('click', Game.handleClick);
        })
    }

    // Get Gameboard 
    const getGameboard = () => gameboard;

    // Update
    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    return {
        render,
        getGameboard,
        update
    }
})();

// Create Player Constructor
const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}
// GAME Start
const Game = (() => {
    let players = [];
    let currPlayerIndex = 0;
    let gameOver;
    // start
    const start = () => {
        players = [
            createPlayer(document.querySelector('#player1').value, "X"),
            createPlayer(document.querySelector('#player2').value, "O")
        ]
        currPlayerIndex = 0;
        gameOver = false;

        // Render Gameboard
        Gameboard.render();

        // Click squares
        // const squares = document.querySelectorAll('.cell');
        // squares.forEach((square) => {
        //     square.addEventListener('click', handleClick);
        // })
    }

    // Handle Click
    const handleClick = (e) => {
        if (gameOver) {
            return;
        }
        let index = parseInt(e.target.id.split("-")[1]);

        if(Gameboard.getGameboard()[index] !== "")
            return;
        Gameboard.update(index, players[currPlayerIndex].mark);

        if(checkForWin(Gameboard.getGameboard(), players[currPlayerIndex].mark)){
            gameOver = true;
            displayController.renderMessage(`${players[currPlayerIndex].name} Won!`);
        } else if (checkForTie(Gameboard.getGameboard())){
            gameOver = true;
            displayController.renderMessage(`It's a Tie!`);
        }

        currPlayerIndex = currPlayerIndex === 0 ? 1 : 0;


    }
    // restart
    const restart = () => {
        for(let i = 0; i < 9; i++){
            Gameboard.update(i, "")
        }
        Gameboard.render();
        document.querySelector('#message').innerHTML = "";
        gameOver = false;
    }

    return {
        start,
        handleClick,
        restart
    }
})();

function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [1, 4, 7],
        [0, 3, 6],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for(let i = 0; i < winningCombinations.length; i++){
        const [a, b, c] = winningCombinations[i];
        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            return true;
        }
    }
    return false;
}
function checkForTie(board) {
    return board.every(cell => cell !== "")
}

// restart Button
const restartBtn = document.querySelector('#restart');
    restartBtn.addEventListener('click', () => {
        Game.restart();
    })


const startBtn = document.querySelector('#start');
startBtn.addEventListener('click', () => {
    Game.start();
})