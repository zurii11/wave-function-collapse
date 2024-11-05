let spritesheet;
const WIDTH = 32;
const HEIGHT = 32;
const DIM = 10;

const grid = [];
let sortedGrid = [];

const Direction = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
}

const Tile = {
    Vertical: 0,
    Horizontal: 1,
    RightCornerB: 2,
    LeftCornerB: 3,
    LeftCornerT: 4,
    RightCornerT: 5,
}

const RULES = {
    [Tile.Vertical]: {
        [Direction.TOP]: [Tile.Vertical, Tile.LeftCornerT, Tile.RightCornerT],
        [Direction.RIGHT]: [Tile.Vertical, Tile.LeftCornerB, Tile.LeftCornerT],
        [Direction.BOTTOM]: [Tile.Vertical, Tile.RightCornerB, Tile.LeftCornerB],
        [Direction.LEFT]: [Tile.Vertical, Tile.RightCornerB, Tile.RightCornerT]
    },
    [Tile.Horizontal]: {
        [Direction.TOP]: [Tile.Horizontal, Tile.LeftCornerB, Tile.RightCornerB],
        [Direction.RIGHT]: [Tile.Horizontal, Tile.RightCornerB, Tile.RightCornerT],
        [Direction.BOTTOM]: [Tile.Horizontal, Tile.RightCornerT, Tile.LeftCornerT],
        [Direction.LEFT]: [Tile.Horizontal, Tile.LeftCornerB, Tile.LeftCornerT]
    },
    [Tile.RightCornerB]: {
        [Direction.TOP]: [Tile.Vertical, Tile.LeftCornerT, Tile.RightCornerT],
        [Direction.RIGHT]: [Tile.Vertical, Tile.LeftCornerB, Tile.LeftCornerT],
        [Direction.BOTTOM]: [Tile.Horizontal, Tile.RightCornerT, Tile.LeftCornerT],
        [Direction.LEFT]: [Tile.Horizontal, Tile.LeftCornerB, Tile.LeftCornerT]
    },
    [Tile.LeftCornerB]: {
        [Direction.TOP]: [Tile.Vertical, Tile.LeftCornerT, Tile.RightCornerT],
        [Direction.RIGHT]: [Tile.Horizontal, Tile.RightCornerB, Tile.RightCornerT],
        [Direction.BOTTOM]: [Tile.Horizontal, Tile.RightCornerT, Tile.LeftCornerT],
        [Direction.LEFT]: [Tile.Vertical, Tile.RightCornerB, Tile.RightCornerT]
    },
    [Tile.LeftCornerT]: {
        [Direction.TOP]: [Tile.Horizontal, Tile.RightCornerB, Tile.LeftCornerB],
        [Direction.RIGHT]: [Tile.Horizontal, Tile.RightCornerB, Tile.RightCornerT],
        [Direction.BOTTOM]: [Tile.Vertical, Tile.RightCornerB, Tile.LeftCornerB],
        [Direction.LEFT]: [Tile.Vertical, Tile.RightCornerB, Tile.RightCornerT]
    },
    [Tile.RightCornerT]: {
        [Direction.TOP]: [Tile.Horizontal, Tile.RightCornerB, Tile.LeftCornerB],
        [Direction.RIGHT]: [Tile.Vertical, Tile.LeftCornerB, Tile.LeftCornerT],
        [Direction.BOTTOM]: [Tile.Vertical, Tile.RightCornerB, Tile.LeftCornerB],
        [Direction.LEFT]: [Tile.Horizontal, Tile.LeftCornerB, Tile.LeftCornerT]
    }
}

function preload() {
    spritesheet = loadImage('assets/Pipes.png');
}

function setup() {
    Array.prototype.merge = function(array) {
        array.forEach((el) => {
            if(!this.includes(el)) this.push(el);
        });
    }

    createCanvas(WIDTH*DIM, HEIGHT*DIM);
    background(51);
    fillGrid(DIM);
    console.table(RULES);
    let currentCell = revealTile();
    countPossibilities(currentCell);
    console.log(currentCell);
    console.table(grid);
}

function draw() {
    for(let i = 0; i < DIM; i++) {
        for(let j = 0; j < DIM; j++) {
            drawSprite(grid[i][j].tile, i, j);
        }
    }
}

function drawSprite(tile, i, j) {
    if(tile === null) return;
    image(spritesheet, i*WIDTH, j*HEIGHT, WIDTH, HEIGHT, Tile[tile]*WIDTH, 0, WIDTH, HEIGHT);
}

function revealTile() {
    sortedGrid = grid.flat();
    sortedGrid.sort((a, b) => a.possibilites.length - b.possibilites.length);
    smallestPossibility = sortedGrid[0].possibilites.length;
    sortedGrid = sortedGrid.filter(item => item.possibilites.length <= smallestPossibility);
    randomCellInd = Math.floor(Math.random() * sortedGrid.length);
    randomCell = sortedGrid[randomCellInd];
    randomTile = sortedGrid[randomCellInd].possibilites[Math.floor(Math.random() * sortedGrid[randomCellInd].possibilites.length)];
    randomCell.collapsed = true;
    randomCell.tile = randomTile;

    return randomCell;
}

function countPossibilities(currentCell) {
    const currentCellInd = sortedGrid.findIndex(item => item === currentCell);
    console.log(currentCellInd);
    const neighbours = [];
    // Top neighbour
    neighbours[Direction.TOP] = sortedGrid[currentCellInd-DIM];
    // Right neighbour
    neighbours[Direction.RIGHT] = sortedGrid[currentCellInd+1];
    // Bottom neighbour
    neighbours[Direction.BOTTOM] = sortedGrid[currentCellInd+DIM];
    // Left neighbour
    neighbours[Direction.LEFT] = sortedGrid[currentCellInd-1];
    
    let ind = 0;
    // Reduce possibilities
    for(const value in Object.values(Direction)) {
        const neighbour = neighbours[value];
        if(!neighbour.collapsed) {
            neighbour.possibilites = Object.keys(Tile).filter((item) => RULES[Tile[currentCell.tile]][value].includes(Tile[item]));
            for(const value in Object.values(Direction)) {
                ind++;
                console.log(value);
                let mesh = [];
                const deepNeighbour = neighbours[value];
                if(!deepNeighbour.collapsed) {
                    for(const possibleTile of neighbour.possibilites) {
                        deepNeighbour.possibilites = Object.keys(Tile).filter((item) => RULES[Tile[possibleTile]][value].includes(Tile[item]));
                        console.log(deepNeighbour.possibilites);
                    }
                }
                console.log(mesh);
            }
        }
    }
}

function fillGrid(dim) {
    for(let i = 0; i < dim; i++) {
        grid[i] = [];
        for(let j = 0; j < dim; j++) {
            grid[i][j] = {
                collapsed: false,
                tile: null,
                possibilites: Object.keys(Tile)
            };
        }
    }
}