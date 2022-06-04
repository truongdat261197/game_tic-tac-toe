// get cell list
export function getCellElementList() {
    return document.querySelectorAll('#cellList > li');
}

// get current turn 
export function getCurrentTurnElement() {
    return document.getElementById('currentTurn');
}

// get cell at index
export function getCellElementAtIdx(index) {
    return document.querySelector(`#cellList > li:nth-child(${index + 1})`);
}

// get game status
export function getGameStatusElement() {
    return document.getElementById('gameStatus');
}

// get replay game
export function getReplayButtonElement() {
    return document.getElementById('replayGame');
}

// get cell list element
export function getCellListElement() {
    return document.getElementById('cellList');
}
