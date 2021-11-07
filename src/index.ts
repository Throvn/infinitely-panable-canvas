const $canvas = <HTMLCanvasElement>document.getElementById("cnvs")!;

import { Box } from "./objects";

// global store
const store = {
    offset: {
        x: 0,
        y: 0,
    },
    boxes: Array<Box>(new Box(10, 10), new Box(200, 1300)),
}

/**
 * Sets the right canvas proportions
 * and handles the canvas setup in general
 * @returns canvas context
 */
function initializeCanvas(): CanvasRenderingContext2D {
    $canvas.width = screen.availWidth;
    $canvas.height = screen.availHeight;
    return $canvas.getContext("2d")!;
}

const context = initializeCanvas();

/**
 * Repaints the canvas with the corrsponding offset
 * @param ev mouse event of event listener
 */
function dragCallback(ev: MouseEvent) {

    // update offset in store
    store.offset.x += ev.movementX;
    store.offset.y += ev.movementY;

    // clear the canvas to not leave any straints
    context.clearRect(0, 0, $canvas.width, $canvas.height);

    for (const box of store.boxes) {
        box.offsetX += ev.movementX;
        box.offsetY += ev.movementY;

        // later you could only draw the boxes in the viewport
        box.drawOnto(context);
    }
}

$canvas.addEventListener("pointerdown", (ev: MouseEvent) => {
    // on click and drag recalculate pan offset
    $canvas.addEventListener("pointermove", dragCallback);
});

$canvas.addEventListener("pointerup", () => {
    // deregister pan event if click ended
    $canvas.removeEventListener("pointermove", dragCallback);
});