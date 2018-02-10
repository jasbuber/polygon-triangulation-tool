import { Vector } from "../model/Vector";

export class SortingService{

    public sortByClosestPoints(originalPoints: Array<number>, width: number): Array<number> {
        let points = originalPoints.slice();
        let startPoint = points.shift();
        let sortedPoints: Array<number> = [startPoint];
        while (points.length > 1) {
            points.sort(this.compareByDistanceFromPoint(startPoint, width));
            sortedPoints.push(points.shift());

            let lastClosestPoint = points.shift();
            sortedPoints.push(lastClosestPoint);

            startPoint = lastClosestPoint;
        }

        while (points.length > 0) {
            sortedPoints.push(points.shift());
        }

        return sortedPoints;
    }

    public sortByClosestFromPoint(startPoint: number, originalPoints: Array<number>, width: number): Array<number> {
        let points = originalPoints.slice();
        let sortedPoints: Array<number> = [startPoint];

        return points.sort(this.compareByDistanceFromPoint(startPoint, width));
    }

    public sortByDistanceFromVectors(originalPoints: Array<number>, width: number, vectors: Array<Vector>): Array<number> {
        let points = originalPoints.slice();

        return points.sort(this.compareByDistanceFromVectors(width, vectors));
    }

    public sortByShortestVector(points: Array<Array<number>>, width: number){
        let shortestVectorLength: Array<number> = [];

        points.forEach( (arr, key) => {
            shortestVectorLength[key] = this.calculateVectorLength(key, arr[0], width);
        })
    }

    private compareByDistanceFromPoint(p: number, width: number) {
        return function (a: number, b: number) {

            let pY = Math.floor(p / width);
            let pX = p - (pY * width);
            let aY = Math.floor(a / width);
            let aX = a - (aY * width);
            let bY = Math.floor(b / width);
            let bX = b - (bY * width);

            let pToA = Math.sqrt(Math.pow(aX - pX, 2) + Math.pow(aY - pY, 2));
            let pToB = Math.sqrt(Math.pow(bX - pX, 2) + Math.pow(bY - pY, 2));

            if (pToA < pToB) {
                return -1;
            }
            else if (pToA > pToB) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }

    private compareByDistanceFromVectors(width: number, vectors: Array<Vector>){

        return function (a: number, b: number) {

            let aY = Math.floor(a / width);
            let aX = a - (aY * width);
            let bY = Math.floor(b / width);
            let bX = b - (bY * width);

            let distanceFromA = 0;
            let distanceFromB = 0;

            vectors.forEach( v => {
                let vToA = Math.sqrt(Math.pow(aX - v.getEndX(), 2) + Math.pow(aY - v.getEndY(), 2));
                let vToB = Math.sqrt(Math.pow(bX - v.getEndX(), 2) + Math.pow(bY - v.getEndY(), 2));

                if(distanceFromA == 0 || distanceFromA > vToA){
                    distanceFromA = vToA;
                }

                if (distanceFromB == 0 || distanceFromB > vToB) {
                    distanceFromB = vToB;
                }
            });

            if (distanceFromA < distanceFromB) {
                return -1;
            }
            else if (distanceFromA > distanceFromB) {
                return 1;
            }
            else {
                return 0;
            }
        }

    }

    private calculateVectorLength(pos1: number, pos2: number, width: number): number{

        let aY = Math.floor(pos1 / width);
        let aX = pos1 - (aY * width);
        let bY = Math.floor(pos2 / width);
        let bX = pos2 - (bY * width);

        return Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));
    }

}