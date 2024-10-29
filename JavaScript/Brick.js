export class Brick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.status = 1;
        this.isHeartBrick = false;
        this.color = "#663399";
    }

    draw(ctx, width, height) {
        if (this.status === 1) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, width, height);
            ctx.fillStyle = this.isHeartBrick ? "red" : this.color;
            ctx.fill();
            ctx.closePath();
        }
    }
}
