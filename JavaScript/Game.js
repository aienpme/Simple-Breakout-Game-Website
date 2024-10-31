// Import ball, paddle and brick from their js files
import { Ball } from './Ball.js';
import { Paddle } from './Paddle.js';
import { Brick } from './Brick.js';

class Game { // Game class that handles the game logic 
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ball = new Ball(canvas);
        this.paddle = new Paddle(canvas);
        this.bricks = [];
        this.levels = [
            { rows: 2, cols: 5 },
            { rows: 3, cols: 5 },
            { rows: 4, cols: 5 },
            { rows: 5, cols: 5 },
            { rows: 6, cols: 6, extraHeartBricks: 2},
        ];
        this.currentLevel = 0;
        this.score = 0;
        this.lives = 3;
        this.extraHeartBricks = [];
        this.username = sessionStorage.getItem("loggedInUser");

        if (!this.username) {
            console.log("No logged-in user found.");
        } else {
            console.log("Logged-in user:", this.username);
        }

        // Setup game components and different states
        this.setupBricks();
        this.gameRunning = false;
        this.gameOver = false;
        this.gameCompleted = false;
        this.animationFrameId = null;
        this.message = "";
        this.messageTimeout = null;
        this.reloadTimeout = null;

        // Event listeners for game controls 
        document.addEventListener("keydown", this.keyDownHandler.bind(this));
        document.addEventListener("keyup", this.keyUpHandler.bind(this));
        document.getElementById("startButton").addEventListener("click", this.startGame.bind(this));
        
