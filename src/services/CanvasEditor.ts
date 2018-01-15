import { Vector } from "../model/Vector";

export class CanvasEditor {

    changePixelColorInArray(data: Uint8ClampedArray, index: number, r: number, g: number, b: number) {
        data[index] = r;
        data[index + 1] = r;
        data[index + 2] = r;
    }

    repaintPixels(data: Uint8ClampedArray, pixelPositions: Array<number>, r: number, g: number, b: number) {
        pixelPositions.forEach(p => {
            this.changePixelColorInArray(data, p * 4, r, g, b);
        });
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

    loadObjectUrl(canvas: HTMLCanvasElement, url: string) {
        var context = canvas.getContext('2d');
        var img = new Image();
        img.src = url;
        context.clearRect(0, 0, canvas.width, canvas.height);

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
        }
    }

}