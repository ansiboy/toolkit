export class Errors {
    argumentNull(argumentName: string) {
        let error = new Error(`Argument ${argumentName} cannt be null or emtpy.`);
        let name: keyof Errors = "argumentNull";
        error.name = name;
        return error;
    }
    routeDataFieldNull(fieldName: string): Error {
        let msg = `The ${fieldName} field of route data cannt be null.`;
        let error = new Error(msg);
        let name: keyof Errors = "routeDataFieldNull";
        error.name = name;
        return error;
    }
    argumentFieldNull(fieldName: string, argumentName: string): Error {
        let msg = `The ${fieldName} field of ${argumentName} cannt be null.`;
        let error = new Error(msg);
        let name: keyof Errors = "argumentFieldNull";
        error.name = name;
        return error;
    }
    argumentTypeIncorrect(argumentName: string, expectedType: string) {
        let msg = `Argument ${argumentName} type error, expected type is ${expectedType}.`;
        let error = new Error(msg);
        let name: keyof Errors = "argumentTypeIncorrect";
        error.name = name;
        return error;
    }
    queryResultTypeError() {
        let msg = 'Type of the query result is expected as Array or DataSourceSelectResult.';
        return new Error(msg);
    }
}

export let errors = new Errors();