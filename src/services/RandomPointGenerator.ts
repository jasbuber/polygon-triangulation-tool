export class RandomPointGenerator {

    public generatePoints(pixels: Array<number>, frequency: number): Array<number> {
        let step = pixels.length / frequency;
        let pos = 0;
        let generatedPixels: Array<number> = [];

        while (pos < pixels.length) {
            var pixel = pixels[Math.floor(pos)];
            generatedPixels.push(pixel);
            pos += step;
        }

        return generatedPixels;
    }

}