'use strict'

import * as utils from '@/cifradores/utils'

export const KEY = 'caesar'
export const NAME = 'Caesar'
//export { default as ABOUT_TEMPLATE } from 'raw-loader!./caesar.md'
//export * from '@/cifradores/ejemplos'

// Argumentos por defecto
export const DEFAULTS = {
    isEncoding: true,
    inputStr: '',
    inputs: {
        shift: 0
    }
}

// Entradas de ejemplo
export const SAMPLE_INPUTS = {
    shift: 3
}

// Entradas
export const INPUTS = [
    {
        type: 'number',
        name: 'shift',
        label: 'Rotar',
        value: SAMPLE_INPUTS.shift
    }
]

export const INPUTS_BY_NAME = INPUTS.reduce((obj, input) => {
    obj[input.name] = input
    return obj
}, {})

// Ejecucion principal
// Retorna la cada codificada/decodificada basada en las reglas del encriptado
export function run (args) {
    let { 
        isEncoding, 
        inputStr, 
        inputs } = utils.parseCipherArgs(args, DEFAULTS)

    if (inputStr.match(/([a-zA-Z0-9\u00C0-\u00FF]+)/gm) === null) {
        return {
            isSuccess: false,
            outputStr: null,
            errorStr: `${NAME} requiere una entrada con al menos una letra o numero.`
        }
    }

    let output = ''

    const alpha = utils.ALFANUM
    const shift = utils.makeValidInt(inputs.shift, DEFAULTS.inputs.shift)

    utils.forEachCharacter(inputStr, (i, char, isUpper) => {
        if (utils.isLetter(char)){
            // La posicion actual de la letra en el alfabeto
            const letterPos = alpha.indexOf(char.toLowerCase())

            // Direccion de la rotacion (positiva/nevativa)
            const direction = (isEncoding) ? 1 : -1

            // Obtiene la nueva letra por la rotacion dada por la direccion
            let newLetterPos = letterPos + (direction * shift)

            // Modifica la nueva posición en caso de que hayamos superado los límites del alfabeto
            newLetterPos = utils.mod(newLetterPos, utils.TOTAL_ALPHA)

            char = utils.setCase(alpha[newLetterPos], isUpper)
        }

        output += char
        console.log(output);
    })

    return {
        isSuccess: true,
        outputStr: output,
        errorStr: null
    }

    
}