import { Vector } from "../model/Vector";
import { Shape } from "../model/Shape";

import { RandomPointGenerator } from "./RandomPointGenerator";
import { EdgeGenerator } from "./EdgeGenerator";

export class ShapeEditor {

    randomPointGenerator: RandomPointGenerator;

    edgeGenerator: EdgeGenerator;

    canvasWidth: number;

    constructor(randomPointGenerator: RandomPointGenerator, edgeGenerator: EdgeGenerator, canvasWidth: number) {
        this.randomPointGenerator = randomPointGenerator;
        this.edgeGenerator = edgeGenerator;
        this.canvasWidth = canvasWidth;
    }

    public vectorizeShape(shape: Shape, accuracyPoints: number): Array<Vector> {

        let standardSpreadPoints: Array<number> = this.randomPointGenerator.generatePoints(shape.getBorder(), 100);
        return this.edgeGenerator.generateVectorShape(standardSpreadPoints, this.canvasWidth);
    }

    public generateBorderPoints(shape: Shape, frequency: number): Array<number> {
        return this.randomPointGenerator.generatePoints(shape.getBorder(), frequency);
    }

    public generateContentPoints(shape: Shape, frequency: number): Array<number> {
        return this.randomPointGenerator.generatePoints(shape.getContent(), frequency);
    }

    public generateInnerVectors(shape: Shape, innerFrequency: number, borderFrequency: number, accuracy: number): Array<Vector> {

        let innerPoints: Array<number> = this.generateContentPoints(shape, innerFrequency);

        let borderPoints: Array<number> = this.generateBorderPoints(shape, borderFrequency);

        let shapeVectors: Array<Vector> = this.vectorizeShape(shape, accuracy);

        let edges: Array<Vector> = this.edgeGenerator.generateEdgesNet(innerPoints, innerPoints, this.canvasWidth, shapeVectors);

        edges.push(...this.edgeGenerator.generateEdgesNet(innerPoints, borderPoints, this.canvasWidth, shapeVectors));

        return edges;
    }

}