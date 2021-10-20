// the parts of the game
var p1;
var p2;
var board;
var score;

//set up the game, it launches everything
window.onload = setUp;

//setting up the game
function setUp() {
    p1 = new Player("O", true);
    p2 = new Player("X");
    score = new Score(); 
    board = new GameBoard(p1, p2, score);
    makeCellsClickable();
}

//make the table cells clickable
function makeCellsClickable() {
    var cells = document.querySelectorAll(".cellData");
    for(let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", addLetter);
    }
}

//make the tablecells not clickable
function disabledCells() {
    var cells = document.querySelectorAll(".cellData");
    for(let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", addLetter);
    }
}

//showing the results either winner, loser, or tie
function updateResults(winner, loser, result) {
    var resultsMessage = document.getElementById("results");
    if(result === "winner") {
        resultsMessage.innerHTML = winner + " has won the game " + loser + " has lost the game ";
    } else if (result === "tie") {
        resultsMessage.innerHTML = winner + " has tie the game. ";
    }
}

//manipulate the board to be cleared
function reset() {
    var cells = document.querySelectorAll(".cellData");
    for(let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
    }
}

//letting the turn message to appear. In other words, letting who's turn it is.
function updateTurnMessage(name) {
    var turnMessage = document.getElementById("currentTurn");
    turnMessage.innerHTML = name + " turn";
}
//clicking on the cell
function addLetter() {
    var cell = this;
    var isP1Turn = p1.turn;
    var hasWinner = false; //setting the variables
    var hasTie = false;
    if(this.innerText === "" || this.innerText === null) { //checking to see if it's empty
        var position = this.getAttribute("id"); //position of the square to tile
        if(isP1Turn == true) { //player 1 turns
            updateTurnMessage(p1.name); //making the messsage to let either the X or the O to go next after the player 1
            this.innerText = p1.name; //getting the player letter
            board.updateGameState(p1.name, position); //updating the list to see the results later
            hasWinner = board.checkWinner(p1.name); //inspect to see if there's a winner
            hasTie = board.checkTie(); //inspecting to see if there's a tie
        }
        //it's player 2 turn!
        else {
            updateTurnMessage(p2.name);
            this.innerText = p2.name;
            board.updateGameState(p2.name, position);
            hasWinner = board.checkWinner(p2.name); //inspect to see if there's a winner for player 2
            hasTie = board.checkTie(); //inspect to see if there's a tie
        }
        //there's a winner
        if(hasWinner == true) {
            alert(score.previousWinner + " has won the game");
            updateResults(score.previousWinner, score.previousLoser, "winner");
            disabledCells();
        }
        //there's a tie
        if(hasTie == true && hasWinner == false) {
            alert(score.previousTies + " has tie the game!");
            updateResults(score.previousTies, score.previousTies, "tie");
            disabledCells();
        }
        //changing turns
        p1.updateTurn();
        p2.updateTurn();
    }
}

//a class shows all the concepts of the players and the results too
class Player {
    constructor (name, turn = false, wins = 0, losses = 0, ties = 0) {
        this.name = name;
        this.turn = turn;
        this.wins = wins;
        this.losses = losses;
        this.ties = ties;
    }

    //updating changing the turns
    updateTurn() {
        this.turn = !this.turn;
    }
    
    //updating changing the wins
    updateWins() {
        this.wins = 1+this.wins;
    }
    
    //updating changing the loses
    updateLosses() {
        this.losses = 1+this.losses;
    }

    //updating changing the ties
    updateTies() {
        this.ties = 1+this.ties;
    }
}

//a class shows all the concepts of the gameboard along with the scoreboard and the positions on Tic-Tac-Toe
class GameBoard {
    constructor (playerOne, playerTwo, score, gameState = ["", "", "", "", "", "", "", "", ""]) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.score = score;
        this.gameState = gameState;
    }

    //updating when a player click on the letter space
    updateGameState(letter, position) {
        this.gameState[position] = letter;
    }

    //checking if the difference of one condition
    checkWinner(letter) {
        var hasWinner = false;
        if (this.gameState[0] === letter && this.gameState[1] === letter && this.gameState[2] === letter) {
            hasWinner = true;
        } else if (this.gameState[0] === letter && this.gameState[3] === letter && this.gameState[6] === letter) {
            hasWinner = true;
        } else if (this.gameState[0] === letter && this.gameState[4] === letter && this.gameState[8] === letter) {
            hasWinner = true;
        } else if (this.gameState[1] === letter && this.gameState[4] === letter && this.gameState[7] === letter) {
            hasWinner = true;
        } else if (this.gameState[3] === letter && this.gameState[4] === letter && this.gameState[5] === letter) {
            hasWinner = true;
        } else if (this.gameState[2] === letter && this.gameState[5] === letter && this.gameState[8] === letter) {
            hasWinner = true; 
        } else if (this.gameState[2] === letter && this.gameState[4] === letter && this.gameState[6] === letter) {
            hasWinner = true;
        } else if (this.gameState[6] === letter && this.gameState[7] === letter && this.gameState[8] === letter) {
            hasWinner = true;
        }

        //updating the result statuses
        if(hasWinner == true) {
            if(letter === p1.name) {
                this.score.updatePreviousWinner(p1.name);
                this.score.updatePreviousLoser(p2.name);
                p1.updateWins();
                p2.updateLosses();
            } else {
                p1.updateLosses();
                p2.updateWins();
                this.score.updatePreviousWinner(p2.name);
                this.score.updatePreviousLoser(p1.name);
            }
        }
        
        return hasWinner; //shows if there's a sign of a winner
    }

    //check to see if there's a tie
    checkTie() {
        var hasTie = false;
        if(!this.gameState.includes("")) {
            hasTie = true;  
            this.score.updatePreviousTies(p1.name + " " + p2.name);
            p1.updateTies();
            p2.updateTies();
        }

        return hasTie; //shows if there's a sign of a tie
    }

}

//a class shows all the concepts of the scoreboard that is being subsquentially by class Game Board. Holds the previous game results.
class Score {
    constructor (previousWinner = "", previousLoser = "", previousTies = "") {
        this.previousWinner = previousWinner;
        this.previousLoser = previousLoser;
        this.previousTies = previousTies;
    }

    //updating the previous winner
    updatePreviousWinner(champion) {
        this.previousWinner = champion;
    }

    //updating the previous loser
    updatePreviousLoser(shamers) {
        this.previousLoser = shamers;
    }

    //updating the previous tie
    updatePreviousTies(ties) {
        this.previousTies = ties;
    }

}