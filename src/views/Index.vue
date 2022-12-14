<template>
  <div class="index">
    <header class="content-frame">
      <h1 class="site-title">Cifrador</h1>
    </header>

    <main
      class="index__main content-frame"
      :inert="(isModalVisible) ? 'true' : 'false'">

      <fixed-header>
        <form class="input-form" @submit.prevent>
          <div class="input-form__settings">
            <button
              role="switch"
              class="toggle"
              :class=[toggleClass]
              :aria-checked="toggleAriaChecked"
              v-on:click="handleToggleSubmit">
              <!-- codificar label -->
              <span class="toggle__text toggle__text--encode">codifica</span>
              <!-- switch -->
              <span class="toggle__symbol"></span>
              <!-- decodificar label -->
              <span class="toggle__text toggle__text--decode">decodifica</span>
            </button>
          </div>

          <!-- Entrada textarea -->
          <textarea
            class="input-form__textarea"
            :aria-label="textareaLabel"
            :placeholder="textareaPlaceholder"
            v-model="inputStr">
          </textarea>
        </form>
      </fixed-header>

      <!-- Lista de los cifradores y sus salidas -->
      <section
        class="ciphers"
        aria-label="Cipher Results">
        <Cipher
          v-for="(cipherKey, index) in cipherKeys"
          :key="cipherKey"
          :cipher-key="cipherKey"
          @copy-success="handleCopySuccess"
          @copy-error="handleCopyError"
          :aria-posinset="index + 1"
          :aria-setsize="cipherKeys.length" />
      </section>

     
      <transition name="toast-transition-up-" mode="out-in">
        <div
          role="alert"
          class="toast"
          v-show="toast.isVisible">
          {{ toast.message }}
        </div>
      </transition>
    </main>

    <!-- man footer -->
    <footer>
      <a
        class="unicorn__link"
        title="Creator website"
        href="https://test-aboutlucas.web.app/"
        target="_blank"
        rel="noopener">
        <img alt="" src="../assets/man.svg" />
      </a>
    </footer>

    <!-- Nested views -- Modal content -->
    <transition name="modal-transition-up-" mode="out-in" appear>
      <router-view
        role="dialog"
        aria-modal="true"
        :key="$route.path">
      </router-view>
    </transition>
  </div>
</template>

<script>
import FixedHeader from 'vue-fixed-header'

import { CIPHER_KEYS } from '@/cifradores'
import Cipher from '@/components/Cipher.vue'

