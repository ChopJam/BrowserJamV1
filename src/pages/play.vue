<script lang="ts" setup>
import { Status } from '~/components/layout';
import { Ruffle } from '~/components';

import { useAnimalJamStore } from '~/stores';
import { onMounted } from 'vue';

import animaljamSwf from '~/assets/ajclient.swf';


const store = useAnimalJamStore();
const { username, token } = storeToRefs<typeof store>(store);

const fullWidth = ref(false)

const errorMessage = ref('');
const gameContainer = ref(null);
let vars = ref({});
const flashvarsReady = ref(false);
const socketProxyUrl = ref('');
const base = ref(`${window.location.origin}/`);

const toggleWidth = () => {
  fullWidth.value = !fullWidth.value
}

const logout = () => {
  store.logout()
  navigateTo('/')
}

onMounted(async () => {
  if (!store.username || !store.token) {
    navigateTo('/');
    return;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  socketProxyUrl.value = `${protocol}//${window.location.host}/socket-proxy?screen_name=${username.value}&token=${token.value}`

  const flashvars = await store.flashVars()

  if (flashvars) {
    flashvars.content = `${window.location.origin}/proxy`

    flashvars.smartFoxServer = '127.0.0.1'
    flashvars.socketPolicyPort = '443'
    flashvars.clientURL = `${window.location.origin}/proxy/1713/ajclient.swf`
    flashvars.clientPlatformVersion = '1.5.4'
    flashvars.clientPlatform = 'electron'
    flashvars.country = "GB"
    flashvars.df = "0"
    flashvars.locale = 'en'

    const flashvarsString = Object.entries(flashvars)
      .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      .join('&')

    vars.value = flashvarsString
    flashvarsReady.value = true
  } else {
    errorMessage.value = 'Failed to load flashvars. Please try again.'
  }
})

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white p-4">
    <div :class="['w-full bg-white shadow-lg rounded-lg overflow-hidden', fullWidth ? 'max-w-none' : 'max-w-5xl']">
      <div class="flex justify-end space-x-2 p-2">
        <button class="px-3 py-1 text-sm bg-gray-200 rounded" @click="toggleWidth">
          {{ fullWidth ? 'Default Width' : 'Fit Window' }}
        </button>
        <button class="px-3 py-1 text-sm bg-gray-200 rounded" @click="logout">
          Logout
        </button>
      </div>
      <!-- Game Container -->
      <div ref="gameContainer" class="h-[700px] w-full bg-black">
        <Ruffle           
          v-if="flashvarsReady" 
          :src="animaljamSwf" 
          :width="'100%'" 
          :height="'100%'" 
          :config="{
            autoplay: true,
            quality: 'high',
            scale: 'exactfit',
            wmode: 'direct',
            preferredRender: 'webgpu',
            menu: 'false',
            base: base,
            parameters: vars,
            socketProxy: [{
              host: '127.0.0.1',
              port: 443,
              proxyUrl: socketProxyUrl,
            }],
            logLevel: 'none',
            showSwfDownload: false,
            warnOnUnsupportedContent: false,
            hideErrors: true,
            letterbox: 'off',
            allowScriptAccess: 'always',
            maxExecutionDuration: 300,
            frameRate: 45,
            useWebWorker: true,
            wasmLoadStrategy: 'fetch',
            splashScreen: false,
            unmuteOverlay: 'hidden',
            upgradeToHttps: false,
            salign: 'tl',
            align: 'middle',
            allowFullScreen: true,
            allowFullScreenInteractive: true,
            forceScale: true,
            backgroundColor: '#000000',
            traceEnabled: false,
            logActionScript: false,
            playerRuntime: 'air'
        }"/>
      </div>
    </div>

    <!-- Game Instructions -->
    <div class="mt-6 w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-lg font-bold mb-2">Playing Animal Jam with Ruffle</h2>
      <p class="text-gray-600 mb-4">
        This is an experimental feature that allows you to play Animal Jam Classic in your browser using Ruffle, an
        open-source Flash Player emulator.
      </p>
      <Status color="black" icon="info-circle">
        Some features may not work correctly as Ruffle is still in development.
      </Status>
    </div>
  </div>
</template>

<style>
ruffle-player {
  width: 100%;
  height: 100%;
  contain: strict;
  isolation: isolate;
  will-change: transform;
  transform: translateZ(0);

  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
}

.game-focus {
  background: #000;
  scroll-behavior: auto !important;
  text-rendering: optimizeSpeed !important;
}

#gameContainer {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  overflow: visible !important;
  /* Changed to visible to prevent clipping */

  & * {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
  }
}
</style>
