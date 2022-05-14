import { ValueStore } from "./value-store.js";

export class SingleInvoke<T> {

    private func: () => Promise<any>;
    private result = new ValueStore<T>(undefined);
    private error = new ValueStore<T>(undefined);
    private executing: boolean = false;

    constructor(func: () => Promise<T>) {
        this.func = func;
    }

    clear() {
        this.result = new ValueStore<T>(undefined);
        this.error = new ValueStore<T>(undefined);
    }

    execute(): Promise<T> {
        if (this.result.value !== undefined) {
            return Promise.resolve(this.result.value);
        }

        if (this.executing) {
            return new Promise((resolve, reject) => {
                this.result.add(value => {
                    resolve(value);
                })
                this.error.add(err => {
                    reject(err);
                })
            })
        }

        this.executing = true;
        return new Promise((resolve, reject) => {
            this.func().then(r => {
                this.result.value = r || null;
                this.executing = false;
                resolve(r);

            }).catch(err => {
                this.error = err;
                this.executing = false;
                reject(err);
            });
        })
    }

}