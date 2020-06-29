import { errors as baseErrors } from "./errors";
import { Callback } from "./callback";

let errors = Object.assign(baseErrors, {
    dataSourceCanntInsert() {
        return new Error("DataSource can not insert.");
    },
    dataSourceCanntDelete() {
        return new Error("DataSource can not delete.");
    },
    dataSourceCanntUpdate() {
        return new Error("DataSource can not update.");
    },
    primaryKeyNull(key: string) {
        let msg = `Primary key named '${key}' value is null.`;
        return new Error(msg);
    },
    queryResultTypeError() {
        let msg = `Query result type error.`;
        return new Error(msg);
    }
});

// namespace wuzhui {
export interface DataSourceSelectResult<T> {
    totalRowCount: number,
    dataItems: Array<T>
}

export interface DataSourceError extends Error {
    handled: boolean,
    method: DataMethod,
}

export type DataMethod = 'select' | 'update' | 'delete' | 'insert';
export class DataSource<T> {
    private args: DataSourceArguments<T>;
    primaryKeys: (keyof T)[];

    inserting = new Callback<{ sender: DataSource<T>, dataItem: T, index: number }>(); //callbacks1<DataSource<T>, T, number>();
    inserted = new Callback<{ sender: DataSource<T>, dataItem: T, index: number }>();

    deleting = new Callback<{ sender: DataSource<T>, dataItem: T }>(); //callbacks<DataSource<T>, T>();
    deleted = new Callback<{ sender: DataSource<T>, dataItem: T }>(); //callbacks<DataSource<T>, T>();
    updating = new Callback<{ sender: DataSource<T>, dataItem: T }>();
    updated = new Callback<{ sender: DataSource<T>, dataItem: T }>();
    selecting = new Callback<{ sender: DataSource<T>, selectArguments: DataSourceSelectArguments }>();;//callbacks<DataSource<T>, DataSourceSelectArguments>();
    selected = new Callback<{ sender: DataSource<T>, selectResult: DataSourceSelectResult<T>, selectArguments: DataSourceSelectArguments }>(); //callbacks<DataSource<T>, DataSourceSelectResult<T>>();
    error = new Callback<{ sender: DataSource<T>, error: DataSourceError }>();//callbacks<this, DataSourceError>();

    constructor(args: DataSourceArguments<T>) {
        this.args = args;
        this.primaryKeys = args.primaryKeys || [];
    }
    get canDelete() {
        return this.args.delete != null && this.primaryKeys.length > 0;
    }
    get canInsert() {
        return this.args.insert != null && this.primaryKeys.length > 0;
    }
    get canUpdate() {
        return this.args.update != null && this.primaryKeys.length > 0;
    }

    executeInsert(item: T, args?: any) {
        return this.args.insert(item, args);
    }
    executeDelete(item: T, args?: any) {
        return this.args.delete(item, args);
    }
    executeUpdate(item: T, args?: any) {
        return this.args.update(item, args);
    }
    executeSelect(args?: DataSourceSelectArguments) {
        args = args || {}
        return this.args.select(args);
    }

    insert(item: T)
    insert(item: T, index?: number)
    insert(item: T, args?: any, index?: number) {
        if (!this.canInsert)
            throw errors.dataSourceCanntInsert();

        if (!item)
            throw errors.argumentNull("item");

        if (typeof args == 'number') {
            index = args;
            args = null;
        }

        this.inserting.fire({ sender: this, dataItem: item, index });
        return this.executeInsert(item, args).then((data) => {
            Object.assign(item, data);
            this.inserted.fire({ sender: this, dataItem: item, index });
            return data;
        }).catch(exc => {
            this.processError(exc, 'insert');
            throw exc;
        });
    }
    delete(item: T, args?: any) {
        if (!this.canDelete)
            throw errors.dataSourceCanntDelete();

        if (!item)
            throw errors.argumentNull("item");

        this.checkPrimaryKeys(item);
        this.deleting.fire({ sender: this, dataItem: item });
        return this.executeDelete(item, args).then((data) => {
            this.deleted.fire({ sender: this, dataItem: item });
            return data;
        }).catch(exc => {
            this.processError(exc, 'delete');
            throw exc;
        });
    }
    update(item: T, args?: any) {
        if (!this.canUpdate)
            throw errors.dataSourceCanntUpdate();

        if (!item)
            throw errors.argumentNull("item");

        this.checkPrimaryKeys(item);
        this.updating.fire({ sender: this, dataItem: item });
        return this.executeUpdate(item, args).then((data) => {
            Object.assign(item, data);
            this.updated.fire({ sender: this, dataItem: item });
            return data;
        }).catch((exc: DataSourceError) => {
            this.processError(exc, 'update');
            throw exc;
        });
    }
    isSameItem(theItem: T, otherItem: T) {
        if (theItem == null)
            throw errors.argumentNull('theItem');

        if (otherItem == null)
            throw errors.argumentNull('otherItem');

        if (this.primaryKeys.length == 0)
            return theItem == otherItem;

        this.checkPrimaryKeys(theItem);
        this.checkPrimaryKeys(otherItem);

        for (let pk of this.primaryKeys) {
            if (theItem[pk] != otherItem[pk])
                return false;
        }

        return true;
    }
    private checkPrimaryKeys(item: Partial<T>) {
        for (let key in item) {
            if (item[key] == null && this.primaryKeys.indexOf(key) >= 0)
                throw errors.primaryKeyNull(key);
        }
    }
    select(args?: DataSourceSelectArguments): Promise<DataSourceSelectResult<T>> {
        args = args || {};
        // fireCallback(this.selecting, this, args);
        this.selecting.fire({ sender: this, selectArguments: args });
        return this.executeSelect(args).then((data) => {
            let dataItems: Array<T>;
            let totalRowCount: number
            if (Array.isArray(data)) {
                dataItems = data;
                totalRowCount = data.length;
            }
            else if (data.dataItems !== undefined && data.totalRowCount !== undefined) {
                dataItems = (<DataSourceSelectResult<T>>data).dataItems;
                totalRowCount = (<DataSourceSelectResult<T>>data).totalRowCount;
            }
            else {
                throw errors.queryResultTypeError();
            }
            this.selected.fire({ sender: this, selectResult: { totalRowCount, dataItems }, selectArguments: args });
            return { totalRowCount, dataItems };
        }).catch(exc => {
            this.processError(exc, 'select');
            throw exc;
        });
    }

    private processError(exc: DataSourceError, method: DataMethod) {
        exc.method = method;
        this.error.fire({ sender: this, error: exc });
        if (!exc.handled)
            throw exc;
    }
}

export class DataSourceSelectArguments {
    startRowIndex?: number;
    maximumRows?: number;
    sortExpression?: string;
    filter?: string;

    constructor() {
        this.startRowIndex = 0;
        this.maximumRows = 2147483647;
    }
}

export type DataSourceArguments<T> = {
    primaryKeys?: (keyof T)[]
    select: ((args: DataSourceSelectArguments) => Promise<DataSourceSelectResult<T>>),
    insert?: ((item: T, args?: any) => Promise<any>),
    update?: ((item: T, args?: any) => Promise<any>),
    delete?: ((item: T, args?: any) => Promise<any>),
    sort?: (items: T[]) => T[],
};

