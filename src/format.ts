export function formatDate(date: Date | string, showHourMinutes?: boolean, showSeconds?: boolean): string {
    if (typeof date == "string")
        return date;

    let d = date;
    if (showHourMinutes) {
        let str = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
        if (showSeconds)
            str = `${str}:${d.getSeconds()}`;

        return str;
    }

    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function formatString(pattern: string, ...args: string[]) {
    let a = pattern;
    for (let k in args) {
        a = a.replace("{" + k + "}", args[k])
    }

    return a;
}