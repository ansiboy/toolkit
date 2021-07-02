import { errors } from "./errors";

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

    let arr1 = path1.split('/');
    let arr2 = path2.split('/');


    while (arr2[0] == "." || arr2[0] == "..") {
        if (arr2[0] == "..")
            arr1.pop();

        arr2.shift();
    }

    path1 = arr1.join('/');
    path2 = arr2.join('/');

    if (!path1)
        return path2;

    let path = path1 + '/' + path2;
    return path;
}
