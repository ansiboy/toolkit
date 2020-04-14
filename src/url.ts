export function parseUrl(url: string) {
    let i = url.indexOf("?");
    if (i < 0)
        return {};

    let query = url.substr(i + 1);
    return pareeUrlQuery(query);
}

function pareeUrlQuery(query: string) {
    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s: string) {
            return decodeURIComponent(s.replace(pl, " "));
        };

    let urlParams: { [key: string]: string } = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

    return urlParams;
}