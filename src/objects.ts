export class Box {
    public x: number;
    public y: number;

    public offsetX: number = 0;
    public offsetY: number = 0;

    public color: string = "#000000";

    public width: number = 100;
    public height: number = 100;

    /**
     * Creates a box with a defined background color.
     * Potential parent class of all following box implementations.
     * @param x 
     * @param y 
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public drawOnto(context: CanvasRenderingContext2D): void {
        const oldFillStyle = context.fillStyle;
        context.fillStyle = this.color;
        context.fillRect(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height);
        context.fillStyle = oldFillStyle;
    }

    /**
     * Gets called if the box was clicked.
     */
    public onClick(): void {
        this.color = "green";
    }

    /**
     * Checks if coordinates are inside of the current box.
     * @param x coordinate
     * @param y coordinate
     * @returns whether the coordinates match
     */
    public isColliding(x: number, y: number): boolean {
        console.log("Collison: ", this.x + this.offsetX, this.y + this.offsetY);
        return (x > this.x + this.offsetX && x < this.x + this.offsetX + this.width)
            && (y > this.y + this.offsetY && y < this.y + this.offsetY + this.height);
    }
}