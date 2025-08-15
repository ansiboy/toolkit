export function formatDate(date: Date | string, showHourMinutes?: boolean, showSeconds?: boolean): string {
    if (typeof date == "string")
        return date;

    let d = date;
    if (showHourMinutes) {
        let str = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
        if (showSeconds)
            str = `${str}:${d.getSeconds()}`;

        return str;
    }

    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function formatString(pattern: string, ...args: string[]) {
    let a = pattern;
    for (let k in args) {
        a = a.replace("{" + k + "}", args[k])
    }

    return a;
}

export function format(value: any, format?: string): string {//...args
    if (!format)
        return `${value}`;

    var result = '';

    for (var i = 0; ;) {
        var open = format.indexOf('{', i);
        var close = format.indexOf('}', i);
        if ((open < 0) && (close < 0)) {
            result += format.slice(i);
            break;
        }
        if ((close > 0) && ((close < open) || (open < 0))) {
            if (format.charAt(close + 1) !== '}') {
                throw new Error('Sys.Res.stringFormatBraceMismatch');
            }
            result += format.slice(i, close + 1);
            i = close + 2;
            continue;
        }

        result += format.slice(i, open);
        i = open + 1;

        if (format.charAt(i) === '{') {
            result += '{';
            i++;
            continue;
        }

        if (close < 0)
            throw new Error('Sys.Res.stringFormatBraceMismatch');


        var brace = format.substring(i, close);
        var argFormat = brace;
        if (typeof (value) === "undefined" || value === null) {
            value = '';
        }

        if (value instanceof Date) {
            result = result + formatDate1(value, argFormat);
        }
        else if (typeof value == "string" && datePattern.test(value)) {
            value = new Date(value);
            result = result + formatDate1(value, argFormat);
        }
        else if (value instanceof Number || typeof value == 'number') {
            result = result + formatNumber(value, argFormat);
        }
        else {
            result = result + value.toString();
        }

        i = close + 1;
    }

    return result;
}

const datePattern = /^\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}(\.\d\d\dZ)?$/;
function formatDate1(value: Date, format: string): string {
    let y = value.getFullYear()
    let m = value.getMonth() + 1
    let d = value.getDate()
    let h = value.getHours()
    let M = value.getMinutes()
    let s = value.getSeconds()

    let twoDigit = function (value: number): string {
        const TEN = 10
        if (value < TEN)
            return `0` + value

        return value.toString()
    }

    switch (format) {
        case 'd':
            return `${y}-${m}-${d}`;
        case 'g':
            return `${y}-${m}-${d} ${h}:${M}`;
        case 'gg':
            return `${y}-${twoDigit(m)}-${twoDigit(d)} ${twoDigit(h)}:${twoDigit(M)}`;
        case 'G':
            return `${y}-${m}-${d} ${h}:${M}:${s}`;
        case 'GG':
            return `${y}-${twoDigit(m)}-${twoDigit(d)} ${twoDigit(h)}:${twoDigit(M)}:${twoDigit(s)}`;
        case 't':
            return `${h}:${M}`;
        case 'T':
            return `${h}:${M}:${s}`;
    }

    return value.toString();
}

function formatNumber(value: Number, format: string): string {
    let reg = new RegExp('^C[0-9]+');
    if (reg.test(format)) {
        let num: any = format.substr(1);
        return value.toFixed(num);
    }
    return value.toString();
}