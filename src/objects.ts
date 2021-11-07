export class Box {
    private x: number;
    private y: number;

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
}