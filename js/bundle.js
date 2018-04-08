(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.module = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pixel_1 = require("./model/Pixel");
const CanvasDataParser_1 = require("./services/CanvasDataParser");
const CanvasEditor_1 = require("./services/CanvasEditor");
const RandomPointGenerator_1 = require("./services/RandomPointGenerator");
const EdgeGenerator_1 = require("./services/EdgeGenerator");
const ShapeEditor_1 = require("./services/ShapeEditor");
const SortingService_1 = require("./services/SortingService");
var shape;
var mainCanvas;
var vectorCanvas;
var innerPointsElem;
var borderPointsElem;
function generateInnerVectors() {
    clearVectorCanvas();
    let innerAccuracyElem = document.getElementsByClassName("inner-accuracy")[0];
    let shapeAccuracyElem = document.getElementsByClassName("shape-accuracy")[0];
    let sortingService = new SortingService_1.SortingService();
    let shapeEditor = new ShapeEditor_1.ShapeEditor(new RandomPointGenerator_1.RandomPointGenerator(), new EdgeGenerator_1.EdgeGenerator(sortingService), sortingService, mainCanvas.width);
    let innerAccuracy = parseInt(innerAccuracyElem.value);
    let shapeAccuracy = parseInt(shapeAccuracyElem.value);
    let innerPointsNr = parseInt(innerPointsElem.innerText);
    let borderPointsNr = parseInt(borderPointsElem.innerText);
    let innerVectors = shapeEditor.generateInnerVectors(shape, innerPointsNr, borderPointsNr, shapeAccuracy, innerAccuracy);
    new CanvasEditor_1.CanvasEditor().drawVectors(vectorCanvas, innerVectors);
}
exports.generateInnerVectors = generateInnerVectors;
function onImageLoad() {
    clearVectorCanvas();
    let sortingService = new SortingService_1.SortingService();
    vectorCanvas.width = mainCanvas.width;
    vectorCanvas.height = mainCanvas.height;
    let shapeEditor = new ShapeEditor_1.ShapeEditor(new RandomPointGenerator_1.RandomPointGenerator(), new EdgeGenerator_1.EdgeGenerator(sortingService), sortingService, mainCanvas.width);
    shape = new CanvasDataParser_1.CanvasDataParser(new SortingService_1.SortingService()).process(mainCanvas, getBackgroundColor());
}
window.onload = function () {
    mainCanvas = document.getElementById("main-canvas");
    vectorCanvas = document.getElementById("vector-canvas");
    innerPointsElem = document.getElementsByClassName("inner-points-nr")[0];
    borderPointsElem = document.getElementsByClassName("border-points-nr")[0];
    var input = document.querySelector("input[type=file]");
    input.addEventListener("change", loadImage, false);
    var innerPointsSlider = document.getElementsByClassName("inner-points-slider")[0];
    var borderPointsSlider = document.getElementsByClassName("border-points-slider")[0];
    innerPointsSlider.oninput = function () {
        innerPointsElem.innerHTML = this.value;
    };
    borderPointsSlider.oninput = function () {
        borderPointsElem.innerHTML = this.value;
    };
    innerPointsSlider.onmouseup = function () {
        generateInnerVectors();
    };
    borderPointsSlider.onmouseup = function () {
        generateInnerVectors();
    };
};
function loadImage(e) {
    let files = e.target.files;
    if (files.length == 0) {
        return;
    }
    hideCanvas();
    vectorCanvas.getContext("2d").clearRect(0, 0, vectorCanvas.width, vectorCanvas.height);
    var url = URL.createObjectURL(files[0]);
    loadObjectUrl(mainCanvas, url);
}
exports.loadImage = loadImage;
function loadObjectUrl(canvas, url) {
    var context = canvas.getContext('2d');
    var img = new Image();
    img.src = url;
    context.clearRect(0, 0, canvas.width, canvas.height);
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        shape = new CanvasDataParser_1.CanvasDataParser(new SortingService_1.SortingService()).process(canvas, getBackgroundColor());
        showCanvas();
    };
}
function getImage() {
    let resultCanvas = document.createElement('canvas');
    resultCanvas.width = mainCanvas.width;
    resultCanvas.height = mainCanvas.height;
    resultCanvas.getContext("2d").drawImage(mainCanvas, 0, 0);
    resultCanvas.getContext("2d").drawImage(vectorCanvas, 0, 0);
    var link = document.createElement('a');
    link.download = "test.png";
    link.href = resultCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    ;
    link.click();
}
exports.getImage = getImage;
function clearVectorCanvas() {
    vectorCanvas.getContext("2d").clearRect(0, 0, vectorCanvas.width, vectorCanvas.height);
    vectorCanvas.width = mainCanvas.width;
    vectorCanvas.height = mainCanvas.height;
}
function showCanvas() {
    let canvasDiv = document.getElementsByClassName("canvas-panel")[0];
    let canvasWidthElem = document.getElementsByClassName("canvas-width")[0];
    let canvasHeightElem = document.getElementsByClassName("canvas-height")[0];
    let loader = document.getElementsByClassName("loader")[0];
    let disabledButtons = document.querySelectorAll(".disabled-button");
    loader.style.display = "none";
    canvasDiv.style.display = "block";
    canvasDiv.style.width = mainCanvas.width.toString();
    canvasDiv.style.height = mainCanvas.height.toString();
    canvasWidthElem.innerText = mainCanvas.width.toString() + "px";
    canvasHeightElem.innerText = mainCanvas.height.toString() + "px";
    for (let button of disabledButtons) {
        button.disabled = false;
        button.classList.remove("disabled-button");
    }
}
function hideCanvas() {
    let canvasDiv = document.getElementsByClassName("canvas-panel")[0];
    let loader = document.getElementsByClassName("loader")[0];
    canvasDiv.style.display = "none";
    loader.style.display = "block";
}
function getBackgroundColor() {
    let backgroundColorElem = document.getElementsByClassName("background-color")[0];
    return parseColor(backgroundColorElem.value);
}
function parseColor(color) {
    let matcher = color.match(/^#([0-9a-f]{6})$/i)[1];
    let r = 255;
    let g = 255;
    let b = 255;
    if (matcher) {
        r = parseInt(matcher.substr(0, 2), 16);
        g = parseInt(matcher.substr(2, 2), 16);
        b = parseInt(matcher.substr(4, 2), 16);
    }
    return new Pixel_1.Pixel(0, 0, 0, r, g, b, 0);
}

},{"./model/Pixel":3,"./services/CanvasDataParser":7,"./services/CanvasEditor":8,"./services/EdgeGenerator":9,"./services/RandomPointGenerator":10,"./services/ShapeEditor":11,"./services/SortingService":12}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pixel {
    constructor(dataIndex, x, y, r, g, b, alpha) {
        this.dataIndex = dataIndex;
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = alpha;
    }
    isColorEqual(pixel) {
        return this.r == pixel.r && this.g == pixel.g && this.b == pixel.b;
    }
    toArray() {
        return [this.r, this.g, this.b, this.alpha];
    }
    changeColor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    get getR() {
        return this.r;
    }
    get getG() {
        return this.g;
    }
    get getB() {
        return this.b;
    }
    get getX() {
        return this.x;
    }
    get getY() {
        return this.y;
    }
    getIndex() {
        return this.dataIndex;
    }
    getPosition() {
        return this.dataIndex / 4;
    }
}
exports.Pixel = Pixel;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PointWithTargets {
    constructor(position, endpoints) {
        this.position = position;
        this.endpoints = endpoints;
    }
    getPoint() {
        return this.position;
    }
    getEndpoints() {
        return this.endpoints;
    }
}
exports.PointWithTargets = PointWithTargets;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Shape {
    constructor(border, content) {
        this.border = border;
        this.content = content;
    }
    getBorder() {
        return this.border;
    }
    getContent() {
        return this.content;
    }
}
exports.Shape = Shape;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(startPos, endPos, width) {
        this.startPos = startPos;
        this.endPos = endPos;
        this.width = width;
        this.startY = Math.floor(startPos / width);
        this.startX = startPos - (this.startY * width);
        this.endY = Math.floor(endPos / width);
        this.endX = endPos - (this.endY * width);
    }
    getLength() {
        return Math.sqrt(Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2));
    }
    getStartPosition() {
        return this.startPos;
    }
    getEndPosition() {
        return this.endPos;
    }
    getWidth() {
        return this.width;
    }
    getStartX() {
        return this.startX;
    }
    getStartY() {
        return this.startY;
    }
    getEndX() {
        return this.endX;
    }
    getEndY() {
        return this.endY;
    }
    moveStartX(move) {
        this.startX += move;
    }
    moveStartY(move) {
        this.startY += move;
    }
    moveEndX(move) {
        this.endX += move;
    }
    moveEndY(move) {
        this.endY += move;
    }
}
exports.Vector = Vector;

},{}],7:[function(require,module,exports){
(function (process){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shape_1 = require("../model/Shape");
class CanvasDataParser {
    constructor(sortingService) {
        this.sortingService = sortingService;
    }
    process(canvas, bgPixel) {
        var context = canvas.getContext('2d');
        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        var data = imgData.data;
        let pixels = this.parsePixelData(data, canvas.width, canvas.height, bgPixel);
        let firstInnerPosition = this.findFirstInnerPixel(pixels, bgPixel, canvas.width);
        let shape = this.findContentWithBorder(pixels, firstInnerPosition, canvas.width);
        return shape;
    }
    parsePixelData(data, width, height, bgPixel) {
        let pixels = [];
        let pos = 0;
        let pixelsNr = width * height;
        for (var i = 0; i < pixelsNr; i++) {
            let index = pos * 4;
            let y = Math.floor(pos / width);
            let x = pos - (y * width);
            var red = data[index];
            var green = data[index + 1];
            var blue = data[index + 2];
            var alpha = data[index + 3];
            let isBorder = !(red == bgPixel.getR && green == bgPixel.getG && blue == bgPixel.getB);
            pixels.push(isBorder);
            pos++;
        }
        return pixels;
    }
    findFirstInnerPixel(pixels, bgPixel, width) {
        let firstNonBGPos = width;
        do {
            firstNonBGPos++;
        } while (!pixels[firstNonBGPos]);
        for (let i = firstNonBGPos++; i < pixels.length; i++) {
            let pixel = pixels[i];
            let previousPixel = pixels[i - 1];
            let x = i % width;
            if (x != 0 && previousPixel && !pixel && pixels[i - width] && pixels[i - width + 1]) {
                return i;
            }
        }
        return null;
    }
    findContentWithBorder(imagePixels, firstInnerPosition, width) {
        let pixels = imagePixels.slice();
        let content = [];
        let border = [];
        let pixelsToEvaluate = [firstInnerPosition];
        let ctr = 0;
        while (pixelsToEvaluate.length > 0) {
            ++ctr;
            let pixelPosition = pixelsToEvaluate.pop();
            delete pixels[pixelPosition];
            if (!pixels[pixelPosition]) {
                let neighbours = this.getPixelNeighbours(pixelPosition, width);
                let notEvaluatedNeighbours = neighbours.filter(p => pixels[p] != undefined);
                let neighboursToEvaluate = notEvaluatedNeighbours.filter(p => !pixels[p]);
                let borderNeighbours = notEvaluatedNeighbours.filter(p => pixels[p]);
                border.push(...borderNeighbours);
                pixelsToEvaluate.push(...neighboursToEvaluate);
                neighboursToEvaluate.forEach(p => delete pixels[p]);
                content.push(pixelPosition);
            }
            else {
                border.push(pixelPosition);
            }
        }
        return new Shape_1.Shape(this.sortingService.sortByClosestPoints(border, width), content);
    }
    getPixelNeighbours(position, width) {
        let top = position - width;
        let topLeft = position - width - 1;
        let topRight = position - width + 1;
        let left = position - 1;
        let right = position + 1;
        let bottom = position + width;
        let bottomLeft = position + width - 1;
        let bottomRight = position + width + 1;
        return [top, topLeft, topRight, left, right, bottom, bottomLeft, bottomRight];
    }
}
exports.CanvasDataParser = CanvasDataParser;

}).call(this,require('_process'))
},{"../model/Shape":5,"_process":1}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CanvasEditor {
    changePixelColorInArray(data, index, r, g, b) {
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
    }
    repaintPixels(canvas, pixelPositions, r, g, b, repaint) {
        var context = canvas.getContext('2d');
        if (repaint) {
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        var data = imgData.data;
        pixelPositions.forEach(p => {
            this.changePixelColorInArray(data, p * 4, r, g, b);
        });
        context.putImageData(imgData, 0, 0);
    }
    drawVectors(canvas, vectors) {
        var context = canvas.getContext('2d');
        vectors.forEach(e => {
            context.beginPath();
            context.moveTo(e.getStartX(), e.getStartY());
            context.lineTo(e.getEndX(), e.getEndY());
            context.closePath();
            context.stroke();
        });
    }
}
exports.CanvasEditor = CanvasEditor;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("../model/Vector");
const PointWithTargets_1 = require("../model/PointWithTargets");
class EdgeGenerator {
    constructor(sortingService) {
        this.sortingService = sortingService;
    }
    generateEdgesNet(points, connections, width, preEdges) {
        let edges = [];
        let closestPixels = [];
        let ctr = 0;
        let deletedClosestNr = 0;
        let connectionsCopy = connections.slice();
        points.forEach(p => {
            let sortedPoints = this.sortingService.sortByClosestFromPoint(p, connections, width).slice(1);
            let pointWithTargets = new PointWithTargets_1.PointWithTargets(p, sortedPoints);
            closestPixels.push(pointWithTargets);
        });
        while (closestPixels.length != deletedClosestNr) {
            closestPixels.forEach((p, key) => {
                let closest = p.getEndpoints().shift();
                let edge = new Vector_1.Vector(p.getPoint(), closest, width);
                if (preEdges.every(e => !this.isColliding(e, edge))) {
                    edges.push(edge);
                    preEdges.push(edge);
                }
                if (p.getEndpoints().length == 0) {
                    delete closestPixels[key];
                    deletedClosestNr++;
                }
            });
        }
        return edges;
    }
    generateVectorShape(points, width) {
        let vectors = [];
        let pointsCopy = points.slice();
        let firstPoint = pointsCopy.shift();
        let startPoint = firstPoint;
        pointsCopy.forEach(p => {
            vectors.push(new Vector_1.Vector(startPoint, p, width));
            startPoint = p;
        });
        vectors.push(new Vector_1.Vector(pointsCopy[pointsCopy.length - 1], firstPoint, width));
        return vectors;
    }
    turn(aX, aY, bX, bY, cX, cY) {
        let a = (cY - aY) * (bX - aX);
        let b = (bY - aY) * (cX - aX);
        return (a > b + Number.EPSILON) ? 1 : (a + Number.EPSILON < b) ? -1 : 0;
    }
    isColliding(v1, v2Orig) {
        let v2 = this.trimVectorBy1(v2Orig);
        let eval1 = this.turn(v1.getStartX(), v1.getStartY(), v2.getStartX(), v2.getStartY(), v2.getEndX(), v2.getEndY());
        let eval2 = this.turn(v1.getEndX(), v1.getEndY(), v2.getStartX(), v2.getStartY(), v2.getEndX(), v2.getEndY());
        let eval3 = this.turn(v1.getStartX(), v1.getStartY(), v1.getEndX(), v1.getEndY(), v2.getStartX(), v2.getStartY());
        let eval4 = this.turn(v1.getStartX(), v1.getStartY(), v1.getEndX(), v1.getEndY(), v2.getEndX(), v2.getEndY());
        return eval1 != eval2 && eval3 != eval4;
    }
    trimVectorBy1(v) {
        let vectorCopy = new Vector_1.Vector(v.getStartPosition(), v.getEndPosition(), v.getWidth());
        if (v.getStartX() > v.getEndX()) {
            vectorCopy.moveStartX(-1);
            vectorCopy.moveEndX(1);
        }
        else if (v.getStartX() < v.getEndX()) {
            vectorCopy.moveStartX(1);
            vectorCopy.moveEndX(-1);
        }
        if (v.getStartY() > v.getEndY()) {
            vectorCopy.moveStartY(-1);
            vectorCopy.moveEndY(1);
        }
        else if (v.getStartY() < v.getEndY()) {
            vectorCopy.moveStartY(1);
            vectorCopy.moveEndY(-1);
        }
        return vectorCopy;
    }
}
exports.EdgeGenerator = EdgeGenerator;

},{"../model/PointWithTargets":4,"../model/Vector":6}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RandomPointGenerator {
    generatePoints(pixels, frequency) {
        let step = pixels.length / frequency;
        let pos = 0;
        let generatedPixels = [];
        while (pos < pixels.length) {
            var pixel = pixels[Math.floor(pos)];
            generatedPixels.push(pixel);
            pos += step;
        }
        return generatedPixels;
    }
}
exports.RandomPointGenerator = RandomPointGenerator;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("../model/Vector");
const RandomPointGenerator_1 = require("./RandomPointGenerator");
class ShapeEditor {
    constructor(randomPointGenerator, edgeGenerator, sortingService, canvasWidth) {
        this.randomPointGenerator = randomPointGenerator;
        this.edgeGenerator = edgeGenerator;
        this.sortingService = sortingService;
        this.canvasWidth = canvasWidth;
    }
    vectorizeShape(shape, accuracyPoints) {
        let standardSpreadPoints = this.randomPointGenerator.generatePoints(shape.getBorder(), accuracyPoints);
        return this.edgeGenerator.generateVectorShape(standardSpreadPoints, this.canvasWidth);
    }
    generateBorderPoints(shape, frequency) {
        return this.randomPointGenerator.generatePoints(shape.getBorder(), frequency);
    }
    generateContentPoints(shape, frequency, accuracy, origShapeVectors) {
        let shapeVectors = origShapeVectors.slice();
        let contentPoints = this.randomPointGenerator.generatePoints(shape.getContent(), frequency);
        let genPoints = new RandomPointGenerator_1.RandomPointGenerator().generatePoints(shape.getContent(), accuracy);
        let finalPoints = [];
        for (var i = 0; i < frequency; i++) {
            let points = this.sortingService.sortByDistanceFromVectors(genPoints, this.canvasWidth, shapeVectors);
            let point = points.pop();
            finalPoints.push(point);
            genPoints = points;
            shapeVectors.push(new Vector_1.Vector(point, point, this.canvasWidth));
        }
        return finalPoints;
    }
    generateInnerVectors(shape, innerFrequency, borderFrequency, shapeAccuracy, contentAccuracy) {
        let borderPoints = this.generateBorderPoints(shape, borderFrequency);
        let shapeVectors = this.vectorizeShape(shape, shapeAccuracy);
        let innerPoints = this.generateContentPoints(shape, innerFrequency, contentAccuracy, shapeVectors);
        let endPoints = innerPoints.slice();
        endPoints.push(...borderPoints);
        let edges = this.edgeGenerator.generateEdgesNet(innerPoints, endPoints, this.canvasWidth, shapeVectors);
        return edges;
    }
}
exports.ShapeEditor = ShapeEditor;

},{"../model/Vector":6,"./RandomPointGenerator":10}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SortingService {
    sortByClosestPoints(originalPoints, width) {
        let points = originalPoints.slice();
        let startPoint = points.shift();
        let sortedPoints = [startPoint];
        while (points.length > 1) {
            points.sort(this.compareByDistanceFromPoint(startPoint, width));
            sortedPoints.push(points.shift());
            let lastClosestPoint = points.shift();
            sortedPoints.push(lastClosestPoint);
            startPoint = lastClosestPoint;
        }
        while (points.length > 0) {
            sortedPoints.push(points.shift());
        }
        return sortedPoints;
    }
    sortByClosestFromPoint(startPoint, originalPoints, width) {
        let points = originalPoints.slice();
        let sortedPoints = [startPoint];
        return points.sort(this.compareByDistanceFromPoint(startPoint, width));
    }
    sortByDistanceFromVectors(originalPoints, width, vectors) {
        let points = originalPoints.slice();
        return points.sort(this.compareByDistanceFromVectors(width, vectors));
    }
    sortByShortestVector(points, width) {
        let shortestVectorLength = [];
        points.forEach((arr, key) => {
            shortestVectorLength[key] = this.calculateVectorLength(key, arr[0], width);
        });
    }
    compareByDistanceFromPoint(p, width) {
        return function (a, b) {
            let pY = Math.floor(p / width);
            let pX = p - (pY * width);
            let aY = Math.floor(a / width);
            let aX = a - (aY * width);
            let bY = Math.floor(b / width);
            let bX = b - (bY * width);
            let pToA = Math.sqrt(Math.pow(aX - pX, 2) + Math.pow(aY - pY, 2));
            let pToB = Math.sqrt(Math.pow(bX - pX, 2) + Math.pow(bY - pY, 2));
            if (pToA < pToB) {
                return -1;
            }
            else if (pToA > pToB) {
                return 1;
            }
            else {
                return 0;
            }
        };
    }
    compareByDistanceFromVectors(width, vectors) {
        return function (a, b) {
            let aY = Math.floor(a / width);
            let aX = a - (aY * width);
            let bY = Math.floor(b / width);
            let bX = b - (bY * width);
            let distanceFromA = 0;
            let distanceFromB = 0;
            vectors.forEach(v => {
                let vToA = Math.sqrt(Math.pow(aX - v.getEndX(), 2) + Math.pow(aY - v.getEndY(), 2));
                let vToB = Math.sqrt(Math.pow(bX - v.getEndX(), 2) + Math.pow(bY - v.getEndY(), 2));
                if (distanceFromA == 0 || distanceFromA > vToA) {
                    distanceFromA = vToA;
                }
                if (distanceFromB == 0 || distanceFromB > vToB) {
                    distanceFromB = vToB;
                }
            });
            if (distanceFromA < distanceFromB) {
                return -1;
            }
            else if (distanceFromA > distanceFromB) {
                return 1;
            }
            else {
                return 0;
            }
        };
    }
    calculateVectorLength(pos1, pos2, width) {
        let aY = Math.floor(pos1 / width);
        let aX = pos1 - (aY * width);
        let bY = Math.floor(pos2 / width);
        let bX = pos2 - (bY * width);
        return Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));
    }
}
exports.SortingService = SortingService;

},{}]},{},[2])(2)
});