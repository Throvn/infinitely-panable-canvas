const $canvas = <HTMLCanvasElement>document.getElementById("cnvs")!;
const bounds = $canvas.getBoundingClientRect();

import { Box } from "./objects";

// global store
const store = {
    dragging: false,
    offset: {
        x: 0,
        y: 0,
    },
    boxes: Array<Box>(new Box(10, 10), new Box(200, 1300)),
    selectedBox: Box.prototype || null,
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

// draw boxes once initially
for (const box of store.boxes) {
    box.drawOnto(context);
}

/**
 * Repaints the canvas with the corrsponding offset
 * @param ev mouse event of event listener
 */
function startDrag(ev: MouseEvent): void {
    store.dragging = true;

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

/**
 * Only drags the [store.selectedBox]
 * For dragging all boxes, see [startDrag]
 * @param ev Mouse Event
 */
function startDragSelectedBox(ev: MouseEvent): void {
    store.dragging = true;
    const box = store.selectedBox;

    if (box === null) {
        return;
    }

    // clear the canvas to not leave any straints
    context.clearRect(0, 0, $canvas.width, $canvas.height);

    box.x += ev.movementX;
    box.y += ev.movementY;

    for (const box of store.boxes) {

        // later you could only draw the boxes in the viewport
        box.drawOnto(context);
    }

    // later you could only draw the boxes in the viewport
    box.drawOnto(context);

}

$canvas.addEventListener("pointerdown", (ev: MouseEvent): void => {

    for (const box of store.boxes) {
        console.log(ev.clientX, ev.clientY);
        if (box.isColliding(ev.clientX, ev.clientY)) {
            store.selectedBox = box;

            console.log("colliding");
            box.color = "#FF0000";
            box.onClick();
            box.drawOnto(context);

            $canvas.addEventListener("pointermove", startDragSelectedBox);
            return;
        }
    }

    // on click and drag recalculate pan offset
    $canvas.addEventListener("pointermove", startDrag);
});


/**
 * Stops listening for drag changes
 */
function cancelDrag(): void {
    // deregister pan event if click ended
    $canvas.removeEventListener("pointermove", startDrag);
    // deregister dragging of selected box, if thats the case
    if (store.selectedBox !== null) {
        $canvas.removeEventListener("pointermove", startDragSelectedBox);
    }
}

// Handle stop of drag gesture
$canvas.addEventListener("pointerup", cancelDrag);
$canvas.addEventListener("pointercancel", cancelDrag);
$canvas.addEventListener("pointerout", cancelDrag);