export default {
  name: 'index',
  components: { FixedHeader, Cipher },
  data () {
    return {
      cipherKeys: CIPHER_KEYS,
      toast: {
        isVisible: false,
        timeout: null,
        message: null
      }
    }
  },
  computed: {
    inputStr: {
      get () {
        return this.$store.state.inputStr
      },
      set (inputStr) {
        this.$store.commit('setInputStr', inputStr)
      }
    },
    isEncoding: {
      get () {
        return this.$store.state.isEncoding
      },
      set (isEncoding) {
        this.$store.commit('setIsEncoding', isEncoding)
      }
    },
    isModalVisible () {
      return this.$store.state.isModalVisible
    },
    selectedState () {
      return (this.isEncoding) ? 'encode' : 'decode'
    },
    toggleClass () {
      return `toggle--${this.selectedState}`
    },
    textareaPlaceholder () {
      return `Ingresa texto para ${this.selectedState}...`
    },
    textareaLabel () {
      return `Source text to ${this.selectedState}`
    },
    toggleAriaChecked () {
      return this.isEncoding.toString()
    }
  },
  methods: {
    renderToast (type, res) {
      if (this.toast.timeout !== null) {
        window.clearTimeout(this.toast.timeout)
      }

      let message = ''
      if (type === 'copy:success') {
        message = `Texto de ${res.cipher.NAME} copiado al portapapeles`
      } else if (type === 'copy:error') {
        message = `Error copiandio el texto de ${res.cipher.NAME} `
      }

      this.toast.isVisible = true
      this.toast.message = message

      this.toast.timeout = window.setTimeout(() => {
        this.toast.isVisible = false
        this.toast.timeout = null
      }, 3000)
    },
    handleCopySuccess (cipher) {
      this.renderToast('copy:success', { cipher })
    },
    handleCopyError (cipher) {
      this.renderToast('copy:error', { cipher })
    },
    handleToggleSubmit (e) {
      this.isEncoding = !this.isEncoding
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/_variables';

.index {
  &__main {
    display: flex;
    flex-flow: column nowrap;
  }

  .input-form {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    overflow: hidden;
    margin: 0 0 3.2em;

    box-shadow: 0px 0px 3.2em $color__blue--darker--faded;
    border-radius: 1.6em;
    transition: margin 300ms ease;

    &.vue-fixed-header--isFixed {
      position: fixed;
      z-index: 1;
      top: 0;
    }

    &__textarea {
      border: 0;
      resize: none;
      height: 8.0em;
      padding: 1.0em;
      border: 0.4em solid $color__white;
      font: normal normal 1.8em/1.2 'Signika', Arial, sans-serif;
      color: $color__text;
      transition: border 300ms cubic-bezier(0.65, 0.05, 0.36, 1);

      &:focus {
        outline: none !important;
        border: 0.4em solid $color__yellow;
      }
    }

    &__settings {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 4.8em;
      background: $color__pink;
    }
  }

  .toggle {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    border: 0;
    background: transparent;
    padding: 0;
    margin: 0;
    font: normal normal 1em/1.2 'Signika', Arial, sans-serif;
    cursor: pointer;

    &__text {
      font-size: 1.6em;
      transition: all 300ms ease;

      &--encode {
        color: $color__toggle--encode;
      }

      &--decode {
        color: $color__toggle--decode;
      }
    }

    &__symbol {
      display: flex;
      position: relative;
      flex-flow: row nowrap;
      align-items: center;
      width: 3.2em;
      height: 0.4em;
      margin: 0 0.8em;
      border-radius: 0.4em;
      background-image: linear-gradient(90deg, $color__toggle--encode 0%, $color__toggle--decode 100%);

      &::after {
        content: '';
        display: block;
        position: absolute;
        width: 1.6em;
        height: 1.6em;
        border-radius: 50%;
        transition: all 300ms ease;
      }
    }

    &.toggle--encode .toggle__symbol::after {
      left: 0;
      background-color: $color__toggle--encode;
    }

    &.toggle--decode .toggle__symbol::after {
      left: 1.6em;
      background-color: $color__toggle--decode;
    }

    &.toggle--encode:hover .toggle__text--decode,
    &.toggle--decode:hover .toggle__text--encode {
      opacity: 1;
      text-shadow: 0 0 0.2em rgba($color__blue--darker, 0.3);
    }
  }

  .toast {
    display: flex;
    position: fixed;
    align-self: center;
    bottom: 1.6em;
    margin: 0 auto;
    padding: 0.8em 1.6em;
    font-size: 1.4em;
    background-color: $color__blue--darker;
    color: $color__white;
    border-radius: 2em;
    box-shadow: 0px 0px 16px $color__blue--darker--faded;
    transition: all 300ms cubic-bezier(0.65, 0.05, 0.36, 1);
    opacity: 1;
  }

  .toast-transition-up--enter-active,
  .toast-transition-up--leave-active {
    transition: all 300ms ease;
  }

  .toast-transition-up--enter,
  .toast-transition-up--leave-to {
    bottom: -6.0em;
    opacity: 0;
  }

  .modal-transition-up--enter-active,
  .modal-transition-up--leave-active {
    display: flex;
    transition: top 300ms ease;
    box-shadow: 0 -10em 10em white;

    .modal__header {
      position: absolute;
    }
  }

  .modal-transition-up--enter,
  .modal-transition-up--leave-to {
    top: 100%;
  }
}
</style>