import { Vector } from "../model/Vector";

export class CanvasEditor {

    changePixelColorInArray(data: Uint8ClampedArray, index: number, r: number, g: number, b: number) {
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
    }

    repaintPixels(canvas: HTMLCanvasElement, pixelPositions: Array<number>, r: number, g: number, b: number, repaint: boolean) {
        var context = canvas.getContext('2d');

        if (repaint) {
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        var data: Uint8ClampedArray = imgData.data;

        pixelPositions.forEach(p => {
            this.changePixelColorInArray(data, p * 4, r, g, b);
        });

        context.putImageData(imgData, 0, 0);
    }

    drawVectors(canvas: HTMLCanvasElement, vectors: Array<Vector>) {

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