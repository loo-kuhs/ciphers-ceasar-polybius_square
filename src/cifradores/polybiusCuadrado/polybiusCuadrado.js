'use strict'

import * as utils from '@/cifradores/utils'

export const KEY = 'polybius-cuadrado'
export const NAME = 'Polybius Cuadrado'
export { default as ABOUT_TEMPLATE } from 'raw-loader!./polybiusCuadrado.md'
//export * from '@/cipher/ejemplos'

// Variables locales 

const __ENCODE_REGEX = /([a-zA-Z0-9]+)/gm
const __DECODE_REGEX = /^[1-6]{2}(\s[1-6]{2})*$/

// Argumentos por defecto

export const DEFAULTS = {
    isEncoding: true,
    inputStr: ''
}

// Codigo inicial
// Regresa el string codificado / decodificado basado en las reglas del cifrado
export function run (args) {
    let  { isEncoding, inputStr } = utils.parseCipherArgs(args, DEFAULTS)
    let output = []

    const alphanumeric = utils.ALPHANUMERIC
    const alphaGridSize = Math.sqrt(alphanumeric.length)
    inputStr = inputStr.trim()

    if (isEncoding && inputStr.match(__ENCODE_REGEX) === null) {
        return {
            isSuccess: false,
            outputStr: null,
            errorStr: `${NAME} requiere al menos una letra o algun numero. (Caracteres especiales se omitiran.)` 
        }
    }

    if (!isEncoding && __DECODE_REGEX.test(inputStr) === false) {
        return {
            isSuccess: false,
            outputStr: null,
            errorStr: `${NAME} requiere una entrada de solo numeros 1-6, en pares, y separados por espacios. Por ejemplo: 15 46 11 31 34 26 15.`
        }
    }
    
    // Remueve todos los espacios de la cadena
    inputStr = inputStr.replace(/[\s]+/gi, '')

    // Si estamos codificando necesitamos ir letra por letra. PERO,
    // Si estamos decodificando necesitamos cada parra de numeros.
    const increment = (isEncoding) ? 1 : 2
    utils.forEachCharacter(inputStr, increment, (i, char) => {
        if (isEncoding) {
            // Busca el caracter  en el arreglo alfanumerico, y en base
            // a esa posicion calcula X y Y coordinadas en la tabla
            char = char.toLowerCase()
            if (char.match(/^[a-z0-9]$/)) {
                const letterPos = alphanumeric.indexOf(char.toString())
                const x = Math.floor(letterPos / alphaGridSize) + 1
                const y = (letterPos % alphaGridSize) + 1
                output.push(`${x}${y}`)
            }
        } else {
            // Obtiene X y Y, y los "caracteres" ej. 13 => x: 1, y: 3
            const x = parseInt(char, 10) - 1
            const y = parseInt(inputStr.charAt(i + 1), 10) - 1
            const charIndex = (x * alphaGridSize) + y
            output.push(alphanumeric[charIndex])
        }
    })

    output = (isEncoding) ? output.join(' ') : output.join('')

    return {
        isSuccess: true,
        outputStr: output,
        errorStr: null
    }
}
