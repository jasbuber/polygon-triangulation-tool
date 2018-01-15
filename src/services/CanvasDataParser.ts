import { Pixel } from "../model/Pixel";
import { Shape } from "../model/Shape";

export class CanvasDataParser {

    process(canvas: HTMLCanvasElement, bgPixel: Pixel): Shape {

        var context = canvas.getContext('2d');
        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        var data: Uint8ClampedArray = imgData.data;

        let pixels = this.parsePixelData(data, canvas.width, canvas.height, bgPixel);
        let firstInnerPosition = this.findFirstInnerPixel(pixels, bgPixel, canvas.width);
        let shape: Shape = this.findContentWithBorder(pixels, firstInnerPosition, canvas.width);

        return shape;
    }

    parsePixelData(data: Uint8ClampedArray, width: number, height: number, bgPixel: Pixel): Array<boolean> {

        let pixels: Array<boolean> = [];
        let pos: number = 0;
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

    findFirstInnerPixel(pixels: Array<boolean>, bgPixel: Pixel, width: number): number {

        let firstNonBGPos = width;

        do {
            firstNonBGPos++;
        } while (!pixels[firstNonBGPos]);

        for (let i = firstNonBGPos++; i < pixels.length; i++) {
            let pixel = pixels[i];
            let previousPixel = pixels[i - 1];
            let x: number = i % width;
            if (x != 0 && previousPixel && !pixel && pixels[i - width]) {
                return i;
            }
        }
        return null;
    }

    findContentWithBorder(imagePixels: Array<boolean>, firstInnerPosition: number, width: number) {

        let pixels = imagePixels.slice();
        let content: Array<number> = [];
        let border: Array<number> = [];
        let pixelsToEvaluate = [firstInnerPosition];
        let ctr = 0;

        while (pixelsToEvaluate.length > 0) {

            ++ctr;
            let pixelPosition = pixelsToEvaluate.pop();

            delete pixels[pixelPosition];

            if (!pixels[pixelPosition]) {
                let neighbours: Array<number> = this.getPixelNeighbours(pixelPosition, width);

                let notEvaluatedNeighbours: Array<number> = neighbours.filter(p => pixels[p] != undefined);
                let neighboursToEvaluate = notEvaluatedNeighbours.filter(p => !pixels[p]);
                let borderNeighbours = notEvaluatedNeighbours.filter(p => pixels[p]);

                border.push(...borderNeighbours);
                pixelsToEvaluate.push(...neighboursToEvaluate);
                neighboursToEvaluate.forEach(p => delete pixels[p]);

                content.push(pixelPosition);
            } else {
                border.push(pixelPosition);
            }

        }

        return new Shape(border, content);
    }

    getPixelNeighbours(position: number, width: number): Array<number> {
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
