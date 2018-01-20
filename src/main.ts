import { Shape } from "./model/Shape";
import { Pixel } from "./model/Pixel";

import { CanvasDataParser } from "./services/CanvasDataParser";
import { CanvasEditor } from "./services/CanvasEditor";
import { RandomPointGenerator } from "./services/RandomPointGenerator";
import { EdgeGenerator } from "./services/EdgeGenerator";
import { ShapeEditor } from "./services/ShapeEditor";

const bgPixel: Pixel = new Pixel(0, 0, 0, 255, 255, 255, 0);

export function generateInnerVectors() {
    var mainCanvas = <HTMLCanvasElement>document.getElementById("main-canvas");
    var vectorCanvas = <HTMLCanvasElement>document.getElementById("vector-canvas");

    vectorCanvas.getContext("2d").clearRect(0, 0, vectorCanvas.width, vectorCanvas.height);

    var innerPointsNr = <HTMLInputElement>document.getElementsByClassName("inner-points-nr")[0];
    var borderPointsNr = <HTMLInputElement>document.getElementsByClassName("border-points-nr")[0];

    vectorCanvas.width = mainCanvas.width;
    vectorCanvas.height = mainCanvas.height;
    let shapeEditor = new ShapeEditor(new RandomPointGenerator(), new EdgeGenerator(), mainCanvas.width);

    let shape: Shape = new CanvasDataParser().process(mainCanvas, bgPixel);

    
    new CanvasEditor().drawVectors(vectorCanvas, 
        shapeEditor.generateInnerVectors(shape, parseInt(innerPointsNr.innerText), parseInt(borderPointsNr.innerText), 100));

}

window.onload = function () {
    var input = <HTMLInputElement>document.querySelector("input[type=file]");
    input.addEventListener("change", loadImage, false);

    var innerPointsSlider: HTMLInputElement = <HTMLInputElement> document.getElementsByClassName("inner-points-slider")[0];
    var borderPointsSlider = <HTMLInputElement>document.getElementsByClassName("border-points-slider")[0];

    var innerPointsNr = <HTMLInputElement> document.getElementsByClassName("inner-points-nr")[0];
    var borderPointsNr = <HTMLInputElement> document.getElementsByClassName("border-points-nr")[0];

    innerPointsSlider.oninput = function () {
        innerPointsNr.innerHTML = (<HTMLInputElement>this).value;
    }

    borderPointsSlider.oninput = function () {
        borderPointsNr.innerHTML = (<HTMLInputElement>this).value;
    }

    innerPointsSlider.onmouseup = function () {
        console.log("onDrop");
        generateInnerVectors();
    }

    borderPointsSlider.onmouseup = function () {
        generateInnerVectors();
    }
};

export function loadImage(e: any) {
    var canvas = <HTMLCanvasElement>document.getElementById("main-canvas");
    var vectorCanvas = <HTMLCanvasElement>document.getElementById("vector-canvas");

    vectorCanvas.getContext("2d").clearRect(0, 0, vectorCanvas.width, vectorCanvas.height);

    var url = URL.createObjectURL(e.target.files[0]);

    new CanvasEditor().loadObjectUrl(canvas, url);
}

export function getImage(){
    var canvas = <HTMLCanvasElement>document.getElementById("main-canvas");
    var vectorCanvas = <HTMLCanvasElement>document.getElementById("vector-canvas");

    canvas.getContext("2d").drawImage(vectorCanvas, 0, 0);

    var link = document.createElement('a');
    link.download = "test.png";
    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
    link.click();
}
