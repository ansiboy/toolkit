import { errors } from "./errors.js";

/** 连接多个路径 */
export function pathConcat(path: string, ...otherPaths: string[]) {

    let prefix = "";
    if (path.startsWith("http://"))
        prefix = "http://";
    else if (path.startsWith("https://"))
        prefix = "https://";

    path = path.substring(prefix.length);
    for (let i = 0; i < otherPaths.length; i++) {
        path = partConcat2(path, otherPaths[i]);
    }

    path = prefix + path;
    return path;
}

export function partConcat2(path1: string, path2: string) {

    if (path1.startsWith("http://") || path1.startsWith("https://"))
        throw errors.pathStartsHttp(path1);

    if (path2.startsWith("http://") || path2.startsWith("https://"))
        throw errors.pathStartsHttp(path2);

    path1 = path1.replace(/(\/+\\*|\\+\/*)/g, '/');
    path2 = path2.replace(/(\/+\\*|\\+\/*)/g, '/');

    let arr1 = path1.split('/').filter(o => o);
    let arr2 = path2.split('/').filter(o => o);

    if (path1[0] == "/") {
        arr1.unshift("")
    }




    while (arr2[0] == "." || arr2[0] == "..") {
        if (arr2[0] == ".." && arr1.length > 0 && arr1[arr1.length - 1] != "") {
            arr1.pop();
        }

        arr2.shift();
    }

    if (arr1.length == 1 && arr1[0] == "" && arr2.length == 0) {
        return "/";
    }

    let path = [...arr1, ...arr2].join("/");
    return path;
}
