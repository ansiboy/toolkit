import less = require("lessjs");
import { Errors, errors } from "./errors";



interface Options {
    wrapperClassName?: string, name?: string, baseUrl?: string
}

export class Less {

    private static pathname(url: string) {
        let el = document.createElement('a');
        el.href = url;
        return el.pathname;
    }

    static async load(url: string, options?: Options) {

        options = options || {};
        let { wrapperClassName, name } = options;
        if (!options.baseUrl) {
            let { protocol, host } = location;
            let pathname = Less.pathname(url);
            console.assert(pathname[0] == "/");
            options.baseUrl = `${protocol}//${host}${pathname}`;
        }

        let res = await fetch(url);
        let text = await res.text();
        if (wrapperClassName) {
            text = `.${wrapperClassName} {${text}}`;
        }

        Less.renderByText(text, options);
    }

    static async renderByRequireJS(moduleName: string, options?: Options & { contextName?: string }) {
        let req: RequireJS;
        if (options.contextName) {
            req = requirejs({ context: options.contextName });
        }
        else {
            req = requirejs;
        }

        req([`text!${moduleName}`], function (str) {
            console.assert(str);
            Less.renderByText(str, options);
        })
    }

    static async renderByText(lessText: string, options?: Options) {

        if (!lessText) throw errors.argumentNull("lessText");
        if (typeof lessText != "string") throw errors.argumentTypeIncorrect("lessText", "string");

        options = options || {};
        if (options.baseUrl) {
            let extractUrlParts = less.FileManager.prototype.extractUrlParts;
            less.FileManager.prototype.extractUrlParts = function (url) {
                return extractUrlParts.apply(less, [url, options.baseUrl]);
            }
        }

        less.render(lessText, function (e: Error, result: { css: string }) {
            if (e) {
                console.error(e)
                return
            }

            let styleElement: HTMLStyleElement | null = null;
            if (name) {
                console.assert(document.head != null);
                let head = document.head;
                styleElement = head.querySelector(`style[data-name="${name}"]`);
            }

            if (styleElement == null) {
                styleElement = document.createElement('style');
                document.head.appendChild(styleElement);

                if (name)
                    styleElement.setAttribute("data-name", name);
            }

            styleElement.innerText = result.css
        });
    }

    static parse(lessText: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            less.render(lessText, function (e: Error, result: { css: string }) {
                if (e) {
                    reject(e);
                    return
                }

                resolve(result.css);
            });
        })
    }
}

