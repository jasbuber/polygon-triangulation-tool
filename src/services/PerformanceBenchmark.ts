export class PerformanceBenchmark {

    private counters: Map<string, number> = new Map<string, number>();

    public startCounter(name: string) {
        this.counters.set(name, window.performance.now());
    }

    public endCounter(name: string): number {
        let result = window.performance.now() - this.counters.get(name);
        this.counters.delete(name);
        console.log(name + " - " + result);
        return result;
    }

    public retrieveCounter(name: string): number {
        let result = this.counters.get(name);
        this.counters.delete(name);
        console.log(name + " - " + result);
        return result;
    }


    public silentlyEndCounter(name: string): number {
        let result = window.performance.now() - this.counters.get(name);
        this.counters.delete(name);
        return result;
    }

    public addToCounter(name: string, millis: number) {
        this.counters.set(name, this.counters.get(name) + millis);
    }

    public initializeCounter(name: string) {
        this.counters.set(name, 0);
    }
}