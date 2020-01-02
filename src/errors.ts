export class Errors {
    argumentNull(argumentName: string) {
        let error = new Error(`Argument ${argumentName} cannt be null or emtpy.`);
        error.name = Errors.prototype.argumentNull.name;
        return error;
    }
    routeDataFieldNull(fieldName: string): Error {
        let msg = `The ${fieldName} field of route data cannt be null.`;
        let error = new Error(msg);
        error.name = Errors.prototype.routeDataFieldNull.name;
        return error;
    }
    argumentFieldNull(fieldName: string, argumentName: string): Error {
        let msg = `The ${fieldName} field of ${argumentName} cannt be null.`;
        let error = new Error(msg);
        error.name = Errors.prototype.argumentFieldNull.name;
        return error;
    }
}