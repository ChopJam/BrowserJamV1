import { config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

config.autoAddCss = false

library.add(fas)
library.add(faDiscord)
library.add(faGithub)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Icon', FontAwesomeIcon)
})