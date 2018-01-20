export class SortingService{

    compare(p: number, width: number) {
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

    public sortByClosestPoints(originalPoints: Array<number>, width: number): Array<number> {
        let points = originalPoints.slice();
        let startPoint = points.shift();
        let sortedPoints: Array<number> = [startPoint];
        while (points.length > 1) {
            points.sort(this.compare(startPoint, width));
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

        return points.sort(this.compare(startPoint, width));
    }

}