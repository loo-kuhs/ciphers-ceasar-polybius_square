import * as polybiusCuadrado from './polybiusCuadrado'

let cifradores = [
    polybiusCuadrado
]

let ciphersByKey = cifradores.reduce((obj, cipher) => {
    obj[cipher.KEY] = cipher
    return obj
}, {})

export const CIPHER_KEYS = Object.keys(ciphersByKey)
export function getCipherByKey (key) {
    return ciphersByKey[key.toLowerCase()]
}