'use strict'

export const ALPHA = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

export const ALFANUM = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

export const ALPHAMAYUS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export const ALPHANUMERIC = [].concat(ALPHA, NUMBERS, ALPHAMAYUS)
export const TOTAL_ALPHA = ALFANUM.length

export const ALPHAMINUSNUM = [].concat(ALPHA, NUMBERS)
export const TOTAL_ALPHANUMERIC = ALPHAMINUSNUM.length

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

// isLetter
// Revisa si el string tiene solo letras
export function isLetter (str) {
    if (typeof str !== 'string') {
        return false
    }

    const matches = str.match(/^[a-zA-Z0-9\u00F1\u00D1]$/)
    return (matches) ? matches.length > 0 : false
}

// isNumber
// Revisa si hay numeros en la cadena
export function isNumber (num){
    if (typeof num !== 'number') {
        return false
    }

    const matches = num.match(/^[0-9]$/)
    return (matches) ? matches.length > 0 : false
}

// setCase (char:chart, toUpper:boolean)
// Revisa si el caracterr debe ser mayuscula
export function setCase (char, toUpper) {
    if (typeof char !== 'string') {
        return char
    }
    return (toUpper) ? char.toUpperCase() : char.toLowerCase()
}

// matchCase (char:char, charToMatch:char)
// Forza al caracter a ser compatible con el mayus dado de charToMatch
export function matchCase (char, charToMatch) {
    if (typeof char !== 'string') {
        return char
    }
    const isUpper = charToMatch.match(/^[A-Z\u00D1]$/) !== null
    return (isUpper) ? char.toUpperCase() : char.toLowerCase()
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
        const isUpper = c.match(/^[A-Z\u00D1]$/) !== null
        cb(i, c, isUpper)
    }
}

// Convierte la entrada dada a un valor entero valido
export function makeValidInt (currVal, defaultVal) {
    if (typeof currVal === 'number') {
        return currVal
    }

    if (typeof currVal === 'string' && currVal.length > 0) {
        let number = parseInt(currVal, 10)
        if (!isNaN(number)) {
            return number
        }
    }

    return defaultVal
}

export function makeValidKey (string, defaultKey, mode){
    if (typeof string !== 'string') {
        return (typeof defaultKey === 'string') ? defaultKey : null
    }

    let charsArray = string.replace(/[^A-Za-z]+/gi, '').toLowerCase().split('')

    return [...charsArray].join('')
}

let cachedKeyedAlphas = {}
export function makeKeyedAlpha (string, defaultKey, mode) {
  let key = makeValidKey(string, defaultKey, mode)
  let cacheKey = `${key}-${mode}`

  if (typeof cachedKeyedAlphas[cacheKey] !== 'undefined') {
    return cachedKeyedAlphas[cacheKey]
  }

  let alpha = [...ALPHA]

  // Return the regular alphabet if no key
  if (typeof key !== 'string' || key.length <= 0) {
    return alpha
  }

  let keyedAlphabet = [].concat(key.split('')).concat(alpha)

  // For Playfair: Replace any j's with i's in the key
  if (mode === 'playfair') {
    const jIndex = keyedAlphabet.indexOf('j')
    keyedAlphabet.splice(jIndex, 1)
  }

  let uniqueKeyedAlphabet = new Set(keyedAlphabet)
  let uniqueKeyedAlphabetArr = [...uniqueKeyedAlphabet]

  // Save this keyed alphabet
  cachedKeyedAlphas[cacheKey] = uniqueKeyedAlphabetArr
  return cachedKeyedAlphas[cacheKey]
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

