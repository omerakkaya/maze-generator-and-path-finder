class Cell {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.visited = false;
        this.solutionVisited = false;
        this.walls = [true, true, true, true];
    }

    showWalls() {
        let x = this.x * this.r;
        let y = this.y * this.r;
        stroke(255);
        if (this.walls[0]) {
            line(x, y, x + this.r, y);
        }
        if (this.walls[1]) {
            line(x + this.r, y, x + this.r, y + this.r);
        }
        if (this.walls[2]) {
            line(x + this.r, y + this.r, x, y + this.r);
        }
        if (this.walls[3]) {
            line(x, y + this.r, x, y);
        }
    }

    getNeighbour() {
        let options = [];
        if (this.x != 0) {
            let up = maze[this.x - 1][this.y];
            if (!up.visited) {
                options.push(up);
            }
        }
        if (this.x != maze.length - 1) {
            let down = maze[this.x + 1][this.y];
            if (!down.visited) {
                options.push(down);
            }
        }
        if (this.y != 0) {
            let left = maze[this.x][this.y - 1];
            if (!left.visited) {
                options.push(left);
            }
        }
        if (this.y != maze[0].length - 1) {
            let right = maze[this.x][this.y + 1];
            if (!right.visited) {
                options.push(right);
            }
        }

        if (options.length == 0) {
            return undefined;
        }

        return options[Math.floor(Math.random() * options.length)];
    }

    getSolutionNeighbour() {
        let solutionOptions = [];
        if (this.y != 0) {
            let up = maze[this.x][this.y - 1];
            if (!up.solutionVisited && !this.walls[0]) {
                solutionOptions.push(up);
            }
        }
        if (this.y != maze.length - 1) {
            let down = maze[this.x][this.y + 1];
            if (!down.solutionVisited && !this.walls[2]) {
                solutionOptions.push(down);
            }
        }
        if (this.x != 0) {
            let left = maze[this.x - 1][this.y];
            if (!left.solutionVisited && !this.walls[3]) {
                solutionOptions.push(left);
            }
        }
        if (this.x != maze[0].length - 1) {
            let right = maze[this.x + 1][this.y];
            if (!right.solutionVisited && !this.walls[1]) {
                solutionOptions.push(right);
            }
        }

        if (solutionOptions.length == 0) {
            return undefined;
        }
        return solutionOptions[Math.floor(Math.random() * solutionOptions.length)];
    }

    highlight() {
        var x = this.x * this.r;
        var y = this.y * this.r;
        noStroke();
        fill(0, 0, 255, 100);
        rect(x, y, this.r, this.r);
    }
}

let maze = [];
let sizeOfEdge = 20;
let canvasWidth = 1000;
let canvasHeight = 1000;
let rowCellNum = canvasWidth / sizeOfEdge;
let colCellNum = canvasHeight / sizeOfEdge;
let path = [];
let solutionPath = [];
let currentCell = null;
let solutionCurrentCell = null;
function setup() {
    createCanvas(canvasWidth, canvasHeight);
    noStroke();
    fill(220);
    for (let i = 0; i < rowCellNum; i++) {
        let row = [];
        for (let j = 0; j < colCellNum; j++) {
            let cell = new Cell(i, j, sizeOfEdge);
            row.push(cell);
            square(i * sizeOfEdge, j * sizeOfEdge, sizeOfEdge);
        }
        maze.push(row);
    }
    currentCell = maze[0][0];
    solutionCurrentCell = maze[0][0];
    solutionPath.push(solutionCurrentCell);
}

function draw() {
    background(51);
    for (let i = 0; i < rowCellNum; i++) {
        for (let j = 0; j < colCellNum; j++) {
            maze[i][j].showWalls();
        }
    }

    let option = currentCell.getNeighbour();
    currentCell.visited = true;
    currentCell.highlight();
    if (option) {
        option.visited = true;
        path.push(currentCell);
        removeWalls(currentCell, option);

        currentCell = option;
    }
    else if (path.length > 0) {
        currentCell = path.pop();
    }
    else {
        let solutionOption = solutionCurrentCell.getSolutionNeighbour();
        solutionCurrentCell.solutionVisited = true;
        solutionCurrentCell.highlight();
        if (solutionOption !== undefined) {
            solutionOption.solutionVisited = true;
            solutionPath.push(solutionCurrentCell);
            solutionCurrentCell = solutionOption;
            if (solutionCurrentCell.x == rowCellNum - 1 && solutionCurrentCell.y == colCellNum - 1) {
                solutionPath.push(solutionCurrentCell);
                solutionCurrentCell.highlight();
                solutionPath.forEach(cell => {
                    var x = cell.x * cell.r;
                    var y = cell.y * cell.r;
                    noStroke();
                    fill(255, 255, 0, 100);
                    rect(x, y, cell.r, cell.r);
                });
                noLoop();
            }
        }
        else if (solutionPath.length > 0) {
            solutionCurrentCell = solutionPath.pop();
        }
    }
}

function removeWalls(a, b) {
    var x = a.x - b.x;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }

    var y = a.y - b.y;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}