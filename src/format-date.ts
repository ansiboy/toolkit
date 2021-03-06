export function formatDate(date: Date | string, showHourMinutes?: boolean): string {
    if (typeof date == "string")
        return date;

    let d = date;
    if (showHourMinutes)
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours() + 1}:${d.getMinutes()}`;

    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}