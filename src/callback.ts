export class Callback<Args> {
    private funcs = new Array<(...args: Array<any>) => void>();

    constructor() {
    }

    add(func: (args: Args) => any) {
        this.funcs.push(func);
    }
    remove(func: (args: Args) => any) {
        this.funcs = this.funcs.filter(o => o != func);
    }
    fire(args: Args) {
        this.funcs.forEach(o => o(args));
    }

    static create<Args = any>() {
        return new Callback<Args>();
    }
}
