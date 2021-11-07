export abstract class Box {
    protected x: number;
    protected y: number;

    protected static xPadding: number = 5;

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

    /**
     * Draws the representation of the object onto the specified canvas.
     * @param context The canvas context to draw onto
     * @abstract
     */
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

    /**
     * Adds the [num] to the x coordinate.
     * @param num 
     */
    public addToX(num: number): void {
        this.x += num;
    }

    /**
     * Adds the [num] to the y coordinate.
     * @param num 
     */
    public addToY(num: number): void {
        this.y += num;
    }

    /**
     * Getter of the x-coordinate
     * @returns x coordinate
     */
    public get getX(): number {
        return this.x;
    }

    /**
     * Getter of the y-coordinate
     * @returns y coordinate
     */
    public get getY(): number {
        return this.y;
    }




}

export class TextBox extends Box {
    private text: string = "Test";
    private textColor: string = "#000000";
    constructor(x: number, y: number, text?: string) {
        super(x, y);

        if (text) {
            this.text = text!;
        }

    }

    /**
     * draws a box with a little text onto the specified canvas.
     * @param {CanvasRenderingContext2D} context - the canvas to draw on.
     * @override
     */
    public drawOnto(context: CanvasRenderingContext2D): void {
        const oldFillStyle = context.fillStyle;

        context.fillStyle = this.color;

        const textMetrics: TextMetrics = context.measureText(this.text);
        this.width = textMetrics.width + TextBox.xPadding * 2;

        context.fillRect(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height);

        context.fillStyle = this.textColor;
        context.fillText(this.text, this.x + this.offsetX + TextBox.xPadding, this.y + this.offsetY);

        context.fillStyle = oldFillStyle;
    }
}

export class Connection {
    private startBox: Box;
    private endBox: Box;


    constructor(startBox: Box, endBox: Box) {
        this.startBox = startBox;
        this.endBox = endBox;
    }

    /**
     * Draws the connection onto the specified canvas.
     * @param context Canvas to draw connection onto
     */
    public drawOnto(context: CanvasRenderingContext2D): void {
        const oldFillStyle = context.fillStyle;
        context.fillStyle = "yellow";
        context.beginPath();
        context.moveTo(this.startBox.getX + this.startBox.offsetX + this.startBox.width * 0.5, this.startBox.getY + this.startBox.offsetY + this.startBox.height * 0.5);
        context.lineTo(this.endBox.getX + this.endBox.offsetX + this.endBox.width * 0.5, this.endBox.getY + this.endBox.offsetY + this.endBox.height * 0.5);
        context.stroke();

        context.fillStyle = oldFillStyle;
    }
}