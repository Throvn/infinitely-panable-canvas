
// Do method logic here
const $methods = document.getElementById("methods");
let $methodInputs = document.querySelectorAll(".method-input");

// attributes
const $attributes = document.getElementById("attributes");
let $attributeInputs = document.querySelectorAll(".attribute-input");

const createNewMethodInputs = (ev: Event): void => {
    const event = <KeyboardEvent>ev;
    switch (event.key) {
        case "Enter":
            $methods!.insertAdjacentHTML("beforeend", `
            <div id="method-${$methods?.children.length}" class="input-group mt-2">

                <select class="input-group-addon" name="modifier" id="input-method-modifier-${$methods?.children.length}">
                    <option value="public">+</option>
                    <option value="private">-</option>
                    <option value="protected">#</option>
                </select>
                <input class="form-input method-input" type="text" id="input-methods-${$methods?.children.length}" placeholder="method">
                <button class="btn btn-primary input-group-btn" 
                    onclick="document.getElementById('input-methods-${$methods?.children.length}').parentElement.remove();">
                    <i class="icon icon-delete"></i>
                </button>
            </div>
            `);
            $methodInputs = document.querySelectorAll(".method-input");
            $methodInputs.item($methodInputs.length - 1).addEventListener("keyup", createNewMethodInputs);
            (<HTMLInputElement>$methodInputs.item($methodInputs.length - 1)).focus();
            break;

        default:
            console.log(event.key, "not recognized");
            break;
    }
}


// do attribute logic here
// basically the same as with methods

const createNewAttributeInputs = (ev: Event): void => {
    const event = <KeyboardEvent>ev;
    switch (event.key) {
        case "Enter":
            $attributes!.insertAdjacentHTML("beforeend", `
            <div id="attribute-${$attributes?.children.length}" class="input-group mt-2">
                <select class="input-group-addon" name="modifier" id="input-attribute-modifier-${$attributes?.children.length}">
                    <option value="public">+</option>
                    <option value="private">-</option>
                    <option value="protected">#</option>
                </select>
                <input class="form-input attribute-input" type="text" id="input-attributes-${$attributes?.children.length}"
                    placeholder="attribute">
                <button class="btn btn-primary input-group-btn"
                    onclick="document.getElementById('input-attributes-${$attributes?.children.length}').parentElement.remove();"><i
                        class="icon icon-delete"></i>
                </button>
            </div>
            `);
            $attributeInputs = document.querySelectorAll(".attribute-input");
            $attributeInputs.item($attributeInputs.length - 1).addEventListener("keyup", createNewAttributeInputs);
            (<HTMLInputElement>$attributeInputs.item($attributeInputs.length - 1)).focus();
            break;

        default:
            console.log(event.key, "not recognized");
            break;
    }
}

// initialize once
$methodInputs.forEach(($inpt: Element) => {
    $inpt.addEventListener("keyup", createNewMethodInputs);
});
$attributeInputs.forEach(($inpt: Element) => {
    $inpt.addEventListener("keyup", createNewAttributeInputs);
});
