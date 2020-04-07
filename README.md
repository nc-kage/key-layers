# key-layers
Free and small library for comfortable handling key events. If web application contains the several abstract layers such as file browsing, image preview, video preview etc. If active layer needs to handle own events and lock event handlers of the other layers, key-layers can help to resolve this task.

# Getting Started
To create a Emitter instance (key listeners instance) for the layer execute the **Emitter** constructor.

```javascript
import { Emitter } from 'key-layers-js';

const secondLayerEmitter = new Emitter(2);

// Add a listener for any key down event.
secondLayerEmitter.addListener('keyDown', (e) => {
  console.log('Key down of the layer 2', e);
});

// Add a listener for key down event when user presses
// "w" and "e" keys together.
secondLayerEmitter.addListener('keyDown', (e) => {
  console.log('"w" and "e" keys down of the layer 2', e);
}, { codes: [87, 69] });

// Add a listener for the synthetic key release event
// which fires on down and up "esc" key with 150 ms delay or less.
secondLayerEmitter.addListener('keyRelease', (e) => {
  console.log('Esc key release of the layer 2', e);
}, { code: 27 });

// Destroy Emitter instance of the layer.
secondLayerEmitter.destroy();
```

This example shows how to create one Emitter instance for the layer with different types of the key listeners such as:
* Key down listener for any key
* "w" and "e" keys together down listener
* "esc" key release listener which fires on down and up with 150 ms delay or less.

**Emitter** constructor takes two parameters:
```javascript
new Emitter(layerIndex, releaseDelay)
```
***layerIndex*** - it's a something like z-index. Active layer will be with the biggest layerIndex.

***releaseDelay*** - it's a delay between down and up events for release synthetic event. By default, this value sets to 150 ms.

# Layer execute priority
**Layer** - it's an abstract plane with which Emitter instances connecting.

There are three types of the layers:
* High priority layer (anonymous top layer) with only one Emitter instance
* General priority layer (index layer)
* Force executable layer

## High priority layers
Layers that are created by Emittor constructor without index. Constructor execution without parameters or with layerIndex = null creates a new unindexed layer and connect new Emitter instance with this layer.

**Listening layer is a layer that was created latest.**
```javascript
import { Emitter } from 'key-layers-js';

//Create new "High priority layer" and conntect this layer with new Emitter instance (hightPriorityFirst)
const hightPriorityFirst = new Emitter();

//Create new "High priority layer" and conntect this layer with new Emitter instance (hightPrioritySecond)
const hightPrioritySecond = new Emitter();

setTimeout(() => {
  // Destroy Emitter instance (hightPrioritySecond) with its "High priority layer"
  // and than hightPriorityFirst starts listen key events
  hightPrioritySecond.destroy();
}, 3000);

// hightPrioritySecond is listening key events for 3 seconds
// hightPriorityFirst isn't listening key events

```


## General priority layers
Layers with index (z-index).

**Listening layer is a layer with the biggest index.**
```javascript
import { Emitter } from 'key-layers-js';

//Create new Emitter instance (listenersTwoIndex) with "2" layer index
const listenersTwoIndex = new Emitter(2);

//Create new Emitter instance (listenersOneIndex) with "1" layer index
const listenersOneIndex = new Emitter(1);

//Create new Emitter instance (listenersThreeIndex) with "3" layer index
const listenersThreeIndex = new Emitter(3);

setTimeout(() => {
  // Destroy listenersThreeIndex Emitter instance
  // and than listenersTwoIndex starts listen key events for 3 seconds
  listenersThreeIndex.destroy();
}, 3000);

setTimeout(() => {
  // Destroy listenersTwoIndex Emitter instance
  // and than listenersOneIndex starts listen key events
  listenersTwoIndex.destroy();
}, 6000);

// listenersThreeIndex is listening key events for 3 seconds
// listenersOneIndex isn't listening key events
// listenersTwoIndex isn't listening key events

```

## Force executable layer
Key listeners instances which connected with this layer will listen key events despite
the existence of the "high priority layers" and "general priority layers".

For creating key listener layer which connected with **Force executable layer** needs to execute Emitter constructor with layerIndex = EMITTER_FORCE_LAYER_TYPE.
```javascript
import { Emitter, EMITTER_FORCE_LAYER_TYPE } from 'key-layers-js';

//Create new Emitter instance (listenersTwoIndex) with "2" layer index
const listenersTwoIndex = new Emitter(2);

//Create new Emitter instance (listenersOneIndex) with "1" layer index
const listenersOneIndex = new Emitter(1);

//Create new Emitter instance connected with the force executable layer
const forceListeners = new Emitter(EMITTER_FORCE_LAYER_TYPE);

// listenersTwoIndex is listening key events
// listenersOneIndex isn't listening key events
// forceListeners is listening key events

```

## Summary
In general there are two active layers
* Force executable layer
* One of the high priority or low priority layer.
```javascript
import { Emitter, EMITTER_FORCE_LAYER_TYPE } from 'key-layers-js';

//Create new "High priority layer" and conntect this layer with new Emitter instance (hightPriorityFirst)
const hightPriorityFirst = new Emitter();

//Create new "High priority layer" and conntect this layer with new Emitter instance (hightPrioritySecond)
const hightPrioritySecond = new Emitter();

//Create new Emitter instance (listenersTwoIndex) with "2" layer index
const listenersTwoIndex = new Emitter(2);

//Create new Emitter instance (listenersOneIndex) with "1" layer index
const listenersOneIndex = new Emitter(1);

//Create new Emitter instance connected with the force executable layer
const forceListeners = new Emitter(EMITTER_FORCE_LAYER_TYPE);

setTimeout(() => {
  // Destroy Emitter instance (hightPrioritySecond) with its "High priority layer"
  // and than hightPriorityFirst starts listen key events for 3 seconds
  // forceListeners is listening key events
  hightPrioritySecond.destroy();
}, 3000);

setTimeout(() => {
  // Destroy Emitter instance (hightPriorityFirst) with its "High priority layer"
  // and than listenersTwoIndex starts listen key events
  // forceListeners is listening key events
  hightPriorityFirst.destroy();
}, 3000);

// hightPrioritySecond is listening key events for 3 seconds
// forceListeners is listening key events
// hightPriorityFirst isn't listening key events
// listenersOneIndex isn't listening key events
// listenersTwoIndex isn't listening key events

```

