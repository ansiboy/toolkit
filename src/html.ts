import { errors } from "./errors.js"

export class HTML {
    static addClassName(sourceClassName: string, addonClassName: string): string
    static addClassName(element: HTMLElement, addonClassName: string): string
    static addClassName(element: string | HTMLElement, addonClassName: string): string {
        if (element == null) throw errors.argumentNull('element')
        if (!addonClassName) throw errors.argumentNull('addonClassName')

        let sourceClassName: string
        if (typeof element == 'string')
            sourceClassName = element
        else
            sourceClassName = element.className

        sourceClassName = sourceClassName || ''
        console.assert(addonClassName != null)

        if (sourceClassName.indexOf(addonClassName) >= 0)
            return sourceClassName

        let className = `${sourceClassName} ${addonClassName}`
        if (typeof element != 'string')
            element.className = className

        return className
    }

    static removeClassName(sourceClassName: string, targetClassName: string): string
    static removeClassName(element: HTMLElement, targetClassName: string): string
    static removeClassName(element: string | HTMLElement, targetClassName: string): string {
        let sourceClassName: string
        if (typeof element == 'string')
            sourceClassName = element
        else
            sourceClassName = element.className || ''

        if (sourceClassName.indexOf(targetClassName) < 0)
            return sourceClassName

        sourceClassName = sourceClassName || ''
        sourceClassName = sourceClassName.replace(new RegExp(targetClassName, 'g'), '')
        sourceClassName = sourceClassName.trim()
        if (typeof element != 'string')
            element.className = sourceClassName

        return sourceClassName
    }

}