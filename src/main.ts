import { Shape } from "./model/Shape";
import { Pixel } from "./model/Pixel";

import { CanvasDataParser } from "./services/CanvasDataParser";
import { CanvasEditor } from "./services/CanvasEditor";
import { RandomPointGenerator } from "./services/RandomPointGenerator";
import { EdgeGenerator } from "./services/EdgeGenerator";
import { ShapeEditor } from "./services/ShapeEditor";

const bgPixel: Pixel = new Pixel(0, 0, 0, 255, 255, 255, 0);

export function generateInnerVectors() {
    var canvas = <HTMLCanvasElement>document.getElementById("main-canvas");

    let shapeEditor = new ShapeEditor(new RandomPointGenerator(), new EdgeGenerator(), canvas.width);

    let shape: Shape = new CanvasDataParser().process(canvas, bgPixel);

    new CanvasEditor().drawVectors(canvas, shapeEditor.generateInnerVectors(shape, 15, 30, 100));
}

window.onload = function () {
    var input = <HTMLInputElement>document.querySelector("input[type=file]");
    input.addEventListener("change", loadImage, false);
};

export function loadImage(e: any) {
    var canvas = <HTMLCanvasElement>document.getElementById("main-canvas");

    var url = URL.createObjectURL(e.target.files[0]);

    new CanvasEditor().loadObjectUrl(canvas, url);
}
