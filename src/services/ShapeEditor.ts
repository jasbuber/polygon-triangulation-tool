import { Vector } from "../model/Vector";
import { Shape } from "../model/Shape";

import { RandomPointGenerator } from "./RandomPointGenerator";
import { EdgeGenerator } from "./EdgeGenerator";
import { SortingService } from "./SortingService";

export class ShapeEditor {

    randomPointGenerator: RandomPointGenerator;

    edgeGenerator: EdgeGenerator;

    sortingService: SortingService;

    canvasWidth: number;

    constructor(randomPointGenerator: RandomPointGenerator, edgeGenerator: EdgeGenerator, sortingService: SortingService, canvasWidth: number) {
        this.randomPointGenerator = randomPointGenerator;
        this.edgeGenerator = edgeGenerator;
        this.sortingService = sortingService;
        this.canvasWidth = canvasWidth;
    }

    public vectorizeShape(shape: Shape, accuracyPoints: number): Array<Vector> {

        let standardSpreadPoints: Array<number> = this.randomPointGenerator.generatePoints(shape.getBorder(), accuracyPoints);
        return this.edgeGenerator.generateVectorShape(standardSpreadPoints, this.canvasWidth);
    }

    public generateBorderPoints(shape: Shape, frequency: number): Array<number> {
        return this.randomPointGenerator.generatePoints(shape.getBorder(), frequency);
    }

    public generateContentPoints(shape: Shape, frequency: number, accuracy: number, origShapeVectors: Array<Vector>): Array<number> {

        let shapeVectors = origShapeVectors.slice();
        let contentPoints = this.randomPointGenerator.generatePoints(shape.getContent(), frequency);

        let genPoints = new RandomPointGenerator().generatePoints(shape.getContent(), accuracy);

        let finalPoints: Array<number> = [];
        for (var i = 0; i < frequency; i++) {
            let points = this.sortingService.sortByDistanceFromVectors(genPoints, this.canvasWidth, shapeVectors);
            let point = points.pop();
            finalPoints.push(point);
            genPoints = points
            shapeVectors.push(new Vector(point, point, this.canvasWidth));
        }
        return finalPoints;
    }

    public generateInnerVectors(shape: Shape, innerFrequency: number, borderFrequency: number, shapeAccuracy: number, contentAccuracy: number): Array<Vector> {

        let borderPoints: Array<number> = this.generateBorderPoints(shape, borderFrequency);

        let shapeVectors: Array<Vector> = this.vectorizeShape(shape, shapeAccuracy);

        let innerPoints: Array<number> = this.generateContentPoints(shape, innerFrequency, contentAccuracy, shapeVectors);

        let edges: Array<Vector> = this.edgeGenerator.generateEdgesNet(innerPoints, innerPoints, this.canvasWidth, shapeVectors);

        edges.push(...this.edgeGenerator.generateEdgesNet(innerPoints, borderPoints, this.canvasWidth, shapeVectors));

        return edges;
    }

}