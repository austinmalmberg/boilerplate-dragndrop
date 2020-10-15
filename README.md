Drag 'n Drop
============

Boilerplate JavaScript for dragging and dropping HTML elements.

Create a Drop Zone
--------------------

- Set an id attribute
- Add the `dropzone` class to an element

#### Attributes

##### data-dragtype
The dropzone will only accept draggable elements that have the same `data-dragtype`. *Optional.*

##### data-max-children
Only accepts the dropped element if the max children is less than the given number. *Optional.*

##### data-remove-position
Remove the element from the given posiiton if a new element is appended to the dropzone while the dropzone is at the
capacity set by data-max-children. *Optional.*

Possible values:
- `start` | removes the first element
- `end` | removes the last element

Default: `end`. Does nothing if `data-max-children` is not set. 

##### data-append-position
Appends the dropped element to the specified position. *Optional.*

Possible values:
- `start` | prepends the element to the top of the dropzone
- `end` | appends the element to the dropzone
- `between` | attempts to place the element between two child elements within the dropzone, nearest to the drop position
        
Default: `end`


Creating a Draggable Item
-------------------------

- Add an id attribute
- Add `draggable="true"` as an attribute
- When working with multiple dropzones, add the `data-dragtype` attribute and set this to the appropriate value


Set the Replenishment Source
----------------------------

A replenishment source can be specified on the container where items are dragged from. A function is called to take one
item from the replenishment source each time an item leave the container unless `data-min-children` is provided. In this
case, the function will only begin pulling items from the replenishment source when the number of children in the
container dips below the amount specified

#### data-replenish-source
After a successful drop, calls a function to replenish the parent where the dropped element was taken from and uses the
selector specified in this attribute. This can be specified on any element that will contain droppable items. *Optional.*

#### data-min-children
Calls a function to replenish the container from the `data-replenish-source` when the children in the node begins
dropping below this number.  Without this, children will be added to the container every time an item is removed from
it. *Optional.*
