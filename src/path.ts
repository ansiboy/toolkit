/** 连接多个路径 */
export function pathContact(...paths: string[]) {

    paths = paths || [];

    if (paths.length == 0)
        return "";

    if (paths.length == 1) {
        return paths[0]
    }

    let str = paths.join("");
    // 将一个或多个的 / 变为一个 /，例如：/shop/test// 转换为 /shop/test/
    str = str.replace(/\/+/g, '/');

    return str;
}