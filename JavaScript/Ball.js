export class Ball {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.radius = 10;
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.dx = 2; 
        this.dy = -2; 
    }

    // Draws the ball on the canvas 
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Ball collision with walls
        if (this.x + this.dx > this.canvas.width - this.radius || this.x + this.dx < this.radius) {
            this.dx = -this.dx;
        }
        if (this.y + this.dy < this.radius) {
            this.dy = -this.dy;
        }
    }

    // When reset, put the ball on the paddle 
    reset(paddleX) {
        this.x = paddleX + (75 / 2);
        this.y = this.canvas.height - 20;
    }
}
