(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],3:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":9}],6:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":26}],7:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":12}],8:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":17,"is-object":3}],9:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":15,"../vnode/is-vnode.js":18,"../vnode/is-vtext.js":19,"../vnode/is-widget.js":20,"./apply-properties":8,"global/document":2}],10:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],11:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":20,"../vnode/vpatch.js":23,"./apply-properties":8,"./update-widget":13}],12:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":9,"./dom-index":10,"./patch-op":11,"global/document":2,"x-is-array":27}],13:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":20}],14:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],15:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":16,"./is-vnode":18,"./is-vtext":19,"./is-widget":20}],16:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],17:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],18:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":21}],19:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":21}],20:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],21:[function(require,module,exports){
module.exports = "2"

},{}],22:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":16,"./is-vhook":17,"./is-vnode":18,"./is-widget":20,"./version":21}],23:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":21}],24:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":21}],25:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":17,"is-object":3}],26:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":15,"../vnode/is-thunk":16,"../vnode/is-vnode":18,"../vnode/is-vtext":19,"../vnode/is-widget":20,"../vnode/vpatch":23,"./diff-props":25,"x-is-array":27}],27:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],28:[function(require,module,exports){
(function (process){
// Generated by psc-bundle 0.10.5
var PS = {};
(function(exports) {
    "use strict";

  exports.arrayMap = function (f) {
    return function (arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Semigroupoid = function (compose) {
      this.compose = compose;
  };
  var semigroupoidFn = new Semigroupoid(function (f) {
      return function (g) {
          return function (x) {
              return f(g(x));
          };
      };
  });
  var compose = function (dict) {
      return dict.compose;
  };
  exports["Semigroupoid"] = Semigroupoid;
  exports["compose"] = compose;
  exports["semigroupoidFn"] = semigroupoidFn;
})(PS["Control.Semigroupoid"] = PS["Control.Semigroupoid"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var Category = function (__superclass_Control$dotSemigroupoid$dotSemigroupoid_0, id) {
      this["__superclass_Control.Semigroupoid.Semigroupoid_0"] = __superclass_Control$dotSemigroupoid$dotSemigroupoid_0;
      this.id = id;
  };
  var id = function (dict) {
      return dict.id;
  };
  var categoryFn = new Category(function () {
      return Control_Semigroupoid.semigroupoidFn;
  }, function (x) {
      return x;
  });
  exports["Category"] = Category;
  exports["id"] = id;
  exports["categoryFn"] = categoryFn;
})(PS["Control.Category"] = PS["Control.Category"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Control_Category = PS["Control.Category"];        
  var on = function (f) {
      return function (g) {
          return function (x) {
              return function (y) {
                  return f(g(x))(g(y));
              };
          };
      };
  };
  var flip = function (f) {
      return function (b) {
          return function (a) {
              return f(a)(b);
          };
      };
  };
  var $$const = function (a) {
      return function (v) {
          return a;
      };
  };
  exports["const"] = $$const;
  exports["flip"] = flip;
  exports["on"] = on;
})(PS["Data.Function"] = PS["Data.Function"] || {});
(function(exports) {
    "use strict";

  exports.unit = {};
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function(exports) {
    "use strict";

  exports.showIntImpl = function (n) {
    return n.toString();
  };

  exports.showStringImpl = function (s) {
    var l = s.length;
    return "\"" + s.replace(
      /[\0-\x1F\x7F"\\]/g,
      function (c, i) { // jshint ignore:line
        switch (c) {
          case "\"":
          case "\\":
            return "\\" + c;
          case "\x07": return "\\a";
          case "\b": return "\\b";
          case "\f": return "\\f";
          case "\n": return "\\n";
          case "\r": return "\\r";
          case "\t": return "\\t";
          case "\v": return "\\v";
        }
        var k = i + 1;
        var empty = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
        return "\\" + c.charCodeAt(0).toString(10) + empty;
      }
    ) + "\"";
  };
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Show"];     
  var Show = function (show) {
      this.show = show;
  };
  var showString = new Show($foreign.showStringImpl);
  var showInt = new Show($foreign.showIntImpl);
  var show = function (dict) {
      return dict.show;
  };
  exports["Show"] = Show;
  exports["show"] = show;
  exports["showInt"] = showInt;
  exports["showString"] = showString;
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Unit"];
  var Data_Show = PS["Data.Show"];
  exports["unit"] = $foreign.unit;
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Functor"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var Functor = function (map) {
      this.map = map;
  };
  var map = function (dict) {
      return dict.map;
  };
  var $$void = function (dictFunctor) {
      return map(dictFunctor)(Data_Function["const"](Data_Unit.unit));
  };
  var voidLeft = function (dictFunctor) {
      return function (f) {
          return function (x) {
              return map(dictFunctor)(Data_Function["const"](x))(f);
          };
      };
  };
  var voidRight = function (dictFunctor) {
      return function (x) {
          return map(dictFunctor)(Data_Function["const"](x));
      };
  };
  var functorFn = new Functor(Control_Semigroupoid.compose(Control_Semigroupoid.semigroupoidFn));
  var functorArray = new Functor($foreign.arrayMap);
  exports["Functor"] = Functor;
  exports["map"] = map;
  exports["void"] = $$void;
  exports["voidLeft"] = voidLeft;
  exports["voidRight"] = voidRight;
  exports["functorFn"] = functorFn;
  exports["functorArray"] = functorArray;
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
    "use strict";

  exports.concatString = function (s1) {
    return function (s2) {
      return s1 + s2;
    };
  };

  exports.concatArray = function (xs) {
    return function (ys) {
      if (xs.length === 0) return ys;
      if (ys.length === 0) return xs;
      return xs.concat(ys);
    };
  };
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Semigroup = function (append) {
      this.append = append;
  }; 
  var semigroupString = new Semigroup($foreign.concatString);
  var semigroupArray = new Semigroup($foreign.concatArray);
  var append = function (dict) {
      return dict.append;
  };
  exports["Semigroup"] = Semigroup;
  exports["append"] = append;
  exports["semigroupString"] = semigroupString;
  exports["semigroupArray"] = semigroupArray;
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Data_Functor = PS["Data.Functor"];
  var Data_Semigroup = PS["Data.Semigroup"];        
  var Alt = function (__superclass_Data$dotFunctor$dotFunctor_0, alt) {
      this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
      this.alt = alt;
  };                                                       
  var alt = function (dict) {
      return dict.alt;
  };
  exports["Alt"] = Alt;
  exports["alt"] = alt;
})(PS["Control.Alt"] = PS["Control.Alt"] || {});
(function(exports) {
    "use strict";

  exports.arrayApply = function (fs) {
    return function (xs) {
      var result = [];
      var n = 0;
      for (var i = 0, l = fs.length; i < l; i++) {
        for (var j = 0, k = xs.length; j < k; j++) {
          result[n++] = fs[i](xs[j]);
        }
      }
      return result;
    };
  };
})(PS["Control.Apply"] = PS["Control.Apply"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Function = PS["Data.Function"];
  var Control_Category = PS["Control.Category"];        
  var Apply = function (__superclass_Data$dotFunctor$dotFunctor_0, apply) {
      this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
      this.apply = apply;
  }; 
  var applyArray = new Apply(function () {
      return Data_Functor.functorArray;
  }, $foreign.arrayApply);
  var apply = function (dict) {
      return dict.apply;
  };
  var applySecond = function (dictApply) {
      return function (a) {
          return function (b) {
              return apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(Data_Function["const"](Control_Category.id(Control_Category.categoryFn)))(a))(b);
          };
      };
  };
  var lift2 = function (dictApply) {
      return function (f) {
          return function (a) {
              return function (b) {
                  return apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(f)(a))(b);
              };
          };
      };
  };
  exports["Apply"] = Apply;
  exports["apply"] = apply;
  exports["applySecond"] = applySecond;
  exports["lift2"] = lift2;
  exports["applyArray"] = applyArray;
})(PS["Control.Apply"] = PS["Control.Apply"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Applicative = function (__superclass_Control$dotApply$dotApply_0, pure) {
      this["__superclass_Control.Apply.Apply_0"] = __superclass_Control$dotApply$dotApply_0;
      this.pure = pure;
  };
  var pure = function (dict) {
      return dict.pure;
  };
  var when = function (dictApplicative) {
      return function (v) {
          return function (v1) {
              if (v) {
                  return v1;
              };
              if (!v) {
                  return pure(dictApplicative)(Data_Unit.unit);
              };
              throw new Error("Failed pattern match at Control.Applicative line 58, column 1 - line 58, column 16: " + [ v.constructor.name, v1.constructor.name ]);
          };
      };
  };
  var liftA1 = function (dictApplicative) {
      return function (f) {
          return function (a) {
              return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(pure(dictApplicative)(f))(a);
          };
      };
  };
  exports["Applicative"] = Applicative;
  exports["liftA1"] = liftA1;
  exports["pure"] = pure;
  exports["when"] = when;
})(PS["Control.Applicative"] = PS["Control.Applicative"] || {});
(function(exports) {
    "use strict";

  exports.arrayBind = function (arr) {
    return function (f) {
      var result = [];
      for (var i = 0, l = arr.length; i < l; i++) {
        Array.prototype.push.apply(result, f(arr[i]));
      }
      return result;
    };
  };
})(PS["Control.Bind"] = PS["Control.Bind"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];        
  var Bind = function (__superclass_Control$dotApply$dotApply_0, bind) {
      this["__superclass_Control.Apply.Apply_0"] = __superclass_Control$dotApply$dotApply_0;
      this.bind = bind;
  }; 
  var bindArray = new Bind(function () {
      return Control_Apply.applyArray;
  }, $foreign.arrayBind);
  var bind = function (dict) {
      return dict.bind;
  };
  var bindFlipped = function (dictBind) {
      return Data_Function.flip(bind(dictBind));
  };
  var composeKleisliFlipped = function (dictBind) {
      return function (f) {
          return function (g) {
              return function (a) {
                  return bindFlipped(dictBind)(f)(g(a));
              };
          };
      };
  };
  var composeKleisli = function (dictBind) {
      return function (f) {
          return function (g) {
              return function (a) {
                  return bind(dictBind)(f(a))(g);
              };
          };
      };
  };
  exports["Bind"] = Bind;
  exports["bind"] = bind;
  exports["bindFlipped"] = bindFlipped;
  exports["composeKleisli"] = composeKleisli;
  exports["composeKleisliFlipped"] = composeKleisliFlipped;
  exports["bindArray"] = bindArray;
})(PS["Control.Bind"] = PS["Control.Bind"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Control_Category = PS["Control.Category"];        
  var Bifunctor = function (bimap) {
      this.bimap = bimap;
  };
  var bimap = function (dict) {
      return dict.bimap;
  };
  var lmap = function (dictBifunctor) {
      return function (f) {
          return bimap(dictBifunctor)(f)(Control_Category.id(Control_Category.categoryFn));
      };
  };
  var rmap = function (dictBifunctor) {
      return bimap(dictBifunctor)(Control_Category.id(Control_Category.categoryFn));
  };
  exports["Bifunctor"] = Bifunctor;
  exports["bimap"] = bimap;
  exports["lmap"] = lmap;
  exports["rmap"] = rmap;
})(PS["Data.Bifunctor"] = PS["Data.Bifunctor"] || {});
(function(exports) {
    "use strict";

  exports.foldrArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };

  exports.foldlArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Data_Functor = PS["Data.Functor"];        
  var Plus = function (__superclass_Control$dotAlt$dotAlt_0, empty) {
      this["__superclass_Control.Alt.Alt_0"] = __superclass_Control$dotAlt$dotAlt_0;
      this.empty = empty;
  };       
  var empty = function (dict) {
      return dict.empty;
  };
  exports["Plus"] = Plus;
  exports["empty"] = empty;
})(PS["Control.Plus"] = PS["Control.Plus"] || {});
(function(exports) {
    "use strict";

  exports.refEq = function (r1) {
    return function (r2) {
      return r1 === r2;
    };
  };
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Eq"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Eq = function (eq) {
      this.eq = eq;
  }; 
  var eqString = new Eq($foreign.refEq);
  var eqChar = new Eq($foreign.refEq);
  var eqBoolean = new Eq($foreign.refEq);
  var eq = function (dict) {
      return dict.eq;
  };
  var notEq = function (dictEq) {
      return function (x) {
          return function (y) {
              return eq(eqBoolean)(eq(dictEq)(x)(y))(false);
          };
      };
  };
  exports["Eq"] = Eq;
  exports["eq"] = eq;
  exports["notEq"] = notEq;
  exports["eqBoolean"] = eqBoolean;
  exports["eqChar"] = eqChar;
  exports["eqString"] = eqString;
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
(function(exports) {
    "use strict";

  exports.unsafeCompareImpl = function (lt) {
    return function (eq) {
      return function (gt) {
        return function (x) {
          return function (y) {
            return x < y ? lt : x === y ? eq : gt;
          };
        };
      };
    };
  };
})(PS["Data.Ord.Unsafe"] = PS["Data.Ord.Unsafe"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Data_Eq = PS["Data.Eq"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];        
  var LT = (function () {
      function LT() {

      };
      LT.value = new LT();
      return LT;
  })();
  var GT = (function () {
      function GT() {

      };
      GT.value = new GT();
      return GT;
  })();
  var EQ = (function () {
      function EQ() {

      };
      EQ.value = new EQ();
      return EQ;
  })();
  exports["LT"] = LT;
  exports["GT"] = GT;
  exports["EQ"] = EQ;
})(PS["Data.Ordering"] = PS["Data.Ordering"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Ord.Unsafe"];
  var Data_Ordering = PS["Data.Ordering"];        
  var unsafeCompare = $foreign.unsafeCompareImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value);
  exports["unsafeCompare"] = unsafeCompare;
})(PS["Data.Ord.Unsafe"] = PS["Data.Ord.Unsafe"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Ord"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Ord_Unsafe = PS["Data.Ord.Unsafe"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];
  var Data_Semiring = PS["Data.Semiring"];        
  var Ord = function (__superclass_Data$dotEq$dotEq_0, compare) {
      this["__superclass_Data.Eq.Eq_0"] = __superclass_Data$dotEq$dotEq_0;
      this.compare = compare;
  }; 
  var ordString = new Ord(function () {
      return Data_Eq.eqString;
  }, Data_Ord_Unsafe.unsafeCompare);
  var ordChar = new Ord(function () {
      return Data_Eq.eqChar;
  }, Data_Ord_Unsafe.unsafeCompare);
  var compare = function (dict) {
      return dict.compare;
  };
  exports["Ord"] = Ord;
  exports["compare"] = compare;
  exports["ordString"] = ordString;
  exports["ordChar"] = ordChar;
})(PS["Data.Ord"] = PS["Data.Ord"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var otherwise = true;
  exports["otherwise"] = otherwise;
})(PS["Data.Boolean"] = PS["Data.Boolean"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Function = PS["Data.Function"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Boolean = PS["Data.Boolean"];        
  var Monoid = function (__superclass_Data$dotSemigroup$dotSemigroup_0, mempty) {
      this["__superclass_Data.Semigroup.Semigroup_0"] = __superclass_Data$dotSemigroup$dotSemigroup_0;
      this.mempty = mempty;
  };                 
  var monoidString = new Monoid(function () {
      return Data_Semigroup.semigroupString;
  }, "");
  var monoidArray = new Monoid(function () {
      return Data_Semigroup.semigroupArray;
  }, [  ]);
  var mempty = function (dict) {
      return dict.mempty;
  };
  exports["Monoid"] = Monoid;
  exports["mempty"] = mempty;
  exports["monoidString"] = monoidString;
  exports["monoidArray"] = monoidArray;
})(PS["Data.Monoid"] = PS["Data.Monoid"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Monad = function (__superclass_Control$dotApplicative$dotApplicative_0, __superclass_Control$dotBind$dotBind_1) {
      this["__superclass_Control.Applicative.Applicative_0"] = __superclass_Control$dotApplicative$dotApplicative_0;
      this["__superclass_Control.Bind.Bind_1"] = __superclass_Control$dotBind$dotBind_1;
  };
  var ap = function (dictMonad) {
      return function (f) {
          return function (a) {
              return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(f)(function (v) {
                  return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(a)(function (v1) {
                      return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(v(v1));
                  });
              });
          };
      };
  };
  exports["Monad"] = Monad;
  exports["ap"] = ap;
})(PS["Control.Monad"] = PS["Control.Monad"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Extend = PS["Control.Extend"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Function = PS["Data.Function"];
  var Control_Category = PS["Control.Category"];        
  var Nothing = (function () {
      function Nothing() {

      };
      Nothing.value = new Nothing();
      return Nothing;
  })();
  var Just = (function () {
      function Just(value0) {
          this.value0 = value0;
      };
      Just.create = function (value0) {
          return new Just(value0);
      };
      return Just;
  })();
  var maybe = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Nothing) {
                  return v;
              };
              if (v2 instanceof Just) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Maybe line 214, column 1 - line 214, column 22: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var isNothing = maybe(true)(Data_Function["const"](false));
  var isJust = maybe(false)(Data_Function["const"](true));
  var functorMaybe = new Data_Functor.Functor(function (v) {
      return function (v1) {
          if (v1 instanceof Just) {
              return new Just(v(v1.value0));
          };
          return Nothing.value;
      };
  });
  var fromMaybe = function (a) {
      return maybe(a)(Control_Category.id(Control_Category.categoryFn));
  };
  var applyMaybe = new Control_Apply.Apply(function () {
      return functorMaybe;
  }, function (v) {
      return function (v1) {
          if (v instanceof Just) {
              return Data_Functor.map(functorMaybe)(v.value0)(v1);
          };
          if (v instanceof Nothing) {
              return Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Maybe line 67, column 3 - line 67, column 31: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  exports["Nothing"] = Nothing;
  exports["Just"] = Just;
  exports["fromMaybe"] = fromMaybe;
  exports["isJust"] = isJust;
  exports["isNothing"] = isNothing;
  exports["maybe"] = maybe;
  exports["functorMaybe"] = functorMaybe;
  exports["applyMaybe"] = applyMaybe;
})(PS["Data.Maybe"] = PS["Data.Maybe"] || {});
(function(exports) {
    "use strict";

  exports.boolConj = function (b1) {
    return function (b2) {
      return b1 && b2;
    };
  };

  exports.boolDisj = function (b1) {
    return function (b2) {
      return b1 || b2;
    };
  };

  exports.boolNot = function (b) {
    return !b;
  };
})(PS["Data.HeytingAlgebra"] = PS["Data.HeytingAlgebra"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.HeytingAlgebra"];
  var Data_Unit = PS["Data.Unit"];        
  var HeytingAlgebra = function (conj, disj, ff, implies, not, tt) {
      this.conj = conj;
      this.disj = disj;
      this.ff = ff;
      this.implies = implies;
      this.not = not;
      this.tt = tt;
  };
  var tt = function (dict) {
      return dict.tt;
  };
  var not = function (dict) {
      return dict.not;
  };
  var implies = function (dict) {
      return dict.implies;
  };                 
  var ff = function (dict) {
      return dict.ff;
  };
  var disj = function (dict) {
      return dict.disj;
  };
  var heytingAlgebraBoolean = new HeytingAlgebra($foreign.boolConj, $foreign.boolDisj, false, function (a) {
      return function (b) {
          return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
      };
  }, $foreign.boolNot, true);
  var conj = function (dict) {
      return dict.conj;
  };
  exports["HeytingAlgebra"] = HeytingAlgebra;
  exports["conj"] = conj;
  exports["disj"] = disj;
  exports["ff"] = ff;
  exports["implies"] = implies;
  exports["not"] = not;
  exports["tt"] = tt;
  exports["heytingAlgebraBoolean"] = heytingAlgebraBoolean;
})(PS["Data.HeytingAlgebra"] = PS["Data.HeytingAlgebra"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Function = PS["Data.Function"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Functor = PS["Data.Functor"];        
  var Newtype = function (unwrap, wrap) {
      this.unwrap = unwrap;
      this.wrap = wrap;
  };
  var wrap = function (dict) {
      return dict.wrap;
  };
  var unwrap = function (dict) {
      return dict.unwrap;
  };
  var alaF = function (dictFunctor) {
      return function (dictFunctor1) {
          return function (dictNewtype) {
              return function (dictNewtype1) {
                  return function (v) {
                      return function (f) {
                          return function ($64) {
                              return Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1))(f(Data_Functor.map(dictFunctor)(wrap(dictNewtype))($64)));
                          };
                      };
                  };
              };
          };
      };
  };
  exports["Newtype"] = Newtype;
  exports["alaF"] = alaF;
  exports["unwrap"] = unwrap;
  exports["wrap"] = wrap;
})(PS["Data.Newtype"] = PS["Data.Newtype"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];        
  var Disj = function (x) {
      return x;
  };
  var semigroupDisj = function (dictHeytingAlgebra) {
      return new Data_Semigroup.Semigroup(function (v) {
          return function (v1) {
              return Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v)(v1);
          };
      });
  };
  var newtypeDisj = new Data_Newtype.Newtype(function (n) {
      return n;
  }, Disj);
  var monoidDisj = function (dictHeytingAlgebra) {
      return new Data_Monoid.Monoid(function () {
          return semigroupDisj(dictHeytingAlgebra);
      }, Data_HeytingAlgebra.ff(dictHeytingAlgebra));
  };
  exports["Disj"] = Disj;
  exports["newtypeDisj"] = newtypeDisj;
  exports["semigroupDisj"] = semigroupDisj;
  exports["monoidDisj"] = monoidDisj;
})(PS["Data.Monoid.Disj"] = PS["Data.Monoid.Disj"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Foldable"];
  var Prelude = PS["Prelude"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Endo = PS["Data.Monoid.Endo"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Newtype = PS["Data.Newtype"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Function = PS["Data.Function"];
  var Control_Category = PS["Control.Category"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];        
  var Foldable = function (foldMap, foldl, foldr) {
      this.foldMap = foldMap;
      this.foldl = foldl;
      this.foldr = foldr;
  };
  var foldr = function (dict) {
      return dict.foldr;
  };
  var traverse_ = function (dictApplicative) {
      return function (dictFoldable) {
          return function (f) {
              return foldr(dictFoldable)(function ($169) {
                  return Control_Apply.applySecond(dictApplicative["__superclass_Control.Apply.Apply_0"]())(f($169));
              })(Control_Applicative.pure(dictApplicative)(Data_Unit.unit));
          };
      };
  };
  var for_ = function (dictApplicative) {
      return function (dictFoldable) {
          return Data_Function.flip(traverse_(dictApplicative)(dictFoldable));
      };
  };
  var foldl = function (dict) {
      return dict.foldl;
  };
  var intercalate = function (dictFoldable) {
      return function (dictMonoid) {
          return function (sep) {
              return function (xs) {
                  var go = function (v) {
                      return function (x) {
                          if (v.init) {
                              return {
                                  init: false, 
                                  acc: x
                              };
                          };
                          return {
                              init: false, 
                              acc: Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(v.acc)(Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(sep)(x))
                          };
                      };
                  };
                  return (foldl(dictFoldable)(go)({
                      init: true, 
                      acc: Data_Monoid.mempty(dictMonoid)
                  })(xs)).acc;
              };
          };
      };
  }; 
  var foldMapDefaultR = function (dictFoldable) {
      return function (dictMonoid) {
          return function (f) {
              return function (xs) {
                  return foldr(dictFoldable)(function (x) {
                      return function (acc) {
                          return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(f(x))(acc);
                      };
                  })(Data_Monoid.mempty(dictMonoid))(xs);
              };
          };
      };
  };
  var foldableArray = new Foldable(function (dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
  }, $foreign.foldlArray, $foreign.foldrArray);
  var foldMap = function (dict) {
      return dict.foldMap;
  };
  var fold = function (dictFoldable) {
      return function (dictMonoid) {
          return foldMap(dictFoldable)(dictMonoid)(Control_Category.id(Control_Category.categoryFn));
      };
  };
  var any = function (dictFoldable) {
      return function (dictHeytingAlgebra) {
          return function (p) {
              return Data_Newtype.alaF(Data_Functor.functorFn)(Data_Functor.functorFn)(Data_Monoid_Disj.newtypeDisj)(Data_Monoid_Disj.newtypeDisj)(Data_Monoid_Disj.Disj)(foldMap(dictFoldable)(Data_Monoid_Disj.monoidDisj(dictHeytingAlgebra)))(p);
          };
      };
  };
  exports["Foldable"] = Foldable;
  exports["any"] = any;
  exports["fold"] = fold;
  exports["foldMap"] = foldMap;
  exports["foldMapDefaultR"] = foldMapDefaultR;
  exports["foldl"] = foldl;
  exports["foldr"] = foldr;
  exports["for_"] = for_;
  exports["intercalate"] = intercalate;
  exports["traverse_"] = traverse_;
  exports["foldableArray"] = foldableArray;
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
    "use strict";

  // jshint maxparams: 3

  exports.traverseArrayImpl = function () {
    function Cont(fn) {
      this.fn = fn;
    }

    var emptyList = {};

    var ConsCell = function (head, tail) {
      this.head = head;
      this.tail = tail;
    };

    function consList(x) {
      return function (xs) {
        return new ConsCell(x, xs);
      };
    }

    function listToArray(list) {
      var arr = [];
      while (list !== emptyList) {
        arr.push(list.head);
        list = list.tail;
      }
      return arr;
    }

    return function (apply) {
      return function (map) {
        return function (pure) {
          return function (f) {
            var buildFrom = function (x, ys) {
              return apply(map(consList)(f(x)))(ys);
            };

            var go = function (acc, currentLen, xs) {
              if (currentLen === 0) {
                return acc;
              } else {
                var last = xs[currentLen - 1];
                return new Cont(function () {
                  return go(buildFrom(last, acc), currentLen - 1, xs);
                });
              }
            };

            return function (array) {
              var result = go(pure(emptyList), array.length, array);
              while (result instanceof Cont) {
                result = result.fn();
              }

              return map(listToArray)(result);
            };
          };
        };
      };
    };
  }();
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Category = PS["Control.Category"];
  var Traversable = function (__superclass_Data$dotFoldable$dotFoldable_1, __superclass_Data$dotFunctor$dotFunctor_0, sequence, traverse) {
      this["__superclass_Data.Foldable.Foldable_1"] = __superclass_Data$dotFoldable$dotFoldable_1;
      this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
      this.sequence = sequence;
      this.traverse = traverse;
  };
  var traverse = function (dict) {
      return dict.traverse;
  };
  var sequenceDefault = function (dictTraversable) {
      return function (dictApplicative) {
          return function (tma) {
              return traverse(dictTraversable)(dictApplicative)(Control_Category.id(Control_Category.categoryFn))(tma);
          };
      };
  };
  var traversableArray = new Traversable(function () {
      return Data_Foldable.foldableArray;
  }, function () {
      return Data_Functor.functorArray;
  }, function (dictApplicative) {
      return sequenceDefault(traversableArray)(dictApplicative);
  }, function (dictApplicative) {
      return $foreign.traverseArrayImpl(Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]()))(Data_Functor.map((dictApplicative["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]()))(Control_Applicative.pure(dictApplicative));
  });
  var sequence = function (dict) {
      return dict.sequence;
  };
  exports["Traversable"] = Traversable;
  exports["sequence"] = sequence;
  exports["sequenceDefault"] = sequenceDefault;
  exports["traverse"] = traverse;
  exports["traversableArray"] = traversableArray;
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Extend = PS["Control.Extend"];
  var Data_Bifoldable = PS["Data.Bifoldable"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Bitraversable = PS["Data.Bitraversable"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Function = PS["Data.Function"];        
  var Left = (function () {
      function Left(value0) {
          this.value0 = value0;
      };
      Left.create = function (value0) {
          return new Left(value0);
      };
      return Left;
  })();
  var Right = (function () {
      function Right(value0) {
          this.value0 = value0;
      };
      Right.create = function (value0) {
          return new Right(value0);
      };
      return Right;
  })();
  var functorEither = new Data_Functor.Functor(function (v) {
      return function (v1) {
          if (v1 instanceof Left) {
              return new Left(v1.value0);
          };
          if (v1 instanceof Right) {
              return new Right(v(v1.value0));
          };
          throw new Error("Failed pattern match at Data.Either line 35, column 3 - line 35, column 26: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var either = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return v(v2.value0);
              };
              if (v2 instanceof Right) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Either line 224, column 1 - line 224, column 26: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var bifunctorEither = new Data_Bifunctor.Bifunctor(function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return new Left(v(v2.value0));
              };
              if (v2 instanceof Right) {
                  return new Right(v1(v2.value0));
              };
              throw new Error("Failed pattern match at Data.Either line 42, column 3 - line 42, column 34: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  });
  var applyEither = new Control_Apply.Apply(function () {
      return functorEither;
  }, function (v) {
      return function (v1) {
          if (v instanceof Left) {
              return new Left(v.value0);
          };
          if (v instanceof Right) {
              return Data_Functor.map(functorEither)(v.value0)(v1);
          };
          throw new Error("Failed pattern match at Data.Either line 78, column 3 - line 78, column 28: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  exports["Left"] = Left;
  exports["Right"] = Right;
  exports["either"] = either;
  exports["functorEither"] = functorEither;
  exports["bifunctorEither"] = bifunctorEither;
  exports["applyEither"] = applyEither;
})(PS["Data.Either"] = PS["Data.Either"] || {});
(function(exports) {
    "use strict";

  // module Unsafe.Coerce

  exports.unsafeCoerce = function (x) {
    return x;
  };
})(PS["Unsafe.Coerce"] = PS["Unsafe.Coerce"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Unsafe.Coerce"];
  exports["unsafeCoerce"] = $foreign.unsafeCoerce;
})(PS["Unsafe.Coerce"] = PS["Unsafe.Coerce"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var runExists = Unsafe_Coerce.unsafeCoerce;
  var mkExists = Unsafe_Coerce.unsafeCoerce;
  exports["mkExists"] = mkExists;
  exports["runExists"] = runExists;
})(PS["Data.Exists"] = PS["Data.Exists"] || {});
(function(exports) {
    "use strict";

  exports.pureE = function (a) {
    return function () {
      return a;
    };
  };

  exports.bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Monad.Eff"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var monadEff = new Control_Monad.Monad(function () {
      return applicativeEff;
  }, function () {
      return bindEff;
  });
  var bindEff = new Control_Bind.Bind(function () {
      return applyEff;
  }, $foreign.bindE);
  var applyEff = new Control_Apply.Apply(function () {
      return functorEff;
  }, Control_Monad.ap(monadEff));
  var applicativeEff = new Control_Applicative.Applicative(function () {
      return applyEff;
  }, $foreign.pureE);
  var functorEff = new Data_Functor.Functor(Control_Applicative.liftA1(applicativeEff));
  exports["functorEff"] = functorEff;
  exports["applyEff"] = applyEff;
  exports["applicativeEff"] = applicativeEff;
  exports["bindEff"] = bindEff;
  exports["monadEff"] = monadEff;
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_BooleanAlgebra = PS["Data.BooleanAlgebra"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Ring = PS["Data.Ring"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_Field = PS["Data.Field"];
  var Data_Show = PS["Data.Show"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];        
  var Identity = function (x) {
      return x;
  };
  var newtypeIdentity = new Data_Newtype.Newtype(function (n) {
      return n;
  }, Identity);
  var functorIdentity = new Data_Functor.Functor(function (f) {
      return function (v) {
          return f(v);
      };
  });
  var applyIdentity = new Control_Apply.Apply(function () {
      return functorIdentity;
  }, function (v) {
      return function (v1) {
          return v(v1);
      };
  });
  var bindIdentity = new Control_Bind.Bind(function () {
      return applyIdentity;
  }, function (v) {
      return function (f) {
          return f(v);
      };
  });
  var applicativeIdentity = new Control_Applicative.Applicative(function () {
      return applyIdentity;
  }, Identity);
  var monadIdentity = new Control_Monad.Monad(function () {
      return applicativeIdentity;
  }, function () {
      return bindIdentity;
  });
  exports["Identity"] = Identity;
  exports["newtypeIdentity"] = newtypeIdentity;
  exports["functorIdentity"] = functorIdentity;
  exports["applyIdentity"] = applyIdentity;
  exports["applicativeIdentity"] = applicativeIdentity;
  exports["bindIdentity"] = bindIdentity;
  exports["monadIdentity"] = monadIdentity;
})(PS["Data.Identity"] = PS["Data.Identity"] || {});
(function(exports) {
    "use strict";

  // module Partial.Unsafe

  exports.unsafePartial = function (f) {
    return f();
  };
})(PS["Partial.Unsafe"] = PS["Partial.Unsafe"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Partial.Unsafe"];
  var Partial = PS["Partial"];
  exports["unsafePartial"] = $foreign.unsafePartial;
})(PS["Partial.Unsafe"] = PS["Partial.Unsafe"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Unsafe = PS["Control.Monad.Eff.Unsafe"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Either = PS["Data.Either"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Unit = PS["Data.Unit"];        
  var Loop = (function () {
      function Loop(value0) {
          this.value0 = value0;
      };
      Loop.create = function (value0) {
          return new Loop(value0);
      };
      return Loop;
  })();
  var Done = (function () {
      function Done(value0) {
          this.value0 = value0;
      };
      Done.create = function (value0) {
          return new Done(value0);
      };
      return Done;
  })();
  var MonadRec = function (__superclass_Control$dotMonad$dotMonad_0, tailRecM) {
      this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
      this.tailRecM = tailRecM;
  };
  var tailRecM = function (dict) {
      return dict.tailRecM;
  }; 
  var forever = function (dictMonadRec) {
      return function (ma) {
          return tailRecM(dictMonadRec)(function (u) {
              return Data_Functor.voidRight((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(new Loop(u))(ma);
          })(Data_Unit.unit);
      };
  };
  exports["Loop"] = Loop;
  exports["Done"] = Done;
  exports["MonadRec"] = MonadRec;
  exports["forever"] = forever;
  exports["tailRecM"] = tailRecM;
})(PS["Control.Monad.Rec.Class"] = PS["Control.Monad.Rec.Class"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];        
  var MonadTrans = function (lift) {
      this.lift = lift;
  };
  var lift = function (dict) {
      return dict.lift;
  };
  exports["MonadTrans"] = MonadTrans;
  exports["lift"] = lift;
})(PS["Control.Monad.Trans.Class"] = PS["Control.Monad.Trans.Class"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Exists = PS["Data.Exists"];
  var Data_Monoid = PS["Data.Monoid"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Category = PS["Control.Category"];        
  var Bound = (function () {
      function Bound(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Bound.create = function (value0) {
          return function (value1) {
              return new Bound(value0, value1);
          };
      };
      return Bound;
  })();
  var FreeT = (function () {
      function FreeT(value0) {
          this.value0 = value0;
      };
      FreeT.create = function (value0) {
          return new FreeT(value0);
      };
      return FreeT;
  })();
  var Bind = (function () {
      function Bind(value0) {
          this.value0 = value0;
      };
      Bind.create = function (value0) {
          return new Bind(value0);
      };
      return Bind;
  })();
  var monadTransFreeT = function (dictFunctor) {
      return new Control_Monad_Trans_Class.MonadTrans(function (dictMonad) {
          return function (ma) {
              return new FreeT(function (v) {
                  return Data_Functor.map(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Either.Left.create)(ma);
              });
          };
      });
  };
  var freeT = FreeT.create;
  var bound = function (m) {
      return function (f) {
          return new Bind(Data_Exists.mkExists(new Bound(m, f)));
      };
  };
  var functorFreeT = function (dictFunctor) {
      return function (dictFunctor1) {
          return new Data_Functor.Functor(function (f) {
              return function (v) {
                  if (v instanceof FreeT) {
                      return new FreeT(function (v1) {
                          return Data_Functor.map(dictFunctor1)(Data_Bifunctor.bimap(Data_Either.bifunctorEither)(f)(Data_Functor.map(dictFunctor)(Data_Functor.map(functorFreeT(dictFunctor)(dictFunctor1))(f))))(v.value0(Data_Unit.unit));
                      });
                  };
                  if (v instanceof Bind) {
                      return Data_Exists.runExists(function (v1) {
                          return bound(v1.value0)(function ($100) {
                              return Data_Functor.map(functorFreeT(dictFunctor)(dictFunctor1))(f)(v1.value1($100));
                          });
                      })(v.value0);
                  };
                  throw new Error("Failed pattern match at Control.Monad.Free.Trans line 55, column 3 - line 55, column 69: " + [ f.constructor.name, v.constructor.name ]);
              };
          });
      };
  };
  var bimapFreeT = function (dictFunctor) {
      return function (dictFunctor1) {
          return function (nf) {
              return function (nm) {
                  return function (v) {
                      if (v instanceof Bind) {
                          return Data_Exists.runExists(function (v1) {
                              return bound(function ($101) {
                                  return bimapFreeT(dictFunctor)(dictFunctor1)(nf)(nm)(v1.value0($101));
                              })(function ($102) {
                                  return bimapFreeT(dictFunctor)(dictFunctor1)(nf)(nm)(v1.value1($102));
                              });
                          })(v.value0);
                      };
                      if (v instanceof FreeT) {
                          return new FreeT(function (v1) {
                              return Data_Functor.map(dictFunctor1)(Data_Functor.map(Data_Either.functorEither)(function ($103) {
                                  return nf(Data_Functor.map(dictFunctor)(bimapFreeT(dictFunctor)(dictFunctor1)(nf)(nm))($103));
                              }))(nm(v.value0(Data_Unit.unit)));
                          });
                      };
                      throw new Error("Failed pattern match at Control.Monad.Free.Trans line 101, column 1 - line 101, column 114: " + [ nf.constructor.name, nm.constructor.name, v.constructor.name ]);
                  };
              };
          };
      };
  };
  var hoistFreeT = function (dictFunctor) {
      return function (dictFunctor1) {
          return bimapFreeT(dictFunctor)(dictFunctor1)(Control_Category.id(Control_Category.categoryFn));
      };
  };
  var monadFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return new Control_Monad.Monad(function () {
              return applicativeFreeT(dictFunctor)(dictMonad);
          }, function () {
              return bindFreeT(dictFunctor)(dictMonad);
          });
      };
  };
  var bindFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return new Control_Bind.Bind(function () {
              return applyFreeT(dictFunctor)(dictMonad);
          }, function (v) {
              return function (f) {
                  if (v instanceof Bind) {
                      return Data_Exists.runExists(function (v1) {
                          return bound(v1.value0)(function (x) {
                              return bound(function (v2) {
                                  return v1.value1(x);
                              })(f);
                          });
                      })(v.value0);
                  };
                  return bound(function (v1) {
                      return v;
                  })(f);
              };
          });
      };
  };
  var applyFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return new Control_Apply.Apply(function () {
              return functorFreeT(dictFunctor)(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
          }, Control_Monad.ap(monadFreeT(dictFunctor)(dictMonad)));
      };
  };
  var applicativeFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return new Control_Applicative.Applicative(function () {
              return applyFreeT(dictFunctor)(dictMonad);
          }, function (a) {
              return new FreeT(function (v) {
                  return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Either.Left(a));
              });
          });
      };
  };
  var liftFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return function (fa) {
              return new FreeT(function (v) {
                  return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Either.Right(Data_Functor.map(dictFunctor)(Control_Applicative.pure(applicativeFreeT(dictFunctor)(dictMonad)))(fa)));
              });
          };
      };
  };
  var resume = function (dictFunctor) {
      return function (dictMonadRec) {
          var go = function (v) {
              if (v instanceof FreeT) {
                  return Data_Functor.map((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Monad_Rec_Class.Done.create)(v.value0(Data_Unit.unit));
              };
              if (v instanceof Bind) {
                  return Data_Exists.runExists(function (v1) {
                      var $82 = v1.value0(Data_Unit.unit);
                      if ($82 instanceof FreeT) {
                          return Control_Bind.bind((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())($82.value0(Data_Unit.unit))(function (v2) {
                              if (v2 instanceof Data_Either.Left) {
                                  return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Control_Monad_Rec_Class.Loop(v1.value1(v2.value0)));
                              };
                              if (v2 instanceof Data_Either.Right) {
                                  return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Control_Monad_Rec_Class.Done(new Data_Either.Right(Data_Functor.map(dictFunctor)(function (h) {
                                      return Control_Bind.bind(bindFreeT(dictFunctor)(dictMonadRec["__superclass_Control.Monad.Monad_0"]()))(h)(v1.value1);
                                  })(v2.value0))));
                              };
                              throw new Error("Failed pattern match at Control.Monad.Free.Trans line 49, column 20 - line 51, column 67: " + [ v2.constructor.name ]);
                          });
                      };
                      if ($82 instanceof Bind) {
                          return Data_Exists.runExists(function (v2) {
                              return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Control_Monad_Rec_Class.Loop(Control_Bind.bind(bindFreeT(dictFunctor)(dictMonadRec["__superclass_Control.Monad.Monad_0"]()))(v2.value0(Data_Unit.unit))(function (z) {
                                  return Control_Bind.bind(bindFreeT(dictFunctor)(dictMonadRec["__superclass_Control.Monad.Monad_0"]()))(v2.value1(z))(v1.value1);
                              })));
                          })($82.value0);
                      };
                      throw new Error("Failed pattern match at Control.Monad.Free.Trans line 47, column 5 - line 52, column 98: " + [ $82.constructor.name ]);
                  })(v.value0);
              };
              throw new Error("Failed pattern match at Control.Monad.Free.Trans line 45, column 3 - line 45, column 35: " + [ v.constructor.name ]);
          };
          return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(go);
      };
  };
  var runFreeT = function (dictFunctor) {
      return function (dictMonadRec) {
          return function (interp) {
              var go = function (v) {
                  if (v instanceof Data_Either.Left) {
                      return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Control_Monad_Rec_Class.Done(v.value0));
                  };
                  if (v instanceof Data_Either.Right) {
                      return Data_Functor.map((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Monad_Rec_Class.Loop.create)(interp(v.value0));
                  };
                  throw new Error("Failed pattern match at Control.Monad.Free.Trans line 109, column 3 - line 109, column 30: " + [ v.constructor.name ]);
              };
              return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(Control_Bind.composeKleisliFlipped((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(go)(resume(dictFunctor)(dictMonadRec)));
          };
      };
  };
  var monadRecFreeT = function (dictFunctor) {
      return function (dictMonad) {
          return new Control_Monad_Rec_Class.MonadRec(function () {
              return monadFreeT(dictFunctor)(dictMonad);
          }, function (f) {
              var go = function (s) {
                  return Control_Bind.bind(bindFreeT(dictFunctor)(dictMonad))(f(s))(function (v) {
                      if (v instanceof Control_Monad_Rec_Class.Loop) {
                          return go(v.value0);
                      };
                      if (v instanceof Control_Monad_Rec_Class.Done) {
                          return Control_Applicative.pure(applicativeFreeT(dictFunctor)(dictMonad))(v.value0);
                      };
                      throw new Error("Failed pattern match at Control.Monad.Free.Trans line 77, column 15 - line 79, column 25: " + [ v.constructor.name ]);
                  });
              };
              return go;
          });
      };
  };
  exports["bimapFreeT"] = bimapFreeT;
  exports["freeT"] = freeT;
  exports["hoistFreeT"] = hoistFreeT;
  exports["liftFreeT"] = liftFreeT;
  exports["resume"] = resume;
  exports["runFreeT"] = runFreeT;
  exports["functorFreeT"] = functorFreeT;
  exports["applyFreeT"] = applyFreeT;
  exports["applicativeFreeT"] = applicativeFreeT;
  exports["bindFreeT"] = bindFreeT;
  exports["monadFreeT"] = monadFreeT;
  exports["monadTransFreeT"] = monadTransFreeT;
  exports["monadRecFreeT"] = monadRecFreeT;
})(PS["Control.Monad.Free.Trans"] = PS["Control.Monad.Free.Trans"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];        
  var MonadError = function (__superclass_Control$dotMonad$dotMonad_0, catchError, throwError) {
      this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
      this.catchError = catchError;
      this.throwError = throwError;
  };
  var throwError = function (dict) {
      return dict.throwError;
  };                          
  var catchError = function (dict) {
      return dict.catchError;
  };
  exports["MonadError"] = MonadError;
  exports["catchError"] = catchError;
  exports["throwError"] = throwError;
})(PS["Control.Monad.Error.Class"] = PS["Control.Monad.Error.Class"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Control_Category = PS["Control.Category"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];        
  var MonadEff = function (__superclass_Control$dotMonad$dotMonad_0, liftEff) {
      this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
      this.liftEff = liftEff;
  };
  var monadEffEff = new MonadEff(function () {
      return Control_Monad_Eff.monadEff;
  }, Control_Category.id(Control_Category.categoryFn));
  var liftEff = function (dict) {
      return dict.liftEff;
  };
  exports["MonadEff"] = MonadEff;
  exports["liftEff"] = liftEff;
  exports["monadEffEff"] = monadEffEff;
})(PS["Control.Monad.Eff.Class"] = PS["Control.Monad.Eff.Class"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Biapplicative = PS["Control.Biapplicative"];
  var Control_Biapply = PS["Control.Biapply"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Lazy = PS["Control.Lazy"];
  var Data_Bifoldable = PS["Data.Bifoldable"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Bitraversable = PS["Data.Bitraversable"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Bounded = PS["Data.Bounded"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Ring = PS["Data.Ring"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_BooleanAlgebra = PS["Data.BooleanAlgebra"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];        
  var Tuple = (function () {
      function Tuple(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Tuple.create = function (value0) {
          return function (value1) {
              return new Tuple(value0, value1);
          };
      };
      return Tuple;
  })();
  var snd = function (v) {
      return v.value1;
  };                                                                                                    
  var fst = function (v) {
      return v.value0;
  };
  exports["Tuple"] = Tuple;
  exports["fst"] = fst;
  exports["snd"] = snd;
})(PS["Data.Tuple"] = PS["Data.Tuple"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];        
  var MonadState = function (__superclass_Control$dotMonad$dotMonad_0, state) {
      this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
      this.state = state;
  };
  var state = function (dict) {
      return dict.state;
  };
  var modify = function (dictMonadState) {
      return function (f) {
          return state(dictMonadState)(function (s) {
              return new Data_Tuple.Tuple(Data_Unit.unit, f(s));
          });
      };
  };
  var get = function (dictMonadState) {
      return state(dictMonadState)(function (s) {
          return new Data_Tuple.Tuple(s, s);
      });
  };
  exports["MonadState"] = MonadState;
  exports["get"] = get;
  exports["modify"] = modify;
  exports["state"] = state;
})(PS["Control.Monad.State.Class"] = PS["Control.Monad.State.Class"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Monad_Cont_Class = PS["Control.Monad.Cont.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Reader_Class = PS["Control.Monad.Reader.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Either = PS["Data.Either"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Function = PS["Data.Function"];
  var Control_Category = PS["Control.Category"];        
  var ExceptT = function (x) {
      return x;
  };
  var runExceptT = function (v) {
      return v;
  }; 
  var mapExceptT = function (f) {
      return function (v) {
          return f(v);
      };
  };
  var functorExceptT = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return mapExceptT(Data_Functor.map(dictFunctor)(Data_Functor.map(Data_Either.functorEither)(f)));
      });
  };
  var except = function (dictApplicative) {
      return function ($87) {
          return ExceptT(Control_Applicative.pure(dictApplicative)($87));
      };
  };
  var monadExceptT = function (dictMonad) {
      return new Control_Monad.Monad(function () {
          return applicativeExceptT(dictMonad);
      }, function () {
          return bindExceptT(dictMonad);
      });
  };
  var bindExceptT = function (dictMonad) {
      return new Control_Bind.Bind(function () {
          return applyExceptT(dictMonad);
      }, function (v) {
          return function (k) {
              return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(Data_Either.either(function ($88) {
                  return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Either.Left.create($88));
              })(function (a) {
                  var $56 = k(a);
                  return $56;
              }));
          };
      });
  };
  var applyExceptT = function (dictMonad) {
      return new Control_Apply.Apply(function () {
          return functorExceptT(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
      }, Control_Monad.ap(monadExceptT(dictMonad)));
  };
  var applicativeExceptT = function (dictMonad) {
      return new Control_Applicative.Applicative(function () {
          return applyExceptT(dictMonad);
      }, function ($89) {
          return ExceptT(Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Either.Right.create($89)));
      });
  };
  var monadErrorExceptT = function (dictMonad) {
      return new Control_Monad_Error_Class.MonadError(function () {
          return monadExceptT(dictMonad);
      }, function (v) {
          return function (k) {
              return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(Data_Either.either(function (a) {
                  var $60 = k(a);
                  return $60;
              })(function ($91) {
                  return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Either.Right.create($91));
              }));
          };
      }, function ($92) {
          return ExceptT(Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Either.Left.create($92)));
      });
  };
  exports["ExceptT"] = ExceptT;
  exports["except"] = except;
  exports["mapExceptT"] = mapExceptT;
  exports["runExceptT"] = runExceptT;
  exports["functorExceptT"] = functorExceptT;
  exports["applyExceptT"] = applyExceptT;
  exports["applicativeExceptT"] = applicativeExceptT;
  exports["bindExceptT"] = bindExceptT;
  exports["monadExceptT"] = monadExceptT;
  exports["monadErrorExceptT"] = monadErrorExceptT;
})(PS["Control.Monad.Except.Trans"] = PS["Control.Monad.Except.Trans"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Data_Either = PS["Data.Either"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Newtype = PS["Data.Newtype"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];                                 
  var runExcept = function ($0) {
      return Data_Newtype.unwrap(Data_Identity.newtypeIdentity)(Control_Monad_Except_Trans.runExceptT($0));
  };
  var mapExcept = function (f) {
      return Control_Monad_Except_Trans.mapExceptT(function ($1) {
          return Data_Identity.Identity(f(Data_Newtype.unwrap(Data_Identity.newtypeIdentity)($1)));
      });
  };
  exports["mapExcept"] = mapExcept;
  exports["runExcept"] = runExcept;
})(PS["Control.Monad.Except"] = PS["Control.Monad.Except"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Newtype = PS["Data.Newtype"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Category = PS["Control.Category"];        
  var Profunctor = function (dimap) {
      this.dimap = dimap;
  };
  var profunctorFn = new Profunctor(function (a2b) {
      return function (c2d) {
          return function (b2c) {
              return function ($9) {
                  return c2d(b2c(a2b($9)));
              };
          };
      };
  });
  var dimap = function (dict) {
      return dict.dimap;
  };
  var rmap = function (dictProfunctor) {
      return function (b2c) {
          return dimap(dictProfunctor)(Control_Category.id(Control_Category.categoryFn))(b2c);
      };
  };
  exports["Profunctor"] = Profunctor;
  exports["dimap"] = dimap;
  exports["rmap"] = rmap;
  exports["profunctorFn"] = profunctorFn;
})(PS["Data.Profunctor"] = PS["Data.Profunctor"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Monad_Cont_Class = PS["Control.Monad.Cont.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Reader_Class = PS["Control.Monad.Reader.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Function = PS["Data.Function"];
  var Control_Category = PS["Control.Category"];        
  var MaybeT = function (x) {
      return x;
  };
  var runMaybeT = function (v) {
      return v;
  };
  var functorMaybeT = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return function (v) {
              return Data_Functor.map(dictFunctor)(Data_Functor.map(Data_Maybe.functorMaybe)(f))(v);
          };
      });
  };
  var monadMaybeT = function (dictMonad) {
      return new Control_Monad.Monad(function () {
          return applicativeMaybeT(dictMonad);
      }, function () {
          return bindMaybeT(dictMonad);
      });
  };
  var bindMaybeT = function (dictMonad) {
      return new Control_Bind.Bind(function () {
          return applyMaybeT(dictMonad);
      }, function (v) {
          return function (f) {
              return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(function (v1) {
                  if (v1 instanceof Data_Maybe.Nothing) {
                      return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Maybe.Nothing.value);
                  };
                  if (v1 instanceof Data_Maybe.Just) {
                      var $42 = f(v1.value0);
                      return $42;
                  };
                  throw new Error("Failed pattern match at Control.Monad.Maybe.Trans line 55, column 11 - line 57, column 42: " + [ v1.constructor.name ]);
              });
          };
      });
  };
  var applyMaybeT = function (dictMonad) {
      return new Control_Apply.Apply(function () {
          return functorMaybeT(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
      }, Control_Monad.ap(monadMaybeT(dictMonad)));
  };
  var applicativeMaybeT = function (dictMonad) {
      return new Control_Applicative.Applicative(function () {
          return applyMaybeT(dictMonad);
      }, function ($67) {
          return MaybeT(Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Maybe.Just.create($67)));
      });
  };
  var monadRecMaybeT = function (dictMonadRec) {
      return new Control_Monad_Rec_Class.MonadRec(function () {
          return monadMaybeT(dictMonadRec["__superclass_Control.Monad.Monad_0"]());
      }, function (f) {
          return function ($69) {
              return MaybeT(Control_Monad_Rec_Class.tailRecM(dictMonadRec)(function (a) {
                  return Control_Bind.bind((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())((function () {
                      var $48 = f(a);
                      return $48;
                  })())(function (m$prime) {
                      return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())((function () {
                          if (m$prime instanceof Data_Maybe.Nothing) {
                              return new Control_Monad_Rec_Class.Done(Data_Maybe.Nothing.value);
                          };
                          if (m$prime instanceof Data_Maybe.Just && m$prime.value0 instanceof Control_Monad_Rec_Class.Loop) {
                              return new Control_Monad_Rec_Class.Loop(m$prime.value0.value0);
                          };
                          if (m$prime instanceof Data_Maybe.Just && m$prime.value0 instanceof Control_Monad_Rec_Class.Done) {
                              return new Control_Monad_Rec_Class.Done(new Data_Maybe.Just(m$prime.value0.value0));
                          };
                          throw new Error("Failed pattern match at Control.Monad.Maybe.Trans line 85, column 16 - line 88, column 43: " + [ m$prime.constructor.name ]);
                      })());
                  });
              })($69));
          };
      });
  };
  var altMaybeT = function (dictMonad) {
      return new Control_Alt.Alt(function () {
          return functorMaybeT(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
      }, function (v) {
          return function (v1) {
              return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v)(function (v2) {
                  if (v2 instanceof Data_Maybe.Nothing) {
                      return v1;
                  };
                  return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(v2);
              });
          };
      });
  };
  var plusMaybeT = function (dictMonad) {
      return new Control_Plus.Plus(function () {
          return altMaybeT(dictMonad);
      }, Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(Data_Maybe.Nothing.value));
  };
  exports["MaybeT"] = MaybeT;
  exports["runMaybeT"] = runMaybeT;
  exports["functorMaybeT"] = functorMaybeT;
  exports["applyMaybeT"] = applyMaybeT;
  exports["applicativeMaybeT"] = applicativeMaybeT;
  exports["bindMaybeT"] = bindMaybeT;
  exports["monadMaybeT"] = monadMaybeT;
  exports["altMaybeT"] = altMaybeT;
  exports["plusMaybeT"] = plusMaybeT;
  exports["monadRecMaybeT"] = monadRecMaybeT;
})(PS["Control.Monad.Maybe.Trans"] = PS["Control.Monad.Maybe.Trans"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Monad_Cont_Class = PS["Control.Monad.Cont.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Reader_Class = PS["Control.Monad.Reader.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Function = PS["Data.Function"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Unit = PS["Data.Unit"];        
  var WriterT = function (x) {
      return x;
  };
  var runWriterT = function (v) {
      return v;
  };
  var mapWriterT = function (f) {
      return function (v) {
          return f(v);
      };
  };
  var functorWriterT = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return mapWriterT(Data_Functor.map(dictFunctor)(function (v) {
              return new Data_Tuple.Tuple(f(v.value0), v.value1);
          }));
      });
  };
  var applyWriterT = function (dictSemigroup) {
      return function (dictApply) {
          return new Control_Apply.Apply(function () {
              return functorWriterT(dictApply["__superclass_Data.Functor.Functor_0"]());
          }, function (v) {
              return function (v1) {
                  var k = function (v3) {
                      return function (v4) {
                          return new Data_Tuple.Tuple(v3.value0(v4.value0), Data_Semigroup.append(dictSemigroup)(v3.value1)(v4.value1));
                      };
                  };
                  return Control_Apply.apply(dictApply)(Data_Functor.map(dictApply["__superclass_Data.Functor.Functor_0"]())(k)(v))(v1);
              };
          });
      };
  };
  var applicativeWriterT = function (dictMonoid) {
      return function (dictApplicative) {
          return new Control_Applicative.Applicative(function () {
              return applyWriterT(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(dictApplicative["__superclass_Control.Apply.Apply_0"]());
          }, function (a) {
              return WriterT(Control_Applicative.pure(dictApplicative)(new Data_Tuple.Tuple(a, Data_Monoid.mempty(dictMonoid))));
          });
      };
  };
  exports["WriterT"] = WriterT;
  exports["mapWriterT"] = mapWriterT;
  exports["runWriterT"] = runWriterT;
  exports["functorWriterT"] = functorWriterT;
  exports["applyWriterT"] = applyWriterT;
  exports["applicativeWriterT"] = applicativeWriterT;
})(PS["Control.Monad.Writer.Trans"] = PS["Control.Monad.Writer.Trans"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Monad_Cont_Trans = PS["Control.Monad.Cont.Trans"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var Control_Monad_Eff_Unsafe = PS["Control.Monad.Eff.Unsafe"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Monad_Maybe_Trans = PS["Control.Monad.Maybe.Trans"];
  var Control_Monad_Reader_Trans = PS["Control.Monad.Reader.Trans"];
  var Control_Monad_Writer_Trans = PS["Control.Monad.Writer.Trans"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Either = PS["Data.Either"];
  var Data_Functor_Compose = PS["Data.Functor.Compose"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Function = PS["Data.Function"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Unit = PS["Data.Unit"];
  var Parallel = function (__superclass_Control$dotApplicative$dotApplicative_1, __superclass_Control$dotMonad$dotMonad_0, parallel, sequential) {
      this["__superclass_Control.Applicative.Applicative_1"] = __superclass_Control$dotApplicative$dotApplicative_1;
      this["__superclass_Control.Monad.Monad_0"] = __superclass_Control$dotMonad$dotMonad_0;
      this.parallel = parallel;
      this.sequential = sequential;
  };                                                           
  var sequential = function (dict) {
      return dict.sequential;
  };
  var parallel = function (dict) {
      return dict.parallel;
  };
  exports["Parallel"] = Parallel;
  exports["parallel"] = parallel;
  exports["sequential"] = sequential;
})(PS["Control.Parallel.Class"] = PS["Control.Parallel.Class"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Monad_Free_Trans = PS["Control.Monad.Free.Trans"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Parallel = PS["Control.Parallel"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Profunctor = PS["Data.Profunctor"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Function = PS["Data.Function"];
  var Control_Parallel_Class = PS["Control.Parallel.Class"];
  var Control_Category = PS["Control.Category"];
  var profunctorAwait = new Data_Profunctor.Profunctor(function (f) {
      return function (g) {
          return function (v) {
              return Data_Profunctor.dimap(Data_Profunctor.profunctorFn)(f)(g)(v);
          };
      };
  });
  var fuseWith = function (dictFunctor) {
      return function (dictFunctor1) {
          return function (dictFunctor2) {
              return function (dictMonadRec) {
                  return function (dictParallel) {
                      return function (zap) {
                          return function (fs) {
                              return function (gs) {
                                  var go = function (v) {
                                      return Control_Bind.bind((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())(Control_Parallel_Class.sequential(dictParallel)(Control_Apply.apply((dictParallel["__superclass_Control.Applicative.Applicative_1"]())["__superclass_Control.Apply.Apply_0"]())(Data_Functor.map(((dictParallel["__superclass_Control.Applicative.Applicative_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Apply.lift2(Data_Either.applyEither)(zap(Data_Tuple.Tuple.create)))(Control_Parallel_Class.parallel(dictParallel)(Control_Monad_Free_Trans.resume(dictFunctor)(dictMonadRec)(v.value0))))(Control_Parallel_Class.parallel(dictParallel)(Control_Monad_Free_Trans.resume(dictFunctor1)(dictMonadRec)(v.value1)))))(function (v1) {
                                          if (v1 instanceof Data_Either.Left) {
                                              return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Data_Either.Left(v1.value0));
                                          };
                                          if (v1 instanceof Data_Either.Right) {
                                              return Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())(new Data_Either.Right(Data_Functor.map(dictFunctor2)(function (t) {
                                                  return Control_Monad_Free_Trans.freeT(function (v2) {
                                                      return go(t);
                                                  });
                                              })(v1.value0)));
                                          };
                                          throw new Error("Failed pattern match at Control.Coroutine line 76, column 5 - line 78, column 63: " + [ v1.constructor.name ]);
                                      });
                                  };
                                  return Control_Monad_Free_Trans.freeT(function (v) {
                                      return go(new Data_Tuple.Tuple(fs, gs));
                                  });
                              };
                          };
                      };
                  };
              };
          };
      };
  };
  var functorAwait = new Data_Functor.Functor(Data_Profunctor.rmap(profunctorAwait));
  var $$await = function (dictMonad) {
      return Control_Monad_Free_Trans.liftFreeT(functorAwait)(dictMonad)(Control_Category.id(Control_Category.categoryFn));
  };
  exports["await"] = $$await;
  exports["fuseWith"] = fuseWith;
  exports["profunctorAwait"] = profunctorAwait;
  exports["functorAwait"] = functorAwait;
})(PS["Control.Coroutine"] = PS["Control.Coroutine"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Coroutine = PS["Control.Coroutine"];
  var Control_Monad_Free_Trans = PS["Control.Monad.Free.Trans"];
  var Control_Monad_Maybe_Trans = PS["Control.Monad.Maybe.Trans"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Parallel = PS["Control.Parallel"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Bind = PS["Control.Bind"];        
  var Emit = (function () {
      function Emit(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Emit.create = function (value0) {
          return function (value1) {
              return new Emit(value0, value1);
          };
      };
      return Emit;
  })();
  var Stall = (function () {
      function Stall(value0) {
          this.value0 = value0;
      };
      Stall.create = function (value0) {
          return new Stall(value0);
      };
      return Stall;
  })();
  var runStallingProcess = function (dictMonadRec) {
      return function ($31) {
          return Control_Monad_Maybe_Trans.runMaybeT(Control_Monad_Free_Trans.runFreeT(Data_Maybe.functorMaybe)(Control_Monad_Maybe_Trans.monadRecMaybeT(dictMonadRec))(Data_Maybe.maybe(Control_Plus.empty(Control_Monad_Maybe_Trans.plusMaybeT(dictMonadRec["__superclass_Control.Monad.Monad_0"]())))(Control_Applicative.pure(Control_Monad_Maybe_Trans.applicativeMaybeT(dictMonadRec["__superclass_Control.Monad.Monad_0"]()))))(Control_Monad_Free_Trans.hoistFreeT(Data_Maybe.functorMaybe)(Control_Monad_Maybe_Trans.functorMaybeT((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]()))(function ($32) {
              return Control_Monad_Maybe_Trans.MaybeT(Data_Functor.map((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Data_Maybe.Just.create)($32));
          })($31)));
      };
  };
  var bifunctorStallF = new Data_Bifunctor.Bifunctor(function (f) {
      return function (g) {
          return function (v) {
              if (v instanceof Emit) {
                  return new Emit(f(v.value0), g(v.value1));
              };
              if (v instanceof Stall) {
                  return new Stall(g(v.value0));
              };
              throw new Error("Failed pattern match at Control.Coroutine.Stalling line 51, column 15 - line 53, column 27: " + [ v.constructor.name ]);
          };
      };
  });
  var functorStallF = new Data_Functor.Functor(function (f) {
      return Data_Bifunctor.rmap(bifunctorStallF)(f);
  });
  var fuse = function (dictMonadRec) {
      return function (dictParallel) {
          return Control_Coroutine.fuseWith(functorStallF)(Control_Coroutine.functorAwait)(Data_Maybe.functorMaybe)(dictMonadRec)(dictParallel)(function (f) {
              return function (q) {
                  return function (v) {
                      if (q instanceof Emit) {
                          return new Data_Maybe.Just(f(q.value1)(v(q.value0)));
                      };
                      if (q instanceof Stall) {
                          return Data_Maybe.Nothing.value;
                      };
                      throw new Error("Failed pattern match at Control.Coroutine.Stalling line 86, column 5 - line 88, column 27: " + [ q.constructor.name ]);
                  };
              };
          });
      };
  };
  exports["Emit"] = Emit;
  exports["Stall"] = Stall;
  exports["fuse"] = fuse;
  exports["runStallingProcess"] = runStallingProcess;
  exports["bifunctorStallF"] = bifunctorStallF;
  exports["functorStallF"] = functorStallF;
})(PS["Control.Coroutine.Stalling"] = PS["Control.Coroutine.Stalling"] || {});
(function(exports) {
  /* globals setTimeout, clearTimeout, setImmediate, clearImmediate */
  "use strict";

  exports._cancelWith = function (nonCanceler, aff, canceler1) {
    return function (success, error) {
      var canceler2 = aff(success, error);

      return function (e) {
        return function (success, error) {
          var cancellations = 0;
          var result = false;
          var errored = false;

          var s = function (bool) {
            cancellations = cancellations + 1;
            result = result || bool;

            if (cancellations === 2 && !errored) {
              success(result);
            }
          };

          var f = function (err) {
            if (!errored) {
              errored = true;
              error(err);
            }
          };

          canceler2(e)(s, f);
          canceler1(e)(s, f);

          return nonCanceler;
        };
      };
    };
  };

  exports._forkAff = function (nonCanceler, aff) {
    var voidF = function () {};

    return function (success) {
      var canceler = aff(voidF, voidF);
      success(canceler);
      return nonCanceler;
    };
  };

  exports._forkAll = function (nonCanceler, foldl, affs) {
    var voidF = function () {};

    return function (success) {
      var cancelers = foldl(function (acc) {
        return function (aff) {
          acc.push(aff(voidF, voidF));
          return acc;
        };
      })([])(affs);

      var canceler = function (e) {
        return function (success, error) {
          var cancellations = 0;
          var result        = false;
          var errored       = false;

          var s = function (bool) {
            cancellations = cancellations + 1;
            result        = result || bool;

            if (cancellations === cancelers.length && !errored) {
              success(result);
            }
          };

          var f = function (err) {
            if (!errored) {
              errored = true;
              error(err);
            }
          };

          for (var i = 0; i < cancelers.length; i++) {
            cancelers[i](e)(s, f);
          }

          return nonCanceler;
        };
      };

      success(canceler);
      return nonCanceler;
    };
  };

  exports._makeAff = function (cb) {
    return function (success, error) {
      try {
        return cb(function (e) {
          return function () {
            error(e);
          };
        })(function (v) {
          return function () {
            success(v);
          };
        })();
      } catch (err) {
        error(err);
      }
    };
  };

  exports._pure = function (nonCanceler, v) {
    return function (success) {
      success(v);
      return nonCanceler;
    };
  };

  exports._throwError = function (nonCanceler, e) {
    return function (success, error) {
      error(e);
      return nonCanceler;
    };
  };

  exports._fmap = function (f, aff) {
    return function (success, error) {
      return aff(function (v) {
        success(f(v));
      }, error);
    };
  };

  exports._bind = function (alwaysCanceler, aff, f) {
    return function (success, error) {
      var canceler1, canceler2;

      var isCanceled    = false;
      var requestCancel = false;

      var onCanceler = function () {};

      canceler1 = aff(function (v) {
        if (requestCancel) {
          isCanceled = true;

          return alwaysCanceler;
        } else {
          canceler2 = f(v)(success, error);

          onCanceler(canceler2);

          return canceler2;
        }
      }, error);

      return function (e) {
        return function (s, f) {
          requestCancel = true;

          if (canceler2 !== undefined) {
            return canceler2(e)(s, f);
          } else {
            return canceler1(e)(function (bool) {
              if (bool || isCanceled) {
                s(true);
              } else {
                onCanceler = function (canceler) {
                  canceler(e)(s, f);
                };
              }
            }, f);
          }
        };
      };
    };
  };

  exports._attempt = function (Left, Right, aff) {
    return function (success) {
      return aff(function (v) {
        success(Right(v));
      }, function (e) {
        success(Left(e));
      });
    };
  };

  exports._runAff = function (errorT, successT, aff) {
    // If errorT or successT throw, and an Aff is comprised only of synchronous
    // effects, then it's possible for makeAff/liftEff to accidentally catch
    // it, which may end up rerunning the Aff depending on error recovery
    // behavior. To mitigate this, we observe synchronicity using mutation. If
    // an Aff is observed to be synchronous, we let the stack reset and run the
    // handlers outside of the normal callback flow.
    return function () {
      var status = 0;
      var result, success;

      var canceler = aff(function (v) {
        if (status === 2) {
          successT(v)();
        } else {
          status = 1;
          result = v;
          success = true;
        }
      }, function (e) {
        if (status === 2) {
          errorT(e)();
        } else {
          status = 1;
          result = e;
          success = false;
        }
      });

      if (status === 1) {
        if (success) {
          successT(result)();
        } else {
          errorT(result)();
        }
      } else {
        status = 2;
      }

      return canceler;
    };
  };

  exports._liftEff = function (nonCanceler, e) {
    return function (success, error) {
      var result;
      try {
        result = e();
      } catch (err) {
        error(err);
        return nonCanceler;
      }

      success(result);
      return nonCanceler;
    };
  };

  exports._tailRecM = function (isLeft, f, a) {
    return function (success, error) {
      return function go (acc) {
        var result, status, canceler;

        // Observes synchronous effects using a flag.
        //   status = 0 (unresolved status)
        //   status = 1 (synchronous effect)
        //   status = 2 (asynchronous effect)

        var csuccess = function (v) {
          // If the status is still unresolved, we have observed a
          // synchronous effect. Otherwise, the status will be `2`.
          if (status === 0) {
            // Store the result for further synchronous processing.
            result = v;
            status = 1;
          } else {
            // When we have observed an asynchronous effect, we use normal
            // recursion. This is safe because we will be on a new stack.
            if (isLeft(v)) {
              go(v.value0);
            } else {
              success(v.value0);
            }
          }
        };

        while (true) {
          status = 0;
          canceler = f(acc)(csuccess, error);

          // If the status has already resolved to `1` by our Aff handler, then
          // we have observed a synchronous effect. Otherwise it will still be
          // `0`.
          if (status === 1) {
            // When we have observed a synchronous effect, we merely swap out the
            // accumulator and continue the loop, preserving stack.
            if (isLeft(result)) {
              acc = result.value0;
              continue;
            } else {
              success(result.value0);
            }
          } else {
            // If the status has not resolved yet, then we have observed an
            // asynchronous effect.
            status = 2;
          }
          return canceler;
        }

      }(a);
    };
  };
})(PS["Control.Monad.Aff"] = PS["Control.Monad.Aff"] || {});
(function(exports) {
    "use strict";

  exports._makeVar = function (nonCanceler) {
    return function (success) {
      success({
        consumers: [],
        producers: [],
        error: undefined
      });
      return nonCanceler;
    };
  };

  exports._takeVar = function (nonCanceler, avar) {
    return function (success, error) {
      if (avar.error !== undefined) {
        error(avar.error);
      } else if (avar.producers.length > 0) {
        avar.producers.shift()(success, error);
      } else {
        avar.consumers.push({ peek: false, success: success, error: error });
      }

      return nonCanceler;
    };
  };

  exports._putVar = function (nonCanceler, avar, a) {
    return function (success, error) {
      if (avar.error !== undefined) {
        error(avar.error);
      } else {
        var shouldQueue = true;
        var consumers = [];
        var consumer;

        while (true) {
          consumer = avar.consumers.shift();
          if (consumer) {
            consumers.push(consumer);
            if (consumer.peek) {
              continue;
            } else {
              shouldQueue = false;
            }
          }
          break;
        }

        if (shouldQueue) {
          avar.producers.push(function (success) {
            success(a);
            return nonCanceler;
          });
        }

        for (var i = 0; i < consumers.length; i++) {
          consumers[i].success(a);
        }

        success({});
      }

      return nonCanceler;
    };
  };

  exports._killVar = function (nonCanceler, avar, e) {
    return function (success, error) {
      if (avar.error !== undefined) {
        error(avar.error);
      } else {
        avar.error = e;
        while (avar.consumers.length) {
          avar.consumers.shift().error(e);
        }
        success({});
      }

      return nonCanceler;
    };
  };
})(PS["Control.Monad.Aff.Internal"] = PS["Control.Monad.Aff.Internal"] || {});
(function(exports) {
    "use strict";

  exports.error = function (msg) {
    return new Error(msg);
  };

  exports.throwException = function (e) {
    return function () {
      throw e;
    };
  };
})(PS["Control.Monad.Eff.Exception"] = PS["Control.Monad.Eff.Exception"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Exception"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Either = PS["Data.Either"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Show = PS["Data.Show"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Functor = PS["Data.Functor"];
  exports["error"] = $foreign.error;
  exports["throwException"] = $foreign.throwException;
})(PS["Control.Monad.Eff.Exception"] = PS["Control.Monad.Eff.Exception"] || {});
(function(exports) {
    "use strict";

  exports.runFn2 = function (fn) {
    return function (a) {
      return function (b) {
        return fn(a, b);
      };
    };
  };
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Function.Uncurried"];
  var Data_Unit = PS["Data.Unit"];
  exports["runFn2"] = $foreign.runFn2;
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Monad.Aff.Internal"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  exports["_killVar"] = $foreign._killVar;
  exports["_makeVar"] = $foreign._makeVar;
  exports["_putVar"] = $foreign._putVar;
  exports["_takeVar"] = $foreign._takeVar;
})(PS["Control.Monad.Aff.Internal"] = PS["Control.Monad.Aff.Internal"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Monad.Aff"];
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Monad_Aff_Internal = PS["Control.Monad.Aff.Internal"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_Parallel = PS["Control.Parallel"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Function = PS["Data.Function"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Semiring = PS["Data.Semiring"];
  var Control_Parallel_Class = PS["Control.Parallel.Class"];
  var Data_Unit = PS["Data.Unit"];        
  var ParAff = function (x) {
      return x;
  };
  var runAff = function (ex) {
      return function (f) {
          return function (aff) {
              return $foreign._runAff(ex, f, aff);
          };
      };
  };         
  var makeAff$prime = function (h) {
      return $foreign._makeAff(h);
  };
  var functorAff = new Data_Functor.Functor(function (f) {
      return function (fa) {
          return $foreign._fmap(f, fa);
      };
  });
  var functorParAff = functorAff;
  var fromAVBox = Unsafe_Coerce.unsafeCoerce;
  var attempt = function (aff) {
      return $foreign._attempt(Data_Either.Left.create, Data_Either.Right.create, aff);
  };
  var applyAff = new Control_Apply.Apply(function () {
      return functorAff;
  }, function (ff) {
      return function (fa) {
          return $foreign._bind(alwaysCanceler, ff, function (f) {
              return Data_Functor.map(functorAff)(f)(fa);
          });
      };
  });
  var applicativeAff = new Control_Applicative.Applicative(function () {
      return applyAff;
  }, function (v) {
      return $foreign._pure(nonCanceler, v);
  });
  var nonCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(false));
  var alwaysCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(true));
  var cancelWith = function (aff) {
      return function (c) {
          return $foreign._cancelWith(nonCanceler, aff, c);
      };
  };
  var forkAff = function (aff) {
      return $foreign._forkAff(nonCanceler, aff);
  };
  var forkAll = function (dictFoldable) {
      return function (affs) {
          return $foreign._forkAll(nonCanceler, Data_Foldable.foldl(dictFoldable), affs);
      };
  };
  var killVar = function (q) {
      return function (e) {
          return fromAVBox(Control_Monad_Aff_Internal._killVar(nonCanceler, q, e));
      };
  };
  var makeAff = function (h) {
      return makeAff$prime(function (e) {
          return function (a) {
              return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Function["const"](nonCanceler))(h(e)(a));
          };
      });
  };
  var makeVar = fromAVBox(Control_Monad_Aff_Internal._makeVar(nonCanceler));
  var putVar = function (q) {
      return function (a) {
          return fromAVBox(Control_Monad_Aff_Internal._putVar(nonCanceler, q, a));
      };
  };
  var takeVar = function (q) {
      return fromAVBox(Control_Monad_Aff_Internal._takeVar(nonCanceler, q));
  };
  var semigroupCanceler = new Data_Semigroup.Semigroup(function (v) {
      return function (v1) {
          return function (e) {
              return Control_Apply.apply(applyAff)(Data_Functor.map(functorAff)(Data_HeytingAlgebra.disj(Data_HeytingAlgebra.heytingAlgebraBoolean))(v(e)))(v1(e));
          };
      };
  });                                                                        
  var bindAff = new Control_Bind.Bind(function () {
      return applyAff;
  }, function (fa) {
      return function (f) {
          return $foreign._bind(alwaysCanceler, fa, f);
      };
  });
  var applyParAff = new Control_Apply.Apply(function () {
      return functorParAff;
  }, function (v) {
      return function (v1) {
          var putOrKill = function (v2) {
              return Data_Either.either(killVar(v2))(putVar(v2));
          };
          return Control_Bind.bind(bindAff)(makeVar)(function (v2) {
              return Control_Bind.bind(bindAff)(makeVar)(function (v3) {
                  return Control_Bind.bind(bindAff)(forkAff(Control_Bind.bindFlipped(bindAff)(putOrKill(v2))(attempt(v))))(function (v4) {
                      return Control_Bind.bind(bindAff)(forkAff(Control_Bind.bindFlipped(bindAff)(putOrKill(v3))(attempt(v1))))(function (v5) {
                          return cancelWith(Control_Apply.apply(applyAff)(takeVar(v2))(takeVar(v3)))(Data_Semigroup.append(semigroupCanceler)(v4)(v5));
                      });
                  });
              });
          });
      };
  });
  var applicativeParAff = new Control_Applicative.Applicative(function () {
      return applyParAff;
  }, function ($53) {
      return ParAff(Control_Applicative.pure(applicativeAff)($53));
  });
  var monadAff = new Control_Monad.Monad(function () {
      return applicativeAff;
  }, function () {
      return bindAff;
  });
  var monadEffAff = new Control_Monad_Eff_Class.MonadEff(function () {
      return monadAff;
  }, function (eff) {
      return $foreign._liftEff(nonCanceler, eff);
  });
  var monadRecAff = new Control_Monad_Rec_Class.MonadRec(function () {
      return monadAff;
  }, function (f) {
      return function (a) {
          var isLoop = function (v) {
              if (v instanceof Control_Monad_Rec_Class.Loop) {
                  return true;
              };
              return false;
          };
          return $foreign._tailRecM(isLoop, f, a);
      };
  });
  var parallelParAff = new Control_Parallel_Class.Parallel(function () {
      return applicativeParAff;
  }, function () {
      return monadAff;
  }, ParAff, function (v) {
      return v;
  });
  var monadErrorAff = new Control_Monad_Error_Class.MonadError(function () {
      return monadAff;
  }, function (aff) {
      return function (ex) {
          return Control_Bind.bind(bindAff)(attempt(aff))(Data_Either.either(ex)(Control_Applicative.pure(applicativeAff)));
      };
  }, function (e) {
      return $foreign._throwError(nonCanceler, e);
  });
  exports["ParAff"] = ParAff;
  exports["attempt"] = attempt;
  exports["cancelWith"] = cancelWith;
  exports["forkAff"] = forkAff;
  exports["forkAll"] = forkAll;
  exports["makeAff"] = makeAff;
  exports["makeAff'"] = makeAff$prime;
  exports["nonCanceler"] = nonCanceler;
  exports["runAff"] = runAff;
  exports["functorAff"] = functorAff;
  exports["applyAff"] = applyAff;
  exports["applicativeAff"] = applicativeAff;
  exports["bindAff"] = bindAff;
  exports["monadAff"] = monadAff;
  exports["monadEffAff"] = monadEffAff;
  exports["monadErrorAff"] = monadErrorAff;
  exports["monadRecAff"] = monadRecAff;
  exports["semigroupCanceler"] = semigroupCanceler;
  exports["functorParAff"] = functorParAff;
  exports["applyParAff"] = applyParAff;
  exports["applicativeParAff"] = applicativeParAff;
  exports["parallelParAff"] = parallelParAff;
})(PS["Control.Monad.Aff"] = PS["Control.Monad.Aff"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_Internal = PS["Control.Monad.Aff.Internal"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Data_Function = PS["Data.Function"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var fromAVBox = Unsafe_Coerce.unsafeCoerce;
  var makeVar = fromAVBox(Control_Monad_Aff_Internal._makeVar(Control_Monad_Aff.nonCanceler));
  var putVar = function (q) {
      return function (a) {
          return fromAVBox(Control_Monad_Aff_Internal._putVar(Control_Monad_Aff.nonCanceler, q, a));
      };
  };
  var makeVar$prime = function (a) {
      return Control_Bind.bind(Control_Monad_Aff.bindAff)(makeVar)(function (v) {
          return Control_Bind.bind(Control_Monad_Aff.bindAff)(putVar(v)(a))(function () {
              return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v);
          });
      });
  };
  var takeVar = function (q) {
      return fromAVBox(Control_Monad_Aff_Internal._takeVar(Control_Monad_Aff.nonCanceler, q));
  };
  var modifyVar = function (f) {
      return function (v) {
          return Control_Bind.bind(Control_Monad_Aff.bindAff)(takeVar(v))(function ($2) {
              return putVar(v)(f($2));
          });
      };
  };
  exports["makeVar"] = makeVar;
  exports["makeVar'"] = makeVar$prime;
  exports["modifyVar"] = modifyVar;
  exports["putVar"] = putVar;
  exports["takeVar"] = takeVar;
})(PS["Control.Monad.Aff.AVar"] = PS["Control.Monad.Aff.AVar"] || {});
(function(exports) {
    "use strict";

  exports.log = function (s) {
    return function () {
      console.log(s);
      return {};
    };
  };
})(PS["Control.Monad.Eff.Console"] = PS["Control.Monad.Eff.Console"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Console"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  exports["log"] = $foreign.log;
})(PS["Control.Monad.Eff.Console"] = PS["Control.Monad.Eff.Console"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Eq = PS["Data.Eq"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Category = PS["Control.Category"];        
  var NonEmpty = (function () {
      function NonEmpty(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      NonEmpty.create = function (value0) {
          return function (value1) {
              return new NonEmpty(value0, value1);
          };
      };
      return NonEmpty;
  })();
  var singleton = function (dictPlus) {
      return function (a) {
          return new NonEmpty(a, Control_Plus.empty(dictPlus));
      };
  };
  var showNonEmpty = function (dictShow) {
      return function (dictShow1) {
          return new Data_Show.Show(function (v) {
              return "(NonEmpty " + (Data_Show.show(dictShow)(v.value0) + (" " + (Data_Show.show(dictShow1)(v.value1) + ")")));
          });
      };
  };
  var functorNonEmpty = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return function (v) {
              return new NonEmpty(f(v.value0), Data_Functor.map(dictFunctor)(f)(v.value1));
          };
      });
  };
  exports["NonEmpty"] = NonEmpty;
  exports["singleton"] = singleton;
  exports["showNonEmpty"] = showNonEmpty;
  exports["functorNonEmpty"] = functorNonEmpty;
})(PS["Data.NonEmpty"] = PS["Data.NonEmpty"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Generic = PS["Data.Generic"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Category = PS["Control.Category"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];        
  var Nil = (function () {
      function Nil() {

      };
      Nil.value = new Nil();
      return Nil;
  })();
  var Cons = (function () {
      function Cons(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Cons.create = function (value0) {
          return function (value1) {
              return new Cons(value0, value1);
          };
      };
      return Cons;
  })();
  var NonEmptyList = function (x) {
      return x;
  };
  var foldableList = new Data_Foldable.Foldable(function (dictMonoid) {
      return function (f) {
          return Data_Foldable.foldl(foldableList)(function (acc) {
              return function ($128) {
                  return Data_Semigroup.append(dictMonoid["__superclass_Data.Semigroup.Semigroup_0"]())(acc)(f($128));
              };
          })(Data_Monoid.mempty(dictMonoid));
      };
  }, function (f) {
      var go = function (__copy_b) {
          return function (__copy_v) {
              var b = __copy_b;
              var v = __copy_v;
              tco: while (true) {
                  if (v instanceof Nil) {
                      return b;
                  };
                  if (v instanceof Cons) {
                      var __tco_b = f(b)(v.value0);
                      var __tco_v = v.value1;
                      b = __tco_b;
                      v = __tco_v;
                      continue tco;
                  };
                  throw new Error("Failed pattern match at Data.List.Types line 66, column 3 - line 69, column 34: " + [ b.constructor.name, v.constructor.name ]);
              };
          };
      };
      return go;
  }, function (f) {
      return function (b) {
          return function (as) {
              var rev = function (__copy_acc) {
                  return function (__copy_v) {
                      var acc = __copy_acc;
                      var v = __copy_v;
                      tco: while (true) {
                          if (v instanceof Nil) {
                              return acc;
                          };
                          if (v instanceof Cons) {
                              var __tco_acc = new Cons(v.value0, acc);
                              var __tco_v = v.value1;
                              acc = __tco_acc;
                              v = __tco_v;
                              continue tco;
                          };
                          throw new Error("Failed pattern match at Data.List.Types line 62, column 3 - line 65, column 40: " + [ acc.constructor.name, v.constructor.name ]);
                      };
                  };
              };
              return Data_Foldable.foldl(foldableList)(Data_Function.flip(f))(b)(rev(Nil.value)(as));
          };
      };
  });                                                                     
  var functorList = new Data_Functor.Functor(function (f) {
      return Data_Foldable.foldr(foldableList)(function (x) {
          return function (acc) {
              return new Cons(f(x), acc);
          };
      })(Nil.value);
  });
  var functorNonEmptyList = Data_NonEmpty.functorNonEmpty(functorList);
  var semigroupList = new Data_Semigroup.Semigroup(function (xs) {
      return function (ys) {
          return Data_Foldable.foldr(foldableList)(Cons.create)(ys)(xs);
      };
  });
  var showList = function (dictShow) {
      return new Data_Show.Show(function (v) {
          if (v instanceof Nil) {
              return "Nil";
          };
          return "(" + (Data_Foldable.intercalate(foldableList)(Data_Monoid.monoidString)(" : ")(Data_Functor.map(functorList)(Data_Show.show(dictShow))(v)) + " : Nil)");
      });
  };
  var showNonEmptyList = function (dictShow) {
      return new Data_Show.Show(function (v) {
          return "(NonEmptyList " + (Data_Show.show(Data_NonEmpty.showNonEmpty(dictShow)(showList(dictShow)))(v) + ")");
      });
  }; 
  var applyList = new Control_Apply.Apply(function () {
      return functorList;
  }, function (v) {
      return function (v1) {
          if (v instanceof Nil) {
              return Nil.value;
          };
          if (v instanceof Cons) {
              return Data_Semigroup.append(semigroupList)(Data_Functor.map(functorList)(v.value0)(v1))(Control_Apply.apply(applyList)(v.value1)(v1));
          };
          throw new Error("Failed pattern match at Data.List.Types line 84, column 3 - line 84, column 20: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var applyNonEmptyList = new Control_Apply.Apply(function () {
      return functorNonEmptyList;
  }, function (v) {
      return function (v1) {
          return new Data_NonEmpty.NonEmpty(v.value0(v1.value0), Data_Semigroup.append(semigroupList)(Control_Apply.apply(applyList)(v.value1)(new Cons(v1.value0, Nil.value)))(Control_Apply.apply(applyList)(new Cons(v.value0, v.value1))(v1.value1)));
      };
  });
  var applicativeList = new Control_Applicative.Applicative(function () {
      return applyList;
  }, function (a) {
      return new Cons(a, Nil.value);
  });                                              
  var altList = new Control_Alt.Alt(function () {
      return functorList;
  }, Data_Semigroup.append(semigroupList));
  var plusList = new Control_Plus.Plus(function () {
      return altList;
  }, Nil.value);
  var applicativeNonEmptyList = new Control_Applicative.Applicative(function () {
      return applyNonEmptyList;
  }, function ($132) {
      return NonEmptyList(Data_NonEmpty.singleton(plusList)($132));
  });
  exports["Nil"] = Nil;
  exports["Cons"] = Cons;
  exports["NonEmptyList"] = NonEmptyList;
  exports["showList"] = showList;
  exports["semigroupList"] = semigroupList;
  exports["functorList"] = functorList;
  exports["foldableList"] = foldableList;
  exports["applyList"] = applyList;
  exports["applicativeList"] = applicativeList;
  exports["altList"] = altList;
  exports["plusList"] = plusList;
  exports["showNonEmptyList"] = showNonEmptyList;
  exports["functorNonEmptyList"] = functorNonEmptyList;
  exports["applyNonEmptyList"] = applyNonEmptyList;
  exports["applicativeNonEmptyList"] = applicativeNonEmptyList;
})(PS["Data.List.Types"] = PS["Data.List.Types"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Function = PS["Data.Function"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semiring = PS["Data.Semiring"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Apply = PS["Control.Apply"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Category = PS["Control.Category"];
  var reverse = (function () {
      var go = function (__copy_acc) {
          return function (__copy_v) {
              var acc = __copy_acc;
              var v = __copy_v;
              tco: while (true) {
                  if (v instanceof Data_List_Types.Nil) {
                      return acc;
                  };
                  if (v instanceof Data_List_Types.Cons) {
                      var __tco_acc = new Data_List_Types.Cons(v.value0, acc);
                      var __tco_v = v.value1;
                      acc = __tco_acc;
                      v = __tco_v;
                      continue tco;
                  };
                  throw new Error("Failed pattern match at Data.List line 359, column 1 - line 362, column 36: " + [ acc.constructor.name, v.constructor.name ]);
              };
          };
      };
      return go(Data_List_Types.Nil.value);
  })();
  exports["reverse"] = reverse;
})(PS["Data.List"] = PS["Data.List"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Data_List = PS["Data.List"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_List_Types = PS["Data.List.Types"];        
  var CatQueue = (function () {
      function CatQueue(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      CatQueue.create = function (value0) {
          return function (value1) {
              return new CatQueue(value0, value1);
          };
      };
      return CatQueue;
  })();
  var uncons = function (__copy_v) {
      var v = __copy_v;
      tco: while (true) {
          if (v.value0 instanceof Data_List_Types.Nil && v.value1 instanceof Data_List_Types.Nil) {
              return Data_Maybe.Nothing.value;
          };
          if (v.value0 instanceof Data_List_Types.Nil) {
              var __tco_v = new CatQueue(Data_List.reverse(v.value1), Data_List_Types.Nil.value);
              v = __tco_v;
              continue tco;
          };
          if (v.value0 instanceof Data_List_Types.Cons) {
              return new Data_Maybe.Just(new Data_Tuple.Tuple(v.value0.value0, new CatQueue(v.value0.value1, v.value1)));
          };
          throw new Error("Failed pattern match at Data.CatQueue line 51, column 1 - line 51, column 36: " + [ v.constructor.name ]);
      };
  };
  var snoc = function (v) {
      return function (a) {
          return new CatQueue(v.value0, new Data_List_Types.Cons(a, v.value1));
      };
  };
  var $$null = function (v) {
      if (v.value0 instanceof Data_List_Types.Nil && v.value1 instanceof Data_List_Types.Nil) {
          return true;
      };
      return false;
  };
  var empty = new CatQueue(Data_List_Types.Nil.value, Data_List_Types.Nil.value);
  exports["CatQueue"] = CatQueue;
  exports["empty"] = empty;
  exports["null"] = $$null;
  exports["snoc"] = snoc;
  exports["uncons"] = uncons;
})(PS["Data.CatQueue"] = PS["Data.CatQueue"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Data_CatQueue = PS["Data.CatQueue"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_List = PS["Data.List"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_NaturalTransformation = PS["Data.NaturalTransformation"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_List_Types = PS["Data.List.Types"];        
  var CatNil = (function () {
      function CatNil() {

      };
      CatNil.value = new CatNil();
      return CatNil;
  })();
  var CatCons = (function () {
      function CatCons(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      CatCons.create = function (value0) {
          return function (value1) {
              return new CatCons(value0, value1);
          };
      };
      return CatCons;
  })();
  var link = function (v) {
      return function (cat) {
          if (v instanceof CatNil) {
              return cat;
          };
          if (v instanceof CatCons) {
              return new CatCons(v.value0, Data_CatQueue.snoc(v.value1)(cat));
          };
          throw new Error("Failed pattern match at Data.CatList line 111, column 1 - line 111, column 22: " + [ v.constructor.name, cat.constructor.name ]);
      };
  };
  var foldr = function (k) {
      return function (b) {
          return function (q) {
              var foldl = function (__copy_v) {
                  return function (__copy_c) {
                      return function (__copy_v1) {
                          var v = __copy_v;
                          var c = __copy_c;
                          var v1 = __copy_v1;
                          tco: while (true) {
                              if (v1 instanceof Data_List_Types.Nil) {
                                  return c;
                              };
                              if (v1 instanceof Data_List_Types.Cons) {
                                  var __tco_v = v;
                                  var __tco_c = v(c)(v1.value0);
                                  var __tco_v1 = v1.value1;
                                  v = __tco_v;
                                  c = __tco_c;
                                  v1 = __tco_v1;
                                  continue tco;
                              };
                              throw new Error("Failed pattern match at Data.CatList line 126, column 3 - line 126, column 22: " + [ v.constructor.name, c.constructor.name, v1.constructor.name ]);
                          };
                      };
                  };
              };
              var go = function (__copy_xs) {
                  return function (__copy_ys) {
                      var xs = __copy_xs;
                      var ys = __copy_ys;
                      tco: while (true) {
                          var $33 = Data_CatQueue.uncons(xs);
                          if ($33 instanceof Data_Maybe.Nothing) {
                              return foldl(function (x) {
                                  return function (i) {
                                      return i(x);
                                  };
                              })(b)(ys);
                          };
                          if ($33 instanceof Data_Maybe.Just) {
                              var __tco_ys = new Data_List_Types.Cons(k($33.value0.value0), ys);
                              xs = $33.value0.value1;
                              ys = __tco_ys;
                              continue tco;
                          };
                          throw new Error("Failed pattern match at Data.CatList line 121, column 14 - line 123, column 67: " + [ $33.constructor.name ]);
                      };
                  };
              };
              return go(q)(Data_List_Types.Nil.value);
          };
      };
  };
  var uncons = function (v) {
      if (v instanceof CatNil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof CatCons) {
          return new Data_Maybe.Just(new Data_Tuple.Tuple(v.value0, (function () {
              var $38 = Data_CatQueue["null"](v.value1);
              if ($38) {
                  return CatNil.value;
              };
              if (!$38) {
                  return foldr(link)(CatNil.value)(v.value1);
              };
              throw new Error("Failed pattern match at Data.CatList line 103, column 39 - line 103, column 89: " + [ $38.constructor.name ]);
          })()));
      };
      throw new Error("Failed pattern match at Data.CatList line 102, column 1 - line 102, column 24: " + [ v.constructor.name ]);
  }; 
  var empty = CatNil.value;
  var append = function (v) {
      return function (v1) {
          if (v1 instanceof CatNil) {
              return v;
          };
          if (v instanceof CatNil) {
              return v1;
          };
          return link(v)(v1);
      };
  }; 
  var semigroupCatList = new Data_Semigroup.Semigroup(append);
  var snoc = function (cat) {
      return function (a) {
          return append(cat)(new CatCons(a, Data_CatQueue.empty));
      };
  };
  exports["CatNil"] = CatNil;
  exports["CatCons"] = CatCons;
  exports["append"] = append;
  exports["empty"] = empty;
  exports["snoc"] = snoc;
  exports["uncons"] = uncons;
  exports["semigroupCatList"] = semigroupCatList;
})(PS["Data.CatList"] = PS["Data.CatList"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Data_CatList = PS["Data.CatList"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Inject = PS["Data.Inject"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Function = PS["Data.Function"];
  var Control_Category = PS["Control.Category"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Free = (function () {
      function Free(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Free.create = function (value0) {
          return function (value1) {
              return new Free(value0, value1);
          };
      };
      return Free;
  })();
  var Return = (function () {
      function Return(value0) {
          this.value0 = value0;
      };
      Return.create = function (value0) {
          return new Return(value0);
      };
      return Return;
  })();
  var Bind = (function () {
      function Bind(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Bind.create = function (value0) {
          return function (value1) {
              return new Bind(value0, value1);
          };
      };
      return Bind;
  })();
  var toView = function (__copy_v) {
      var v = __copy_v;
      tco: while (true) {
          var runExpF = function (v2) {
              return v2;
          };
          var concatF = function (v2) {
              return function (r) {
                  return new Free(v2.value0, Data_Semigroup.append(Data_CatList.semigroupCatList)(v2.value1)(r));
              };
          };
          if (v.value0 instanceof Return) {
              var $37 = Data_CatList.uncons(v.value1);
              if ($37 instanceof Data_Maybe.Nothing) {
                  return new Return(Unsafe_Coerce.unsafeCoerce(v.value0.value0));
              };
              if ($37 instanceof Data_Maybe.Just) {
                  var __tco_v = Unsafe_Coerce.unsafeCoerce(concatF(runExpF($37.value0.value0)(v.value0.value0))($37.value0.value1));
                  v = __tco_v;
                  continue tco;
              };
              throw new Error("Failed pattern match at Control.Monad.Free line 206, column 7 - line 210, column 64: " + [ $37.constructor.name ]);
          };
          if (v.value0 instanceof Bind) {
              return new Bind(v.value0.value0, function (a) {
                  return Unsafe_Coerce.unsafeCoerce(concatF(v.value0.value1(a))(v.value1));
              });
          };
          throw new Error("Failed pattern match at Control.Monad.Free line 204, column 3 - line 212, column 56: " + [ v.value0.constructor.name ]);
      };
  };
  var runFreeM = function (dictFunctor) {
      return function (dictMonadRec) {
          return function (k) {
              var go = function (f) {
                  var $46 = toView(f);
                  if ($46 instanceof Return) {
                      return Data_Functor.map((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Monad_Rec_Class.Done.create)(Control_Applicative.pure((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Applicative.Applicative_0"]())($46.value0));
                  };
                  if ($46 instanceof Bind) {
                      return Data_Functor.map((((dictMonadRec["__superclass_Control.Monad.Monad_0"]())["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Monad_Rec_Class.Loop.create)(k(Data_Functor.map(dictFunctor)($46.value1)($46.value0)));
                  };
                  throw new Error("Failed pattern match at Control.Monad.Free line 182, column 10 - line 184, column 37: " + [ $46.constructor.name ]);
              };
              return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(go);
          };
      };
  };
  var fromView = function (f) {
      return new Free(Unsafe_Coerce.unsafeCoerce(f), Data_CatList.empty);
  };
  var freeMonad = new Control_Monad.Monad(function () {
      return freeApplicative;
  }, function () {
      return freeBind;
  });
  var freeFunctor = new Data_Functor.Functor(function (k) {
      return function (f) {
          return Control_Bind.bindFlipped(freeBind)(function ($85) {
              return Control_Applicative.pure(freeApplicative)(k($85));
          })(f);
      };
  });
  var freeBind = new Control_Bind.Bind(function () {
      return freeApply;
  }, function (v) {
      return function (k) {
          return new Free(v.value0, Data_CatList.snoc(v.value1)(Unsafe_Coerce.unsafeCoerce(k)));
      };
  });
  var freeApply = new Control_Apply.Apply(function () {
      return freeFunctor;
  }, Control_Monad.ap(freeMonad));
  var freeApplicative = new Control_Applicative.Applicative(function () {
      return freeApply;
  }, function ($86) {
      return fromView(Return.create($86));
  });
  var liftF = function (f) {
      return fromView(new Bind(Unsafe_Coerce.unsafeCoerce(f), function ($87) {
          return Control_Applicative.pure(freeApplicative)(Unsafe_Coerce.unsafeCoerce($87));
      }));
  };
  exports["liftF"] = liftF;
  exports["runFreeM"] = runFreeM;
  exports["freeFunctor"] = freeFunctor;
  exports["freeBind"] = freeBind;
  exports["freeApplicative"] = freeApplicative;
  exports["freeApply"] = freeApply;
  exports["freeMonad"] = freeMonad;
})(PS["Control.Monad.Free"] = PS["Control.Monad.Free"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Cont_Class = PS["Control.Monad.Cont.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Reader_Class = PS["Control.Monad.Reader.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Function = PS["Data.Function"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var StateT = function (x) {
      return x;
  }; 
  var functorStateT = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return function (v) {
              return function (s) {
                  return Data_Functor.map(dictFunctor)(function (v1) {
                      return new Data_Tuple.Tuple(f(v1.value0), v1.value1);
                  })(v(s));
              };
          };
      });
  };
  var monadStateT = function (dictMonad) {
      return new Control_Monad.Monad(function () {
          return applicativeStateT(dictMonad);
      }, function () {
          return bindStateT(dictMonad);
      });
  };
  var bindStateT = function (dictMonad) {
      return new Control_Bind.Bind(function () {
          return applyStateT(dictMonad);
      }, function (v) {
          return function (f) {
              return function (s) {
                  return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(v(s))(function (v1) {
                      var $65 = f(v1.value0);
                      return $65(v1.value1);
                  });
              };
          };
      });
  };
  var applyStateT = function (dictMonad) {
      return new Control_Apply.Apply(function () {
          return functorStateT(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]());
      }, Control_Monad.ap(monadStateT(dictMonad)));
  };
  var applicativeStateT = function (dictMonad) {
      return new Control_Applicative.Applicative(function () {
          return applyStateT(dictMonad);
      }, function (a) {
          return function (s) {
              return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(new Data_Tuple.Tuple(a, s));
          };
      });
  };
  var monadStateStateT = function (dictMonad) {
      return new Control_Monad_State_Class.MonadState(function () {
          return monadStateT(dictMonad);
      }, function (f) {
          return StateT(function ($101) {
              return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(f($101));
          });
      });
  };
  exports["StateT"] = StateT;
  exports["functorStateT"] = functorStateT;
  exports["applyStateT"] = applyStateT;
  exports["applicativeStateT"] = applicativeStateT;
  exports["bindStateT"] = bindStateT;
  exports["monadStateT"] = monadStateT;
  exports["monadStateStateT"] = monadStateStateT;
})(PS["Control.Monad.State.Trans"] = PS["Control.Monad.State.Trans"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_State_Trans = PS["Control.Monad.State.Trans"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var runState = function (v) {
      return function ($14) {
          return Data_Newtype.unwrap(Data_Identity.newtypeIdentity)(v($14));
      };
  };
  exports["runState"] = runState;
})(PS["Control.Monad.State"] = PS["Control.Monad.State"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_Monad_Writer_Trans = PS["Control.Monad.Writer.Trans"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var runWriter = function ($0) {
      return Data_Newtype.unwrap(Data_Identity.newtypeIdentity)(Control_Monad_Writer_Trans.runWriterT($0));
  };
  exports["runWriter"] = runWriter;
})(PS["Control.Monad.Writer"] = PS["Control.Monad.Writer"] || {});
(function(exports) {
    "use strict";

  exports.eventListener = function (fn) {
    return function (event) {
      return fn(event)();
    };
  };

  exports.addEventListener = function (type) {
    return function (listener) {
      return function (useCapture) {
        return function (target) {
          return function () {
            target.addEventListener(type, listener, useCapture);
            return {};
          };
        };
      };
    };
  };
})(PS["DOM.Event.EventTarget"] = PS["DOM.Event.EventTarget"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["DOM.Event.EventTarget"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var DOM = PS["DOM"];
  var DOM_Event_Types = PS["DOM.Event.Types"];
  exports["addEventListener"] = $foreign.addEventListener;
  exports["eventListener"] = $foreign.eventListener;
})(PS["DOM.Event.EventTarget"] = PS["DOM.Event.EventTarget"] || {});
(function(exports) {
  /* global window */
  "use strict";

  exports.window = function () {
    return window;
  };
})(PS["DOM.HTML"] = PS["DOM.HTML"] || {});
(function(exports) {
    "use strict";

  exports._readHTMLElement = function (failure) {
    return function (success) {
      return function (value) {
        var tag = Object.prototype.toString.call(value);
        if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
          return success(value);
        } else {
          return failure(tag);
        }
      };
    };
  };
})(PS["DOM.HTML.Types"] = PS["DOM.HTML.Types"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // jshint maxparams: 3
  exports.parseJSONImpl = function (left, right, str) {
    try {
      return right(JSON.parse(str));
    } catch (e) {
      return left(e.toString());
    }
  };
  // jshint maxparams: 1

  exports.toForeign = function (value) {
    return value;
  };

  exports.unsafeFromForeign = function (value) {
    return value;
  };

  exports.typeOf = function (value) {
    return typeof value;
  };

  exports.tagOf = function (value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };

  exports.isNull = function (value) {
    return value === null;
  };

  exports.isUndefined = function (value) {
    return value === undefined;
  };

  exports.isArray = Array.isArray || function (value) {
    return Object.prototype.toString.call(value) === "[object Array]";
  };
})(PS["Data.Foreign"] = PS["Data.Foreign"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Function = PS["Data.Function"];
  var Control_Bind = PS["Control.Bind"];
  var singleton = function ($36) {
      return Data_List_Types.NonEmptyList(Data_NonEmpty.singleton(Data_List_Types.plusList)($36));
  };
  exports["singleton"] = singleton;
})(PS["Data.List.NonEmpty"] = PS["Data.List.NonEmpty"] || {});
(function(exports) {
    "use strict";

  exports.singleton = function (c) {
    return c;
  };

  exports.length = function (s) {
    return s.length;
  };

  exports.take = function (n) {
    return function (s) {
      return s.substr(0, n);
    };
  };

  exports.drop = function (n) {
    return function (s) {
      return s.substring(n);
    };
  };

  exports.split = function (sep) {
    return function (s) {
      return s.split(sep);
    };
  };

  exports.toCharArray = function (s) {
    return s.split("");
  };

  exports.joinWith = function (s) {
    return function (xs) {
      return xs.join(s);
    };
  };
})(PS["Data.String"] = PS["Data.String"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.String"];
  var Prelude = PS["Prelude"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_String_Unsafe = PS["Data.String.Unsafe"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Function = PS["Data.Function"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  exports["drop"] = $foreign.drop;
  exports["joinWith"] = $foreign.joinWith;
  exports["length"] = $foreign.length;
  exports["singleton"] = $foreign.singleton;
  exports["take"] = $foreign.take;
  exports["toCharArray"] = $foreign.toCharArray;
})(PS["Data.String"] = PS["Data.String"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Foreign"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Data_Either = PS["Data.Either"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Int = PS["Data.Int"];
  var Data_List_NonEmpty = PS["Data.List.NonEmpty"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_String = PS["Data.String"];
  var Data_Eq = PS["Data.Eq"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Data_Identity = PS["Data.Identity"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Function = PS["Data.Function"];
  var Data_Boolean = PS["Data.Boolean"];
  var ForeignError = (function () {
      function ForeignError(value0) {
          this.value0 = value0;
      };
      ForeignError.create = function (value0) {
          return new ForeignError(value0);
      };
      return ForeignError;
  })();
  var TypeMismatch = (function () {
      function TypeMismatch(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      TypeMismatch.create = function (value0) {
          return function (value1) {
              return new TypeMismatch(value0, value1);
          };
      };
      return TypeMismatch;
  })();
  var ErrorAtIndex = (function () {
      function ErrorAtIndex(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtIndex.create = function (value0) {
          return function (value1) {
              return new ErrorAtIndex(value0, value1);
          };
      };
      return ErrorAtIndex;
  })();
  var ErrorAtProperty = (function () {
      function ErrorAtProperty(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtProperty.create = function (value0) {
          return function (value1) {
              return new ErrorAtProperty(value0, value1);
          };
      };
      return ErrorAtProperty;
  })();
  var JSONError = (function () {
      function JSONError(value0) {
          this.value0 = value0;
      };
      JSONError.create = function (value0) {
          return new JSONError(value0);
      };
      return JSONError;
  })();
  var showForeignError = new Data_Show.Show(function (v) {
      if (v instanceof ForeignError) {
          return "(ForeignError " + (v.value0 + ")");
      };
      if (v instanceof ErrorAtIndex) {
          return "(ErrorAtIndex " + (Data_Show.show(Data_Show.showInt)(v.value0) + (" " + (Data_Show.show(showForeignError)(v.value1) + ")")));
      };
      if (v instanceof ErrorAtProperty) {
          return "(ErrorAtProperty " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + (Data_Show.show(showForeignError)(v.value1) + ")")));
      };
      if (v instanceof JSONError) {
          return "(JSONError " + (Data_Show.show(Data_Show.showString)(v.value0) + ")");
      };
      if (v instanceof TypeMismatch) {
          return "(TypeMismatch " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + (Data_Show.show(Data_Show.showString)(v.value1) + ")")));
      };
      throw new Error("Failed pattern match at Data.Foreign line 66, column 3 - line 67, column 3: " + [ v.constructor.name ]);
  });
  var fail = function ($112) {
      return Control_Monad_Error_Class.throwError(Control_Monad_Except_Trans.monadErrorExceptT(Data_Identity.monadIdentity))(Data_List_NonEmpty.singleton($112));
  };
  var parseJSON = function (json) {
      return $foreign.parseJSONImpl(function ($113) {
          return fail(JSONError.create($113));
      }, Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity)), json);
  };
  var readArray = function (value) {
      if ($foreign.isArray(value)) {
          return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))($foreign.unsafeFromForeign(value));
      };
      if (Data_Boolean.otherwise) {
          return fail(new TypeMismatch("array", $foreign.tagOf(value)));
      };
      throw new Error("Failed pattern match at Data.Foreign line 150, column 1 - line 152, column 58: " + [ value.constructor.name ]);
  };
  var unsafeReadTagged = function (tag) {
      return function (value) {
          if ($foreign.tagOf(value) === tag) {
              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))($foreign.unsafeFromForeign(value));
          };
          if (Data_Boolean.otherwise) {
              return fail(new TypeMismatch(tag, $foreign.tagOf(value)));
          };
          throw new Error("Failed pattern match at Data.Foreign line 109, column 1 - line 111, column 54: " + [ tag.constructor.name, value.constructor.name ]);
      };
  };
  var readBoolean = unsafeReadTagged("Boolean");
  var readString = unsafeReadTagged("String");
  exports["ForeignError"] = ForeignError;
  exports["TypeMismatch"] = TypeMismatch;
  exports["ErrorAtIndex"] = ErrorAtIndex;
  exports["ErrorAtProperty"] = ErrorAtProperty;
  exports["JSONError"] = JSONError;
  exports["fail"] = fail;
  exports["parseJSON"] = parseJSON;
  exports["readArray"] = readArray;
  exports["readBoolean"] = readBoolean;
  exports["readString"] = readString;
  exports["unsafeReadTagged"] = unsafeReadTagged;
  exports["showForeignError"] = showForeignError;
  exports["isNull"] = $foreign.isNull;
  exports["isUndefined"] = $foreign.isUndefined;
  exports["toForeign"] = $foreign.toForeign;
  exports["typeOf"] = $foreign.typeOf;
})(PS["Data.Foreign"] = PS["Data.Foreign"] || {});
(function(exports) {
    "use strict";

  //------------------------------------------------------------------------------
  // Array creation --------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.range = function (start) {
    return function (end) {
      var step = start > end ? -1 : 1;
      var result = [];
      for (var i = start, n = 0; i !== end; i += step) {
        result[n++] = i;
      }
      result[n] = i;
      return result;
    };
  };

  exports.fromFoldableImpl = (function () {
    // jshint maxparams: 2
    function Cons(head, tail) {
      this.head = head;
      this.tail = tail;
    }
    var emptyList = {};

    function curryCons(head) {
      return function (tail) {
        return new Cons(head, tail);
      };
    }

    function listToArray(list) {
      var result = [];
      var count = 0;
      while (list !== emptyList) {
        result[count++] = list.head;
        list = list.tail;
      }
      return result;
    }

    return function (foldr) {
      return function (xs) {
        return listToArray(foldr(curryCons)(emptyList)(xs));
      };
    };
  })();

  //------------------------------------------------------------------------------
  // Array size ------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.length = function (xs) {
    return xs.length;
  };

  exports.snoc = function (l) {
    return function (e) {
      var l1 = l.slice();
      l1.push(e);
      return l1;
    };
  };

  exports.filter = function (f) {
    return function (xs) {
      return xs.filter(f);
    };
  };

  exports.partition = function (f) {
    return function (xs) {
      var yes = [];
      var no  = [];
      for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        if (f(x))
          yes.push(x);
        else
          no.push(x);
      }
      return { yes: yes, no: no };
    };
  };

  //------------------------------------------------------------------------------
  // Subarrays -------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.slice = function (s) {
    return function (e) {
      return function (l) {
        return l.slice(s, e);
      };
    };
  };

  //------------------------------------------------------------------------------
  // Zipping ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.zipWith = function (f) {
    return function (xs) {
      return function (ys) {
        var l = xs.length < ys.length ? xs.length : ys.length;
        var result = new Array(l);
        for (var i = 0; i < l; i++) {
          result[i] = f(xs[i])(ys[i]);
        }
        return result;
      };
    };
  };
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Array"];
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Array_ST = PS["Data.Array.ST"];
  var Data_Array_ST_Iterator = PS["Data.Array.ST.Iterator"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Data_Function = PS["Data.Function"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Eq = PS["Data.Eq"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Category = PS["Control.Category"];
  var zip = $foreign.zipWith(Data_Tuple.Tuple.create);
  var singleton = function (a) {
      return [ a ];
  };
  var fromFoldable = function (dictFoldable) {
      return $foreign.fromFoldableImpl(Data_Foldable.foldr(dictFoldable));
  };
  var concatMap = Data_Function.flip(Control_Bind.bind(Control_Bind.bindArray));
  var mapMaybe = function (f) {
      return concatMap(function ($85) {
          return Data_Maybe.maybe([  ])(singleton)(f($85));
      });
  };
  var catMaybes = mapMaybe(Control_Category.id(Control_Category.categoryFn));
  exports["catMaybes"] = catMaybes;
  exports["concatMap"] = concatMap;
  exports["fromFoldable"] = fromFoldable;
  exports["mapMaybe"] = mapMaybe;
  exports["singleton"] = singleton;
  exports["zip"] = zip;
  exports["filter"] = $foreign.filter;
  exports["length"] = $foreign.length;
  exports["partition"] = $foreign.partition;
  exports["range"] = $foreign.range;
  exports["snoc"] = $foreign.snoc;
  exports["zipWith"] = $foreign.zipWith;
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // jshint maxparams: 4
  exports.unsafeReadPropImpl = function (f, s, key, value) {
    return value == null ? f : s(value[key]);
  };

  // jshint maxparams: 2
  exports.unsafeHasOwnProperty = function (prop, value) {
    return Object.prototype.hasOwnProperty.call(value, prop);
  };

  exports.unsafeHasProperty = function (prop, value) {
    return prop in value;
  };
})(PS["Data.Foreign.Index"] = PS["Data.Foreign.Index"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Foreign.Index"];
  var Prelude = PS["Prelude"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Function = PS["Data.Function"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Data_Identity = PS["Data.Identity"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Eq = PS["Data.Eq"];        
  var Index = function (errorAt, hasOwnProperty, hasProperty, ix) {
      this.errorAt = errorAt;
      this.hasOwnProperty = hasOwnProperty;
      this.hasProperty = hasProperty;
      this.ix = ix;
  };
  var unsafeReadProp = function (k) {
      return function (value) {
          return $foreign.unsafeReadPropImpl(Data_Foreign.fail(new Data_Foreign.TypeMismatch("object", Data_Foreign.typeOf(value))), Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity)), k, value);
      };
  };
  var prop = unsafeReadProp;
  var ix = function (dict) {
      return dict.ix;
  };                         
  var hasPropertyImpl = function (v) {
      return function (value) {
          if (Data_Foreign.isNull(value)) {
              return false;
          };
          if (Data_Foreign.isUndefined(value)) {
              return false;
          };
          if (Data_Foreign.typeOf(value) === "object" || Data_Foreign.typeOf(value) === "function") {
              return $foreign.unsafeHasProperty(v, value);
          };
          return false;
      };
  };
  var hasProperty = function (dict) {
      return dict.hasProperty;
  };
  var hasOwnPropertyImpl = function (v) {
      return function (value) {
          if (Data_Foreign.isNull(value)) {
              return false;
          };
          if (Data_Foreign.isUndefined(value)) {
              return false;
          };
          if (Data_Foreign.typeOf(value) === "object" || Data_Foreign.typeOf(value) === "function") {
              return $foreign.unsafeHasOwnProperty(v, value);
          };
          return false;
      };
  };                                                                                                                         
  var indexString = new Index(Data_Foreign.ErrorAtProperty.create, hasOwnPropertyImpl, hasPropertyImpl, Data_Function.flip(prop));
  var hasOwnProperty = function (dict) {
      return dict.hasOwnProperty;
  };
  var errorAt = function (dict) {
      return dict.errorAt;
  };
  exports["Index"] = Index;
  exports["errorAt"] = errorAt;
  exports["hasOwnProperty"] = hasOwnProperty;
  exports["hasProperty"] = hasProperty;
  exports["ix"] = ix;
  exports["prop"] = prop;
  exports["indexString"] = indexString;
})(PS["Data.Foreign.Index"] = PS["Data.Foreign.Index"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Data_Array = PS["Data.Array"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Index = PS["Data.Foreign.Index"];
  var Data_Foreign_Null = PS["Data.Foreign.Null"];
  var Data_Foreign_NullOrUndefined = PS["Data.Foreign.NullOrUndefined"];
  var Data_Foreign_Undefined = PS["Data.Foreign.Undefined"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Traversable = PS["Data.Traversable"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Semiring = PS["Data.Semiring"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Identity = PS["Data.Identity"];        
  var IsForeign = function (read) {
      this.read = read;
  };
  var stringIsForeign = new IsForeign(Data_Foreign.readString);
  var read = function (dict) {
      return dict.read;
  };
  var readJSON = function (dictIsForeign) {
      return function (json) {
          return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign.parseJSON(json))(read(dictIsForeign));
      };
  };
  var readWith = function (dictIsForeign) {
      return function (f) {
          return function ($23) {
              return Control_Monad_Except.mapExcept(Data_Bifunctor.lmap(Data_Either.bifunctorEither)(f))(read(dictIsForeign)($23));
          };
      };
  };
  var readProp = function (dictIsForeign) {
      return function (dictIndex) {
          return function (prop) {
              return function (value) {
                  return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign_Index.ix(dictIndex)(value)(prop))(readWith(dictIsForeign)(Data_Functor.map(Data_List_Types.functorNonEmptyList)(Data_Foreign_Index.errorAt(dictIndex)(prop))));
              };
          };
      };
  };                                                        
  var booleanIsForeign = new IsForeign(Data_Foreign.readBoolean);
  var arrayIsForeign = function (dictIsForeign) {
      return new IsForeign((function () {
          var readElement = function (i) {
              return function (value) {
                  return readWith(dictIsForeign)(Data_Functor.map(Data_List_Types.functorNonEmptyList)(Data_Foreign.ErrorAtIndex.create(i)))(value);
              };
          };
          var readElements = function (arr) {
              return Data_Traversable.sequence(Data_Traversable.traversableArray)(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_Array.zipWith(readElement)(Data_Array.range(0)(Data_Array.length(arr)))(arr));
          };
          return Control_Bind.composeKleisli(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign.readArray)(readElements);
      })());
  };
  exports["IsForeign"] = IsForeign;
  exports["read"] = read;
  exports["readJSON"] = readJSON;
  exports["readProp"] = readProp;
  exports["readWith"] = readWith;
  exports["stringIsForeign"] = stringIsForeign;
  exports["booleanIsForeign"] = booleanIsForeign;
  exports["arrayIsForeign"] = arrayIsForeign;
})(PS["Data.Foreign.Class"] = PS["Data.Foreign.Class"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["DOM.HTML.Types"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Identity = PS["Data.Identity"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_List_Types = PS["Data.List.Types"];        
  var windowToEventTarget = Unsafe_Coerce.unsafeCoerce;                        
  var readHTMLElement = $foreign._readHTMLElement(function ($0) {
      return Control_Monad_Except_Trans.except(Data_Identity.applicativeIdentity)(Data_Either.Left.create(Control_Applicative.pure(Data_List_Types.applicativeNonEmptyList)(Data_Foreign.TypeMismatch.create("HTMLElement")($0))));
  })(function ($1) {
      return Control_Monad_Except_Trans.except(Data_Identity.applicativeIdentity)(Data_Either.Right.create($1));
  });                                                                    
  var htmlElementToNode = Unsafe_Coerce.unsafeCoerce;   
  var htmlDocumentToParentNode = Unsafe_Coerce.unsafeCoerce;
  exports["htmlDocumentToParentNode"] = htmlDocumentToParentNode;
  exports["htmlElementToNode"] = htmlElementToNode;
  exports["readHTMLElement"] = readHTMLElement;
  exports["windowToEventTarget"] = windowToEventTarget;
})(PS["DOM.HTML.Types"] = PS["DOM.HTML.Types"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["DOM.HTML"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  exports["window"] = $foreign.window;
})(PS["DOM.HTML"] = PS["DOM.HTML"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var DOM_Event_Types = PS["DOM.Event.Types"];
  var load = "load";
  exports["load"] = load;
})(PS["DOM.HTML.Event.EventTypes"] = PS["DOM.HTML.Event.EventTypes"] || {});
(function(exports) {
    "use strict";

  exports.document = function (window) {
    return function () {
      return window.document;
    };
  };
})(PS["DOM.HTML.Window"] = PS["DOM.HTML.Window"] || {});
(function(exports) {
    "use strict";

  exports["null"] = null;

  exports.nullable = function (a, r, f) {
    return a == null ? r : f(a);
  };

  exports.notNull = function (x) {
    return x;
  };
})(PS["Data.Nullable"] = PS["Data.Nullable"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Nullable"];
  var Prelude = PS["Prelude"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Show = PS["Data.Show"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];        
  var toNullable = Data_Maybe.maybe($foreign["null"])($foreign.notNull);
  var toMaybe = function (n) {
      return $foreign.nullable(n, Data_Maybe.Nothing.value, Data_Maybe.Just.create);
  };
  exports["toMaybe"] = toMaybe;
  exports["toNullable"] = toNullable;
})(PS["Data.Nullable"] = PS["Data.Nullable"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["DOM.HTML.Window"];
  var Prelude = PS["Prelude"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Nullable = PS["Data.Nullable"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Data_Functor = PS["Data.Functor"];
  exports["document"] = $foreign.document;
})(PS["DOM.HTML.Window"] = PS["DOM.HTML.Window"] || {});
(function(exports) {
    "use strict";

  exports.appendChild = function (node) {
    return function (parent) {
      return function () {
        return parent.appendChild(node);
      };
    };
  };
})(PS["DOM.Node.Node"] = PS["DOM.Node.Node"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["DOM.Node.Node"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Maybe = PS["Data.Maybe"];
  var DOM = PS["DOM"];
  var DOM_Node_NodeType = PS["DOM.Node.NodeType"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  exports["appendChild"] = $foreign.appendChild;
})(PS["DOM.Node.Node"] = PS["DOM.Node.Node"] || {});
(function(exports) {
    "use strict";                                             

  exports.querySelector = function (selector) {
    return function (node) {
      return function () {
        return node.querySelector(selector);
      };
    };
  };
})(PS["DOM.Node.ParentNode"] = PS["DOM.Node.ParentNode"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["DOM.Node.ParentNode"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Nullable = PS["Data.Nullable"];
  var DOM = PS["DOM"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  exports["querySelector"] = $foreign.querySelector;
})(PS["DOM.Node.ParentNode"] = PS["DOM.Node.ParentNode"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var runExistsR = Unsafe_Coerce.unsafeCoerce;
  var mkExistsR = Unsafe_Coerce.unsafeCoerce;
  exports["mkExistsR"] = mkExistsR;
  exports["runExistsR"] = runExistsR;
})(PS["Data.ExistsR"] = PS["Data.ExistsR"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Category = PS["Control.Category"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Either = PS["Data.Either"];
  var Data_Array = PS["Data.Array"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];        
  var Filterable = function (__superclass_Data$dotFunctor$dotFunctor_0, filter, filterMap, partition, partitionMap) {
      this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
      this.filter = filter;
      this.filterMap = filterMap;
      this.partition = partition;
      this.partitionMap = partitionMap;
  };
  var partitionMap = function (dict) {
      return dict.partitionMap;
  };
  var partition = function (dict) {
      return dict.partition;
  };
  var filterableArray = new Filterable(function () {
      return Data_Functor.functorArray;
  }, Data_Array.filter, Data_Array.mapMaybe, Data_Array.partition, function (p) {
      var go = function (acc) {
          return function (x) {
              var $10 = p(x);
              if ($10 instanceof Data_Either.Left) {
                  var $11 = {};
                  for (var $12 in acc) {
                      if ({}.hasOwnProperty.call(acc, $12)) {
                          $11[$12] = acc[$12];
                      };
                  };
                  $11.left = Data_Semigroup.append(Data_Semigroup.semigroupArray)(acc.left)([ $10.value0 ]);
                  return $11;
              };
              if ($10 instanceof Data_Either.Right) {
                  var $15 = {};
                  for (var $16 in acc) {
                      if ({}.hasOwnProperty.call(acc, $16)) {
                          $15[$16] = acc[$16];
                      };
                  };
                  $15.right = Data_Semigroup.append(Data_Semigroup.semigroupArray)(acc.right)([ $10.value0 ]);
                  return $15;
              };
              throw new Error("Failed pattern match at Data.Filterable line 93, column 16 - line 95, column 50: " + [ $10.constructor.name ]);
          };
      };
      return Data_Foldable.foldl(Data_Foldable.foldableArray)(go)({
          left: [  ], 
          right: [  ]
      });
  });
  var filterMap = function (dict) {
      return dict.filterMap;
  };
  var filtered = function (dictFilterable) {
      return filterMap(dictFilterable)(Control_Category.id(Control_Category.categoryFn));
  };
  var filter = function (dict) {
      return dict.filter;
  };
  exports["Filterable"] = Filterable;
  exports["filter"] = filter;
  exports["filterMap"] = filterMap;
  exports["filtered"] = filtered;
  exports["partition"] = partition;
  exports["partitionMap"] = partitionMap;
  exports["filterableArray"] = filterableArray;
})(PS["Data.Filterable"] = PS["Data.Filterable"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Either = PS["Data.Either"];
  var Data_Generic = PS["Data.Generic"];
  var Data_String = PS["Data.String"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Show = PS["Data.Show"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Semigroup = PS["Data.Semigroup"];        
  var OPTIONS = (function () {
      function OPTIONS() {

      };
      OPTIONS.value = new OPTIONS();
      return OPTIONS;
  })();
  var GET = (function () {
      function GET() {

      };
      GET.value = new GET();
      return GET;
  })();
  var HEAD = (function () {
      function HEAD() {

      };
      HEAD.value = new HEAD();
      return HEAD;
  })();
  var POST = (function () {
      function POST() {

      };
      POST.value = new POST();
      return POST;
  })();
  var PUT = (function () {
      function PUT() {

      };
      PUT.value = new PUT();
      return PUT;
  })();
  var DELETE = (function () {
      function DELETE() {

      };
      DELETE.value = new DELETE();
      return DELETE;
  })();
  var TRACE = (function () {
      function TRACE() {

      };
      TRACE.value = new TRACE();
      return TRACE;
  })();
  var CONNECT = (function () {
      function CONNECT() {

      };
      CONNECT.value = new CONNECT();
      return CONNECT;
  })();
  var PROPFIND = (function () {
      function PROPFIND() {

      };
      PROPFIND.value = new PROPFIND();
      return PROPFIND;
  })();
  var PROPPATCH = (function () {
      function PROPPATCH() {

      };
      PROPPATCH.value = new PROPPATCH();
      return PROPPATCH;
  })();
  var MKCOL = (function () {
      function MKCOL() {

      };
      MKCOL.value = new MKCOL();
      return MKCOL;
  })();
  var COPY = (function () {
      function COPY() {

      };
      COPY.value = new COPY();
      return COPY;
  })();
  var MOVE = (function () {
      function MOVE() {

      };
      MOVE.value = new MOVE();
      return MOVE;
  })();
  var LOCK = (function () {
      function LOCK() {

      };
      LOCK.value = new LOCK();
      return LOCK;
  })();
  var UNLOCK = (function () {
      function UNLOCK() {

      };
      UNLOCK.value = new UNLOCK();
      return UNLOCK;
  })();
  var PATCH = (function () {
      function PATCH() {

      };
      PATCH.value = new PATCH();
      return PATCH;
  })();
  var unCustomMethod = function (v) {
      return v;
  };
  var showMethod = new Data_Show.Show(function (v) {
      if (v instanceof OPTIONS) {
          return "OPTIONS";
      };
      if (v instanceof GET) {
          return "GET";
      };
      if (v instanceof HEAD) {
          return "HEAD";
      };
      if (v instanceof POST) {
          return "POST";
      };
      if (v instanceof PUT) {
          return "PUT";
      };
      if (v instanceof DELETE) {
          return "DELETE";
      };
      if (v instanceof TRACE) {
          return "TRACE";
      };
      if (v instanceof CONNECT) {
          return "CONNECT";
      };
      if (v instanceof PROPFIND) {
          return "PROPFIND";
      };
      if (v instanceof PROPPATCH) {
          return "PROPPATCH";
      };
      if (v instanceof MKCOL) {
          return "MKCOL";
      };
      if (v instanceof COPY) {
          return "COPY";
      };
      if (v instanceof MOVE) {
          return "MOVE";
      };
      if (v instanceof LOCK) {
          return "LOCK";
      };
      if (v instanceof UNLOCK) {
          return "UNLOCK";
      };
      if (v instanceof PATCH) {
          return "PATCH";
      };
      throw new Error("Failed pattern match at Data.HTTP.Method line 43, column 3 - line 44, column 3: " + [ v.constructor.name ]);
  });
  var print = Data_Either.either(Data_Show.show(showMethod))(unCustomMethod);
  exports["OPTIONS"] = OPTIONS;
  exports["GET"] = GET;
  exports["HEAD"] = HEAD;
  exports["POST"] = POST;
  exports["PUT"] = PUT;
  exports["DELETE"] = DELETE;
  exports["TRACE"] = TRACE;
  exports["CONNECT"] = CONNECT;
  exports["PROPFIND"] = PROPFIND;
  exports["PROPPATCH"] = PROPPATCH;
  exports["MKCOL"] = MKCOL;
  exports["COPY"] = COPY;
  exports["MOVE"] = MOVE;
  exports["LOCK"] = LOCK;
  exports["UNLOCK"] = UNLOCK;
  exports["PATCH"] = PATCH;
  exports["print"] = print;
  exports["unCustomMethod"] = unCustomMethod;
  exports["showMethod"] = showMethod;
})(PS["Data.HTTP.Method"] = PS["Data.HTTP.Method"] || {});
(function(exports) {
    "use strict";

  exports.defer = function () {

    function Defer(thunk) {
      if (this instanceof Defer) {
        this.thunk = thunk;
        return this;
      } else {
        return new Defer(thunk);
      }
    }

    Defer.prototype.force = function () {
      var value = this.thunk();
      this.thunk = null;
      this.force = function () {
        return value;
      };
      return value;
    };

    return Defer;

  }();

  exports.force = function (l) {
    return l.force();
  };
})(PS["Data.Lazy"] = PS["Data.Lazy"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Lazy"];
  var Prelude = PS["Prelude"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Lazy = PS["Control.Lazy"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Ring = PS["Data.Ring"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Field = PS["Data.Field"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Data_BooleanAlgebra = PS["Data.BooleanAlgebra"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Function = PS["Data.Function"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  exports["defer"] = $foreign.defer;
  exports["force"] = $foreign.force;
})(PS["Data.Lazy"] = PS["Data.Lazy"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_List = PS["Data.List"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_List_Types = PS["Data.List.Types"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semiring = PS["Data.Semiring"];        
  var Leaf = (function () {
      function Leaf() {

      };
      Leaf.value = new Leaf();
      return Leaf;
  })();
  var Two = (function () {
      function Two(value0, value1, value2, value3) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
      };
      Two.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return new Two(value0, value1, value2, value3);
                  };
              };
          };
      };
      return Two;
  })();
  var Three = (function () {
      function Three(value0, value1, value2, value3, value4, value5, value6) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
          this.value6 = value6;
      };
      Three.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return function (value6) {
                                  return new Three(value0, value1, value2, value3, value4, value5, value6);
                              };
                          };
                      };
                  };
              };
          };
      };
      return Three;
  })();
  var TwoLeft = (function () {
      function TwoLeft(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      TwoLeft.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new TwoLeft(value0, value1, value2);
              };
          };
      };
      return TwoLeft;
  })();
  var TwoRight = (function () {
      function TwoRight(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      TwoRight.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new TwoRight(value0, value1, value2);
              };
          };
      };
      return TwoRight;
  })();
  var ThreeLeft = (function () {
      function ThreeLeft(value0, value1, value2, value3, value4, value5) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
      };
      ThreeLeft.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return new ThreeLeft(value0, value1, value2, value3, value4, value5);
                          };
                      };
                  };
              };
          };
      };
      return ThreeLeft;
  })();
  var ThreeMiddle = (function () {
      function ThreeMiddle(value0, value1, value2, value3, value4, value5) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
      };
      ThreeMiddle.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return new ThreeMiddle(value0, value1, value2, value3, value4, value5);
                          };
                      };
                  };
              };
          };
      };
      return ThreeMiddle;
  })();
  var ThreeRight = (function () {
      function ThreeRight(value0, value1, value2, value3, value4, value5) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
      };
      ThreeRight.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return new ThreeRight(value0, value1, value2, value3, value4, value5);
                          };
                      };
                  };
              };
          };
      };
      return ThreeRight;
  })();
  var KickUp = (function () {
      function KickUp(value0, value1, value2, value3) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
      };
      KickUp.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return new KickUp(value0, value1, value2, value3);
                  };
              };
          };
      };
      return KickUp;
  })();
  var lookup = function (dictOrd) {
      return Partial_Unsafe.unsafePartial(function (dictPartial) {
          return function (k) {
              return function (tree) {
                  if (tree instanceof Leaf) {
                      return Data_Maybe.Nothing.value;
                  };
                  var comp = Data_Ord.compare(dictOrd);
                  var __unused = function (dictPartial1) {
                      return function ($dollar43) {
                          return $dollar43;
                      };
                  };
                  return __unused(dictPartial)((function () {
                      if (tree instanceof Two) {
                          var $189 = comp(k)(tree.value1);
                          if ($189 instanceof Data_Ordering.EQ) {
                              return new Data_Maybe.Just(tree.value2);
                          };
                          if ($189 instanceof Data_Ordering.LT) {
                              return lookup(dictOrd)(k)(tree.value0);
                          };
                          return lookup(dictOrd)(k)(tree.value3);
                      };
                      if (tree instanceof Three) {
                          var $194 = comp(k)(tree.value1);
                          if ($194 instanceof Data_Ordering.EQ) {
                              return new Data_Maybe.Just(tree.value2);
                          };
                          var $196 = comp(k)(tree.value4);
                          if ($196 instanceof Data_Ordering.EQ) {
                              return new Data_Maybe.Just(tree.value5);
                          };
                          if ($194 instanceof Data_Ordering.LT) {
                              return lookup(dictOrd)(k)(tree.value0);
                          };
                          if ($196 instanceof Data_Ordering.GT) {
                              return lookup(dictOrd)(k)(tree.value6);
                          };
                          return lookup(dictOrd)(k)(tree.value3);
                      };
                      throw new Error("Failed pattern match at Data.Map line 149, column 10 - line 163, column 39: " + [ tree.constructor.name ]);
                  })());
              };
          };
      });
  };
  var keys = function (v) {
      if (v instanceof Leaf) {
          return Data_List_Types.Nil.value;
      };
      if (v instanceof Two) {
          return Data_Semigroup.append(Data_List_Types.semigroupList)(keys(v.value0))(Data_Semigroup.append(Data_List_Types.semigroupList)(Control_Applicative.pure(Data_List_Types.applicativeList)(v.value1))(keys(v.value3)));
      };
      if (v instanceof Three) {
          return Data_Semigroup.append(Data_List_Types.semigroupList)(keys(v.value0))(Data_Semigroup.append(Data_List_Types.semigroupList)(Control_Applicative.pure(Data_List_Types.applicativeList)(v.value1))(Data_Semigroup.append(Data_List_Types.semigroupList)(keys(v.value3))(Data_Semigroup.append(Data_List_Types.semigroupList)(Control_Applicative.pure(Data_List_Types.applicativeList)(v.value4))(keys(v.value6)))));
      };
      throw new Error("Failed pattern match at Data.Map line 417, column 1 - line 417, column 16: " + [ v.constructor.name ]);
  }; 
  var fromZipper = function (__copy_dictOrd) {
      return function (__copy_v) {
          return function (__copy_tree) {
              var dictOrd = __copy_dictOrd;
              var v = __copy_v;
              var tree = __copy_tree;
              tco: while (true) {
                  if (v instanceof Data_List_Types.Nil) {
                      return tree;
                  };
                  if (v instanceof Data_List_Types.Cons) {
                      if (v.value0 instanceof TwoLeft) {
                          var __tco_dictOrd = dictOrd;
                          var __tco_v = v.value1;
                          var __tco_tree = new Two(tree, v.value0.value0, v.value0.value1, v.value0.value2);
                          dictOrd = __tco_dictOrd;
                          v = __tco_v;
                          tree = __tco_tree;
                          continue tco;
                      };
                      if (v.value0 instanceof TwoRight) {
                          var __tco_dictOrd = dictOrd;
                          var __tco_v = v.value1;
                          var __tco_tree = new Two(v.value0.value0, v.value0.value1, v.value0.value2, tree);
                          dictOrd = __tco_dictOrd;
                          v = __tco_v;
                          tree = __tco_tree;
                          continue tco;
                      };
                      if (v.value0 instanceof ThreeLeft) {
                          var __tco_dictOrd = dictOrd;
                          var __tco_v = v.value1;
                          var __tco_tree = new Three(tree, v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5);
                          dictOrd = __tco_dictOrd;
                          v = __tco_v;
                          tree = __tco_tree;
                          continue tco;
                      };
                      if (v.value0 instanceof ThreeMiddle) {
                          var __tco_dictOrd = dictOrd;
                          var __tco_v = v.value1;
                          var __tco_tree = new Three(v.value0.value0, v.value0.value1, v.value0.value2, tree, v.value0.value3, v.value0.value4, v.value0.value5);
                          dictOrd = __tco_dictOrd;
                          v = __tco_v;
                          tree = __tco_tree;
                          continue tco;
                      };
                      if (v.value0 instanceof ThreeRight) {
                          var __tco_dictOrd = dictOrd;
                          var __tco_v = v.value1;
                          var __tco_tree = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5, tree);
                          dictOrd = __tco_dictOrd;
                          v = __tco_v;
                          tree = __tco_tree;
                          continue tco;
                      };
                      throw new Error("Failed pattern match at Data.Map line 240, column 3 - line 245, column 88: " + [ v.value0.constructor.name ]);
                  };
                  throw new Error("Failed pattern match at Data.Map line 238, column 1 - line 238, column 27: " + [ v.constructor.name, tree.constructor.name ]);
              };
          };
      };
  };
  var insert = function (dictOrd) {
      var up = function (__copy_v) {
          return function (__copy_v1) {
              var v = __copy_v;
              var v1 = __copy_v1;
              tco: while (true) {
                  if (v instanceof Data_List_Types.Nil) {
                      return new Two(v1.value0, v1.value1, v1.value2, v1.value3);
                  };
                  if (v instanceof Data_List_Types.Cons) {
                      if (v.value0 instanceof TwoLeft) {
                          return fromZipper(dictOrd)(v.value1)(new Three(v1.value0, v1.value1, v1.value2, v1.value3, v.value0.value0, v.value0.value1, v.value0.value2));
                      };
                      if (v.value0 instanceof TwoRight) {
                          return fromZipper(dictOrd)(v.value1)(new Three(v.value0.value0, v.value0.value1, v.value0.value2, v1.value0, v1.value1, v1.value2, v1.value3));
                      };
                      if (v.value0 instanceof ThreeLeft) {
                          var __tco_v = v.value1;
                          var __tco_v1 = new KickUp(new Two(v1.value0, v1.value1, v1.value2, v1.value3), v.value0.value0, v.value0.value1, new Two(v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5));
                          v = __tco_v;
                          v1 = __tco_v1;
                          continue tco;
                      };
                      if (v.value0 instanceof ThreeMiddle) {
                          var __tco_v = v.value1;
                          var __tco_v1 = new KickUp(new Two(v.value0.value0, v.value0.value1, v.value0.value2, v1.value0), v1.value1, v1.value2, new Two(v1.value3, v.value0.value3, v.value0.value4, v.value0.value5));
                          v = __tco_v;
                          v1 = __tco_v1;
                          continue tco;
                      };
                      if (v.value0 instanceof ThreeRight) {
                          var __tco_v = v.value1;
                          var __tco_v1 = new KickUp(new Two(v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3), v.value0.value4, v.value0.value5, new Two(v1.value0, v1.value1, v1.value2, v1.value3));
                          v = __tco_v;
                          v1 = __tco_v1;
                          continue tco;
                      };
                      throw new Error("Failed pattern match at Data.Map line 276, column 5 - line 281, column 104: " + [ v.value0.constructor.name, v1.constructor.name ]);
                  };
                  throw new Error("Failed pattern match at Data.Map line 274, column 3 - line 274, column 54: " + [ v.constructor.name, v1.constructor.name ]);
              };
          };
      };
      var comp = Data_Ord.compare(dictOrd);
      var down = function (__copy_ctx) {
          return function (__copy_k) {
              return function (__copy_v) {
                  return function (__copy_v1) {
                      var ctx = __copy_ctx;
                      var k = __copy_k;
                      var v = __copy_v;
                      var v1 = __copy_v1;
                      tco: while (true) {
                          if (v1 instanceof Leaf) {
                              return up(ctx)(new KickUp(Leaf.value, k, v, Leaf.value));
                          };
                          if (v1 instanceof Two) {
                              var $317 = comp(k)(v1.value1);
                              if ($317 instanceof Data_Ordering.EQ) {
                                  return fromZipper(dictOrd)(ctx)(new Two(v1.value0, k, v, v1.value3));
                              };
                              if ($317 instanceof Data_Ordering.LT) {
                                  var __tco_ctx = new Data_List_Types.Cons(new TwoLeft(v1.value1, v1.value2, v1.value3), ctx);
                                  var __tco_k = k;
                                  var __tco_v = v;
                                  var __tco_v1 = v1.value0;
                                  ctx = __tco_ctx;
                                  k = __tco_k;
                                  v = __tco_v;
                                  v1 = __tco_v1;
                                  continue tco;
                              };
                              var __tco_ctx = new Data_List_Types.Cons(new TwoRight(v1.value0, v1.value1, v1.value2), ctx);
                              var __tco_k = k;
                              var __tco_v = v;
                              var __tco_v1 = v1.value3;
                              ctx = __tco_ctx;
                              k = __tco_k;
                              v = __tco_v;
                              v1 = __tco_v1;
                              continue tco;
                          };
                          if (v1 instanceof Three) {
                              var $322 = comp(k)(v1.value1);
                              if ($322 instanceof Data_Ordering.EQ) {
                                  return fromZipper(dictOrd)(ctx)(new Three(v1.value0, k, v, v1.value3, v1.value4, v1.value5, v1.value6));
                              };
                              var $324 = comp(k)(v1.value4);
                              if ($324 instanceof Data_Ordering.EQ) {
                                  return fromZipper(dictOrd)(ctx)(new Three(v1.value0, v1.value1, v1.value2, v1.value3, k, v, v1.value6));
                              };
                              if ($322 instanceof Data_Ordering.LT) {
                                  var __tco_ctx = new Data_List_Types.Cons(new ThreeLeft(v1.value1, v1.value2, v1.value3, v1.value4, v1.value5, v1.value6), ctx);
                                  var __tco_k = k;
                                  var __tco_v = v;
                                  var __tco_v1 = v1.value0;
                                  ctx = __tco_ctx;
                                  k = __tco_k;
                                  v = __tco_v;
                                  v1 = __tco_v1;
                                  continue tco;
                              };
                              if ($322 instanceof Data_Ordering.GT && $324 instanceof Data_Ordering.LT) {
                                  var __tco_ctx = new Data_List_Types.Cons(new ThreeMiddle(v1.value0, v1.value1, v1.value2, v1.value4, v1.value5, v1.value6), ctx);
                                  var __tco_k = k;
                                  var __tco_v = v;
                                  var __tco_v1 = v1.value3;
                                  ctx = __tco_ctx;
                                  k = __tco_k;
                                  v = __tco_v;
                                  v1 = __tco_v1;
                                  continue tco;
                              };
                              var __tco_ctx = new Data_List_Types.Cons(new ThreeRight(v1.value0, v1.value1, v1.value2, v1.value3, v1.value4, v1.value5), ctx);
                              var __tco_k = k;
                              var __tco_v = v;
                              var __tco_v1 = v1.value6;
                              ctx = __tco_ctx;
                              k = __tco_k;
                              v = __tco_v;
                              v1 = __tco_v1;
                              continue tco;
                          };
                          throw new Error("Failed pattern match at Data.Map line 257, column 3 - line 257, column 52: " + [ ctx.constructor.name, k.constructor.name, v.constructor.name, v1.constructor.name ]);
                      };
                  };
              };
          };
      };
      return down(Data_List_Types.Nil.value);
  };
  var pop = function (dictOrd) {
      var up = Partial_Unsafe.unsafePartial(function (dictPartial) {
          return function (ctxs) {
              return function (tree) {
                  if (ctxs instanceof Data_List_Types.Nil) {
                      return tree;
                  };
                  if (ctxs instanceof Data_List_Types.Cons) {
                      var __unused = function (dictPartial1) {
                          return function ($dollar51) {
                              return $dollar51;
                          };
                      };
                      return __unused(dictPartial)((function () {
                          if (ctxs.value0 instanceof TwoLeft && (ctxs.value0.value2 instanceof Leaf && tree instanceof Leaf)) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(Leaf.value, ctxs.value0.value0, ctxs.value0.value1, Leaf.value));
                          };
                          if (ctxs.value0 instanceof TwoRight && (ctxs.value0.value0 instanceof Leaf && tree instanceof Leaf)) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value));
                          };
                          if (ctxs.value0 instanceof TwoLeft && ctxs.value0.value2 instanceof Two) {
                              return up(ctxs.value1)(new Three(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3));
                          };
                          if (ctxs.value0 instanceof TwoRight && ctxs.value0.value0 instanceof Two) {
                              return up(ctxs.value1)(new Three(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree));
                          };
                          if (ctxs.value0 instanceof TwoLeft && ctxs.value0.value2 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(new Two(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6)));
                          };
                          if (ctxs.value0 instanceof TwoRight && ctxs.value0.value0 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(new Two(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree)));
                          };
                          if (ctxs.value0 instanceof ThreeLeft && (ctxs.value0.value2 instanceof Leaf && (ctxs.value0.value5 instanceof Leaf && tree instanceof Leaf))) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value0, ctxs.value0.value1, Leaf.value, ctxs.value0.value3, ctxs.value0.value4, Leaf.value));
                          };
                          if (ctxs.value0 instanceof ThreeMiddle && (ctxs.value0.value0 instanceof Leaf && (ctxs.value0.value5 instanceof Leaf && tree instanceof Leaf))) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value, ctxs.value0.value3, ctxs.value0.value4, Leaf.value));
                          };
                          if (ctxs.value0 instanceof ThreeRight && (ctxs.value0.value0 instanceof Leaf && (ctxs.value0.value3 instanceof Leaf && tree instanceof Leaf))) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value, ctxs.value0.value4, ctxs.value0.value5, Leaf.value));
                          };
                          if (ctxs.value0 instanceof ThreeLeft && ctxs.value0.value2 instanceof Two) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(new Three(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
                          };
                          if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value0 instanceof Two) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(new Three(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
                          };
                          if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value5 instanceof Two) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0, ctxs.value0.value5.value1, ctxs.value0.value5.value2, ctxs.value0.value5.value3)));
                          };
                          if (ctxs.value0 instanceof ThreeRight && ctxs.value0.value3 instanceof Two) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Two(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3, ctxs.value0.value4, ctxs.value0.value5, tree)));
                          };
                          if (ctxs.value0 instanceof ThreeLeft && ctxs.value0.value2 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(new Two(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
                          };
                          if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value0 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(new Two(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
                          };
                          if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value5 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0), ctxs.value0.value5.value1, ctxs.value0.value5.value2, new Two(ctxs.value0.value5.value3, ctxs.value0.value5.value4, ctxs.value0.value5.value5, ctxs.value0.value5.value6)));
                          };
                          if (ctxs.value0 instanceof ThreeRight && ctxs.value0.value3 instanceof Three) {
                              return fromZipper(dictOrd)(ctxs.value1)(new Three(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3), ctxs.value0.value3.value4, ctxs.value0.value3.value5, new Two(ctxs.value0.value3.value6, ctxs.value0.value4, ctxs.value0.value5, tree)));
                          };
                          throw new Error("Failed pattern match at Data.Map line 326, column 9 - line 343, column 136: " + [ ctxs.value0.constructor.name, tree.constructor.name ]);
                      })());
                  };
                  throw new Error("Failed pattern match at Data.Map line 323, column 5 - line 343, column 136: " + [ ctxs.constructor.name ]);
              };
          };
      });
      var removeMaxNode = Partial_Unsafe.unsafePartial(function (dictPartial) {
          return function (ctx) {
              return function (m) {
                  var __unused = function (dictPartial1) {
                      return function ($dollar53) {
                          return $dollar53;
                      };
                  };
                  return __unused(dictPartial)((function () {
                      if (m instanceof Two && (m.value0 instanceof Leaf && m.value3 instanceof Leaf)) {
                          return up(ctx)(Leaf.value);
                      };
                      if (m instanceof Two) {
                          return removeMaxNode(new Data_List_Types.Cons(new TwoRight(m.value0, m.value1, m.value2), ctx))(m.value3);
                      };
                      if (m instanceof Three && (m.value0 instanceof Leaf && (m.value3 instanceof Leaf && m.value6 instanceof Leaf))) {
                          return up(new Data_List_Types.Cons(new TwoRight(Leaf.value, m.value1, m.value2), ctx))(Leaf.value);
                      };
                      if (m instanceof Three) {
                          return removeMaxNode(new Data_List_Types.Cons(new ThreeRight(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx))(m.value6);
                      };
                      throw new Error("Failed pattern match at Data.Map line 355, column 5 - line 359, column 107: " + [ m.constructor.name ]);
                  })());
              };
          };
      });
      var maxNode = Partial_Unsafe.unsafePartial(function (dictPartial) {
          return function (m) {
              var __unused = function (dictPartial1) {
                  return function ($dollar55) {
                      return $dollar55;
                  };
              };
              return __unused(dictPartial)((function () {
                  if (m instanceof Two && m.value3 instanceof Leaf) {
                      return {
                          key: m.value1, 
                          value: m.value2
                      };
                  };
                  if (m instanceof Two) {
                      return maxNode(m.value3);
                  };
                  if (m instanceof Three && m.value6 instanceof Leaf) {
                      return {
                          key: m.value4, 
                          value: m.value5
                      };
                  };
                  if (m instanceof Three) {
                      return maxNode(m.value6);
                  };
                  throw new Error("Failed pattern match at Data.Map line 346, column 33 - line 350, column 45: " + [ m.constructor.name ]);
              })());
          };
      });
      var comp = Data_Ord.compare(dictOrd);
      var down = Partial_Unsafe.unsafePartial(function (dictPartial) {
          return function (ctx) {
              return function (k) {
                  return function (m) {
                      if (m instanceof Leaf) {
                          return Data_Maybe.Nothing.value;
                      };
                      if (m instanceof Two) {
                          var $535 = comp(k)(m.value1);
                          if (m.value3 instanceof Leaf && $535 instanceof Data_Ordering.EQ) {
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value2, up(ctx)(Leaf.value)));
                          };
                          if ($535 instanceof Data_Ordering.EQ) {
                              var max = maxNode(m.value0);
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value2, removeMaxNode(new Data_List_Types.Cons(new TwoLeft(max.key, max.value, m.value3), ctx))(m.value0)));
                          };
                          if ($535 instanceof Data_Ordering.LT) {
                              return down(new Data_List_Types.Cons(new TwoLeft(m.value1, m.value2, m.value3), ctx))(k)(m.value0);
                          };
                          return down(new Data_List_Types.Cons(new TwoRight(m.value0, m.value1, m.value2), ctx))(k)(m.value3);
                      };
                      if (m instanceof Three) {
                          var leaves = (function () {
                              if (m.value0 instanceof Leaf && (m.value3 instanceof Leaf && m.value6 instanceof Leaf)) {
                                  return true;
                              };
                              return false;
                          })();
                          var $544 = comp(k)(m.value1);
                          var $545 = comp(k)(m.value4);
                          if (leaves && $544 instanceof Data_Ordering.EQ) {
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value2, fromZipper(dictOrd)(ctx)(new Two(Leaf.value, m.value4, m.value5, Leaf.value))));
                          };
                          if (leaves && $545 instanceof Data_Ordering.EQ) {
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value5, fromZipper(dictOrd)(ctx)(new Two(Leaf.value, m.value1, m.value2, Leaf.value))));
                          };
                          if ($544 instanceof Data_Ordering.EQ) {
                              var max = maxNode(m.value0);
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value2, removeMaxNode(new Data_List_Types.Cons(new ThreeLeft(max.key, max.value, m.value3, m.value4, m.value5, m.value6), ctx))(m.value0)));
                          };
                          if ($545 instanceof Data_Ordering.EQ) {
                              var max = maxNode(m.value3);
                              return new Data_Maybe.Just(new Data_Tuple.Tuple(m.value5, removeMaxNode(new Data_List_Types.Cons(new ThreeMiddle(m.value0, m.value1, m.value2, max.key, max.value, m.value6), ctx))(m.value3)));
                          };
                          if ($544 instanceof Data_Ordering.LT) {
                              return down(new Data_List_Types.Cons(new ThreeLeft(m.value1, m.value2, m.value3, m.value4, m.value5, m.value6), ctx))(k)(m.value0);
                          };
                          if ($544 instanceof Data_Ordering.GT && $545 instanceof Data_Ordering.LT) {
                              return down(new Data_List_Types.Cons(new ThreeMiddle(m.value0, m.value1, m.value2, m.value4, m.value5, m.value6), ctx))(k)(m.value3);
                          };
                          return down(new Data_List_Types.Cons(new ThreeRight(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx))(k)(m.value6);
                      };
                      throw new Error("Failed pattern match at Data.Map line 296, column 36 - line 319, column 82: " + [ m.constructor.name ]);
                  };
              };
          };
      });
      return down(Data_List_Types.Nil.value);
  };
  var empty = Leaf.value;
  var fromFoldable = function (dictOrd) {
      return function (dictFoldable) {
          return Data_Foldable.foldl(dictFoldable)(function (m) {
              return function (v) {
                  return insert(dictOrd)(v.value0)(v.value1)(m);
              };
          })(empty);
      };
  };
  var $$delete = function (dictOrd) {
      return function (k) {
          return function (m) {
              return Data_Maybe.maybe(m)(Data_Tuple.snd)(pop(dictOrd)(k)(m));
          };
      };
  };
  var alter = function (dictOrd) {
      return function (f) {
          return function (k) {
              return function (m) {
                  var $635 = f(lookup(dictOrd)(k)(m));
                  if ($635 instanceof Data_Maybe.Nothing) {
                      return $$delete(dictOrd)(k)(m);
                  };
                  if ($635 instanceof Data_Maybe.Just) {
                      return insert(dictOrd)(k)($635.value0)(m);
                  };
                  throw new Error("Failed pattern match at Data.Map line 364, column 15 - line 366, column 25: " + [ $635.constructor.name ]);
              };
          };
      };
  };
  var fromFoldableWith = function (dictOrd) {
      return function (dictFoldable) {
          return function (f) {
              var combine = function (v) {
                  return function (v1) {
                      if (v1 instanceof Data_Maybe.Just) {
                          return Data_Maybe.Just.create(f(v)(v1.value0));
                      };
                      if (v1 instanceof Data_Maybe.Nothing) {
                          return new Data_Maybe.Just(v);
                      };
                      throw new Error("Failed pattern match at Data.Map line 381, column 3 - line 381, column 38: " + [ v.constructor.name, v1.constructor.name ]);
                  };
              };
              return Data_Foldable.foldl(dictFoldable)(function (m) {
                  return function (v) {
                      return alter(dictOrd)(combine(v.value1))(v.value0)(m);
                  };
              })(empty);
          };
      };
  };
  exports["alter"] = alter;
  exports["empty"] = empty;
  exports["fromFoldable"] = fromFoldable;
  exports["fromFoldableWith"] = fromFoldableWith;
  exports["insert"] = insert;
  exports["keys"] = keys;
  exports["lookup"] = lookup;
  exports["pop"] = pop;
})(PS["Data.Map"] = PS["Data.Map"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Generic = PS["Data.Generic"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];        
  var MediaType = function (x) {
      return x;
  }; 
  var newtypeMediaType = new Data_Newtype.Newtype(function (n) {
      return n;
  }, MediaType);
  exports["MediaType"] = MediaType;
  exports["newtypeMediaType"] = newtypeMediaType;
})(PS["Data.MediaType"] = PS["Data.MediaType"] || {});
(function(exports) {
    "use strict";

  exports["regex'"] = function (left) {
    return function (right) {
      return function (s1) {
        return function (s2) {
          try {
            return right(new RegExp(s1, s2));
          } catch (e) {
            return left(e.message);
          }
        };
      };
    };
  };

  exports.test = function (r) {
    return function (s) {
      var lastIndex = r.lastIndex;
      var result = r.test(s);
      r.lastIndex = lastIndex;
      return result;
    };
  };
})(PS["Data.String.Regex"] = PS["Data.String.Regex"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_String = PS["Data.String"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Show = PS["Data.Show"];
  var Data_Functor = PS["Data.Functor"];
  var Control_MonadZero = PS["Control.MonadZero"];        
  var RegexFlags = (function () {
      function RegexFlags(value0) {
          this.value0 = value0;
      };
      RegexFlags.create = function (value0) {
          return new RegexFlags(value0);
      };
      return RegexFlags;
  })();
  var noFlags = new RegexFlags({
      global: false, 
      ignoreCase: false, 
      multiline: false, 
      sticky: false, 
      unicode: false
  });
  exports["RegexFlags"] = RegexFlags;
  exports["noFlags"] = noFlags;
})(PS["Data.String.Regex.Flags"] = PS["Data.String.Regex.Flags"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.String.Regex"];
  var Prelude = PS["Prelude"];
  var Data_Either = PS["Data.Either"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_String = PS["Data.String"];
  var Data_String_Regex_Flags = PS["Data.String.Regex.Flags"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Function = PS["Data.Function"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];                          
  var renderFlags = function (v) {
      return (function () {
          if (v.value0.global) {
              return "g";
          };
          if (!v.value0.global) {
              return "";
          };
          throw new Error("Failed pattern match at Data.String.Regex line 59, column 4 - line 59, column 32: " + [ v.value0.global.constructor.name ]);
      })() + ((function () {
          if (v.value0.ignoreCase) {
              return "i";
          };
          if (!v.value0.ignoreCase) {
              return "";
          };
          throw new Error("Failed pattern match at Data.String.Regex line 60, column 4 - line 60, column 36: " + [ v.value0.ignoreCase.constructor.name ]);
      })() + ((function () {
          if (v.value0.multiline) {
              return "m";
          };
          if (!v.value0.multiline) {
              return "";
          };
          throw new Error("Failed pattern match at Data.String.Regex line 61, column 4 - line 61, column 35: " + [ v.value0.multiline.constructor.name ]);
      })() + ((function () {
          if (v.value0.sticky) {
              return "y";
          };
          if (!v.value0.sticky) {
              return "";
          };
          throw new Error("Failed pattern match at Data.String.Regex line 62, column 4 - line 62, column 32: " + [ v.value0.sticky.constructor.name ]);
      })() + (function () {
          if (v.value0.unicode) {
              return "u";
          };
          if (!v.value0.unicode) {
              return "";
          };
          throw new Error("Failed pattern match at Data.String.Regex line 63, column 4 - line 63, column 33: " + [ v.value0.unicode.constructor.name ]);
      })())));
  };
  var regex = function (s) {
      return function (f) {
          return $foreign["regex'"](Data_Either.Left.create)(Data_Either.Right.create)(s)(renderFlags(f));
      };
  };
  exports["regex"] = regex;
  exports["renderFlags"] = renderFlags;
  exports["test"] = $foreign.test;
})(PS["Data.String.Regex"] = PS["Data.String.Regex"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Data_Functor = PS["Data.Functor"];
  var Data_Array = PS["Data.Array"];
  var Data_List = PS["Data.List"];
  var Data_List_Lazy = PS["Data.List.Lazy"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Tuple_Nested = PS["Data.Tuple.Nested"];
  var Control_Monad_List_Trans = PS["Control.Monad.List.Trans"];
  var Control_Monad = PS["Control.Monad"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_List_Lazy_Types = PS["Data.List.Lazy.Types"];        
  var Zippable2 = function (__superclass_Data$dotFunctor$dotFunctor_0, __superclass_Data$dotFunctor$dotFunctor_1, zipWith) {
      this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
      this["__superclass_Data.Functor.Functor_1"] = __superclass_Data$dotFunctor$dotFunctor_1;
      this.zipWith = zipWith;
  };
  var zipWith = function (dict) {
      return dict.zipWith;
  };
  var zip = function (dictZippable2) {
      return zipWith(dictZippable2)(Data_Tuple.Tuple.create);
  }; 
  var arrayZippable2 = new Zippable2(function () {
      return Data_Functor.functorArray;
  }, function () {
      return Data_Functor.functorArray;
  }, function (f) {
      return function (a1) {
          return function (a2) {
              return Data_Functor.map(Data_Functor.functorArray)(function (v) {
                  return f(v.value0)(v.value1);
              })(Data_Array.zip(a1)(a2));
          };
      };
  });
  exports["Zippable2"] = Zippable2;
  exports["zip"] = zip;
  exports["zipWith"] = zipWith;
  exports["arrayZippable2"] = arrayZippable2;
})(PS["Data.Zippable"] = PS["Data.Zippable"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Coroutine_Aff = PS["Control.Coroutine.Aff"];
  var Control_Coroutine_Stalling = PS["Control.Coroutine.Stalling"];
  var Control_Monad_Aff_AVar = PS["Control.Monad.Aff.AVar"];
  var Control_Monad_Aff_Free = PS["Control.Monad.Aff.Free"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Free = PS["Control.Monad.Free"];
  var Control_Monad_Free_Trans = PS["Control.Monad.Free.Trans"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Data_Const = PS["Data.Const"];
  var Data_Either = PS["Data.Either"];
  var Data_Functor_Coproduct = PS["Data.Functor.Coproduct"];
  var Data_Maybe = PS["Data.Maybe"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Coroutine = PS["Control.Coroutine"];
  var Data_Function = PS["Data.Function"];
  var Control_Bind = PS["Control.Bind"];               
  var runEventSource = function (v) {
      return v;
  };
  exports["runEventSource"] = runEventSource;
})(PS["Halogen.Query.EventSource"] = PS["Halogen.Query.EventSource"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_State = PS["Control.Monad.State"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Applicative = PS["Control.Applicative"];        
  var Get = (function () {
      function Get(value0) {
          this.value0 = value0;
      };
      Get.create = function (value0) {
          return new Get(value0);
      };
      return Get;
  })();
  var Modify = (function () {
      function Modify(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Modify.create = function (value0) {
          return function (value1) {
              return new Modify(value0, value1);
          };
      };
      return Modify;
  })();
  var stateN = function (dictMonad) {
      return function (dictMonadState) {
          return function (v) {
              if (v instanceof Get) {
                  return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(Control_Monad_State_Class.get(dictMonadState))(function ($22) {
                      return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(v.value0($22));
                  });
              };
              if (v instanceof Modify) {
                  return Data_Functor.voidLeft(((dictMonad["__superclass_Control.Bind.Bind_1"]())["__superclass_Control.Apply.Apply_0"]())["__superclass_Data.Functor.Functor_0"]())(Control_Monad_State_Class.modify(dictMonadState)(v.value0))(v.value1);
              };
              throw new Error("Failed pattern match at Halogen.Query.StateF line 31, column 1 - line 31, column 40: " + [ v.constructor.name ]);
          };
      };
  };
  var functorStateF = new Data_Functor.Functor(function (f) {
      return function (v) {
          if (v instanceof Get) {
              return new Get(function ($24) {
                  return f(v.value0($24));
              });
          };
          if (v instanceof Modify) {
              return new Modify(v.value0, f(v.value1));
          };
          throw new Error("Failed pattern match at Halogen.Query.StateF line 19, column 3 - line 19, column 32: " + [ f.constructor.name, v.constructor.name ]);
      };
  });
  exports["Get"] = Get;
  exports["Modify"] = Modify;
  exports["stateN"] = stateN;
  exports["functorStateF"] = functorStateF;
})(PS["Halogen.Query.StateF"] = PS["Halogen.Query.StateF"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Monad_Aff_Free = PS["Control.Monad.Aff.Free"];
  var Control_Monad_Free_Trans = PS["Control.Monad.Free.Trans"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Halogen_Query_EventSource = PS["Halogen.Query.EventSource"];
  var Halogen_Query_StateF = PS["Halogen.Query.StateF"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Coroutine_Stalling = PS["Control.Coroutine.Stalling"];        
  var Pending = (function () {
      function Pending() {

      };
      Pending.value = new Pending();
      return Pending;
  })();
  var StateHF = (function () {
      function StateHF(value0) {
          this.value0 = value0;
      };
      StateHF.create = function (value0) {
          return new StateHF(value0);
      };
      return StateHF;
  })();
  var SubscribeHF = (function () {
      function SubscribeHF(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      SubscribeHF.create = function (value0) {
          return function (value1) {
              return new SubscribeHF(value0, value1);
          };
      };
      return SubscribeHF;
  })();
  var QueryHF = (function () {
      function QueryHF(value0) {
          this.value0 = value0;
      };
      QueryHF.create = function (value0) {
          return new QueryHF(value0);
      };
      return QueryHF;
  })();
  var RenderHF = (function () {
      function RenderHF(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      RenderHF.create = function (value0) {
          return function (value1) {
              return new RenderHF(value0, value1);
          };
      };
      return RenderHF;
  })();
  var RenderPendingHF = (function () {
      function RenderPendingHF(value0) {
          this.value0 = value0;
      };
      RenderPendingHF.create = function (value0) {
          return new RenderPendingHF(value0);
      };
      return RenderPendingHF;
  })();
  var HaltHF = (function () {
      function HaltHF(value0) {
          this.value0 = value0;
      };
      HaltHF.create = function (value0) {
          return new HaltHF(value0);
      };
      return HaltHF;
  })();
  var functorHalogenF = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return function (h) {
              if (h instanceof StateHF) {
                  return new StateHF(Data_Functor.map(Halogen_Query_StateF.functorStateF)(f)(h.value0));
              };
              if (h instanceof SubscribeHF) {
                  return new SubscribeHF(h.value0, f(h.value1));
              };
              if (h instanceof QueryHF) {
                  return new QueryHF(Data_Functor.map(dictFunctor)(f)(h.value0));
              };
              if (h instanceof RenderHF) {
                  return new RenderHF(h.value0, f(h.value1));
              };
              if (h instanceof RenderPendingHF) {
                  return new RenderPendingHF(Data_Functor.map(Data_Functor.functorFn)(f)(h.value0));
              };
              if (h instanceof HaltHF) {
                  return new HaltHF(h.value0);
              };
              throw new Error("Failed pattern match at Halogen.Query.HalogenF line 37, column 5 - line 43, column 31: " + [ h.constructor.name ]);
          };
      });
  };
  exports["StateHF"] = StateHF;
  exports["SubscribeHF"] = SubscribeHF;
  exports["QueryHF"] = QueryHF;
  exports["RenderHF"] = RenderHF;
  exports["RenderPendingHF"] = RenderPendingHF;
  exports["HaltHF"] = HaltHF;
  exports["Pending"] = Pending;
  exports["functorHalogenF"] = functorHalogenF;
})(PS["Halogen.Query.HalogenF"] = PS["Halogen.Query.HalogenF"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Free = PS["Control.Monad.Free"];
  var Halogen_Query_HalogenF = PS["Halogen.Query.HalogenF"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var PostRender = (function () {
      function PostRender(value0) {
          this.value0 = value0;
      };
      PostRender.create = function (value0) {
          return new PostRender(value0);
      };
      return PostRender;
  })();
  var Finalized = (function () {
      function Finalized(value0) {
          this.value0 = value0;
      };
      Finalized.create = function (value0) {
          return new Finalized(value0);
      };
      return Finalized;
  })();
  var FinalizedF = (function () {
      function FinalizedF(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      FinalizedF.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new FinalizedF(value0, value1, value2);
              };
          };
      };
      return FinalizedF;
  })();
  var runFinalized = function (k) {
      return function (f) {
          var $6 = Unsafe_Coerce.unsafeCoerce(f);
          return k($6.value0)($6.value1)($6.value2);
      };
  };
  var finalized = function (e) {
      return function (s) {
          return function (i) {
              return Unsafe_Coerce.unsafeCoerce(new FinalizedF(e, s, i));
          };
      };
  };
  exports["PostRender"] = PostRender;
  exports["Finalized"] = Finalized;
  exports["finalized"] = finalized;
  exports["runFinalized"] = runFinalized;
})(PS["Halogen.Component.Hook"] = PS["Halogen.Component.Hook"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  // module Halogen.HTML.Events.Handler

  exports.preventDefaultImpl = function (e) {
    return function () {
      e.preventDefault();
    };
  };

  exports.stopPropagationImpl = function (e) {
    return function () {
      e.stopPropagation();
    };
  };

  exports.stopImmediatePropagationImpl = function (e) {
    return function () {
      e.stopImmediatePropagation();
    };
  };
})(PS["Halogen.HTML.Events.Handler"] = PS["Halogen.HTML.Events.Handler"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Halogen.HTML.Events.Handler"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Writer = PS["Control.Monad.Writer"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Tuple = PS["Data.Tuple"];
  var DOM = PS["DOM"];
  var Halogen_HTML_Events_Types = PS["Halogen.HTML.Events.Types"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Writer_Trans = PS["Control.Monad.Writer.Trans"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Function = PS["Data.Function"];
  var Data_Semigroup = PS["Data.Semigroup"];        
  var PreventDefault = (function () {
      function PreventDefault() {

      };
      PreventDefault.value = new PreventDefault();
      return PreventDefault;
  })();
  var StopPropagation = (function () {
      function StopPropagation() {

      };
      StopPropagation.value = new StopPropagation();
      return StopPropagation;
  })();
  var StopImmediatePropagation = (function () {
      function StopImmediatePropagation() {

      };
      StopImmediatePropagation.value = new StopImmediatePropagation();
      return StopImmediatePropagation;
  })();
  var EventHandler = function (x) {
      return x;
  };                                                                                                                                                                                                    
  var runEventHandler = function (dictMonad) {
      return function (dictMonadEff) {
          return function (e) {
              return function (v) {
                  var applyUpdate = function (v1) {
                      if (v1 instanceof PreventDefault) {
                          return $foreign.preventDefaultImpl(e);
                      };
                      if (v1 instanceof StopPropagation) {
                          return $foreign.stopPropagationImpl(e);
                      };
                      if (v1 instanceof StopImmediatePropagation) {
                          return $foreign.stopImmediatePropagationImpl(e);
                      };
                      throw new Error("Failed pattern match at Halogen.HTML.Events.Handler line 88, column 3 - line 88, column 63: " + [ v1.constructor.name ]);
                  };
                  var $13 = Control_Monad_Writer.runWriter(v);
                  return Control_Monad_Eff_Class.liftEff(dictMonadEff)(Control_Apply.applySecond(Control_Monad_Eff.applyEff)(Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableArray)($13.value1)(applyUpdate))(Control_Applicative.pure(Control_Monad_Eff.applicativeEff)($13.value0)));
              };
          };
      };
  };                                                                                                                                                                                
  var functorEventHandler = new Data_Functor.Functor(function (f) {
      return function (v) {
          return Data_Functor.map(Control_Monad_Writer_Trans.functorWriterT(Data_Identity.functorIdentity))(f)(v);
      };
  });
  var applyEventHandler = new Control_Apply.Apply(function () {
      return functorEventHandler;
  }, function (v) {
      return function (v1) {
          return Control_Apply.apply(Control_Monad_Writer_Trans.applyWriterT(Data_Semigroup.semigroupArray)(Data_Identity.applyIdentity))(v)(v1);
      };
  });
  var applicativeEventHandler = new Control_Applicative.Applicative(function () {
      return applyEventHandler;
  }, function ($23) {
      return EventHandler(Control_Applicative.pure(Control_Monad_Writer_Trans.applicativeWriterT(Data_Monoid.monoidArray)(Data_Identity.applicativeIdentity))($23));
  });
  exports["runEventHandler"] = runEventHandler;
  exports["functorEventHandler"] = functorEventHandler;
  exports["applyEventHandler"] = applyEventHandler;
  exports["applicativeEventHandler"] = applicativeEventHandler;
})(PS["Halogen.HTML.Events.Handler"] = PS["Halogen.HTML.Events.Handler"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Exists = PS["Data.Exists"];
  var Data_ExistsR = PS["Data.ExistsR"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Halogen_HTML_Events_Handler = PS["Halogen.HTML.Events.Handler"];
  var Halogen_HTML_Events_Types = PS["Halogen.HTML.Events.Types"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Show = PS["Data.Show"];
  var Data_Function = PS["Data.Function"];
  var Control_Applicative = PS["Control.Applicative"];        
  var TagName = function (x) {
      return x;
  };
  var PropName = function (x) {
      return x;
  };
  var EventName = function (x) {
      return x;
  };
  var HandlerF = (function () {
      function HandlerF(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      HandlerF.create = function (value0) {
          return function (value1) {
              return new HandlerF(value0, value1);
          };
      };
      return HandlerF;
  })();
  var ClassName = function (x) {
      return x;
  };
  var AttrName = function (x) {
      return x;
  };
  var PropF = (function () {
      function PropF(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      PropF.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new PropF(value0, value1, value2);
              };
          };
      };
      return PropF;
  })();
  var Prop = (function () {
      function Prop(value0) {
          this.value0 = value0;
      };
      Prop.create = function (value0) {
          return new Prop(value0);
      };
      return Prop;
  })();
  var Attr = (function () {
      function Attr(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      Attr.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new Attr(value0, value1, value2);
              };
          };
      };
      return Attr;
  })();
  var Key = (function () {
      function Key(value0) {
          this.value0 = value0;
      };
      Key.create = function (value0) {
          return new Key(value0);
      };
      return Key;
  })();
  var Handler = (function () {
      function Handler(value0) {
          this.value0 = value0;
      };
      Handler.create = function (value0) {
          return new Handler(value0);
      };
      return Handler;
  })();
  var Ref = (function () {
      function Ref(value0) {
          this.value0 = value0;
      };
      Ref.create = function (value0) {
          return new Ref(value0);
      };
      return Ref;
  })();
  var Text = (function () {
      function Text(value0) {
          this.value0 = value0;
      };
      Text.create = function (value0) {
          return new Text(value0);
      };
      return Text;
  })();
  var Element = (function () {
      function Element(value0, value1, value2, value3) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
      };
      Element.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return new Element(value0, value1, value2, value3);
                  };
              };
          };
      };
      return Element;
  })();
  var Slot = (function () {
      function Slot(value0) {
          this.value0 = value0;
      };
      Slot.create = function (value0) {
          return new Slot(value0);
      };
      return Slot;
  })();
  var IsProp = function (toPropString) {
      this.toPropString = toPropString;
  };
  var toPropString = function (dict) {
      return dict.toPropString;
  };
  var tagName = TagName;
  var stringIsProp = new IsProp(function (v) {
      return function (v1) {
          return function (s) {
              return s;
          };
      };
  });
  var runTagName = function (v) {
      return v;
  };
  var runPropName = function (v) {
      return v;
  };
  var runNamespace = function (v) {
      return v;
  };
  var runEventName = function (v) {
      return v;
  };
  var runClassName = function (v) {
      return v;
  };
  var runAttrName = function (v) {
      return v;
  };
  var propName = PropName;
  var prop = function (dictIsProp) {
      return function (name) {
          return function (attr) {
              return function (v) {
                  return new Prop(Data_Exists.mkExists(new PropF(name, v, Data_Functor.map(Data_Maybe.functorMaybe)(Data_Function.flip(Data_Tuple.Tuple.create)(toPropString(dictIsProp)))(attr))));
              };
          };
      };
  }; 
  var handler = function (name) {
      return function (k) {
          return new Handler(Data_ExistsR.mkExistsR(new HandlerF(name, k)));
      };
  };
  var eventName = EventName;
  var element = Element.create(Data_Maybe.Nothing.value);
  var className = ClassName;
  var booleanIsProp = new IsProp(function (v) {
      return function (v1) {
          return function (v2) {
              if (v2) {
                  return runAttrName(v);
              };
              if (!v2) {
                  return "";
              };
              throw new Error("Failed pattern match at Halogen.HTML.Core line 138, column 3 - line 138, column 46: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  });                                                                            
  var attrName = AttrName;
  exports["Text"] = Text;
  exports["Element"] = Element;
  exports["Slot"] = Slot;
  exports["HandlerF"] = HandlerF;
  exports["Prop"] = Prop;
  exports["Attr"] = Attr;
  exports["Key"] = Key;
  exports["Handler"] = Handler;
  exports["Ref"] = Ref;
  exports["PropF"] = PropF;
  exports["IsProp"] = IsProp;
  exports["attrName"] = attrName;
  exports["className"] = className;
  exports["element"] = element;
  exports["eventName"] = eventName;
  exports["handler"] = handler;
  exports["prop"] = prop;
  exports["propName"] = propName;
  exports["runAttrName"] = runAttrName;
  exports["runClassName"] = runClassName;
  exports["runEventName"] = runEventName;
  exports["runNamespace"] = runNamespace;
  exports["runPropName"] = runPropName;
  exports["runTagName"] = runTagName;
  exports["tagName"] = tagName;
  exports["toPropString"] = toPropString;
  exports["stringIsProp"] = stringIsProp;
  exports["booleanIsProp"] = booleanIsProp;
})(PS["Halogen.HTML.Core"] = PS["Halogen.HTML.Core"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Lazy = PS["Data.Lazy"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Category = PS["Control.Category"];        
  var runTree = function (k) {
      return function (t) {
          var $5 = Unsafe_Coerce.unsafeCoerce(t);
          return k($5);
      };
  };
  var mkTree$prime = Unsafe_Coerce.unsafeCoerce;
  exports["mkTree'"] = mkTree$prime;
  exports["runTree"] = runTree;
})(PS["Halogen.Component.Tree"] = PS["Halogen.Component.Tree"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Aff_Free = PS["Control.Monad.Aff.Free"];
  var Control_Monad_Free = PS["Control.Monad.Free"];
  var Halogen_Query_EventSource = PS["Halogen.Query.EventSource"];
  var Halogen_Query_HalogenF = PS["Halogen.Query.HalogenF"];
  var Halogen_Query_StateF = PS["Halogen.Query.StateF"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var modify = function (f) {
      return Control_Monad_Free.liftF(new Halogen_Query_HalogenF.StateHF(new Halogen_Query_StateF.Modify(f, Data_Unit.unit)));
  };
  var gets = function ($2) {
      return Control_Monad_Free.liftF(Halogen_Query_HalogenF.StateHF.create(Halogen_Query_StateF.Get.create($2)));
  };                                                               
  var action = function (act) {
      return act(Data_Unit.unit);
  };
  exports["action"] = action;
  exports["gets"] = gets;
  exports["modify"] = modify;
})(PS["Halogen.Query"] = PS["Halogen.Query"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Free = PS["Control.Monad.Free"];
  var Control_Monad_Free_Trans = PS["Control.Monad.Free.Trans"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Array = PS["Data.Array"];
  var Data_Array_ST = PS["Data.Array.ST"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor_Coproduct = PS["Data.Functor.Coproduct"];
  var Data_Lazy = PS["Data.Lazy"];
  var Data_List = PS["Data.List"];
  var Data_Map = PS["Data.Map"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Halogen_Component_ChildPath = PS["Halogen.Component.ChildPath"];
  var Halogen_Component_Hook = PS["Halogen.Component.Hook"];
  var Halogen_Component_Tree = PS["Halogen.Component.Tree"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_Query = PS["Halogen.Query"];
  var Halogen_Query_EventSource = PS["Halogen.Query.EventSource"];
  var Halogen_Query_HalogenF = PS["Halogen.Query.HalogenF"];
  var Halogen_Query_StateF = PS["Halogen.Query.StateF"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Control_Category = PS["Control.Category"];
  var Control_Coroutine_Stalling = PS["Control.Coroutine.Stalling"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Monoid = PS["Data.Monoid"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_List_Types = PS["Data.List.Types"];
  var Control_Apply = PS["Control.Apply"];
  var renderComponent = function (v) {
      return v.render;
  };
  var queryComponent = function (v) {
      return v["eval"];
  };
  var lifecycleComponent = function (spec) {
      var renderTree = function (html) {
          return Halogen_Component_Tree["mkTree'"]({
              slot: Data_Unit.unit, 
              html: Data_Lazy.defer(function (v) {
                  return Unsafe_Coerce.unsafeCoerce(html);
              }), 
              eq: function (v) {
                  return function (v1) {
                      return false;
                  };
              }, 
              thunk: false
          });
      };
      return {
          render: function (s) {
              return {
                  state: s, 
                  hooks: [  ], 
                  tree: renderTree(spec.render(s))
              };
          }, 
          "eval": spec["eval"], 
          initializer: spec.initializer, 
          finalizers: function (s) {
              return Data_Maybe.maybe([  ])(function (i) {
                  return [ Halogen_Component_Hook.finalized(spec["eval"])(s)(i) ];
              })(spec.finalizer);
          }
      };
  };
  var initializeComponent = function (v) {
      return v.initializer;
  };
  var component = function (spec) {
      return lifecycleComponent({
          render: spec.render, 
          "eval": spec["eval"], 
          initializer: Data_Maybe.Nothing.value, 
          finalizer: Data_Maybe.Nothing.value
      });
  };
  exports["component"] = component;
  exports["initializeComponent"] = initializeComponent;
  exports["lifecycleComponent"] = lifecycleComponent;
  exports["queryComponent"] = queryComponent;
  exports["renderComponent"] = renderComponent;
})(PS["Halogen.Component"] = PS["Halogen.Component"] || {});
(function(exports) {
  /* global exports, require */
  "use strict";
  var vcreateElement =require("virtual-dom/create-element");
  var vdiff =require("virtual-dom/diff");
  var vpatch =require("virtual-dom/patch");
  var VText =require("virtual-dom/vnode/vtext");
  var VirtualNode =require("virtual-dom/vnode/vnode");
  var SoftSetHook =require("virtual-dom/virtual-hyperscript/hooks/soft-set-hook"); 

  // jshint maxparams: 2
  exports.prop = function (key, value) {
    var props = {};
    props[key] = value;
    return props;
  };

  // jshint maxparams: 2
  exports.attr = function (key, value) {
    var props = { attributes: {} };
    props.attributes[key] = value;
    return props;
  };

  function HandlerHook (key, f) {
    this.key = key;
    this.callback = function (e) {
      f(e)();
    };
  }

  HandlerHook.prototype = {
    hook: function (node) {
      node.addEventListener(this.key, this.callback);
    },
    unhook: function (node) {
      node.removeEventListener(this.key, this.callback);
    }
  };

  // jshint maxparams: 2
  exports.handlerProp = function (key, f) {
    var props = {};
    props["halogen-hook-" + key] = new HandlerHook(key, f);
    return props;
  };

  exports.refPropImpl = function (nothing) {
    return function (just) {

      var ifHookFn = function (init) {
        // jshint maxparams: 3
        return function (node, prop, diff) {
          // jshint validthis: true
          if (typeof diff === "undefined") {
            this.f(init ? just(node) : nothing)();
          }
        };
      };

      // jshint maxparams: 1
      function RefHook (f) {
        this.f = f;
      }

      RefHook.prototype = {
        hook: ifHookFn(true),
        unhook: ifHookFn(false)
      };

      return function (f) {
        return { "halogen-ref": new RefHook(f) };
      };
    };
  };

  // jshint maxparams: 3
  function HalogenWidget (tree, eq, render) {
    this.tree = tree;
    this.eq = eq;
    this.render = render;
    this.vdom = null;
    this.el = null;
  }

  HalogenWidget.prototype = {
    type: "Widget",
    init: function () {
      this.vdom = this.render(this.tree);
      this.el = vcreateElement(this.vdom);
      return this.el;
    },
    update: function (prev, node) {
      if (!prev.tree || !this.eq(prev.tree.slot)(this.tree.slot)) {
        return this.init();
      }
      if (this.tree.thunk) {
        this.vdom = prev.vdom;
        this.el = prev.el;
      } else {
        this.vdom = this.render(this.tree);
        this.el = vpatch(node, vdiff(prev.vdom, this.vdom));
      }
    }
  };

  exports.widget = function (tree) {
    return function (eq) {
      return function (render) {
        return new HalogenWidget(tree, eq, render);
      };
    };
  };

  exports.concatProps = function () {
    // jshint maxparams: 2
    var hOP = Object.prototype.hasOwnProperty;
    var copy = function (props, result) {
      for (var key in props) {
        if (hOP.call(props, key)) {
          if (key === "attributes") {
            var attrs = props[key];
            var resultAttrs = result[key] || (result[key] = {});
            for (var attr in attrs) {
              if (hOP.call(attrs, attr)) {
                resultAttrs[attr] = attrs[attr];
              }
            }
          } else {
            result[key] = props[key];
          }
        }
      }
      return result;
    };
    return function (p1, p2) {
      return copy(p2, copy(p1, {}));
    };
  }();

  exports.emptyProps = {};

  exports.createElement = function (vtree) {
    return vcreateElement(vtree);
  };

  exports.diff = function (vtree1) {
    return function (vtree2) {
      return vdiff(vtree1, vtree2);
    };
  };

  exports.patch = function (p) {
    return function (node) {
      return function () {
        return vpatch(node, p);
      };
    };
  };

  exports.vtext = function (s) {
    return new VText(s);
  };

  exports.vnode = function (namespace) {
    return function (name) {
      return function (key) {
        return function (props) {
          return function (children) {
            if (name === "input" && props.value !== undefined) {
              props.value = new SoftSetHook(props.value);
            }
            return new VirtualNode(name, props, children, key, namespace);
          };
        };
      };
    };
  };
})(PS["Halogen.Internal.VirtualDOM"] = PS["Halogen.Internal.VirtualDOM"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Halogen.Internal.VirtualDOM"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Halogen_Component_Tree = PS["Halogen.Component.Tree"];
  var Data_Semigroup = PS["Data.Semigroup"];        
  var semigroupProps = new Data_Semigroup.Semigroup(Data_Function_Uncurried.runFn2($foreign.concatProps));
  var refProp = $foreign.refPropImpl(Data_Maybe.Nothing.value)(Data_Maybe.Just.create);
  var monoidProps = new Data_Monoid.Monoid(function () {
      return semigroupProps;
  }, $foreign.emptyProps);
  exports["refProp"] = refProp;
  exports["semigroupProps"] = semigroupProps;
  exports["monoidProps"] = monoidProps;
  exports["attr"] = $foreign.attr;
  exports["createElement"] = $foreign.createElement;
  exports["diff"] = $foreign.diff;
  exports["handlerProp"] = $foreign.handlerProp;
  exports["patch"] = $foreign.patch;
  exports["prop"] = $foreign.prop;
  exports["vnode"] = $foreign.vnode;
  exports["vtext"] = $foreign.vtext;
  exports["widget"] = $foreign.widget;
})(PS["Halogen.Internal.VirtualDOM"] = PS["Halogen.Internal.VirtualDOM"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Data_Exists = PS["Data.Exists"];
  var Data_ExistsR = PS["Data.ExistsR"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Lazy = PS["Data.Lazy"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Nullable = PS["Data.Nullable"];
  var Halogen_Effects = PS["Halogen.Effects"];
  var Halogen_Component_Tree = PS["Halogen.Component.Tree"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Events_Handler = PS["Halogen.HTML.Events.Handler"];
  var Halogen_Internal_VirtualDOM = PS["Halogen.Internal.VirtualDOM"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Function = PS["Data.Function"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Bind = PS["Control.Bind"];        
  var handleAff = function ($40) {
      return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_Aff.runAff(Control_Monad_Eff_Exception.throwException)(Data_Function["const"](Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit)))($40));
  };
  var renderProp = function (v) {
      return function (v1) {
          if (v1 instanceof Halogen_HTML_Core.Prop) {
              return Data_Exists.runExists(function (v2) {
                  return Halogen_Internal_VirtualDOM.prop(Halogen_HTML_Core.runPropName(v2.value0), v2.value1);
              })(v1.value0);
          };
          if (v1 instanceof Halogen_HTML_Core.Attr) {
              var attrName = Data_Maybe.maybe("")(function (ns$prime) {
                  return Halogen_HTML_Core.runNamespace(ns$prime) + ":";
              })(v1.value0) + Halogen_HTML_Core.runAttrName(v1.value1);
              return Halogen_Internal_VirtualDOM.attr(attrName, v1.value2);
          };
          if (v1 instanceof Halogen_HTML_Core.Handler) {
              return Data_ExistsR.runExistsR(function (v2) {
                  return Halogen_Internal_VirtualDOM.handlerProp(Halogen_HTML_Core.runEventName(v2.value0), function (ev) {
                      return handleAff(Control_Bind.bind(Control_Monad_Aff.bindAff)(Halogen_HTML_Events_Handler.runEventHandler(Control_Monad_Aff.monadAff)(Control_Monad_Aff.monadEffAff)(ev)(v2.value1(ev)))(Data_Maybe.maybe(Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit))(v)));
                  });
              })(v1.value0);
          };
          if (v1 instanceof Halogen_HTML_Core.Ref) {
              return Halogen_Internal_VirtualDOM.refProp(function ($41) {
                  return handleAff(v(v1.value0($41)));
              });
          };
          return Data_Monoid.mempty(Halogen_Internal_VirtualDOM.monoidProps);
      };
  };
  var findKey = function (v) {
      return function (v1) {
          if (v1 instanceof Halogen_HTML_Core.Key) {
              return new Data_Maybe.Just(v1.value0);
          };
          return v;
      };
  };
  var renderTree = function (f) {
      return Halogen_Component_Tree.runTree(function (tree) {
          var go = function (v) {
              if (v instanceof Halogen_HTML_Core.Text) {
                  return Halogen_Internal_VirtualDOM.vtext(v.value0);
              };
              if (v instanceof Halogen_HTML_Core.Slot) {
                  return Halogen_Internal_VirtualDOM.widget(v.value0)(tree.eq)(renderTree(f));
              };
              if (v instanceof Halogen_HTML_Core.Element) {
                  var tag = Halogen_HTML_Core.runTagName(v.value1);
                  var ns$prime = Data_Nullable.toNullable(Data_Functor.map(Data_Maybe.functorMaybe)(Halogen_HTML_Core.runNamespace)(v.value0));
                  var key = Data_Nullable.toNullable(Data_Foldable.foldl(Data_Foldable.foldableArray)(findKey)(Data_Maybe.Nothing.value)(v.value2));
                  return Halogen_Internal_VirtualDOM.vnode(ns$prime)(tag)(key)(Data_Foldable.foldMap(Data_Foldable.foldableArray)(Halogen_Internal_VirtualDOM.monoidProps)(renderProp(f))(v.value2))(Data_Functor.map(Data_Functor.functorArray)(go)(v.value3));
              };
              throw new Error("Failed pattern match at Halogen.HTML.Renderer.VirtualDOM line 49, column 5 - line 56, column 28: " + [ v.constructor.name ]);
          };
          return go(Data_Lazy.force(tree.html));
      });
  };
  exports["renderTree"] = renderTree;
})(PS["Halogen.HTML.Renderer.VirtualDOM"] = PS["Halogen.HTML.Renderer.VirtualDOM"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Coroutine = PS["Control.Coroutine"];
  var Control_Coroutine_Stalling = PS["Control.Coroutine.Stalling"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_AVar = PS["Control.Monad.Aff.AVar"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Free = PS["Control.Monad.Free"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State = PS["Control.Monad.State"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_List = PS["Data.List"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Tuple = PS["Data.Tuple"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var DOM_Node_Node = PS["DOM.Node.Node"];
  var Halogen_Component = PS["Halogen.Component"];
  var Halogen_Component_Hook = PS["Halogen.Component.Hook"];
  var Halogen_Effects = PS["Halogen.Effects"];
  var Halogen_HTML_Renderer_VirtualDOM = PS["Halogen.HTML.Renderer.VirtualDOM"];
  var Halogen_Internal_VirtualDOM = PS["Halogen.Internal.VirtualDOM"];
  var Halogen_Query = PS["Halogen.Query"];
  var Halogen_Query_HalogenF = PS["Halogen.Query.HalogenF"];
  var Halogen_Query_EventSource = PS["Halogen.Query.EventSource"];
  var Halogen_Query_StateF = PS["Halogen.Query.StateF"];
  var Data_List_Types = PS["Data.List.Types"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Function = PS["Data.Function"];
  var Control_Monad_State_Trans = PS["Control.Monad.State.Trans"];
  var Data_Identity = PS["Data.Identity"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Monad_Free_Trans = PS["Control.Monad.Free.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Functor = PS["Data.Functor"];        
  var onInitializers = function (dictFoldable) {
      return function (f) {
          var go = function (v) {
              return function (as) {
                  if (v instanceof Halogen_Component_Hook.PostRender) {
                      return new Data_List_Types.Cons(f(v.value0), as);
                  };
                  return as;
              };
          };
          return Data_Foldable.foldr(dictFoldable)(go)(Data_List_Types.Nil.value);
      };
  };
  var onFinalizers = function (dictFoldable) {
      return function (f) {
          var go = function (v) {
              return function (as) {
                  if (v instanceof Halogen_Component_Hook.Finalized) {
                      return new Data_List_Types.Cons(f(v.value0), as);
                  };
                  return as;
              };
          };
          return Data_Foldable.foldr(dictFoldable)(go)(Data_List_Types.Nil.value);
      };
  };
  var runUI = function (c) {
      return function (s) {
          return function (element) {
              var driver$prime = function (e) {
                  return function (s1) {
                      return function (i) {
                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar["makeVar'"](s1))(function (v) {
                              return Data_Function.flip(Control_Monad_Free.runFreeM(Halogen_Query_HalogenF.functorHalogenF(Control_Monad_Aff.functorAff))(Control_Monad_Aff.monadRecAff))(e(i))(function (h) {
                                  if (h instanceof Halogen_Query_HalogenF.StateHF) {
                                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(v))(function (v1) {
                                          var $29 = Control_Monad_State.runState(Halogen_Query_StateF.stateN(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))(h.value0))(v1);
                                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(v)($29.value1))(function () {
                                              return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)($29.value0);
                                          });
                                      });
                                  };
                                  if (h instanceof Halogen_Query_HalogenF.SubscribeHF) {
                                      return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(h.value1);
                                  };
                                  if (h instanceof Halogen_Query_HalogenF.RenderHF) {
                                      return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(h.value1);
                                  };
                                  if (h instanceof Halogen_Query_HalogenF.RenderPendingHF) {
                                      return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(h.value0(Data_Maybe.Nothing.value));
                                  };
                                  if (h instanceof Halogen_Query_HalogenF.QueryHF) {
                                      return h.value0;
                                  };
                                  if (h instanceof Halogen_Query_HalogenF.HaltHF) {
                                      return Control_Monad_Error_Class.throwError(Control_Monad_Aff.monadErrorAff)(Control_Monad_Eff_Exception.error(h.value0));
                                  };
                                  throw new Error("Failed pattern match at Halogen.Driver line 144, column 7 - line 155, column 45: " + [ h.constructor.name ]);
                              });
                          });
                      };
                  };
              };
              var render = function (ref) {
                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(ref))(function (v) {
                      if (v.renderPaused) {
                          return Control_Monad_Aff_AVar.putVar(ref)((function () {
                              var $42 = {};
                              for (var $43 in v) {
                                  if ({}.hasOwnProperty.call(v, $43)) {
                                      $42[$43] = v[$43];
                                  };
                              };
                              $42.renderPending = true;
                              return $42;
                          })());
                      };
                      if (!v.renderPaused) {
                          var rc = Halogen_Component.renderComponent(c)(v.state);
                          var vtree$prime = Halogen_HTML_Renderer_VirtualDOM.renderTree(driver(ref))(rc.tree);
                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Halogen_Internal_VirtualDOM.patch(Halogen_Internal_VirtualDOM.diff(v.vtree)(vtree$prime))(v.node)))(function (v1) {
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(ref)({
                                  node: v1, 
                                  vtree: vtree$prime, 
                                  state: rc.state, 
                                  renderPending: false, 
                                  renderPaused: true
                              }))(function () {
                                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.forkAll(Data_List_Types.foldableList)(onFinalizers(Data_Foldable.foldableArray)(Halogen_Component_Hook.runFinalized(driver$prime))(rc.hooks)))(function () {
                                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.forkAll(Data_List_Types.foldableList)(onInitializers(Data_Foldable.foldableArray)(driver(ref))(rc.hooks)))(function () {
                                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.modifyVar(function (v2) {
                                              var $46 = {};
                                              for (var $47 in v2) {
                                                  if ({}.hasOwnProperty.call(v2, $47)) {
                                                      $46[$47] = v2[$47];
                                                  };
                                              };
                                              $46.renderPaused = false;
                                              return $46;
                                          })(ref))(function () {
                                              return flushRender(ref);
                                          });
                                      });
                                  });
                              });
                          });
                      };
                      throw new Error("Failed pattern match at Halogen.Driver line 160, column 5 - line 176, column 24: " + [ v.renderPaused.constructor.name ]);
                  });
              };
              var flushRender = Control_Monad_Rec_Class.tailRecM(Control_Monad_Aff.monadRecAff)(function (ref) {
                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(ref))(function (v) {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(ref)(v))(function () {
                          var $50 = !v.renderPending;
                          if ($50) {
                              return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(new Control_Monad_Rec_Class.Done(Data_Unit.unit));
                          };
                          if (!$50) {
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(render(ref))(function () {
                                  return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(new Control_Monad_Rec_Class.Loop(ref));
                              });
                          };
                          throw new Error("Failed pattern match at Halogen.Driver line 182, column 5 - line 186, column 24: " + [ $50.constructor.name ]);
                      });
                  });
              });
              var $$eval = function (ref) {
                  return function (rpRef) {
                      return function (h) {
                          if (h instanceof Halogen_Query_HalogenF.StateHF) {
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(ref))(function (v) {
                                  if (h.value0 instanceof Halogen_Query_StateF.Get) {
                                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(ref)(v))(function () {
                                          return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(h.value0.value0(v.state));
                                      });
                                  };
                                  if (h.value0 instanceof Halogen_Query_StateF.Modify) {
                                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(rpRef))(function (v1) {
                                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(ref)((function () {
                                              var $56 = {};
                                              for (var $57 in v) {
                                                  if ({}.hasOwnProperty.call(v, $57)) {
                                                      $56[$57] = v[$57];
                                                  };
                                              };
                                              $56.state = h.value0.value0(v.state);
                                              return $56;
                                          })()))(function () {
                                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(rpRef)(new Data_Maybe.Just(Halogen_Query_HalogenF.Pending.value)))(function () {
                                                  return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(h.value0.value1);
                                              });
                                          });
                                      });
                                  };
                                  throw new Error("Failed pattern match at Halogen.Driver line 106, column 9 - line 114, column 22: " + [ h.value0.constructor.name ]);
                              });
                          };
                          if (h instanceof Halogen_Query_HalogenF.SubscribeHF) {
                              var producer = Halogen_Query_EventSource.runEventSource(h.value0);
                              var consumer = Control_Monad_Rec_Class.forever(Control_Monad_Free_Trans.monadRecFreeT(Control_Coroutine.functorAwait)(Control_Monad_Aff.monadAff))(Control_Bind.bindFlipped(Control_Monad_Free_Trans.bindFreeT(Control_Coroutine.functorAwait)(Control_Monad_Aff.monadAff))(function ($78) {
                                  return Control_Monad_Trans_Class.lift(Control_Monad_Free_Trans.monadTransFreeT(Control_Coroutine.functorAwait))(Control_Monad_Aff.monadAff)(driver(ref)($78));
                              })(Control_Coroutine["await"](Control_Monad_Aff.monadAff)));
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.forkAff(Control_Coroutine_Stalling.runStallingProcess(Control_Monad_Aff.monadRecAff)(Control_Coroutine_Stalling.fuse(Control_Monad_Aff.monadRecAff)(Control_Monad_Aff.parallelParAff)(producer)(consumer))))(function () {
                                  return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(h.value1);
                              });
                          };
                          if (h instanceof Halogen_Query_HalogenF.RenderHF) {
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.modifyVar(Data_Function["const"](h.value0))(rpRef))(function () {
                                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Applicative.when(Control_Monad_Aff.applicativeAff)(Data_Maybe.isNothing(h.value0))(render(ref)))(function () {
                                      return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(h.value1);
                                  });
                              });
                          };
                          if (h instanceof Halogen_Query_HalogenF.RenderPendingHF) {
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(rpRef))(function (v) {
                                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(rpRef)(v))(function () {
                                      return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(h.value0(v));
                                  });
                              });
                          };
                          if (h instanceof Halogen_Query_HalogenF.QueryHF) {
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(rpRef))(function (v) {
                                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Applicative.when(Control_Monad_Aff.applicativeAff)(Data_Maybe.isJust(v))(render(ref)))(function () {
                                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(rpRef)(Data_Maybe.Nothing.value))(function () {
                                          return h.value0;
                                      });
                                  });
                              });
                          };
                          if (h instanceof Halogen_Query_HalogenF.HaltHF) {
                              return Control_Monad_Error_Class.throwError(Control_Monad_Aff.monadErrorAff)(Control_Monad_Eff_Exception.error(h.value0));
                          };
                          throw new Error("Failed pattern match at Halogen.Driver line 103, column 5 - line 133, column 43: " + [ h.constructor.name ]);
                      };
                  };
              };
              var driver = function (ref) {
                  return function (q) {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar["makeVar'"](Data_Maybe.Nothing.value))(function (v) {
                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Free.runFreeM(Halogen_Query_HalogenF.functorHalogenF(Control_Monad_Aff.functorAff))(Control_Monad_Aff.monadRecAff)($$eval(ref)(v))(Halogen_Component.queryComponent(c)(q)))(function (v1) {
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(v))(function (v2) {
                                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Applicative.when(Control_Monad_Aff.applicativeAff)(Data_Maybe.isJust(v2))(render(ref)))(function () {
                                      return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(v1);
                                  });
                              });
                          });
                      });
                  };
              };
              return Data_Functor.map(Control_Monad_Aff.functorAff)(function (v) {
                  return v.driver;
              })(Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.makeVar)(function (v) {
                  var rc = Halogen_Component.renderComponent(c)(s);
                  var dr = driver(v);
                  var vtree = Halogen_HTML_Renderer_VirtualDOM.renderTree(dr)(rc.tree);
                  var node = Halogen_Internal_VirtualDOM.createElement(vtree);
                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(v)({
                      node: node, 
                      vtree: vtree, 
                      state: rc.state, 
                      renderPending: false, 
                      renderPaused: true
                  }))(function () {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(DOM_Node_Node.appendChild(DOM_HTML_Types.htmlElementToNode(node))(DOM_HTML_Types.htmlElementToNode(element))))(function () {
                          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.forkAll(Data_List_Types.foldableList)(onInitializers(Data_Foldable.foldableArray)(dr)(rc.hooks)))(function () {
                              return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.forkAff(Data_Maybe.maybe(Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Unit.unit))(dr)(Halogen_Component.initializeComponent(c))))(function () {
                                  return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.modifyVar(function (v1) {
                                      var $75 = {};
                                      for (var $76 in v1) {
                                          if ({}.hasOwnProperty.call(v1, $76)) {
                                              $75[$76] = v1[$76];
                                          };
                                      };
                                      $75.renderPaused = false;
                                      return $75;
                                  })(v))(function () {
                                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(flushRender(v))(function () {
                                          return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)({
                                              driver: dr
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
              }));
          };
      };
  };
  exports["runUI"] = runUI;
})(PS["Halogen.Driver"] = PS["Halogen.Driver"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var ul = function (xs) {
      return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("ul"))(xs);
  };
  var ul_ = ul([  ]);        
  var span = function (xs) {
      return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("span"))(xs);
  };
  var span_ = span([  ]);
  var p = function (xs) {
      return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("p"))(xs);
  };
  var p_ = p([  ]);
  var li = function (xs) {
      return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("li"))(xs);
  };
  var li_ = li([  ]);        
  var label = function (xs) {
      return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("label"))(xs);
  };
  var label_ = label([  ]);
  var input = function (props) {
      return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("input"))(props)([  ]);
  };                 
  var h1 = function (xs) {
      return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("h1"))(xs);
  };
  var h1_ = h1([  ]);
  var div = function (xs) {
      return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("div"))(xs);
  };
  var div_ = div([  ]);
  var button = function (xs) {
      return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("button"))(xs);
  };
  exports["button"] = button;
  exports["div"] = div;
  exports["div_"] = div_;
  exports["h1"] = h1;
  exports["h1_"] = h1_;
  exports["input"] = input;
  exports["label"] = label;
  exports["label_"] = label_;
  exports["li"] = li;
  exports["li_"] = li_;
  exports["p"] = p;
  exports["p_"] = p_;
  exports["span"] = span;
  exports["span_"] = span_;
  exports["ul"] = ul;
  exports["ul_"] = ul_;
})(PS["Halogen.HTML.Elements"] = PS["Halogen.HTML.Elements"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Halogen_Component = PS["Halogen.Component"];
  var Halogen_Component_ChildPath = PS["Halogen.Component.ChildPath"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Elements = PS["Halogen.HTML.Elements"];
  var Data_Functor = PS["Data.Functor"];        
  var text = Halogen_HTML_Core.Text.create;
  exports["text"] = text;
})(PS["Halogen.HTML"] = PS["Halogen.HTML"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_String = PS["Data.String"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Data_Function = PS["Data.Function"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Functor = PS["Data.Functor"];
  var value = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("value"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("value")));
  var type_ = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("type"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("type")));
  var title = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("title"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("title")));
  var placeholder = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("placeholder"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("placeholder")));
  var name = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("name"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("name")));      
  var classes = function ($8) {
      return Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("className"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("class")))(Data_String.joinWith(" ")(Data_Functor.map(Data_Functor.functorArray)(Halogen_HTML_Core.runClassName)($8)));
  };
  var checked = Halogen_HTML_Core.prop(Halogen_HTML_Core.booleanIsProp)(Halogen_HTML_Core.propName("checked"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("checked")));
  exports["checked"] = checked;
  exports["classes"] = classes;
  exports["name"] = name;
  exports["placeholder"] = placeholder;
  exports["title"] = title;
  exports["type_"] = type_;
  exports["value"] = value;
})(PS["Halogen.HTML.Properties"] = PS["Halogen.HTML.Properties"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Array = PS["Data.Array"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Tuple = PS["Data.Tuple"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Properties = PS["Halogen.HTML.Properties"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var InputButton = (function () {
      function InputButton() {

      };
      InputButton.value = new InputButton();
      return InputButton;
  })();
  var InputCheckbox = (function () {
      function InputCheckbox() {

      };
      InputCheckbox.value = new InputCheckbox();
      return InputCheckbox;
  })();
  var InputColor = (function () {
      function InputColor() {

      };
      InputColor.value = new InputColor();
      return InputColor;
  })();
  var InputDate = (function () {
      function InputDate() {

      };
      InputDate.value = new InputDate();
      return InputDate;
  })();
  var InputDatetime = (function () {
      function InputDatetime() {

      };
      InputDatetime.value = new InputDatetime();
      return InputDatetime;
  })();
  var InputDatetimeLocal = (function () {
      function InputDatetimeLocal() {

      };
      InputDatetimeLocal.value = new InputDatetimeLocal();
      return InputDatetimeLocal;
  })();
  var InputEmail = (function () {
      function InputEmail() {

      };
      InputEmail.value = new InputEmail();
      return InputEmail;
  })();
  var InputFile = (function () {
      function InputFile() {

      };
      InputFile.value = new InputFile();
      return InputFile;
  })();
  var InputHidden = (function () {
      function InputHidden() {

      };
      InputHidden.value = new InputHidden();
      return InputHidden;
  })();
  var InputImage = (function () {
      function InputImage() {

      };
      InputImage.value = new InputImage();
      return InputImage;
  })();
  var InputMonth = (function () {
      function InputMonth() {

      };
      InputMonth.value = new InputMonth();
      return InputMonth;
  })();
  var InputNumber = (function () {
      function InputNumber() {

      };
      InputNumber.value = new InputNumber();
      return InputNumber;
  })();
  var InputPassword = (function () {
      function InputPassword() {

      };
      InputPassword.value = new InputPassword();
      return InputPassword;
  })();
  var InputRadio = (function () {
      function InputRadio() {

      };
      InputRadio.value = new InputRadio();
      return InputRadio;
  })();
  var InputRange = (function () {
      function InputRange() {

      };
      InputRange.value = new InputRange();
      return InputRange;
  })();
  var InputReset = (function () {
      function InputReset() {

      };
      InputReset.value = new InputReset();
      return InputReset;
  })();
  var InputSearch = (function () {
      function InputSearch() {

      };
      InputSearch.value = new InputSearch();
      return InputSearch;
  })();
  var InputSubmit = (function () {
      function InputSubmit() {

      };
      InputSubmit.value = new InputSubmit();
      return InputSubmit;
  })();
  var InputTel = (function () {
      function InputTel() {

      };
      InputTel.value = new InputTel();
      return InputTel;
  })();
  var InputText = (function () {
      function InputText() {

      };
      InputText.value = new InputText();
      return InputText;
  })();
  var InputTime = (function () {
      function InputTime() {

      };
      InputTime.value = new InputTime();
      return InputTime;
  })();
  var InputUrl = (function () {
      function InputUrl() {

      };
      InputUrl.value = new InputUrl();
      return InputUrl;
  })();
  var InputWeek = (function () {
      function InputWeek() {

      };
      InputWeek.value = new InputWeek();
      return InputWeek;
  })();
  var renderInputType = function (ty) {
      if (ty instanceof InputButton) {
          return "button";
      };
      if (ty instanceof InputCheckbox) {
          return "checkbox";
      };
      if (ty instanceof InputColor) {
          return "color";
      };
      if (ty instanceof InputDate) {
          return "date";
      };
      if (ty instanceof InputDatetime) {
          return "datetime";
      };
      if (ty instanceof InputDatetimeLocal) {
          return "datetime-local";
      };
      if (ty instanceof InputEmail) {
          return "email";
      };
      if (ty instanceof InputFile) {
          return "file";
      };
      if (ty instanceof InputHidden) {
          return "hidden";
      };
      if (ty instanceof InputImage) {
          return "image";
      };
      if (ty instanceof InputMonth) {
          return "month";
      };
      if (ty instanceof InputNumber) {
          return "number";
      };
      if (ty instanceof InputPassword) {
          return "password";
      };
      if (ty instanceof InputRadio) {
          return "radio";
      };
      if (ty instanceof InputRange) {
          return "range";
      };
      if (ty instanceof InputReset) {
          return "reset";
      };
      if (ty instanceof InputSearch) {
          return "search";
      };
      if (ty instanceof InputSubmit) {
          return "submit";
      };
      if (ty instanceof InputTel) {
          return "tel";
      };
      if (ty instanceof InputText) {
          return "text";
      };
      if (ty instanceof InputTime) {
          return "time";
      };
      if (ty instanceof InputUrl) {
          return "url";
      };
      if (ty instanceof InputWeek) {
          return "week";
      };
      throw new Error("Failed pattern match at Halogen.HTML.Properties.Indexed line 184, column 3 - line 209, column 1: " + [ ty.constructor.name ]);
  };
  var refine = Unsafe_Coerce.unsafeCoerce;            
  var title = refine(Halogen_HTML_Properties.title);
  var value = refine(Halogen_HTML_Properties.value);      
  var placeholder = refine(Halogen_HTML_Properties.placeholder);
  var name = refine(Halogen_HTML_Properties.name);
  var inputType = function ($20) {
      return refine(Halogen_HTML_Properties.type_)(renderInputType($20));
  };                                                    
  var classes = refine(Halogen_HTML_Properties.classes);
  var checked = refine(Halogen_HTML_Properties.checked);
  exports["InputButton"] = InputButton;
  exports["InputCheckbox"] = InputCheckbox;
  exports["InputColor"] = InputColor;
  exports["InputDate"] = InputDate;
  exports["InputDatetime"] = InputDatetime;
  exports["InputDatetimeLocal"] = InputDatetimeLocal;
  exports["InputEmail"] = InputEmail;
  exports["InputFile"] = InputFile;
  exports["InputHidden"] = InputHidden;
  exports["InputImage"] = InputImage;
  exports["InputMonth"] = InputMonth;
  exports["InputNumber"] = InputNumber;
  exports["InputPassword"] = InputPassword;
  exports["InputRadio"] = InputRadio;
  exports["InputRange"] = InputRange;
  exports["InputReset"] = InputReset;
  exports["InputSearch"] = InputSearch;
  exports["InputSubmit"] = InputSubmit;
  exports["InputTel"] = InputTel;
  exports["InputText"] = InputText;
  exports["InputTime"] = InputTime;
  exports["InputUrl"] = InputUrl;
  exports["InputWeek"] = InputWeek;
  exports["checked"] = checked;
  exports["classes"] = classes;
  exports["inputType"] = inputType;
  exports["name"] = name;
  exports["placeholder"] = placeholder;
  exports["title"] = title;
  exports["value"] = value;
})(PS["Halogen.HTML.Properties.Indexed"] = PS["Halogen.HTML.Properties.Indexed"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Properties = PS["Halogen.HTML.Properties"];
  var Halogen_HTML_Properties_Indexed = PS["Halogen.HTML.Properties.Indexed"];
  var Halogen_HTML_Elements = PS["Halogen.HTML.Elements"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];                              
  var span = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.span);
  var input = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.input);
  var div = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.div);      
  var button = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.button);
  exports["button"] = button;
  exports["div"] = div;
  exports["input"] = input;
  exports["span"] = span;
})(PS["Halogen.HTML.Elements.Indexed"] = PS["Halogen.HTML.Elements.Indexed"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Maybe = PS["Data.Maybe"];
  var Halogen_Query = PS["Halogen.Query"];
  var Halogen_HTML_Events_Handler = PS["Halogen.HTML.Events.Handler"];
  var Halogen_HTML_Events_Types = PS["Halogen.HTML.Events.Types"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Data_Function = PS["Data.Function"];
  var Control_Applicative = PS["Control.Applicative"];                                      
  var onClick = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("click"));
  var input_ = function (f) {
      return function (v) {
          return Control_Applicative.pure(Halogen_HTML_Events_Handler.applicativeEventHandler)(Data_Maybe.Just.create(Halogen_Query.action(f)));
      };
  };
  exports["input_"] = input_;
  exports["onClick"] = onClick;
})(PS["Halogen.HTML.Events"] = PS["Halogen.HTML.Events"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var Data_Maybe = PS["Data.Maybe"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Events_Handler = PS["Halogen.HTML.Events.Handler"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Foreign_Index = PS["Data.Foreign.Index"];        
  var addForeignPropHandler = function (dictIsForeign) {
      return function (key) {
          return function (prop) {
              return function (f) {
                  return Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName(key))(function ($2) {
                      return Data_Either.either(Data_Function["const"](Control_Applicative.pure(Halogen_HTML_Events_Handler.applicativeEventHandler)(Data_Maybe.Nothing.value)))(f)(Control_Monad_Except.runExcept(Data_Foreign_Class.readProp(dictIsForeign)(Data_Foreign_Index.indexString)(prop)(Data_Foreign.toForeign((function (v) {
                          return v.target;
                      })($2)))));
                  });
              };
          };
      };
  };
  var onChecked = addForeignPropHandler(Data_Foreign_Class.booleanIsForeign)("change")("checked");
  exports["onChecked"] = onChecked;
})(PS["Halogen.HTML.Events.Forms"] = PS["Halogen.HTML.Events.Forms"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Data_Maybe = PS["Data.Maybe"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Events = PS["Halogen.HTML.Events"];
  var Halogen_HTML_Events_Forms = PS["Halogen.HTML.Events.Forms"];
  var Halogen_HTML_Events_Handler = PS["Halogen.HTML.Events.Handler"];
  var Halogen_HTML_Events_Types = PS["Halogen.HTML.Events.Types"];
  var Halogen_HTML_Properties_Indexed = PS["Halogen.HTML.Properties.Indexed"];        
  var refine$prime = Unsafe_Coerce.unsafeCoerce;
  var refine = Unsafe_Coerce.unsafeCoerce;                      
  var onClick = refine(Halogen_HTML_Events.onClick);
  var onChecked = refine$prime(Halogen_HTML_Events_Forms.onChecked);
  exports["onChecked"] = onChecked;
  exports["onClick"] = onClick;
})(PS["Halogen.HTML.Events.Indexed"] = PS["Halogen.HTML.Events.Indexed"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Either = PS["Data.Either"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Foreign = PS["Data.Foreign"];
  var DOM = PS["DOM"];
  var DOM_Event_EventTarget = PS["DOM.Event.EventTarget"];
  var DOM_HTML_Event_EventTypes = PS["DOM.HTML.Event.EventTypes"];
  var DOM_HTML = PS["DOM.HTML"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var DOM_HTML_Window = PS["DOM.HTML.Window"];
  var DOM_Node_ParentNode = PS["DOM.Node.ParentNode"];
  var Halogen_Effects = PS["Halogen.Effects"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Unit = PS["Data.Unit"];        
  var selectElement = function (query) {
      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Nullable.toMaybe)(Control_Bind.bindFlipped(Control_Monad_Eff.bindEff)(Control_Bind.composeKleisliFlipped(Control_Monad_Eff.bindEff)(function ($8) {
          return DOM_Node_ParentNode.querySelector(query)(DOM_HTML_Types.htmlDocumentToParentNode($8));
      })(DOM_HTML_Window.document))(DOM_HTML.window))))(function (v) {
          return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)((function () {
              if (v instanceof Data_Maybe.Nothing) {
                  return Data_Maybe.Nothing.value;
              };
              if (v instanceof Data_Maybe.Just) {
                  return Data_Either.either(Data_Function["const"](Data_Maybe.Nothing.value))(Data_Maybe.Just.create)(Control_Monad_Except.runExcept(DOM_HTML_Types.readHTMLElement(Data_Foreign.toForeign(v.value0))));
              };
              throw new Error("Failed pattern match at Halogen.Util line 54, column 8 - line 56, column 88: " + [ v.constructor.name ]);
          })());
      });
  };
  var runHalogenAff = function ($9) {
      return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_Aff.runAff(Control_Monad_Eff_Exception.throwException)(Data_Function["const"](Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit)))($9));
  };
  var awaitLoad = Control_Monad_Aff.makeAff(function (v) {
      return function (callback) {
          return Control_Monad_Eff_Class.liftEff(Control_Monad_Eff_Class.monadEffEff)(function __do() {
              var $10 = DOM_HTML.window();
              return DOM_Event_EventTarget.addEventListener(DOM_HTML_Event_EventTypes.load)(DOM_Event_EventTarget.eventListener(function (v1) {
                  return callback(Data_Unit.unit);
              }))(false)(DOM_HTML_Types.windowToEventTarget($10))();
          });
      };
  });
  var awaitBody = Control_Bind.bind(Control_Monad_Aff.bindAff)(awaitLoad)(function () {
      return Control_Bind.bindFlipped(Control_Monad_Aff.bindAff)(Data_Maybe.maybe(Control_Monad_Error_Class.throwError(Control_Monad_Aff.monadErrorAff)(Control_Monad_Eff_Exception.error("Could not find body")))(Control_Applicative.pure(Control_Monad_Aff.applicativeAff)))(selectElement("body"));
  });
  exports["awaitBody"] = awaitBody;
  exports["awaitLoad"] = awaitLoad;
  exports["runHalogenAff"] = runHalogenAff;
  exports["selectElement"] = selectElement;
})(PS["Halogen.Util"] = PS["Halogen.Util"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Array = PS["Data.Array"];
  var Data_Zippable = PS["Data.Zippable"];
  var Data_Map = PS["Data.Map"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_String = PS["Data.String"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Function = PS["Data.Function"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Monoid = PS["Data.Monoid"];        
  var Word = (function () {
      function Word(value0) {
          this.value0 = value0;
      };
      Word.create = function (value0) {
          return new Word(value0);
      };
      return Word;
  })();
  var Vowel = (function () {
      function Vowel() {

      };
      Vowel.value = new Vowel();
      return Vowel;
  })();
  var Semivowel = (function () {
      function Semivowel() {

      };
      Semivowel.value = new Semivowel();
      return Semivowel;
  })();
  var Stop = (function () {
      function Stop() {

      };
      Stop.value = new Stop();
      return Stop;
  })();
  var Affricate = (function () {
      function Affricate() {

      };
      Affricate.value = new Affricate();
      return Affricate;
  })();
  var Fricative = (function () {
      function Fricative() {

      };
      Fricative.value = new Fricative();
      return Fricative;
  })();
  var Nasal = (function () {
      function Nasal() {

      };
      Nasal.value = new Nasal();
      return Nasal;
  })();
  var Liquid = (function () {
      function Liquid() {

      };
      Liquid.value = new Liquid();
      return Liquid;
  })();
  var Aspirate = (function () {
      function Aspirate() {

      };
      Aspirate.value = new Aspirate();
      return Aspirate;
  })();
  var spell = function (v) {
      return v.value0.str;
  }; 
  var phonemes = [ {
      arpa: "AA", 
      ipa: "\u0251", 
      typ: Vowel.value
  }, {
      arpa: "AE", 
      ipa: "\xe6", 
      typ: Vowel.value
  }, {
      arpa: "AH", 
      ipa: "\u028c", 
      typ: Vowel.value
  }, {
      arpa: "AO", 
      ipa: "\u0254", 
      typ: Vowel.value
  }, {
      arpa: "AW", 
      ipa: "a\u028a", 
      typ: Vowel.value
  }, {
      arpa: "AY", 
      ipa: "a\u026a", 
      typ: Vowel.value
  }, {
      arpa: "B", 
      ipa: "b", 
      typ: Stop.value
  }, {
      arpa: "CH", 
      ipa: "t\u0283", 
      typ: Affricate.value
  }, {
      arpa: "D", 
      ipa: "d", 
      typ: Stop.value
  }, {
      arpa: "DH", 
      ipa: "\xf0", 
      typ: Fricative.value
  }, {
      arpa: "EH", 
      ipa: "e", 
      typ: Vowel.value
  }, {
      arpa: "ER", 
      ipa: "\u025cr", 
      typ: Vowel.value
  }, {
      arpa: "EY", 
      ipa: "e\u026a", 
      typ: Vowel.value
  }, {
      arpa: "F", 
      ipa: "f", 
      typ: Fricative.value
  }, {
      arpa: "G", 
      ipa: "g", 
      typ: Stop.value
  }, {
      arpa: "HH", 
      ipa: "h", 
      typ: Aspirate.value
  }, {
      arpa: "IH", 
      ipa: "\u026a", 
      typ: Vowel.value
  }, {
      arpa: "IY", 
      ipa: "i", 
      typ: Vowel.value
  }, {
      arpa: "JH", 
      ipa: "d\u0292", 
      typ: Affricate.value
  }, {
      arpa: "K", 
      ipa: "k", 
      typ: Stop.value
  }, {
      arpa: "L", 
      ipa: "l", 
      typ: Liquid.value
  }, {
      arpa: "M", 
      ipa: "m", 
      typ: Nasal.value
  }, {
      arpa: "N", 
      ipa: "n", 
      typ: Nasal.value
  }, {
      arpa: "NG", 
      ipa: "\u014b", 
      typ: Nasal.value
  }, {
      arpa: "OW", 
      ipa: "o\u028a", 
      typ: Vowel.value
  }, {
      arpa: "OY", 
      ipa: "\u0254\u026a", 
      typ: Vowel.value
  }, {
      arpa: "P", 
      ipa: "p", 
      typ: Stop.value
  }, {
      arpa: "R", 
      ipa: "r", 
      typ: Liquid.value
  }, {
      arpa: "S", 
      ipa: "s", 
      typ: Fricative.value
  }, {
      arpa: "SH", 
      ipa: "\u0283", 
      typ: Fricative.value
  }, {
      arpa: "T", 
      ipa: "t", 
      typ: Stop.value
  }, {
      arpa: "TH", 
      ipa: "\u03b8", 
      typ: Fricative.value
  }, {
      arpa: "UH", 
      ipa: "\u028a", 
      typ: Vowel.value
  }, {
      arpa: "UW", 
      ipa: "u", 
      typ: Vowel.value
  }, {
      arpa: "V", 
      ipa: "v", 
      typ: Fricative.value
  }, {
      arpa: "W", 
      ipa: "w", 
      typ: Semivowel.value
  }, {
      arpa: "Y", 
      ipa: "j", 
      typ: Semivowel.value
  }, {
      arpa: "Z", 
      ipa: "z", 
      typ: Fricative.value
  }, {
      arpa: "ZH", 
      ipa: "\u0292", 
      typ: Fricative.value
  } ];
  var letters = Data_String.toCharArray("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
  var eqPhoneme = new Data_Eq.Eq(function (v) {
      return function (v1) {
          return v.arpa === v1.arpa;
      };
  });
  var ordPhoneme = new Data_Ord.Ord(function () {
      return eqPhoneme;
  }, function (v) {
      return function (v1) {
          return Data_Ord.compare(Data_Ord.ordString)(v.arpa)(v1.arpa);
      };
  });
  var phoToChar = function (p) {
      var phoToCharMap = Data_Map.fromFoldable(ordPhoneme)(Data_Foldable.foldableArray)(Data_Zippable.zip(Data_Zippable.arrayZippable2)(phonemes)(letters));
      return Data_Maybe.fromMaybe("_")(Data_Map.lookup(ordPhoneme)(p)(phoToCharMap));
  };
  var charToPhoMap = Data_Map.fromFoldable(Data_Ord.ordChar)(Data_Foldable.foldableArray)(Data_Zippable.zip(Data_Zippable.arrayZippable2)(letters)(phonemes));
  var wordPhonemes = function (v) {
      return Data_Array.catMaybes(Data_Functor.map(Data_Functor.functorArray)(function (x) {
          return Data_Map.lookup(Data_Ord.ordChar)(x)(charToPhoMap);
      })(Data_String.toCharArray(v.value0.phostr)));
  };
  var wordIpa = function ($29) {
      return Data_Foldable.fold(Data_Foldable.foldableArray)(Data_Monoid.monoidString)(Data_Functor.map(Data_Functor.functorArray)(function (v) {
          return v.ipa;
      })(wordPhonemes($29)));
  };
  exports["Vowel"] = Vowel;
  exports["Semivowel"] = Semivowel;
  exports["Stop"] = Stop;
  exports["Affricate"] = Affricate;
  exports["Fricative"] = Fricative;
  exports["Nasal"] = Nasal;
  exports["Liquid"] = Liquid;
  exports["Aspirate"] = Aspirate;
  exports["Word"] = Word;
  exports["phoToChar"] = phoToChar;
  exports["phonemes"] = phonemes;
  exports["spell"] = spell;
  exports["wordIpa"] = wordIpa;
  exports["wordPhonemes"] = wordPhonemes;
  exports["ordPhoneme"] = ordPhoneme;
  exports["eqPhoneme"] = eqPhoneme;
})(PS["Pronounce"] = PS["Pronounce"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Pronounce = PS["Pronounce"];
  var Data_Either = PS["Data.Either"];
  var Data_String_Regex = PS["Data.String.Regex"];
  var Data_String_Regex_Flags = PS["Data.String.Regex.Flags"];
  var Data_String = PS["Data.String"];
  var Data_Array = PS["Data.Array"];
  var Data_Map = PS["Data.Map"];
  var Data_Filterable = PS["Data.Filterable"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Function = PS["Data.Function"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Ord = PS["Data.Ord"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Ring = PS["Data.Ring"];        
  var Empty = (function () {
      function Empty() {

      };
      Empty.value = new Empty();
      return Empty;
  })();
  var Lit = (function () {
      function Lit(value0) {
          this.value0 = value0;
      };
      Lit.create = function (value0) {
          return new Lit(value0);
      };
      return Lit;
  })();
  var Start = (function () {
      function Start() {

      };
      Start.value = new Start();
      return Start;
  })();
  var End = (function () {
      function End() {

      };
      End.value = new End();
      return End;
  })();
  var Any = (function () {
      function Any() {

      };
      Any.value = new Any();
      return Any;
  })();
  var Star = (function () {
      function Star(value0) {
          this.value0 = value0;
      };
      Star.create = function (value0) {
          return new Star(value0);
      };
      return Star;
  })();
  var Alt = (function () {
      function Alt(value0) {
          this.value0 = value0;
      };
      Alt.create = function (value0) {
          return new Alt(value0);
      };
      return Alt;
  })();
  var Cat = (function () {
      function Cat(value0) {
          this.value0 = value0;
      };
      Cat.create = function (value0) {
          return new Cat(value0);
      };
      return Cat;
  })();
  var regexForPhoRE = function (phoRE) {
      if (phoRE instanceof Empty) {
          return "";
      };
      if (phoRE instanceof Lit) {
          return Data_String.singleton(Pronounce.phoToChar(phoRE.value0));
      };
      if (phoRE instanceof Start) {
          return "^";
      };
      if (phoRE instanceof End) {
          return "$";
      };
      if (phoRE instanceof Any) {
          return ".";
      };
      if (phoRE instanceof Star) {
          return "(" + (regexForPhoRE(phoRE.value0) + ")*");
      };
      if (phoRE instanceof Alt) {
          return "(" + (Data_Foldable.intercalate(Data_Foldable.foldableArray)(Data_Monoid.monoidString)("|")(Data_Functor.map(Data_Functor.functorArray)(regexForPhoRE)(phoRE.value0)) + ")");
      };
      if (phoRE instanceof Cat) {
          return Data_Foldable.fold(Data_Foldable.foldableArray)(Data_Monoid.monoidString)(Data_Functor.map(Data_Functor.functorArray)(regexForPhoRE)(phoRE.value0));
      };
      throw new Error("Failed pattern match at MinPairs line 41, column 23 - line 49, column 52: " + [ phoRE.constructor.name ]);
  };              
  var matcher = function (phoRE) {
      var regexEither = Data_String_Regex.regex(regexForPhoRE(phoRE))(Data_String_Regex_Flags.noFlags);
      var test = (function () {
          if (regexEither instanceof Data_Either.Left) {
              return Data_Function["const"](false);
          };
          if (regexEither instanceof Data_Either.Right) {
              return function (v) {
                  return Data_String_Regex.test(regexEither.value0)(v.value0.phostr);
              };
          };
          throw new Error("Failed pattern match at MinPairs line 57, column 12 - line 59, column 65: " + [ regexEither.constructor.name ]);
      })();
      return test;
  };
  var minPairs = function (phoRE) {
      return function (getPart) {
          return function (a) {
              return function (b) {
                  return function (words) {
                      var wordsMatchingPhoRE = function (pho) {
                          return Data_Array.filter(matcher(phoRE(pho)))(words);
                      };
                      var makePartMap = function ($17) {
                          return Data_Map.fromFoldableWith(Data_Ord.ordString)(Data_Foldable.foldableArray)(Data_Semigroup.append(Data_Semigroup.semigroupArray))(Data_Functor.map(Data_Functor.functorArray)(function (word) {
                              return new Data_Tuple.Tuple(getPart(word), [ word ]);
                          })($17));
                      };
                      var partsA = makePartMap(wordsMatchingPhoRE(a));
                      var partsB = makePartMap(wordsMatchingPhoRE(b));
                      var maybeWordsFor = function (part) {
                          return Control_Apply.apply(Data_Maybe.applyMaybe)(Data_Functor.map(Data_Maybe.functorMaybe)(Data_Semigroup.append(Data_Semigroup.semigroupArray))(Data_Map.lookup(Data_Ord.ordString)(part)(partsA)))(Data_Map.lookup(Data_Ord.ordString)(part)(partsB));
                      };
                      return Data_Filterable.filtered(Data_Filterable.filterableArray)(Data_Functor.map(Data_Functor.functorArray)(maybeWordsFor)(Data_Array.fromFoldable(Data_List_Types.foldableList)(Data_Map.keys(partsA))));
                  };
              };
          };
      };
  };
  var minPairsEnd = (function () {
      var phoRE = function (pho) {
          return new Cat([ new Lit(pho), End.value ]);
      };
      var getPart = function (v) {
          return Data_String.take(Data_String.length(v.value0.phostr) - 1)(v.value0.phostr);
      };
      return minPairs(phoRE)(getPart);
  })();
  var minPairsStart = (function () {
      var phoRE = function (pho) {
          return new Cat([ Start.value, new Lit(pho) ]);
      };
      var getPart = function (v) {
          return Data_String.drop(1)(v.value0.phostr);
      };
      return minPairs(phoRE)(getPart);
  })();
  exports["Empty"] = Empty;
  exports["Lit"] = Lit;
  exports["Start"] = Start;
  exports["End"] = End;
  exports["Any"] = Any;
  exports["Star"] = Star;
  exports["Alt"] = Alt;
  exports["Cat"] = Cat;
  exports["minPairsEnd"] = minPairsEnd;
  exports["minPairsStart"] = minPairsStart;
  exports["regexForPhoRE"] = regexForPhoRE;
})(PS["MinPairs"] = PS["MinPairs"] || {});
(function(exports) {
  /* global exports */
  /* global XMLHttpRequest */
  /* global module */
  /* global process */
  "use strict";

  // module Network.HTTP.Affjax

  // jshint maxparams: 5
  exports._ajax = function (mkHeader, options, canceler, errback, callback) {
    var platformSpecific = { };
    if (typeof module !== "undefined" && module.require && !(typeof process !== "undefined" && process.versions["electron"])) {
      // We are on node.js
      platformSpecific.newXHR = function () {
        var XHR = module.require("xhr2");
        return new XHR();
      };

      platformSpecific.fixupUrl = function (url) {
        var urllib = module.require("url");
        var u = urllib.parse(url);
        u.protocol = u.protocol || "http:";
        u.hostname = u.hostname || "localhost";
        return urllib.format(u);
      };

      platformSpecific.getResponse = function (xhr) {
        return xhr.response;
      };
    } else {
      // We are in the browser
      platformSpecific.newXHR = function () {
        return new XMLHttpRequest();
      };

      platformSpecific.fixupUrl = function (url) {
        return url || "/";
      };

      platformSpecific.getResponse = function (xhr) {
        return xhr.response;
      };
    }

    return function () {
      var xhr = platformSpecific.newXHR();
      var fixedUrl = platformSpecific.fixupUrl(options.url);
      xhr.open(options.method || "GET", fixedUrl, true, options.username, options.password);
      if (options.headers) {
        try {
          for (var i = 0, header; (header = options.headers[i]) != null; i++) {
            xhr.setRequestHeader(header.field, header.value);
          }
        }
        catch (e) {
          errback(e)();
        }
      }
      xhr.onerror = function () {
        errback(new Error("AJAX request failed: " + options.method + " " + options.url))();
      };
      xhr.onload = function () {
        callback({
          status: xhr.status,
          headers: xhr.getAllResponseHeaders().split("\r\n")
            .filter(function (header) {
              return header.length > 0;
            })
            .map(function (header) {
              var i = header.indexOf(":");
              return mkHeader(header.substring(0, i))(header.substring(i + 2));
            }),
          response: platformSpecific.getResponse(xhr)
        })();
      };
      xhr.responseType = options.responseType;
      xhr.withCredentials = options.withCredentials;
      xhr.send(options.content);
      return canceler(xhr);
    };
  };

  // jshint maxparams: 4
  exports._cancelAjax = function (xhr, cancelError, errback, callback) {
    return function () {
      try { xhr.abort(); } catch (e) { return callback(false)(); }
      return callback(true)();
    };
  };
})(PS["Network.HTTP.Affjax"] = PS["Network.HTTP.Affjax"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_ArrayBuffer_Types = PS["Data.ArrayBuffer.Types"];
  var Data_FormURLEncoded = PS["Data.FormURLEncoded"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_MediaType_Common = PS["Data.MediaType.Common"];
  var Data_Tuple = PS["Data.Tuple"];
  var DOM_File_Types = PS["DOM.File.Types"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var DOM_XHR_Types = PS["DOM.XHR.Types"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Data_Show = PS["Data.Show"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var Requestable = function (toRequest) {
      this.toRequest = toRequest;
  };
  var toRequest = function (dict) {
      return dict.toRequest;
  }; 
  var defaultToRequest = function ($0) {
      return Data_Tuple.Tuple.create(Data_Maybe.Nothing.value)(Unsafe_Coerce.unsafeCoerce($0));
  };                                                                   
  var requestableUnit = new Requestable(defaultToRequest);
  exports["Requestable"] = Requestable;
  exports["toRequest"] = toRequest;
  exports["requestableUnit"] = requestableUnit;
})(PS["Network.HTTP.Affjax.Request"] = PS["Network.HTTP.Affjax.Request"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_ArrayBuffer_Types = PS["Data.ArrayBuffer.Types"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_MediaType_Common = PS["Data.MediaType.Common"];
  var Data_Tuple = PS["Data.Tuple"];
  var DOM_File_Types = PS["DOM.File.Types"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Show = PS["Data.Show"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Data_Identity = PS["Data.Identity"];        
  var ArrayBufferResponse = (function () {
      function ArrayBufferResponse() {

      };
      ArrayBufferResponse.value = new ArrayBufferResponse();
      return ArrayBufferResponse;
  })();
  var BlobResponse = (function () {
      function BlobResponse() {

      };
      BlobResponse.value = new BlobResponse();
      return BlobResponse;
  })();
  var DocumentResponse = (function () {
      function DocumentResponse() {

      };
      DocumentResponse.value = new DocumentResponse();
      return DocumentResponse;
  })();
  var JSONResponse = (function () {
      function JSONResponse() {

      };
      JSONResponse.value = new JSONResponse();
      return JSONResponse;
  })();
  var StringResponse = (function () {
      function StringResponse() {

      };
      StringResponse.value = new StringResponse();
      return StringResponse;
  })();
  var Respondable = function (fromResponse, responseType) {
      this.fromResponse = fromResponse;
      this.responseType = responseType;
  }; 
  var responseTypeToString = function (v) {
      if (v instanceof ArrayBufferResponse) {
          return "arraybuffer";
      };
      if (v instanceof BlobResponse) {
          return "blob";
      };
      if (v instanceof DocumentResponse) {
          return "document";
      };
      if (v instanceof JSONResponse) {
          return "text";
      };
      if (v instanceof StringResponse) {
          return "text";
      };
      throw new Error("Failed pattern match at Network.HTTP.Affjax.Response line 49, column 1 - line 50, column 1: " + [ v.constructor.name ]);
  };
  var responseType = function (dict) {
      return dict.responseType;
  };                                                                                                                                                                                                                                                        
  var responsableString = new Respondable(Data_Foreign.readString, new Data_Tuple.Tuple(Data_Maybe.Nothing.value, StringResponse.value));                               
  var fromResponse = function (dict) {
      return dict.fromResponse;
  };
  exports["ArrayBufferResponse"] = ArrayBufferResponse;
  exports["BlobResponse"] = BlobResponse;
  exports["DocumentResponse"] = DocumentResponse;
  exports["JSONResponse"] = JSONResponse;
  exports["StringResponse"] = StringResponse;
  exports["Respondable"] = Respondable;
  exports["fromResponse"] = fromResponse;
  exports["responseType"] = responseType;
  exports["responseTypeToString"] = responseTypeToString;
  exports["responsableString"] = responsableString;
})(PS["Network.HTTP.Affjax.Response"] = PS["Network.HTTP.Affjax.Response"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Eq = PS["Data.Eq"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];        
  var Accept = (function () {
      function Accept(value0) {
          this.value0 = value0;
      };
      Accept.create = function (value0) {
          return new Accept(value0);
      };
      return Accept;
  })();
  var ContentType = (function () {
      function ContentType(value0) {
          this.value0 = value0;
      };
      ContentType.create = function (value0) {
          return new ContentType(value0);
      };
      return ContentType;
  })();
  var RequestHeader = (function () {
      function RequestHeader(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      RequestHeader.create = function (value0) {
          return function (value1) {
              return new RequestHeader(value0, value1);
          };
      };
      return RequestHeader;
  })();
  var requestHeaderValue = function (v) {
      if (v instanceof Accept) {
          return Data_Newtype.unwrap(Data_MediaType.newtypeMediaType)(v.value0);
      };
      if (v instanceof ContentType) {
          return Data_Newtype.unwrap(Data_MediaType.newtypeMediaType)(v.value0);
      };
      if (v instanceof RequestHeader) {
          return v.value1;
      };
      throw new Error("Failed pattern match at Network.HTTP.RequestHeader line 30, column 1 - line 30, column 41: " + [ v.constructor.name ]);
  };
  var requestHeaderName = function (v) {
      if (v instanceof Accept) {
          return "Accept";
      };
      if (v instanceof ContentType) {
          return "Content-Type";
      };
      if (v instanceof RequestHeader) {
          return v.value0;
      };
      throw new Error("Failed pattern match at Network.HTTP.RequestHeader line 25, column 1 - line 26, column 1: " + [ v.constructor.name ]);
  };
  exports["Accept"] = Accept;
  exports["ContentType"] = ContentType;
  exports["RequestHeader"] = RequestHeader;
  exports["requestHeaderName"] = requestHeaderName;
  exports["requestHeaderValue"] = requestHeaderValue;
})(PS["Network.HTTP.RequestHeader"] = PS["Network.HTTP.RequestHeader"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Generic = PS["Data.Generic"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Eq = PS["Data.Eq"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];        
  var ResponseHeader = (function () {
      function ResponseHeader(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ResponseHeader.create = function (value0) {
          return function (value1) {
              return new ResponseHeader(value0, value1);
          };
      };
      return ResponseHeader;
  })();
  var responseHeader = function (field) {
      return function (value) {
          return new ResponseHeader(field, value);
      };
  };
  exports["responseHeader"] = responseHeader;
})(PS["Network.HTTP.ResponseHeader"] = PS["Network.HTTP.ResponseHeader"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Network.HTTP.Affjax"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_AVar = PS["Control.Monad.Aff.AVar"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Data_Array = PS["Data.Array"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_HTTP_Method = PS["Data.HTTP.Method"];
  var Data_Int = PS["Data.Int"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Tuple = PS["Data.Tuple"];
  var $$Math = PS["Math"];
  var DOM_XHR_Types = PS["DOM.XHR.Types"];
  var Network_HTTP_Affjax_Request = PS["Network.HTTP.Affjax.Request"];
  var Network_HTTP_Affjax_Response = PS["Network.HTTP.Affjax.Response"];
  var Network_HTTP_RequestHeader = PS["Network.HTTP.RequestHeader"];
  var Network_HTTP_ResponseHeader = PS["Network.HTTP.ResponseHeader"];
  var Network_HTTP_StatusCode = PS["Network.HTTP.StatusCode"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Semiring = PS["Data.Semiring"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Data_Ring = PS["Data.Ring"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Show = PS["Data.Show"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Eq = PS["Data.Eq"];
  var defaultRequest = {
      method: new Data_Either.Left(Data_HTTP_Method.GET.value), 
      url: "/", 
      headers: [  ], 
      content: Data_Maybe.Nothing.value, 
      username: Data_Maybe.Nothing.value, 
      password: Data_Maybe.Nothing.value, 
      withCredentials: false
  };
  var cancelAjax = function (xhr) {
      return function (err) {
          return Control_Monad_Aff.makeAff(function (eb) {
              return function (cb) {
                  return $foreign._cancelAjax(xhr, err, eb, cb);
              };
          });
      };
  };
  var affjax$prime = function (dictRequestable) {
      return function (dictRespondable) {
          return function (req) {
              return function (eb) {
                  return function (cb) {
                      var responseSettings = Network_HTTP_Affjax_Response.responseType(dictRespondable);
                      var requestSettings = (function () {
                          var $55 = Data_Functor.map(Data_Maybe.functorMaybe)(Network_HTTP_Affjax_Request.toRequest(dictRequestable))(req.content);
                          if ($55 instanceof Data_Maybe.Nothing) {
                              return new Data_Tuple.Tuple(Data_Maybe.Nothing.value, Data_Maybe.Nothing.value);
                          };
                          if ($55 instanceof Data_Maybe.Just) {
                              return new Data_Tuple.Tuple($55.value0.value0, new Data_Maybe.Just($55.value0.value1));
                          };
                          throw new Error("Failed pattern match at Network.HTTP.Affjax line 257, column 21 - line 259, column 49: " + [ $55.constructor.name ]);
                      })();
                      var fromResponse$prime = (function () {
                          var $59 = Data_Tuple.snd(responseSettings);
                          if ($59 instanceof Network_HTTP_Affjax_Response.JSONResponse) {
                              return Control_Bind.composeKleisliFlipped(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Network_HTTP_Affjax_Response.fromResponse(dictRespondable))(Control_Bind.composeKleisliFlipped(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign.parseJSON)(Data_Foreign.readString));
                          };
                          return Network_HTTP_Affjax_Response.fromResponse(dictRespondable);
                      })();
                      var cb$prime = function (res) {
                          var $63 = Data_Functor.map(Data_Either.functorEither)(function (v) {
                              var $60 = {};
                              for (var $61 in res) {
                                  if ({}.hasOwnProperty.call(res, $61)) {
                                      $60[$61] = res[$61];
                                  };
                              };
                              $60.response = v;
                              return $60;
                          })(Control_Monad_Except.runExcept(fromResponse$prime(res.response)));
                          if ($63 instanceof Data_Either.Left) {
                              return eb(Control_Monad_Eff_Exception.error(Data_Show.show(Data_List_Types.showNonEmptyList(Data_Foreign.showForeignError))($63.value0)));
                          };
                          if ($63 instanceof Data_Either.Right) {
                              return cb($63.value0);
                          };
                          throw new Error("Failed pattern match at Network.HTTP.Affjax line 276, column 13 - line 278, column 26: " + [ $63.constructor.name ]);
                      };
                      var addHeader = function (mh) {
                          return function (hs) {
                              if (mh instanceof Data_Maybe.Just && !Data_Foldable.any(Data_Foldable.foldableArray)(Data_HeytingAlgebra.heytingAlgebraBoolean)(Data_Function.on(Data_Eq.eq(Data_Eq.eqString))(Network_HTTP_RequestHeader.requestHeaderName)(mh.value0))(hs)) {
                                  return Data_Array.snoc(hs)(mh.value0);
                              };
                              return hs;
                          };
                      };
                      var headers = addHeader(Data_Functor.map(Data_Maybe.functorMaybe)(Network_HTTP_RequestHeader.ContentType.create)(Data_Tuple.fst(requestSettings)))(addHeader(Data_Functor.map(Data_Maybe.functorMaybe)(Network_HTTP_RequestHeader.Accept.create)(Data_Tuple.fst(responseSettings)))(req.headers));
                      var req$prime = {
                          method: Data_HTTP_Method.print(req.method), 
                          url: req.url, 
                          headers: Data_Functor.map(Data_Functor.functorArray)(function (h) {
                              return {
                                  field: Network_HTTP_RequestHeader.requestHeaderName(h), 
                                  value: Network_HTTP_RequestHeader.requestHeaderValue(h)
                              };
                          })(headers), 
                          content: Data_Nullable.toNullable(Data_Tuple.snd(requestSettings)), 
                          responseType: Network_HTTP_Affjax_Response.responseTypeToString(Data_Tuple.snd(responseSettings)), 
                          username: Data_Nullable.toNullable(req.username), 
                          password: Data_Nullable.toNullable(req.password), 
                          withCredentials: req.withCredentials
                      };
                      return $foreign._ajax(Network_HTTP_ResponseHeader.responseHeader, req$prime, cancelAjax, eb, cb$prime);
                  };
              };
          };
      };
  };
  var affjax = function (dictRequestable) {
      return function (dictRespondable) {
          return function ($93) {
              return Control_Monad_Aff["makeAff'"](affjax$prime(dictRequestable)(dictRespondable)($93));
          };
      };
  };                                                                   
  var get = function (dictRespondable) {
      return function (u) {
          return affjax(Network_HTTP_Affjax_Request.requestableUnit)(dictRespondable)((function () {
              var $71 = {};
              for (var $72 in defaultRequest) {
                  if ({}.hasOwnProperty.call(defaultRequest, $72)) {
                      $71[$72] = defaultRequest[$72];
                  };
              };
              $71.url = u;
              return $71;
          })());
      };
  };
  exports["affjax"] = affjax;
  exports["defaultRequest"] = defaultRequest;
  exports["get"] = get;
})(PS["Network.HTTP.Affjax"] = PS["Network.HTTP.Affjax"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Halogen = PS["Halogen"];
  var Halogen_HTML_Core = PS["Halogen.HTML.Core"];
  var Halogen_HTML_Indexed = PS["Halogen.HTML.Indexed"];
  var Halogen_HTML_Properties_Indexed = PS["Halogen.HTML.Properties.Indexed"];
  var Halogen_HTML_Events_Indexed = PS["Halogen.HTML.Events.Indexed"];
  var Halogen_Util = PS["Halogen.Util"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Eff_Console = PS["Control.Monad.Eff.Console"];
  var Pronounce = PS["Pronounce"];
  var MinPairs = PS["MinPairs"];
  var Network_HTTP_Affjax = PS["Network.HTTP.Affjax"];
  var Data_Array = PS["Data.Array"];
  var Data_Maybe = PS["Data.Maybe"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Function = PS["Data.Function"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Foreign_Index = PS["Data.Foreign.Index"];
  var Halogen_HTML_Elements_Indexed = PS["Halogen.HTML.Elements.Indexed"];
  var Data_Functor = PS["Data.Functor"];
  var Halogen_HTML_Elements = PS["Halogen.HTML.Elements"];
  var Halogen_HTML = PS["Halogen.HTML"];
  var Data_Show = PS["Data.Show"];
  var Halogen_HTML_Events = PS["Halogen.HTML.Events"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Control_Monad_Free = PS["Control.Monad.Free"];
  var Halogen_Query = PS["Halogen.Query"];
  var Halogen_Component = PS["Halogen.Component"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Network_HTTP_Affjax_Response = PS["Network.HTTP.Affjax.Response"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Foreign = PS["Data.Foreign"];
  var Halogen_Driver = PS["Halogen.Driver"];        
  var FromStart = (function () {
      function FromStart() {

      };
      FromStart.value = new FromStart();
      return FromStart;
  })();
  var FromEnd = (function () {
      function FromEnd() {

      };
      FromEnd.value = new FromEnd();
      return FromEnd;
  })();
  var IncrState = (function () {
      function IncrState(value0) {
          this.value0 = value0;
      };
      IncrState.create = function (value0) {
          return new IncrState(value0);
      };
      return IncrState;
  })();
  var FlipPho = (function () {
      function FlipPho(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      FlipPho.create = function (value0) {
          return function (value1) {
              return new FlipPho(value0, value1);
          };
      };
      return FlipPho;
  })();
  var SetMinPairsFrom = (function () {
      function SetMinPairsFrom(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      SetMinPairsFrom.create = function (value0) {
          return function (value1) {
              return new SetMinPairsFrom(value0, value1);
          };
      };
      return SetMinPairsFrom;
  })();
  var ForeignWord = function (x) {
      return x;
  };
  var WordObject = function (x) {
      return x;
  };
  var wordIsForeign = new Data_Foreign_Class.IsForeign(function (value) {
      return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign_Class.readProp(Data_Foreign_Class.stringIsForeign)(Data_Foreign_Index.indexString)("str")(value))(function (v) {
          return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign_Class.readProp(Data_Foreign_Class.stringIsForeign)(Data_Foreign_Index.indexString)("phostr")(value))(function (v1) {
              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(ForeignWord(new Pronounce.Word({
                  str: v, 
                  phostr: v1
              })));
          });
      });
  });
  var wordObjectIsForeign = new Data_Foreign_Class.IsForeign(function (value) {
      return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign_Class.readProp(Data_Foreign_Class.arrayIsForeign(wordIsForeign))(Data_Foreign_Index.indexString)("words")(value))(function (v) {
          return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))({
              words: v
          });
      });
  });
  var sillyJson = "{\"words\": [{\"str\": \"a\", \"phostr\": \"b\"}]}";
  var minPairsFromEq = new Data_Eq.Eq(function (v) {
      return function (v1) {
          if (v instanceof FromStart && v1 instanceof FromStart) {
              return true;
          };
          if (v instanceof FromEnd && v1 instanceof FromEnd) {
              return true;
          };
          return false;
      };
  });
  var minPairs = function (minPairsFrom) {
      if (minPairsFrom instanceof FromStart) {
          return MinPairs.minPairsStart;
      };
      if (minPairsFrom instanceof FromEnd) {
          return MinPairs.minPairsEnd;
      };
      throw new Error("Failed pattern match at Main line 54, column 25 - line 56, column 25: " + [ minPairsFrom.constructor.name ]);
  };
  var ui = (function () {
      var t = {
          arpa: "T", 
          ipa: "t", 
          typ: Pronounce.Stop.value
      };
      var s = {
          arpa: "S", 
          ipa: "s", 
          typ: Pronounce.Fricative.value
      };
      var renderB = function (v) {
          return Halogen_HTML_Elements_Indexed.div([ Halogen_HTML_Properties_Indexed.classes(Data_Functor.map(Data_Functor.functorArray)(Halogen_HTML_Core.className)([ "two-thirds", "column" ])) ])([ Halogen_HTML_Elements.h1_([ Halogen_HTML.text("Words") ]), Halogen_HTML_Elements.p_([ Halogen_HTML.text("Number of words loaded: "), Halogen_HTML.text(Data_Show.show(Data_Show.showInt)(Data_Array.length(v.wordList))) ]), Halogen_HTML_Elements_Indexed.button([ Halogen_HTML_Events_Indexed.onClick(Halogen_HTML_Events.input_(IncrState.create)) ])([ Halogen_HTML.text("Increment") ]), Halogen_HTML_Elements_Indexed.input([ Halogen_HTML_Properties_Indexed.placeholder("Phoneme") ]) ]);
      };
      var phos = (function () {
          var liForPho = function (v) {
              return Halogen_HTML_Elements.li_([ Halogen_HTML.text(v.ipa) ]);
          };
          return Halogen_HTML_Elements.ul_(Data_Functor.map(Data_Functor.functorArray)(liForPho)(Pronounce.phonemes));
      })();
      var fmtWord = function (word) {
          return Halogen_HTML_Elements.span_([ Halogen_HTML.text(Pronounce.spell(word) + " "), Halogen_HTML_Elements_Indexed.span([ Halogen_HTML_Properties_Indexed.classes([ Halogen_HTML_Core.className("ipa") ]) ])([ Halogen_HTML.text("/" + (Pronounce.wordIpa(word) + "/")) ]) ]);
      };
      var fmtWordRow = function ($72) {
          return (function ($73) {
              return Halogen_HTML_Elements.li_(Data_Foldable.intercalate(Data_Foldable.foldableArray)(Data_Monoid.monoidArray)([ Halogen_HTML.text(", ") ])($73));
          })(Data_Functor.map(Data_Functor.functorArray)(function (x) {
              return [ x ];
          })(Data_Functor.map(Data_Functor.functorArray)(fmtWord)($72)));
      };
      var fmtWordListList = function ($74) {
          return Halogen_HTML_Elements.ul_(Data_Functor.map(Data_Functor.functorArray)(fmtWordRow)($74));
      };
      var contains = function (dictEq) {
          return function (dictFoldable) {
              return function (x) {
                  return Data_Foldable.any(dictFoldable)(Data_HeytingAlgebra.heytingAlgebraBoolean)(function (v) {
                      return Data_Eq.eq(dictEq)(x)(v);
                  });
              };
          };
      };
      var phonemeButton = function (minPairsPhos) {
          return function (phoneme) {
              var ipaFor = function (v) {
                  return v.ipa;
              };
              return Halogen_HTML_Elements_Indexed.span([ Halogen_HTML_Events_Indexed.onClick(Halogen_HTML_Events.input_(FlipPho.create(phoneme))), Halogen_HTML_Properties_Indexed.classes(Data_Semigroup.append(Data_Semigroup.semigroupArray)([ Halogen_HTML_Core.className("phoneme"), Halogen_HTML_Core.className("ipa") ])((function () {
                  var $34 = contains(Pronounce.eqPhoneme)(Data_Foldable.foldableArray)(phoneme)(minPairsPhos);
                  if ($34) {
                      return [ Halogen_HTML_Core.className("selected") ];
                  };
                  if (!$34) {
                      return [  ];
                  };
                  throw new Error("Failed pattern match at Main line 117, column 74 - line 117, column 145: " + [ $34.constructor.name ]);
              })())) ])([ Halogen_HTML.text(ipaFor(phoneme)) ]);
          };
      };
      var render = function (v) {
          var pairsFor = function (v1) {
              if (v1.length === 2) {
                  return minPairs(v.minPairsFrom)(v1[0])(v1[1])(v.wordList);
              };
              return [  ];
          };
          return Halogen_HTML_Elements.div_([ Halogen_HTML_Elements.label_([ Halogen_HTML_Elements_Indexed.input([ Halogen_HTML_Properties_Indexed.inputType(Halogen_HTML_Properties_Indexed.InputRadio.value), Halogen_HTML_Properties_Indexed.name("minPairsFrom"), Halogen_HTML_Properties_Indexed.checked(Data_Eq.eq(minPairsFromEq)(v.minPairsFrom)(FromStart.value)), Halogen_HTML_Events_Indexed.onChecked(Halogen_HTML_Events.input_(SetMinPairsFrom.create(FromStart.value))) ]), Halogen_HTML.text(" "), Halogen_HTML.text("Starting with") ]), Halogen_HTML_Elements.label_([ Halogen_HTML_Elements_Indexed.input([ Halogen_HTML_Properties_Indexed.inputType(Halogen_HTML_Properties_Indexed.InputRadio.value), Halogen_HTML_Properties_Indexed.title("Ending with"), Halogen_HTML_Properties_Indexed.name("minPairsFrom"), Halogen_HTML_Properties_Indexed.checked(Data_Eq.eq(minPairsFromEq)(v.minPairsFrom)(FromEnd.value)), Halogen_HTML_Events_Indexed.onChecked(Halogen_HTML_Events.input_(SetMinPairsFrom.create(FromEnd.value))) ]), Halogen_HTML.text(" "), Halogen_HTML.text("Ending with") ]), Halogen_HTML_Elements.ul_(Data_Functor.map(Data_Functor.functorArray)(phonemeButton(v.minPairsPhos))(Pronounce.phonemes)), fmtWordListList(pairsFor(v.minPairsPhos)) ]);
      };
      var xorPho = function (pho) {
          return function (phos1) {
              var $42 = contains(Pronounce.eqPhoneme)(Data_Foldable.foldableArray)(pho)(phos1);
              if ($42) {
                  return Data_Array.filter(function (v) {
                      return Data_Eq.notEq(Pronounce.eqPhoneme)(v)(pho);
                  })(phos1);
              };
              if (!$42) {
                  if (phos1.length === 2) {
                      return [ phos1[0], pho ];
                  };
                  return Data_Semigroup.append(Data_Semigroup.semigroupArray)(phos1)([ pho ]);
              };
              throw new Error("Failed pattern match at Main line 179, column 23 - line 183, column 30: " + [ $42.constructor.name ]);
          };
      };
      var $$eval = function (v) {
          if (v instanceof IncrState) {
              return Control_Bind.bind(Control_Monad_Free.freeBind)(Control_Applicative.pure(Control_Monad_Free.freeApplicative)(new Pronounce.Word({
                  str: "a", 
                  phostr: "b"
              })))(function (v1) {
                  return Control_Applicative.pure(Control_Monad_Free.freeApplicative)(v.value0);
              });
          };
          if (v instanceof FlipPho) {
              return Control_Bind.bind(Control_Monad_Free.freeBind)(Halogen_Query.gets(function (v1) {
                  return v1.minPairsPhos;
              }))(function (v1) {
                  var newSet = xorPho(v.value0)(v1);
                  return Control_Bind.bind(Control_Monad_Free.freeBind)(Halogen_Query.modify(function (state) {
                      var $50 = {};
                      for (var $51 in state) {
                          if ({}.hasOwnProperty.call(state, $51)) {
                              $50[$51] = state[$51];
                          };
                      };
                      $50.minPairsPhos = newSet;
                      return $50;
                  }))(function () {
                      return Control_Applicative.pure(Control_Monad_Free.freeApplicative)(v.value1);
                  });
              });
          };
          if (v instanceof SetMinPairsFrom) {
              return Control_Bind.bind(Control_Monad_Free.freeBind)(Halogen_Query.modify(function (v1) {
                  var $55 = {};
                  for (var $56 in v1) {
                      if ({}.hasOwnProperty.call(v1, $56)) {
                          $55[$56] = v1[$56];
                      };
                  };
                  $55.minPairsFrom = v.value0;
                  return $55;
              }))(function () {
                  return Control_Applicative.pure(Control_Monad_Free.freeApplicative)(v.value1);
              });
          };
          throw new Error("Failed pattern match at Main line 163, column 5 - line 166, column 16: " + [ v.constructor.name ]);
      };
      var b = {
          arpa: "B", 
          ipa: "b", 
          typ: Pronounce.Stop.value
      };
      return Halogen_Component.component({
          render: render, 
          "eval": $$eval
      });
  })();
  var initialState = {
      wordList: [  ], 
      minPairsPhos: [  ], 
      minPairsFrom: FromStart.value
  };
  var main = Halogen_Util.runHalogenAff(Control_Bind.bind(Control_Monad_Aff.bindAff)(Halogen_Util.awaitBody)(function (v) {
      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Halogen_Util.selectElement("#gohere"))(function (v1) {
          var elem = Data_Maybe.fromMaybe(v)(v1);
          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Network_HTTP_Affjax.get(Network_HTTP_Affjax_Response.responsableString)("words.json"))(function (v2) {
              return Control_Bind.bind(Control_Monad_Aff.bindAff)((function () {
                  var $63 = Control_Monad_Except.runExcept(Data_Foreign_Class.readJSON(wordObjectIsForeign)(v2.response));
                  if ($63 instanceof Data_Either.Left) {
                      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Control_Monad_Eff_Console.log(Data_Show.show(Data_List_Types.showNonEmptyList(Data_Foreign.showForeignError))($63.value0))))(function () {
                          return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)([  ]);
                      });
                  };
                  if ($63 instanceof Data_Either.Right) {
                      return Control_Applicative.pure(Control_Monad_Aff.applicativeAff)(Data_Functor.map(Data_Functor.functorArray)(function (v3) {
                          return v3;
                      })($63.value0.words));
                  };
                  throw new Error("Failed pattern match at Main line 201, column 13 - line 206, column 56: " + [ $63.constructor.name ]);
              })())(function (v3) {
                  return Halogen_Driver.runUI(ui)((function () {
                      var $69 = {};
                      for (var $70 in initialState) {
                          if ({}.hasOwnProperty.call(initialState, $70)) {
                              $69[$70] = initialState[$70];
                          };
                      };
                      $69.wordList = v3;
                      return $69;
                  })())(elem);
              });
          });
      });
  }));
  exports["ForeignWord"] = ForeignWord;
  exports["FromStart"] = FromStart;
  exports["FromEnd"] = FromEnd;
  exports["IncrState"] = IncrState;
  exports["FlipPho"] = FlipPho;
  exports["SetMinPairsFrom"] = SetMinPairsFrom;
  exports["WordObject"] = WordObject;
  exports["initialState"] = initialState;
  exports["main"] = main;
  exports["minPairs"] = minPairs;
  exports["sillyJson"] = sillyJson;
  exports["ui"] = ui;
  exports["wordIsForeign"] = wordIsForeign;
  exports["wordObjectIsForeign"] = wordObjectIsForeign;
  exports["minPairsFromEq"] = minPairsFromEq;
})(PS["Main"] = PS["Main"] || {});
PS["Main"].main();

}).call(this,require('_process'))
},{"_process":4,"virtual-dom/create-element":5,"virtual-dom/diff":6,"virtual-dom/patch":7,"virtual-dom/virtual-hyperscript/hooks/soft-set-hook":14,"virtual-dom/vnode/vnode":22,"virtual-dom/vnode/vtext":24}]},{},[28]);
