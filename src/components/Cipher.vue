<template>
  <article
    class="cipher-module"
    :class="[
      cipherClass,
      {'cipher-module--has-error': !cipherResults.isSuccess},
      (isEncoding) ? 'cipher-module--encoded' : 'cipher-module--decoded'
    ]"
    :aria-label="cipherAriaLabel">

    <div class="cipher-module__header">
      <h2>
        <router-link
          :to="{ name: 'aboutCipher', params: { cipherKey } }"
          :title="cipherLinkTitle">
          {{cipher.NAME}}
        </router-link>
      </h2>

      <div class="cipher-module__inputs" v-if="cipherHasInputs">
        <div
          class="cipher-module__input"
          v-for="(input, index) in cipherInputs"
          :key="index">
          <!-- Input label -->
          <label :for="`${cipherClass}__input--${index}`">{{input.label}}</label>

          <!-- Entradas soportadas: text, number, and select -->
          <input
            v-if="input.type === 'text' || input.type === 'number'"
            :id="`${cipherClass}__input--${index}`"
            :type="input.type"
            :placeholder="input.placeholder"
            v-model="input.value"
            @input="handleInputChange(input, $event)"
            @blur="handleInputBlur(input, $event)" />

          <select
            v-if="input.type === 'select'"
            :id="`${cipherClass}__input--${index}`"
            v-model="input.value"
            @input="handleInputChange(input, $event)"
            @blur="handleInputBlur(input, $event)">
            <option
              v-for="(option, index) in input.options"
              :key="index"
              :value="option">
              {{ option }}
            </option>
          </select>

        </div>
      </div>
    </div>

    <transition name="notice-transition-fade-" mode="out-in">
      <div class="cipher-module__notice" v-if="keyNotice.isVisible">
        Made key all lowercase letters with no duplicates
      </div>
    </transition>

    <!-- Salida del cifrador -->
    <div class="cipher-module__output">
      <!-- Usa textarea para no necesitar \r\n to <br /> -->
      <textarea
        class="cipher-module__textarea"
        :aria-label="textareaLabel"
        selectedState
        v-model="outputStr"
        readonly>
      </textarea>

      <div class="cipher-module__actions">
        <!-- Cambia entrada y salida del cifrador. -->
        <button
          class="cipher-module__actions__item cipher-module__reverse"
          type="button"
          :title="reverseBtnLabel"
          :aria-label="reverseBtnLabel"
          v-on:click="handleReverseSubmit">
        </button>

        <!-- Copiar el texto de salida -->
        <button
          class="cipher-module__actions__item cipher-module__copy"
          type="button"
          :title="copyBtnLabel"
          :aria-label="copyBtnLabel"
          v-clipboard:copy="outputStr"
          v-clipboard:success="handleCopySuccess"
          v-clipboard:error="handleCopyError">
        </button>
      </div>
    </div>
  </article>
</template>

<script>
import * as utils from '@/cifradores/utils'
import { getCipherByKey } from '@/cifradores'