# API
There are three api types (module, class and Emitter instance).
## Module API
### Emitter(layerIndex[, releaseDelay]) ###
Key listener constructor which takes two parameters

***layerIndex*** - it's an index of the layer with which key listerners instance connect.
```javascript
//Examples
import { Emitter, EMITTER_FORCE_LAYER_TYPE } from 'key-layers-js';

//Connect key listerners instance with the first layer.
const listenersOne = new Emitter(1);

//Connect key listerners instance with the first layer.
const highFirst = new Emitter(null);
const highFirst = new Emitter(second);

//Connect key listerners instance with the force executable layer.
const forceListeners = new Emitter(EMITTER_FORCE_LAYER_TYPE);

//Connect key listerners instance with the the layer sets at the layers dictionary.
const someLayerListeners = new Emitter('some layer name');
```
***releaseDelay*** - it's a delay between down and up events for release synthetic event. By default, this value sets to 150 ms.
```javascript
//Example
import { Emitter } from 'key-layers-js';

//Connect key listerners instance with the first layer and change release delay to 250 ms.
const listenersOne = new Emitter(1, 250);
```
### EMITTER_FORCE_LAYER_TYPE ###
Force executable layer index.
```javascript
//Example
import { Emitter, EMITTER_FORCE_LAYER_TYPE } from 'key-layers-js';

//Connect key listerners instance with the force executable layer.
const forceListeners = new Emitter(EMITTER_FORCE_LAYER_TYPE);
```
## Class API
### setLayersMap(firstParam[, secondParam]) ###
Sets names for the layer's index.
```javascript
//Examples
import { Emitter } from 'key-layers-js';

//Sets name for the first layer using two parameters
Emitter.setLayersMap('someLayer', 1);
const someLayerListeners = new Emitter('someLayer');

//Sets name for the first layer using two parameters
Emitter.setLayersMap(1, 'someLayer');
const someLayerListeners = new Emitter('someLayer');

//Sets name for the first layer using an object 
Emitter.setLayersMap({ name: 'someLayer', id: 1 });
const someLayerListeners = new Emitter('someLayer');

//Sets name for the first layer using an array 
Emitter.setLayersMap(['someLayer', 1]);
const someLayerListeners = new Emitter('someLayer');

//Sets name for the first layer using an array 
Emitter.setLayersMap([1, 'someLayer']);
const someLayerListeners = new Emitter('someLayer');

//Sets name for the first and second layers using an array of objects
Emitter.setLayersMap([
  { name: 'someLayer', id: 1 },
  { name: 'anotherLayer', id: 2 },
]);
const someLayerListeners = new Emitter('someLayer');
const anotherLayerListeners = new Emitter('anotherLayer');

//Sets name for the first and second layers using an array of arrays
Emitter.setLayersMap([
  ['someLayer', 1],
  ['anotherLayer', 2],
]);
const someLayerListeners = new Emitter('someLayer');
const anotherLayerListeners = new Emitter('anotherLayer');

//Sets name for the first and second layers using an array of arrays
Emitter.setLayersMap([
  [1, 'someLayer'],
  [2, 'anotherLayer'],
]);
const someLayerListeners = new Emitter('someLayer');
const anotherLayerListeners = new Emitter('anotherLayer');

//Sets name for the first and second layers using an object
Emitter.setLayersMap({
  someLayer: 1,
  anotherLayer: 2,
});
const someLayerListeners = new Emitter('someLayer');
const anotherLayerListeners = new Emitter('anotherLayer');
```
## Key listeners instance API
### addListener(type, callback[, options]) ###
Add key event listener.

***type*** - type of the event listener. It can be on of "keyDown", "keyUp", "keyPress", "keyRelease". "keyRelease" is a synthetic event of the when user downs and ups the key with delay 150 ms or less.

***callback*** - specifies the function to run when the event occurs.

***options*** - settings of the event listener.

***options.metaKey*** - a boolean parameter that allows you to set the execution of the callback only with pressed command key.

***options.ctrlKey*** - a boolean parameter that allows you to set the execution of the callback only with pressed control key.

***options.altKey*** - a boolean parameter that allows you to set the execution of the callback only with pressed alt key.

***options.shiftKey*** - a boolean parameter that allows you to set the execution of the callback only with pressed shift key.

***options.code*** - an integer parameter that allows you to set the execution of the callback only for the key matches keyCode.

***options.codes*** - an array with number that allows you to set the execution of the callback only for the key combination matches keyCodes from array.

***options.skipInput*** - a boolean parameter that allows you to set skip the execution of the callback if an input or a textarea is in a focus.

### removeListener(type, callback) ###
Remove key event listener.

***type*** - type of the event listener. It can be on of "keyDown", "keyUp", "keyPress", "keyRelease". "keyRelease" is a synthetic event of the when user downs and ups the key with delay 150 ms or less.

***callback*** - specifies the function to run when the event occurs.

### destroy() ###
Disconnect Emitter instance from the layer and remove all event listeners.
