var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var snake;
var apple;
var gameInterval;
var gridSize = 20;
var tileCountX = 20;
var tileCountY = 20;

canvas.width = tileCountX * gridSize;
canvas.height = tileCountY * gridSize;

// Snake constructor function
function Snake() {
    this.body = [{ x: 10, y: 10 }];
    this.direction = { x: 0, y: 0 };
    this.length = 1;
    this.alive = true;
}

Snake.prototype.move = function() {
    var head = { x: this.body[0].x + this.direction.x, y: this.body[0].y + this.direction.y };

    // Check for collision with walls or itself
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY || this.checkCollision(head)) {
        this.alive = false;
        return;
    }

    // Add new head and remove tail
    this.body.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
        this.length++;
        spawnApple();
    } else {
        this.body.pop();
    }
}

Snake.prototype.checkCollision = function(head) {
    for (var i = 1; i < this.body.length; i++) {
        if (this.body[i].x === head.x && this.body[i].y === head.y) {
            return true;
        }
    }
    return false;
}

Snake.prototype.draw = function() {
    ctx.fillStyle = "#00FF00";  // Snake color
    for (var i = 0; i < this.body.length; i++) {
        var part = this.body[i];
        ctx.beginPath();
        ctx.arc(part.x * gridSize + gridSize / 2, part.y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2, false);
        ctx.fill();
    }
}

// Apple object
function spawnApple() {
    var x = Math.floor(Math.random() * tileCountX);
    var y = Math.floor(Math.random() * tileCountY);

    apple = { x: x, y: y };
}

function drawApple() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(apple.x * gridSize + gridSize / 2, apple.y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2, false);
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
    snake.draw();
    drawApple();
}

function update() {
    if (snake.alive) {
        snake.move();
        draw();
    } else {
        clearInterval(gameInterval);
        showGameOverPopup();
    }
}

function restartGame() {
    snake = new Snake();
    spawnApple();
    gameInterval = setInterval(update, 100);  // 100ms interval for the game
    document.getElementById("gameOverPopup").style.display = "none";  // Hide game over screen
}

function showGameOverPopup() {
    document.getElementById("gameOverPopup").style.display = "block";  // Show game over popup
}

// Handle key presses
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && snake.direction.y === 0) {
        snake.direction = { x: 0, y: -1 };
    } else if (event.key === "ArrowDown" && snake.direction.y === 0) {
        snake.direction = { x: 0, y: 1 };
    } else if (event.key === "ArrowLeft" && snake.direction.x === 0) {
        snake.direction = { x: -1, y: 0 };
    } else if (event.key === "ArrowRight" && snake.direction.x === 0) {
        snake.direction = { x: 1, y: 0 };
    }
});

// Initialize the game
function startGame() {
    snake = new Snake();
    spawnApple();
    gameInterval = setInterval(update, 100);  // 100ms interval for the game
}

// Start the game on page load
startGame();
