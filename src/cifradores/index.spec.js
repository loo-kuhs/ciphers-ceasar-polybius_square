'use strict'

import { assert } from 'chai'
import * as index from './index'

describe('ciphers:index', () => {
    let expectedCipherKeys = [
        'polybius-cuadrado'
    ]

    it ('debe tener claves de cifrado en cualquier orden', () => {
        assert.sameMembers(index.CIPHER_KEYS, expectedCipherKeys)
    })

    it('deberia ejecutar el cifrado para todas las llaves', () => {
        expectedCipherKeys.forEach((key) => {
            let foundCipher = index.getCipherByKey(key)
            assert.isFunction(foundCipher.run)
        })
    })
})