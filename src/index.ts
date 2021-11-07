import Colors from "./colors";
const $canvas = <HTMLCanvasElement>document.getElementById("cnvs")!;

import { Box, Connection, ClassBox } from "./objects";


enum ConnectionStates {
    NONE,
    EMPTY,
    START
}

interface Store {
    dragging: boolean;
    offset: {
        x: number;
        y: number;
    };
    boxes: Box[];
    connections: Connection[];
    selectedBox: Box | null;
    connecting: ConnectionStates;
}

// global store
const store: Store = {
    dragging: false,
    offset: {
        x: 0,
        y: 0,
    },
    boxes: Array<Box>(),
    selectedBox: null,
    connecting: ConnectionStates.NONE,
    connections: Array<Connection>(),
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

// Set up the basic canvas properties
context.font = "18px verdana";
context.lineWidth = 5;
context.lineCap = "round";


// draw boxes & connections once initially
for (const box of store.boxes) {
    box.drawOnto(context);
}


// On double click spawn new ClassBox
document.body.addEventListener("dblclick", (ev: MouseEvent): void => {
    const msg: string = "First ClassBox";
    store.boxes.push(new ClassBox(msg, ev.clientX, ev.clientY, context.measureText(msg).width));
    store.boxes.at(-1)?.drawOnto(context);
});

// listen for key events (shortcuts for faster use)
document.body.addEventListener("keyup", (ev: KeyboardEvent): void => {
    switch (ev.key) {
        case "A":
        case "a":
            store.connecting = store.selectedBox !== null ? ConnectionStates.START : ConnectionStates.EMPTY;
            console.log("CONNECTING...");
            break;
        case "Escape":
            resetAll();
            break;
        default:
            console.log("Key not recognized: ", ev.key);
            break;
    }
});

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
    // iterate through and draw all of the connections
    for (const connection of store.connections) {
        // later you could only draw the boxes in the viewport
        connection.drawOnto(context);
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

    box.addToX(ev.movementX);
    box.addToY(ev.movementY);

    repaintCanvas();
}

$canvas.addEventListener("pointerdown", (ev: MouseEvent): void => {

    // check if clicked on box
    for (const box of store.boxes) {
        console.log(ev.clientX, ev.clientY);
        if (box.isColliding(ev.clientX, ev.clientY)) {
            console.log("colliding");

            // check if connection has to be drawn
            if (store.connecting === ConnectionStates.NONE) {
                store.selectedBox = box;
                updateUi(store.selectedBox);

                box.color = Colors.grey;
                box.onClick(context);
                box.drawOnto(context);

                $canvas.addEventListener("pointermove", startDragSelectedBox);
            } else if (store.connecting === ConnectionStates.EMPTY && !store.dragging) {
                store.selectedBox = box;
                updateUi(store.selectedBox);

                box.color = Colors.grey;
                box.drawOnto(context);
                store.connecting = ConnectionStates.START;

                $canvas.addEventListener("pointermove", startConnection);
            } else if (store.connecting === ConnectionStates.START) {
                console.log("Connecting now...");
                drawConnectionBetween(store.selectedBox, box);
            } else {
                resetAll();
            }

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
        store.selectedBox!.color = Colors.white;
        $canvas.removeEventListener("pointermove", startDragSelectedBox);
    }

    // if (store.connecting === ConnectionStates.NONE) {
    //     store.selectedBox = null;
    // }
}

// Handle stop of drag gesture
$canvas.addEventListener("pointerup", cancelDrag);
$canvas.addEventListener("pointercancel", cancelDrag);
$canvas.addEventListener("pointerout", cancelDrag);

/**
 * Draws the final connection between two boxes.
 * @param selectedBox 
 * @param box 
 */
function drawConnectionBetween(startBox: Box | null, endBox: Box) {
    if (store.selectedBox === null) {
        throw new Error("selectedBox is null!");
    }
    $canvas.removeEventListener("pointermove", startConnection);

    const newConnection = new Connection(startBox!, endBox);
    store.connections.push(newConnection);

    repaintCanvas();
    store.connecting = ConnectionStates.NONE;
}

/**
 * draws line from first box to cursor to indicate a connection.
 * @param ev 
 */
function startConnection(ev: MouseEvent): void {

    if (store.selectedBox === null || store.connecting !== ConnectionStates.START) {
        return;
    }
    repaintCanvas();

    context.strokeStyle = Colors.black;

    context.beginPath();
    context.moveTo(store.selectedBox.getX + store.selectedBox.width * 0.5 + store.offset.x, store.selectedBox.getY + store.selectedBox.height * 0.5 + store.offset.y);
    context.lineTo(ev.clientX, ev.clientY);
    context.stroke();
}

/**
 * Clears the canvas and then repaints all of the boxes.
 */
function repaintCanvas() {
    // clear the canvas to not leave any straints
    context.clearRect(0, 0, $canvas.width, $canvas.height);

    // iterate through and draw all of the connections
    for (const connection of store.connections) {
        // later you could only draw the boxes in the viewport
        connection.drawOnto(context);
    }

    for (const box of store.boxes) {
        // later you could only draw the boxes in the viewport
        box.drawOnto(context);
    }

    if (store.selectedBox !== null) {
        store.selectedBox.drawSelectedOnto(context);
    }
}

/**
 * Deletes all event listeners and jumps out of the current user action.
 */
function resetAll() {
    // reset everything if clicked nothing
    store.dragging = false;
    $canvas.removeEventListener("pointermove", startDrag);
    $canvas.removeEventListener("pointermove", startDragSelectedBox);

    $canvas.removeEventListener("pointermove", startConnection);
    store.connecting = ConnectionStates.NONE;

    repaintCanvas();
}

// Get changes from the sidebar
// and save them in realtime in the 
// obect structure
const $className = <HTMLInputElement>document.getElementById("input-class-name");

$className.addEventListener("input", (ev: Event) => {
    if (store.selectedBox instanceof ClassBox) {
        console.log($className.value)
        const textWidth: TextMetrics = context.measureText($className.value);
        store.selectedBox.changeTitle($className.value, textWidth.width);
        repaintCanvas();
    }
});

// listen for changed class type event and save in selectedBox data.
// @ts-ignore
document.classTypes.addEventListener("change", (ev: InputEvent) => {
    if (store.selectedBox !== null && store.selectedBox instanceof ClassBox) {

        // @ts-ignore
        store.selectedBox.setClassType(document.classTypes.type.value);
    }
})

function updateUi(selectedBox: Box) {
    console.log("updateUi")
    if (selectedBox instanceof ClassBox) {
        $className.value = selectedBox.getData.title;

        // set the form accordingly
        // @ts-ignore
        document.classTypes.type.value = selectedBox.getData.classType;
    }
}
