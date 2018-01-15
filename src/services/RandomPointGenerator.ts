export class RandomPointGenerator {

    public generatePoints(pixels: Array<number>, frequency: number): Array<number> {
        let step = pixels.length / frequency;
        let pos = step;
        let generatedPixels: Array<number> = [];

        while (pos < pixels.length) {
            generatedPixels.push(pixels[Math.floor(pos)]);
            pos += step;
        }

        return generatedPixels;
    }

}