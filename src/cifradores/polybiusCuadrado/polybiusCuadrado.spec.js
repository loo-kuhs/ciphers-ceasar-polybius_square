'use strict'

import { assert } from 'chai'
import * as polybiusCuadrado from './polybiusCuadrado'

describe('cipher:polybiusCuadrado', () => {
    let testStrings = {
        normal: 'AbcdefghijklmnopqrstuvwxyZ - 0123456789 ',
        encoded: '11 12 13 14 15 16 21 22 23 24 25 26 31 32 33 34 35 36 41 42 43 44 45 46 51 52 53 54 55 56 61 62 63 64 65 66',
        decoded: 'abcdefghijklmnopqrstuvwxyz0123456789'
    }

    let testCases = [
        {
            label: 'should encode',
            args: {
                isEncoding: true,
                inputStr: testStrings.normal
            },
            expected: {
                isSuccess: true,
                outputStr: testStrings.encoded,
                errorStr: null
            }
        },
        {
            label: 'should decode',
            args: {
                isEncoding: false,
                inputStr: testStrings.encoded
            },
            expected: {
                isSuccess: true,
                outputStr: testStrings.decoded,
                errorStr: null
            }
        },
        {
            label: 'should show validation error on encode',
            args: {
                isEncoding: true,
                inputStr: '!@#'
            },
            expected: {
                isSuccess: false,
                outputStr: null,
                errorStr: 'Polybius Square requires an input with at least one letter or number. (Special characters will be omitted.)'
            }
          },
          {
            label: 'should show validation error on decode',
            args: {
                isEncoding: false,
                inputStr: '9A'
            },
            expected: {
                isSuccess: false,
                outputStr: null,
                errorStr: 'Polybius Square requires an input with using only numbers 1-6, in pairs, and separated by spaces. For example: 15 46 11 31 34 26 15.'
            }
        }
    ]
    testCases.forEach((testCase) => {
        it(testCase.label, () => {
            let results = polybiusCuadrado.run(testCase.args)
            assert.deepEqual(results, testCase.expected)
        })
    })

    it('should encode alphabet using defaults', () => {
        let noArgsResults = polybiusCuadrado.run()
        let defaultArgsResults = polybiusCuadrado.run(polybiusCuadrado.DEFAULTS)
        assert.deepEqual(noArgsResults, defaultArgsResults)
    })
})