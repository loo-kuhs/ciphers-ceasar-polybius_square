'use strict'

export const ALPHA = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

export const ALPHAMAYUS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
export const ALPHANUMERIC = [].concat(ALPHA, NUMBERS, ALPHAMAYUS)
const TOTAL_ALPHA = ALPHA.length

// ALPHAGRID --> Una cuadrícula de 6 x 6 del alfabeto y los números del 0 al 9

export const ALPHAGRID = (() => {
    // Necesitamos crear una cuadricula de 6x6 de los caracteres alfanumericos
    const GRID_SIZE = 8
    let grid = new Array(GRID_SIZE)

    // Indice actual del arreglo alfanumerico
    let index = 0

    // A debe estar en la pos 1,1 NO 0,0
    for (let i = 1; i <= GRID_SIZE; i += 1) {
        grid[i] = new Array(GRID_SIZE)

        for (let j = 1; j <= GRID_SIZE; j += 1) {
            grid[i][j] = ALPHANUMERIC[index]
            index += 1
        }
    }

    return grid
})()

// MOD [Una solucion para los problemas de JS con los residuos negativos]
export function mod (a, b) {
    return ((a % b) + b) % b
}

// esLetra
// Revisa si el string tiene solo letras
export function isLetter (str) {
    if (typeof str !== 'string') {
        return false
    }

    const matches = str.match(/^[A-Za-z]$/)
    return (matches) ? matches > 0 : false
}

// setCase (char:chart, toUpper:boolean)
// Revisa si el caracterr debe ser mayuscula
export function setCase (char, toUpper) {
    if (typeof char !== 'string') {
        return char
    }
    return (toUpper) ? char.toUpperCase() : char.toLowerCase()
}

// forEachCharacter (string:string, (increment:int) cb:function)
//  el incremento es opcional
// Recorre un string determinado y llama a la funcion con el
// indice actual, la letra, y si esa letra es mayuscula
export function forEachCharacter (string, increment, cb) {
    // Si no se pasa el incremento, el valor predeterminado es 1
    if (typeof increment === 'function') {
        cb = increment
        increment = 1
    }

    // Una llamada de regreso es requerida
    if (typeof cb !== 'function') {
        return
    }

    for (let i = 0; i < string.length; i += increment) {
        const c = string.charAt(i)
        const isUpper = c.match(/^[A-Z]$/) !== null
        cb(i, c, isUpper)
    }
}

export function makeValidKey (string, defaultKey, mode){
    if (typeof string !== 'string') {
        return (typeof defaultKey === 'string') ? defaultKey : null
    }
}
// parseCipherArgs
// Convierte usando los argumentos del cifrado
export function parseCipherArgs (args, defaults) {
    defaults = Object.assign({}, { 
        isEncoding: true,
        inputStr: '', 
        inputs: {} }, defaults)
    
    let isEncoding = (args && typeof args.isEncoding === 'boolean') 
        ? args.isEncoding
        : defaults.isEncoding
    let inputStr = (args && typeof args.inputStr === 'string')
        ? args.inputStr
        : defaults.inputStr
    let inputs = {}
    if (args && typeof args.inputs === 'object' && args.inputs !== null) {
        inputs = args.inputs
    }

    if (typeof defaults.inputs === 'object' && defaults.inputs !== null) {
        inputs = Object.assign({}, defaults.inputs, inputs)
    }

    return { isEncoding, inputStr, inputs }
}

export function flattenCipherInputs (inputsObj) {
    return inputsObj.reduce((pairs, input) => {
        pairs[input.name] = input.value
        return pairs
    }, {})
}