        // Event listener for the Play Again button
        document.getElementById("playAgainButton").addEventListener("click", this.resetGame.bind(this));
    }

    // Creates brick layout for current level
    setupBricks() {
        const { rows, cols, extraHeartBricks } = this.levels[this.currentLevel];
        const brickWidth = (this.canvas.width - (cols - 1) * 10) / cols;

        this.bricks = [];
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const brickX = c * (brickWidth + 10);
                const brickY = r * 30 + 30;
                this.bricks.push(new Brick(brickX, brickY));
            }
        }

        // Checks for final level, and adds extra heart bricks that give more lives to the user 
        if (this.currentLevel === 4 && extraHeartBricks > 0) {
            for (let i = 0; i < extraHeartBricks; i++) {
                const randomBrickIndex = Math.floor(Math.random() * this.bricks.length);
                this.bricks[randomBrickIndex].isHeartBrick = true;
            }
        }
    }


    // This handles arrow keys input for paddle movement 
    keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            this.paddle.rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            this.paddle.leftPressed = true;
        }
    }

    // This handles movement if arrow keys are not pressed 
    keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            this.paddle.rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            this.paddle.leftPressed = false;
        }
    }

    // Checks for collisions between ball and bricks 
    collisionDetection() {
        const brickWidth = (this.canvas.width - (this.levels[this.currentLevel].cols - 1) * 10) / this.levels[this.currentLevel].cols;
        const brickHeight = 20;

        for (let brick of this.bricks) {
            if (brick.status === 1) {
                if (this.ball.x > brick.x && this.ball.x < brick.x + brickWidth && 
                    this.ball.y > brick.y && this.ball.y < brick.y + brickHeight) {
                    this.ball.dy = -this.ball.dy;
                    brick.status = 0;

                    // If the brick is red and a heart brick, it will give the user an extra life
                    if (brick.isHeartBrick) {
                        this.lives++;
                        this.displayMessage("Extra Life!");
                    } else {
                        this.score++;
                    }
                }
            }
        }

        if (this.bricks.every(brick => brick.status === 0)) {
            this.displayMessage(`Level ${this.currentLevel + 1}! Score: ${this.score}`);
            this.saveScore();
            this.nextLevel();
        }
    }

    // Show messages to user for 2 seconds 
    displayMessage(message) {
        this.message = message;
        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
            this.message = "";  // Clear message after 2 seconds
        }, 2000);
    }

    // Moves game to next level 
    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel >= this.levels.length) {
            this.displayWinMessage();
        } else {
            // Trigger win message if last level is completed
        
            console.log(`Moving to Level ${this.currentLevel + 1}. Current score: ${this.score}`);
    
            this.lives = 3; 
            this.setupBricks(); 
            this.ball.reset(this.paddle.x); 
    
            // This increases the ball speed for level 4 and 5
            if (this.currentLevel === 3) {
                this.ball.dx *= 1.2;
                this.ball.dy *= 1.2;
            } else if (this.currentLevel === 4) {
                this.ball.dx *= 1.44;
                this.ball.dy *= 1.44;
            }
    
            this.displayMessage(`Level ${this.currentLevel + 1}! Score: ${this.score}`); 
        }
    }    
     
    // When game is over, it will display this message
    displayWinMessage() {
        this.gameOver = true;
        this.gameCompleted = true;
        this.ball.dx = 0;  
        this.ball.dy = 0;
        this.displayMessage(`You win! Final score: ${this.score}`);
        this.saveScore();

        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
            this.message = ""; 
        }, 5000);
        
        // Show the Play Again button
        document.getElementById("playAgainButton").style.display = "block";
    }

        // Handle game over state
        displayGameOver() {
            this.gameOver = true;
            this.displayMessage(`Game Over! Final score: ${this.score}`);
            this.saveScore();
    
            clearTimeout(this.reloadTimeout);
            this.reloadTimeout = setTimeout(() => {
                document.location.reload();
            }, 4000);
        }


    // This is the main loop for the game 
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the screen first

        if (this.message) {
            this.ctx.save();
            this.ctx.fillStyle = "rgba(255, 0, 0, 0.8)";  
            this.ctx.font = "bold 24px Arial"; 
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(this.message, this.canvas.width / 2, this.canvas.height / 2); 
            this.ctx.restore();
        }
        // This is where the actual game logic updating happens
        if (!this.gameCompleted && !this.gameOver) {
            this.bricks.forEach(brick => {
                brick.draw(this.ctx, (this.canvas.width - (this.levels[this.currentLevel].cols - 1) * 10) / this.levels[this.currentLevel].cols, 20);
            });
            this.ball.draw();
            this.paddle.draw();
            this.drawScore();
            this.drawLives();
            
            this.collisionDetection();
            this.ball.update();

            // Handles the ball hitting the bottom of the screen, either start again, or game over 
            if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
                if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
                    this.ball.dy = -this.ball.dy;
                } else {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.lives = 0;
                        this.displayGameOver();
                    } else {
                        this.ball.reset(this.paddle.x);
                    }
                }
            }
            this.paddle.update();
            this.animationFrameId = requestAnimationFrame(this.draw.bind(this));
        }
    }

    // Function to start the game with correct score and lives 
    startGame() {
        if (!this.gameRunning) {
            document.getElementById("startButton").style.display = "none";
            this.score = 0;
            this.lives = 3;
            this.paddle.reset();
            this.ball.reset(this.paddle.x);
            this.gameRunning = true;
            this.draw();
        }
    }

    // Shows the score 
    drawScore() {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#000000";
        this.ctx.textAlign = "left";
        this.ctx.fillText("Score: " + this.score, 20, 20);
    }

    // Shows the lives 
    drawLives() {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText("Lives: " + this.lives, this.canvas.width - 65, 20);
    }

    // Saves score in local storage which then can be accessed by rankings
    saveScore() {
        if (this.username) {
            let scores = JSON.parse(localStorage.getItem("scores")) || {}; 
            scores[this.username] = this.score;
            localStorage.setItem("scores", JSON.stringify(scores));
            console.log(`Score saved for ${this.username}: ${this.score}`);
        } else {
            console.log("No logged-in user found. Score not saved."); 
        }
    }

    // Refreshes the page
    resetGame() {
        window.location.href = 'game.html';
    }
}    

// Initialize game
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("myCanvas");
    const game = new Game(canvas);
});
