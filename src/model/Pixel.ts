export class Pixel {
    private dataIndex: number;
    private x: number;
    private y: number;
    private r: number;
    private g: number;
    private b: number;
    private alpha: number;

    constructor(dataIndex: number, x: number, y: number, r: number, g: number, b: number, alpha: number) {
        this.dataIndex = dataIndex;
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = alpha;
    }

    isColorEqual(pixel: Pixel) {
        return this.r == pixel.r && this.g == pixel.g && this.b == pixel.b;
    }

    toArray() {
        return [this.r, this.g, this.b, this.alpha];
    }

    changeColor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    get getR(): number {
        return this.r;
    }

    get getG(): number {
        return this.g;
    }

    get getB(): number {
        return this.b;
    }

    get getX(): number {
        return this.x;
    }

    get getY(): number {
        return this.y;
    }

    getIndex(): number {
        return this.dataIndex;
    }

    getPosition(): number {
        return this.dataIndex / 4;
    }

}