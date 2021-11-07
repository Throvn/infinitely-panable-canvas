import { v4 as uuidv4 } from "uuid";
import Colors from "./colors";

interface FormData {
    title: string;
    attributes: {
        modifier: string;
        head: string;
    }[];
    methods: {
        modifier: string;
        head: string;
    }[];
}

export abstract class Box {
    protected x: number;
    protected y: number;

    protected static xPadding: number = 5;

    public offsetX: number = 0;
    public offsetY: number = 0;

    public color: string = Colors.white;

    public width: number;
    public height: number;

    /**
     * Creates a box with a defined background color.
     * Potential parent class of all following box implementations.
     * @param x 
     * @param y 
     */
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;

        this.height = height;
        this.width = width;
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
    public onClick(context?: CanvasRenderingContext2D): void {
        this.color = Colors.primary;
    }

    /**
     * Draws a slight variation of the normal apearence. Makes clear to the
     * user that this is the currently selected box.
     * @param context 
     * @abstract
     */
    public drawSelectedOnto(context: CanvasRenderingContext2D): void {
        context.fillRect(0, 0, this.width, this.height);
        // throw new Error("drawSelectedOnto not implemented.");
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

export class ClassBox extends Box {
    private textColor: string = Colors.black;
    private uuid: string;
    public get getUuid() { return this.uuid; }

    protected data: FormData;
    public get getData() { return this.data; }

    public static textHeight = 20; // px

    constructor(text: string, x: number, y: number, width: number, height?: number) {
        super(x - width * 0.5, y, width + ClassBox.xPadding, height || ClassBox.textHeight);

        this.data = { title: text, attributes: [], methods: [] };
        this.uuid = uuidv4;
    }

    /**
     * draws a box with a little text onto the specified canvas.
     * @param {CanvasRenderingContext2D} context - the canvas to draw on.
     * @override
     */
    public drawOnto(context: CanvasRenderingContext2D): void {
        const oldFillStyle = context.fillStyle;

        context.fillStyle = this.color;

        context.fillRect(this.x + this.offsetX, this.y + ClassBox.xPadding + this.offsetY, this.width + ClassBox.xPadding * 2, ClassBox.textHeight);

        context.fillStyle = this.textColor;
        context.fillText(this.data.title, this.x + this.offsetX + ClassBox.xPadding, this.y + this.offsetY + this.height);
        context.fillStyle = oldFillStyle;
    }

    /**
     * Draws the object in slight variation to the canvas so the user
     * sees the currently selected box.
     * @param context render surface
     * @override
     */
    public drawSelectedOnto(context: CanvasRenderingContext2D): void {
        const oldFillStyle = context.fillStyle;

        context.fillStyle = this.color;
        context.strokeStyle = Colors.black;
        context.lineWidth = 2;

        context.fillRect(this.x + this.offsetX, this.y + ClassBox.xPadding * 0.5 + this.offsetY, this.width + ClassBox.xPadding * 2, ClassBox.textHeight);

        context.fillStyle = this.textColor;
        context.fillText(this.data.title, this.x + this.offsetX + ClassBox.xPadding, this.y + this.offsetY + this.height);
        context.strokeRect(this.x + this.offsetX, this.y + ClassBox.xPadding * 0.5 + this.offsetY, this.width + ClassBox.xPadding * 2, this.height);

        context.fillStyle = oldFillStyle;
    }

    /**
     * Updates the title and the width
     * of the ClassBox.
     * @param newTitle 
     * @param width 
     */
    changeTitle(newTitle: string, width: number) {
        this.width = width;
        this.data.title = newTitle;
    }

    /**
     * Checks if coordinates are inside of the current box.
     * @param x coordinate
     * @param y coordinate
     * @returns whether the coordinates match
     * @override
     */
    public isColliding(x: number, y: number): boolean {
        console.log("Collison: ", this.x + this.offsetX, this.y + this.offsetY);
        return (x > this.x + this.offsetX && x < this.x + this.offsetX + this.width + ClassBox.xPadding * 2)
            && (y > this.y + this.offsetY && y < this.y + this.offsetY + this.height);
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