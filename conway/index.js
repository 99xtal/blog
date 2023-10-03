'use strict';

const GRID_MAX_WIDTH = 600;
const CELL_COLOR = 'black';
const CELL_SIZE = 15;
const LINE_COLOR = 'gray';

let cellMap = {};
let timerId = null;
let running = false;

function resetGameState() {
    const btn = document.getElementById('startstop');
    cellMap = {};
    if (timerId) {
        clearInterval(timerId);
        btn.innerHTML = "Start"
    }
}

function toggleStartStop() {
    running = !running;
    const btn = document.getElementById('startstop');
    if (running) {
        timerId = setInterval(() => {
            cellMap = createNextFrame(cellMap);
        }, 60);
        btn.innerHTML = "Stop"
    } else if (timerId) {
        clearInterval(timerId);
        btn.innerHTML = "Start"
    }
}

function toggleCellState(coordinates) {
    const cellState = cellMap[key(coordinates)];
    if (!cellState) {
        cellMap[key(coordinates)] = true;
    } else {
        cellMap[key(coordinates)] = false;
    }
}

function drawGrid(ctx, options = {
    cellSize: CELL_SIZE,
    lineColor: LINE_COLOR,
}) {
    const canvasHeight = ctx.canvas.height;
    const canvasWidth = ctx.canvas.width;
    ctx.strokeStyle = options.lineColor;
    for (let y = 0; y <= canvasHeight; y += options.cellSize) {
        for (let x = 0; x <= canvasWidth; x += options.cellSize) {
            ctx.strokeRect(x, y, options.cellSize, options.cellSize);
        }
    }
    ctx.save();
}

function getMouseCoordinate(e) {
    const x = Math.floor(e.offsetX / CELL_SIZE);
    const y = Math.floor(e.offsetY / CELL_SIZE);
    return [x, y];
}

function fillCell(ctx, coordinate) {
    const canvasX = coordinate[0] * CELL_SIZE;
    const canvasY = coordinate[1] * CELL_SIZE;
    ctx.fillStyle = CELL_COLOR;
    ctx.fillRect(canvasX, canvasY, CELL_SIZE, CELL_SIZE);
}

function clearCell(ctx, coordinate) {
    const canvasX = coordinate[0] * CELL_SIZE;
    const canvasY = coordinate[1] * CELL_SIZE;
    ctx.clearRect(canvasX, canvasY, CELL_SIZE, CELL_SIZE);
    ctx.strokeRect(canvasX, canvasY, CELL_SIZE, CELL_SIZE);
}

function key(coordinate) {
    return `${coordinate[0]},${coordinate[1]}`;
}

function coordinateFromKey(key) {
    return key.split(',').map((k) => parseInt(k, 10));
}

function getNeighbors(coordinates) {
    const [x, y] = coordinates;
    const neighbors = [];
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i === x && j === y) {
                continue;
            }
            neighbors.push([i, j]);
        }
    }
    return neighbors;
}

function createNextFrame(currentState) {
    const nextState = { ...currentState };
    const currentAliveCells = Object.entries(currentState).filter(([_, alive]) => alive).map(([k]) => coordinateFromKey(k));

    for (const cell of currentAliveCells) {
        const neighbors = getNeighbors(cell);
        for (const neighbor of neighbors) {
            if (!nextState[key(neighbor)]) {
                nextState[key(neighbor)] = false;
            }
        }
    }

    for (const cell of Object.keys(nextState).map(coordinateFromKey)) {
        const neighbors = getNeighbors(cell);
        let numAliveNeighbors = 0
        for (const n of neighbors) {
            if (currentState[key(n)]) {
                numAliveNeighbors += 1;
            }
        }
        
        const cellKey = key(cell);
        if (currentState[cellKey] === true) {
            if (numAliveNeighbors < 2) {
                nextState[cellKey] = false;
                continue;
            } else if (numAliveNeighbors > 3) {
                nextState[cellKey] = false;
                continue;
            } else {
                nextState[cellKey] = currentState[cellKey]
                continue;
            }
        } else if (!currentState[cellKey] && numAliveNeighbors === 3) {
            nextState[cellKey] = true
            continue;
        }
    }

    return nextState;
}

function onResize() {
    const canvas = document.getElementById('game');

    if (window.innerWidth >= GRID_MAX_WIDTH) {
        canvas.width = GRID_MAX_WIDTH;
    } else {
        canvas.width = window.innerWidth - 24;
    } 
}

function draw() {
    const ctx = document.getElementById('game').getContext('2d');
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawGrid(ctx);

    for (const [key, alive] of Object.entries(cellMap)) {
        const coordinate = coordinateFromKey(key);
        if (alive) {
            fillCell(ctx, coordinate);
        } else {
            clearCell(ctx, coordinate);
        }
    }
    
    window.requestAnimationFrame(draw);
}

function init() {
    const canvas = document.getElementById('game');

    window.addEventListener('resize', onResize);
    onResize();
    
    canvas.addEventListener('mouseup', (e) => {
        if (!running) {
            const coordinates = getMouseCoordinate(e);
            toggleCellState(coordinates);
        }
    });

    canvas.addEventListener('mouseover', (e) => {
        if (running) {
            canvas.style.cursor = "move";
        } else {
            canvas.style.cursor = "pointer";
        }
    });

    window.requestAnimationFrame(draw);
}

init();