export default {
  name: 'Cipher',
  props: {
    cipherKey: String
  },
  data () {
    let cipher = getCipherByKey(this.cipherKey)
    const cipherHasInputs = (
      typeof cipher.INPUTS !== 'undefined' &&
      cipher.INPUTS !== null &&
      Array.isArray(cipher.INPUTS)
    )
    return {
      cipher,
      cipherHasInputs,
      cipherClass: `cipher-module--${cipher.KEY}`,
      cipherInputs: (cipherHasInputs) ? cipher.INPUTS : null,
      cipherInputDefaults: (cipherHasInputs) ? cipher.DEFAULTS.inputs : null,
      cipherAriaLabel: `${cipher.NAME} Output`,
      cipherLinkTitle: `Acerca de ${cipher.NAME}`,
      copyBtnLabel: `Copiar salida de ${cipher.NAME}`,
      reverseBtnLabel: `Revertir salida de ${cipher.NAME}`,
      textareaLabel: `${cipher.NAME} output`,
      keyNotice: {
        isVisible: false,
        timeout: null
      },
      $inputTextarea: null,
      $outputTextarea: null
    }
  },
  mounted () {
    this.$inputTextarea = document.querySelector('.input-form__textarea')
    this.$outputTextarea = this.$el.querySelector('.cipher-module__textarea')
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setInputStr') {
        this.setTextareaScrollPos()
      }
    })
  },
  computed: {
    isEncoding () {
      return this.$store.state.isEncoding
    },
    inputStr () {
      return this.$store.state.inputStr
    },
    inputValues () {
      if (!this.cipherHasInputs) {
        return null
      }
      return utils.flattenCipherInputs(this.cipherInputs)
    },
    cipherResults () {
      let results = this.cipher.run({
        isEncoding: this.isEncoding,
        inputStr: this.inputStr,
        inputs: this.inputValues
      })

      return results
    },
    outputStr () {
      return (this.cipherResults.isSuccess)
        ? this.cipherResults.outputStr
        : this.cipherResults.errorStr
    }
  },
  methods: {
    setTextareaScrollPos () {
      this.$outputTextarea.scrollTop = this.$inputTextarea.scrollTop
    },
    renderKeyNotice () {
      if (this.keyNotice.timeout !== null) {
        window.clearTimeout(this.keyNotice.timeout)
      }

      this.keyNotice.isVisible = true

      this.keyNotice.timeout = window.setTimeout(() => {
        this.keyNotice.isVisible = false
        this.keyNotice.timeout = null
      }, 3000)
    },
    handleInputChange (input, e) {
      if (input.forceToValidKey) {
        const origValue = e.target.value
        let valueAsKey = utils.makeValidKey(
          e.target.value,
          this.cipherInputDefaults[input.name],
          this.cipher.KEY
        )

        if (origValue !== valueAsKey) {
          this.renderKeyNotice()
        }

        input.value = valueAsKey
      }
    },
    handleInputBlur (input, e) {
      const newVal = e.target.value

      if (
        typeof newVal === 'undefined' ||
        newVal === null ||
        newVal.length === 0 ||
        (input.validate && !input.validate(newVal))
      ) {
        input.value = `${this.cipherInputDefaults[input.name]}`
      }
    },
    handleReverseSubmit () {
      this.$store.commit('setInputStr', this.outputStr)
      this.$store.commit('toggleIsEncoding')
    },
    handleCopySuccess () {
      this.$emit('copy-success', this.cipher)
    },
    handleCopyError () {
      this.$emit('copy-error', this.cipher)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/css/_variables';
@import '~@/assets/fonts/babelstonepigpen/font';

.cipher-module {
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  margin: 3.2em 0;

  &__header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8em;
  }

  &__inputs {
    display: flex;
    flex-flow: row nowrap;
  }

  &__input {
    margin-left: 0.8em;
    font-size: 1.4em;

    label {
      margin-right: 0.4em;
      text-transform: lowercase;
    }

    input,
    select {
      height: 2.0em;
      border: 0;
      padding: 0.1em 0.2em;
      font: normal normal 1.0em/1.2 'Signika', Arial, sans-serif;
      border-radius: 0.6em;
      border: 0.2em solid $color__yellow;
      background-color: $color__yellow;
      text-align: left;

      &:focus {
        outline: none !important;
        border: 0.2em solid $color__yellow--darker;
      }
    }

    input[type="number"],
    select {
      width: 3.5em;
    }

    input[type="text"] {
      width: 6.0em;
    }
  }

  &__notice {
    display: block;
    text-align: right;
    font-size: 1.2em;
    color: $color__purple;
    margin-bottom: 0.8em;
    height: auto;
  }

  .notice-transition-fade--enter-active,
  .notice-transition-fade--leave-active {
    transition: all 300ms ease;
  }

  .notice-transition-fade--enter,
  .notice-transition-fade--leave-to {
    opacity: 0;
    height: 0;
  }

  &__output {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-around;
    overflow: hidden;
    padding: 1em 1em 1em 0.4em;
    border: 0;
    border-radius: 0 2em 2em 2em;
    background-color: $color__gray;
  }

  &__textarea {
    border: 0;
    padding: 0.4em;
    resize: none;
    cursor: text;
    height: 7.2em; // (padding * 2)  - 8.0em height
    width: calc(100% - 1.8em);
    font: normal normal 1.8em/1.2 'Signika', Arial, sans-serif;
    color: $color__text;
    background: transparent;
  }

  &__actions {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    &__item {
      margin: 1em 0;
    }
  }

  &__copy {
    display: flex;
    flex-flow: column nowrap;
    position: relative;
    background: transparent;
    border: 0;
    padding: 0;
    width: 1.4em;
    height: 1.4em;
    cursor: pointer;

    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border: 0.2em solid $color__blue--vibrant;
      border-radius: 0.2em;
      background-color: $color__gray;
      transition: all 150ms ease;
    }

    &::before {
      top: -0.4em;
      right: -0.4em;
    }

    &::after {
      box-shadow: 0.2em -0.2em 0 $color__gray;
    }

    &:hover {
      opacity: 0.8;

      &::after {
        background-color: $color__yellow;
      }
    }

    &:focus {
      &::before,
      &::after {
        border-color: $color__blue--darker;
        background-color: $color__yellow--darker;
        box-shadow: 0 0 0 transparent;
        top: 0;
        right: 0;
      }
    }
  }

  &__reverse {
    display: flex;
    flex-flow: row nowrap;
    position: relative;
    background: transparent;
    border: 0;
    padding: 0;
    width: 0.6em;
    height: 1.4em;
    cursor: pointer;
    margin-left: 0.4em;
    border-left: 0.2em solid $color__link;
    border-right: 0.2em solid $color__link;
    transition: all 150ms ease;

    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 0.2em;
      height: 0.8em;
      background: $color__link;
      border-radius: 0.1em;
      transform: rotate(-30deg);
      transition: all 150ms ease;
    }

    &::before {
      bottom: 0;
      left: -0.2em;
      transform-origin: bottom right;
    }

    &::after {
      top: 0;
      right: -0.2em;
      transform-origin: top left;
    }

    .cipher-module--encoded &:hover,
    .cipher-module--encoded &:focus {
      border-left-color: $color__purple;
      border-right-color: $color__plum;

      &::before {
        background: $color__purple;
      }

      &::after {
        background: $color__plum;
      }
    }

    .cipher-module--decoded &:hover,
    .cipher-module--decoded &:focus {
      border-left-color: $color__plum;
      border-right-color: $color__purple;

      &::before {
        background: $color__plum;
      }

      &::after {
        background: $color__purple;
      }
    }
  }

  &--has-error {
    .cipher-module__actions {
      display: none;
    }
    .cipher-module__output {
      opacity: 0.5;
    }
  }

  // blegh -- classes on classes on calsses
  &.cipher-module--encoded.cipher-module--masonic:not(&--has-error) &__textarea {
    font-family: "Masonic", "Signika", Arial, sans-serif;
  }
}
</style>