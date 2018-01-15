export class Vector {

    startPos: number;

    endPos: number;

    width: number;

    startX: number;

    startY: number;

    endX: number;

    endY: number;

    constructor(startPos: number, endPos: number, width: number) {
        this.startPos = startPos;
        this.endPos = endPos;
        this.width = width;

        this.startY = Math.floor(startPos / width);
        this.startX = startPos - (this.startY * width);
        this.endY = Math.floor(endPos / width);
        this.endX = endPos - (this.endY * width);
    }

    getLength() {
        return Math.sqrt(
            Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2));
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

    getStartX(): number {
        return this.startX;
    }

    getStartY(): number {
        return this.startY;
    }

    getEndX(): number {
        return this.endX;
    }

    getEndY(): number {
        return this.endY;
    }

    moveStartX(move: number) {
        this.startX += move;
    }

    moveStartY(move: number) {
        this.startY += move;
    }

    moveEndX(move: number) {
        this.endX += move;
    }

    moveEndY(move: number) {
        this.endY += move;
    }

}