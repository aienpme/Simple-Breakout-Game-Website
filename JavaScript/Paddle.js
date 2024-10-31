export class Paddle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = 75;
        this.height = 10;
        this.x = (canvas.width - this.width) / 2;
        this.rightPressed = false;
        this.leftPressed = false;
    }

    // Draw paddle on the canvas
    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.canvas.height - this.height, this.width, this.height);
        this.ctx.fillStyle = "#FF4500";
        this.ctx.fill();
        this.ctx.closePath();
    }

    // Deals with moving the paddle left and right when the arrow keys are pressed 
    update() {
        if (this.rightPressed && this.x < this.canvas.width - this.width) {
            this.x += 7;
        } else if (this.leftPressed && this.x > 0) {
            this.x -= 7;
        }
    }

    // Resets the paddle to center position 
    reset() {
        this.x = (this.canvas.width - this.width) / 2;
    }
}
