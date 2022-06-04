import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementList, getCurrentTurnElement, getCellElementAtIdx, getGameStatusElement, getReplayButtonElement, getCellListElement} from "./selectors.js";
import { checkGameStatus } from "./utils.js";


// global variables
let currentTurn = TURN.CROSS; // ban đầu là X
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill('');

function toogleTurn() {
    // toogle turn
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

    // update turn on DOM element
    const currentTurnElement = getCurrentTurnElement();
    if(currentTurnElement){
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
}

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;

    const gameStatusElement = getGameStatusElement();

    if(gameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.add('show');
}

function hideReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.remove('show');
}

function hightlightWinCells(winPositions) {
    if (!Array.isArray(winPositions) || winPositions.length !== 3) {
        throw new Error('Invalid Winpositions');
    }

    for (const position of winPositions){
        const cell = getCellElementAtIdx(position); // lấy thẻ li
        if (cell) cell.classList.add('win'); // hightlight lên
    }
}

function handleCellClick(cell, index) {
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    const isEndGame = gameStatus !== GAME_STATUS.PLAYING; // đã end game
    if (isClicked || isEndGame) return; // không cho click nữa
    
    // set selected cell
    cell.classList.add(currentTurn);

    // update cellValues
    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    // toogle turn 
    toogleTurn();

    // check game status
    const game = checkGameStatus(cellValues);

    switch(game.status) {
        case GAME_STATUS.ENDED: {
            // update game status
            updateGameStatus(game.status);
            // show replay button
            showReplayButton();
            break;
        }
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
            // update game status
            updateGameStatus(game.status);
            // show replay button
            showReplayButton();
            // hightlight win cells
            hightlightWinCells(game.winPositions);
            break;
        }

        default: // playing

    }
}

function initCellElementList() {
    // set index for each li element
    const liList = getCellElementList();
    liList.forEach((cell, index) => {
        cell.dataset.idx = index; // thêm thuộc tính cho li
    })

    // attach event click for ul element
    const ulElement = getCellListElement();
    if (ulElement) {
        ulElement.addEventListener('click', (event) => {
            if(event.target.tagName !== 'LI') return;
            
            const index = Number.parseInt(event.target.dataset.idx); // chuyển chuỗi thành số
            handleCellClick(event.target, index); // event.target tức là thẻ li được click
        })
    }
}

function resetGame() {
    // reset temp global variables
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => ''); // biến phần tử hiện tại thành rỗng

    // reset dom elements
    // reset game status
    updateGameStatus(GAME_STATUS.PLAYING);

    // reset current turn
    const currentTurnElement = getCurrentTurnElement();
    if(currentTurnElement){
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }

    // reset game board
    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        // cellElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        cellElement.className = '';
    }

    // hide replay button
    hideReplayButton();
}

function initReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) {
        replayButton.addEventListener('click',resetGame);
    }
}

(() => {
    // bind click event for all li elements
    initCellElementList()

    // bind click event for replay button
    initReplayButton();
})();