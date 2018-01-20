import { Vector } from "../model/Vector";
import { SortingService } from "../services/SortingService";

export class EdgeGenerator {

    private sortingService: SortingService;

    constructor(sortingService: SortingService){
        this.sortingService = sortingService;
    }

    generateEdgesNet(points: Array<number>, connections: Array<number>, width: number, preEdges: Array<Vector>): Array<Vector> {
        let edges: Array<Vector> = [];
        let closestPixels: Array<Array<number>> = [];
        let pointsKeyMap: Map<number, number> = new Map<number, number>();
        let ctr = 0;
        let deletedClosestNr = 0;

        let connectionsCopy = connections.slice();
        points.forEach((p, key) => {
            let sortedPoints = this.sortingService.sortByClosestFromPoint(p, connections, width);
            closestPixels.push(sortedPoints.slice(1));
            pointsKeyMap.set(p, key);
        });

        while (closestPixels.length != deletedClosestNr) {
            points.forEach((p, key) => {

                let closest = closestPixels[key].shift();

                let edge = new Vector(p, closest, width);

                if (preEdges.every(e => !this.isColliding(e, edge))) {
                    edges.push(edge);
                    preEdges.push(edge);
                }

                if (closestPixels[key].length == 0) {
                    delete closestPixels[key];
                    deletedClosestNr++;
                }
            });
        }

        return edges;
    }

    public generateVectorShape(points: Array<number>, width: number): Array<Vector> {
        let vectors: Array<Vector> = [];
        let pointsCopy = points.slice()
        let firstPoint = pointsCopy.shift();
        let startPoint = firstPoint;

        pointsCopy.forEach(p => {
            vectors.push(new Vector(startPoint, p, width));
            startPoint = p;
        });

        vectors.push(new Vector(pointsCopy[pointsCopy.length - 1], firstPoint, width));

        return vectors;
    }

    private turn(aX: number, aY: number, bX: number, bY: number, cX: number, cY: number): number {
        let a = (cY - aY) * (bX - aX);
        let b = (bY - aY) * (cX - aX);
        return (a > b + Number.EPSILON) ? 1 : (a + Number.EPSILON < b) ? -1 : 0;
    }

    private isColliding(v1: Vector, v2Orig: Vector) {

        let v2 = this.trimVectorBy1(v2Orig);

        let eval1 = this.turn(v1.getStartX(), v1.getStartY(), v2.getStartX(), v2.getStartY(), v2.getEndX(), v2.getEndY());
        let eval2 = this.turn(v1.getEndX(), v1.getEndY(), v2.getStartX(), v2.getStartY(), v2.getEndX(), v2.getEndY());
        let eval3 = this.turn(v1.getStartX(), v1.getStartY(), v1.getEndX(), v1.getEndY(), v2.getStartX(), v2.getStartY());
        let eval4 = this.turn(v1.getStartX(), v1.getStartY(), v1.getEndX(), v1.getEndY(), v2.getEndX(), v2.getEndY());

        return eval1 != eval2 && eval3 != eval4;
    }

    private trimVectorBy1(v: Vector): Vector {

        let vectorCopy: Vector = new Vector(v.getStartPosition(), v.getEndPosition(), v.getWidth());

        if (v.getStartX() > v.getEndX()) {
            vectorCopy.moveStartX(-1);
            vectorCopy.moveEndX(1);
        } else if (v.getStartX() < v.getEndX()) {
            vectorCopy.moveStartX(1);
            vectorCopy.moveEndX(-1);
        }

        if (v.getStartY() > v.getEndY()) {
            vectorCopy.moveStartY(-1);
            vectorCopy.moveEndY(1);
        } else if (v.getStartY() < v.getEndY()) {
            vectorCopy.moveStartY(1);
            vectorCopy.moveEndY(-1);
        }

        return vectorCopy;
    }

}