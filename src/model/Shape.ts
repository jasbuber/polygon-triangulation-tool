import { Pixel } from "./Pixel";

export class Shape{
    
    border: Array<number>;

    content: Array<number>;

    constructor(border: Array<number>, content: Array<number>){
        this.border = border;
        this.content = content;
    }

    getBorder(): Array<number>{
        return this.border;
    }

    getContent(): Array<number>{
        return this.content;
    }
}