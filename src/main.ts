import { Shape } from "./model/Shape";
import { Pixel } from "./model/Pixel";
import { Vector } from "./model/Vector";

import { CanvasDataParser } from "./services/CanvasDataParser";
import { CanvasEditor } from "./services/CanvasEditor";
import { RandomPointGenerator } from "./services/RandomPointGenerator";
import { EdgeGenerator } from "./services/EdgeGenerator";
import { ShapeEditor } from "./services/ShapeEditor";
import { SortingService } from "./services/SortingService";

var shape: Shape;

var mainCanvas: HTMLCanvasElement;

var vectorCanvas: HTMLCanvasElement;

var innerPointsElem: HTMLInputElement;

var borderPointsElem: HTMLInputElement;

export function generateInnerVectors() {

    clearVectorCanvas();

    let innerAccuracyElem = <HTMLInputElement>document.getElementsByClassName("inner-accuracy")[0];
    let shapeAccuracyElem = <HTMLInputElement>document.getElementsByClassName("shape-accuracy")[0];

    let sortingService = new SortingService();
    let shapeEditor = new ShapeEditor(new RandomPointGenerator(), new EdgeGenerator(sortingService), sortingService, mainCanvas.width);

    let innerAccuracy = parseInt(innerAccuracyElem.value);
    let shapeAccuracy = parseInt(shapeAccuracyElem.value);
    let innerPointsNr = parseInt(innerPointsElem.innerText);
    let borderPointsNr = parseInt(borderPointsElem.innerText);

    let innerVectors = shapeEditor.generateInnerVectors(shape, innerPointsNr, borderPointsNr, shapeAccuracy, innerAccuracy);

    new CanvasEditor().drawVectors(vectorCanvas, innerVectors);
}

function onImageLoad(){

    clearVectorCanvas();

    let sortingService = new SortingService();

    vectorCanvas.width = mainCanvas.width;
    vectorCanvas.height = mainCanvas.height;
    let shapeEditor = new ShapeEditor(new RandomPointGenerator(), new EdgeGenerator(sortingService), sortingService, mainCanvas.width);


    shape = new CanvasDataParser(new SortingService()).process(mainCanvas, getBackgroundColor());

}

window.onload = function () {

    mainCanvas = <HTMLCanvasElement>document.getElementById("main-canvas");
    vectorCanvas = <HTMLCanvasElement>document.getElementById("vector-canvas");
    innerPointsElem = <HTMLInputElement>document.getElementsByClassName("inner-points-nr")[0];
    borderPointsElem = <HTMLInputElement>document.getElementsByClassName("border-points-nr")[0];

    var input = <HTMLInputElement>document.querySelector("input[type=file]");
    input.addEventListener("change", loadImage, false);

    var innerPointsSlider: HTMLInputElement = <HTMLInputElement> document.getElementsByClassName("inner-points-slider")[0];
    var borderPointsSlider = <HTMLInputElement>document.getElementsByClassName("border-points-slider")[0];

    innerPointsSlider.oninput = function () {
        innerPointsElem.innerHTML = (<HTMLInputElement>this).value;
        
    }

    borderPointsSlider.oninput = function () {
        borderPointsElem.innerHTML = (<HTMLInputElement>this).value;
    }

    innerPointsSlider.onmouseup = function () {
        generateInnerVectors();
    }

    borderPointsSlider.onmouseup = function () {
        generateInnerVectors();
    }
};

export function loadImage(e: any) {

    hideCanvas();

    vectorCanvas.getContext("2d").clearRect(0, 0, vectorCanvas.width, vectorCanvas.height);

    var url = URL.createObjectURL(e.target.files[0]);

    loadObjectUrl(mainCanvas, url);
}

function loadObjectUrl(canvas: HTMLCanvasElement, url: string) {
    var context = canvas.getContext('2d');
    var img = new Image();
    img.src = url;
    context.clearRect(0, 0, canvas.width, canvas.height);

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        shape = new CanvasDataParser(new SortingService()).process(canvas, getBackgroundColor());

        showCanvas();
    }
}

export function getImage(){

    let resultCanvas: HTMLCanvasElement = document.createElement('canvas');
    resultCanvas.width = mainCanvas.width;
    resultCanvas.height = mainCanvas.height;

    resultCanvas.getContext("2d").drawImage(mainCanvas, 0, 0);
    resultCanvas.getContext("2d").drawImage(vectorCanvas, 0, 0);

    var link = document.createElement('a');
    link.download = "test.png";
    link.href = resultCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
    link.click();
}

function clearVectorCanvas(){

    vectorCanvas.getContext("2d").clearRect(0, 0, vectorCanvas.width, vectorCanvas.height);

    vectorCanvas.width = mainCanvas.width;
    vectorCanvas.height = mainCanvas.height;
}

function showCanvas(){
    let canvasDiv: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("canvas-panel")[0];
    let canvasWidthElem: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("canvas-width")[0];
    let canvasHeightElem: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("canvas-height")[0];
    let loader: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("loader")[0];
    let disabledButtons: NodeListOf<HTMLInputElement> = document.querySelectorAll(".disabled-button");

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
    let canvasDiv: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("canvas-panel")[0];
    let loader: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("loader")[0];
    canvasDiv.style.display = "none";
    loader.style.display = "block";
}

function getBackgroundColor(): Pixel{
    let backgroundColorElem = <HTMLInputElement>document.getElementsByClassName("background-color")[0];
    return parseColor(backgroundColorElem.value);
}

function parseColor(color: string): Pixel{
    let matcher = color.match(/^#([0-9a-f]{6})$/i)[1];

    let r = 255;
    let g = 255;
    let b = 255;

    if (matcher) {
        r = parseInt(matcher.substr(0, 2), 16);
        g = parseInt(matcher.substr(2, 2), 16);
        b = parseInt(matcher.substr(4, 2), 16);
    }

    console.log(new Pixel(0, 0, 0, r, g, b, 0));
    return new Pixel(0, 0, 0, r, g, b, 0);
}

