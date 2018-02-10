export class PointWithTargets {

    position: number;

    endpoints: Array<number>;

    constructor(position: number, endpoints: Array<number>) {
        this.position = position;
        this.endpoints = endpoints;
    }

    getPoint(): number {
        return this.position;
    }

    getEndpoints(): Array<number> {
        return this.endpoints;
    }
}