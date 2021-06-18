import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let inputSamples = [
    `Lucas was here.\r\n🧟‍♀️📠👩🏿‍⚖️`,
    `Señora, señor - niño o niña. Nam nec congue est, eu feugiat nisi. Vestibulum facilisis non. 🤬`,
    `Cat 😺 ipsum dolor sit amet, Donec dignissim elementum turpis ac tempus. Maecenas in enim in velit luctus tristique. Duis tristique, nibh at posuere scelerisque, augue velit aliquet justo, fringilla rhoncus enim sem.`,
    `Sed lobortis 👽 fringilla neque, in lacinia nisl finibus non. Proin volutpat 🤡, purus eget placerat ullamcorper, tortor diam porttitor lorem, quis tincidunt nunc ligula sit amet purus. Nunc nunc elit.`,
    `Hola mundo, jaja no se que mas poner.`
]

const randSampleIndex = Math.floor(Math.random() * inputSamples.length)

export default new Vuex.Store({
    state: {
        isModalVisible: false,
        isEncoding: true,
        inputStr: inputSamples[randSampleIndex]
    },
    mutations: {
        setInputStr (state, inputStr) {
            state.inputStr = inputStr
        },
        setIsEncoding (state, isEncoding) {
            state.isEncoding = isEncoding
        },
        toggleIsEncoding (state) {
            state.isEncoding = !state.isEncoding
        },
        setIsModalVisible (state, isModalVisible) {
            state.isModalVisible = isModalVisible
        }
    }
})