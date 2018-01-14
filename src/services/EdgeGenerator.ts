import { Vector } from "../model/Vector";

export class EdgeGenerator{

    generateEdgesNet(points: Array<number>, connections: Array<number>, width: number, preEdges: Array<Vector>): Array<Vector>{
        let edges: Array<Vector> = [];
        let closestPixels: Array<Array<number>> = [];
        let pointsKeyMap: Map<number, number> = new Map<number, number>();
        let ctr = 0;
        let deletedClosestNr = 0;

        let connectionsCopy = connections.slice();
        points.forEach((p, key) => {
            closestPixels.push(connectionsCopy.sort(this.compare(p, width)).slice(1));
            pointsKeyMap.set(p, key);
        });

        while(closestPixels.length != deletedClosestNr){
            points.forEach(( p, key ) => {
                
                let closest = closestPixels[key].shift();

                let edge = new Vector(p, closest, width);

                if(preEdges.every(e => !this.isColliding(e, edge))){
                    edges.push( edge );
                    preEdges.push( edge );
                }

                if(closestPixels[key].length == 0){
                    delete closestPixels[key];
                    deletedClosestNr++;
                }
            });
        }

        return edges;
    }

    public generateVectorShape(points: Array<number>, width: number): Array<Vector>{
        let vectors: Array<Vector> = [];
        let pointsCopy = this.sortByClosestPoints(points, width);
        let firstPoint = pointsCopy.shift();
        let startPoint = firstPoint;

        pointsCopy.forEach( p => { 
            vectors.push( new Vector(startPoint, p, width));
            startPoint = p;
        });

        vectors.push( new Vector(pointsCopy[pointsCopy.length-1], firstPoint, width));

        return vectors;
    }

    compare(p: number, width: number) { 
        return function (a: number, b: number) {

            let pY = Math.floor( p / width );
            let pX = p - ( pY * width );
            let aY = Math.floor( a / width );
            let aX = a - ( aY * width );
            let bY = Math.floor( b / width );
            let bX = b - ( bY * width );

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

    public sortByClosestPoints(points: Array<number>, width: number): Array<number>{
        let startPoint = points.shift();
        let sortedPoints: Array<number> = [startPoint];
        while(points.length > 1){
            points.sort(this.compare(startPoint, width));
            sortedPoints.push(points.shift());
            
            let lastClosestPoint = points.shift();
            sortedPoints.push(lastClosestPoint);

            startPoint = lastClosestPoint;
        }

        while(points.length > 0){
            sortedPoints.push(points.shift());
        }

        return sortedPoints;
    }

    private turn(aX: number, aY: number, bX: number, bY: number, cX: number, cY: number): number{
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

      private trimVectorBy1(v: Vector): Vector{
        
        let vectorCopy: Vector = new Vector(v.getStartPosition(), v.getEndPosition(), v.getWidth());

        if( v.getStartX() > v.getEndX() ){
            vectorCopy.moveStartX(-1);
            vectorCopy.moveEndX(1);
        }else if( v.getStartX() < v.getEndX() ){
            vectorCopy.moveStartX(1);
            vectorCopy.moveEndX(-1);
        }

        if(v.getStartY() > v.getEndY()){  
            vectorCopy.moveStartY(-1);
            vectorCopy.moveEndY(1);
        }else if(v.getStartY() < v.getEndY()){  
            vectorCopy.moveStartY(1);
            vectorCopy.moveEndY(-1);
        }

      return vectorCopy;
    }

}