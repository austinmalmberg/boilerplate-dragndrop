/* set dropzone ondragover event listeners */
for (const dropzone of document.querySelectorAll('.dropzone')) {
    dropzone.ondragover = (event) => event.preventDefault();
    dropzone.ondrop = (event) => handleDrop(event);
}

for (const draggableItem of document.querySelectorAll("*[draggable='true']")) {
    draggableItem.ondragstart = (event) => handleDragStart(event);
    draggableItem.ondragend = (event) => handleDragEnd(event);
}


function handleDragStart(event) {
    // add indicator for all possible dropzones
    for (const item of document.querySelectorAll(`.dropzone[data-dragtype="${event.target.getAttribute('data-dragtype')}"]`)) {
        item.classList.add('valid-dropzone');
    }

    // store element that is being dragged
    event.dataTransfer.setData("x-sl-target", event.target.id);
    event.dataTransfer.setData("x-sl-parent", event.target.parentElement.id);
}

function handleDragEnd(event) {
    // remove indicator for all dropzones
    for (const item of document.querySelectorAll('.valid-dropzone')) {
        item.classList.remove('valid-dropzone');
    }
}

function handleDrop(event) {
    // get the closest dropzone
    const dropzone = event.target.closest('.dropzone');

    if (dropzone) {
        const elementId = event.dataTransfer.getData("x-sl-target");
        const droppedElement = document.getElementById(elementId);

        // make sure the dropped element is compatible with the dropzone
        const acceptableClass = dropzone.getAttribute('data-dragtype');
        const compatibleDrop = !acceptableClass || droppedElement.getAttribute('data-dragtype') == acceptableClass;
        if (!compatibleDrop) throw new TypeError(`${dropzone.id} is not a compatible element for ${droppedElement.id}`);

        // make sure the data-max-children attribute is a number
        const maxChildren = Number(dropzone.getAttribute('data-max-children') || Number.MAX_SAFE_INTEGER);
        if (Number.isNaN(maxChildren)) throw new TypeError(`See ${dropzone.id}. data-max-children must be a number.`);

        // only remove an element if at capacity
        if (dropzone.childElementCount >= maxChildren) {
            // abort if no "data-remove-position" attribute
            const removeAtPosition = dropzone.getAttribute('data-remove-position');
            if (!removeAtPosition) throw new RangeError(`${dropzone.id} cannot accept anymore items.`);

            // remove an element, if any exist
            if (dropzone.childElementCount > 0) {
                let removeIndex = removeAtPosition === 'start' ? 0 : dropzone.childElementCount - 1;

                dropzone.removeChild(dropzone.children[removeIndex]);
            }
        }

        // append the item to the dropzone
        const appendPosition = dropzone.getAttribute('data-append-position');
        let insertBeforeThisNode = null;

        if (dropzone.childElementCount > 0) {
            if (appendPosition === 'start') {
                insertBeforeThisNode = dropzone.children[0];

            } else if (appendPosition === 'between') {

                // decide which node to place the dropped element before
                for (const child of dropzone.querySelectorAll("*[draggable='true']")) {
                    const rect = child.getBoundingClientRect();
                    if (event.clientY <= rect.top + rect.height / 2) {
                        insertBeforeThisNode = child;
                        break;
                    }
                }
            }
        }

        appendToElement(dropzone, droppedElement, insertBeforeThisNode);

        // replenish the node where the dropped item came from, if "data-replenish-source" is set on the container
        const previousParentId = event.dataTransfer.getData("x-sl-parent");
        const previousParent = document.getElementById(previousParentId);
        const replenishSource = previousParent.getAttribute('data-replenish-source');

        const minChildren = Number(previousParent.getAttribute('data-min-children') || Number.MIN_SAFE_INTEGER);
        if (Number.isNaN(minChildren)) throw new TypeError(`See ${previousParent.id}. data-min-children must be a number.`);

        if (previousParent !== dropzone && replenishSource && previousParent.childElementCount < minChildren) {
            const replenishElement = document.querySelector(replenishSource);
            if (replenishElement) appendToElement(previousParent, replenishElement)
        }
    }
}

function appendToElement(parent, child, insertBeforeThisNode = null) {
    if (parent && child) {

        if (insertBeforeThisNode)
            parent.insertBefore(child, insertBeforeThisNode);
        else
            parent.appendChild(child);
    }
}
