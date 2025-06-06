<script lang="ts" setup>
/**
 * Ruffle configuration.
 */
type RuffleConfig = {
  [key: string]: any;
}

/**
 * Ruffle component props.
 */
type Props = {
  src: string;
  config?: RuffleConfig;
  width?: string | number;
  height?: string | number;
}

/**
 * Props validation.
 */
const props = withDefaults(defineProps<Props>(), {
  config: () => ({}),
  width: '100%',
  height: '100%'
});

/**
 * Ruffle player container.
 */
const ruffleContainer = ref<HTMLElement | null>(null);

/**
 * Script element for loading Ruffle.
 */
const scriptElement = ref<HTMLScriptElement | null>(null);

/**
 * Ruffle player instance.
 */
const ruffleInstance = ref<any>(null);

/**
 * Default configuration for Ruffle.
 */
const defaultConfig: RuffleConfig = {};

/**
 * Merged configuration for Ruffle.
 */
const mergedConfig = { ...defaultConfig, ...props.config };

/**
 * On mounted lifecycle hook.
 */
onMounted(() => {
  if (window.RufflePlayer) {
    createRufflePlayer();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@ruffle-rs/ruffle';
  script.async = true;
  
  script.onload = () => {
    window.RufflePlayer = window.RufflePlayer || {};
    window.RufflePlayer.config = mergedConfig;
    
    createRufflePlayer();
  };

  scriptElement.value = script;
  
  document.body.appendChild(script);
});

/**
 * Create Ruffle player instance.
 */
const createRufflePlayer = (): void => {
  if (!ruffleContainer.value || !window.RufflePlayer) return;
  
  try {
    const ruffle = window.RufflePlayer.newest();
    
    ruffleInstance.value = ruffle.createPlayer();
    
    if (Object.keys(props.config).length > 0) {
      ruffleInstance.value.config = props.config;
      console.log('Ruffle player config:', props.config);
    }
    
    ruffleContainer.value.appendChild(ruffleInstance.value);
    ruffleInstance.value.load({
      url: props.src,
      autoplay: true,
      ...props.config
    }).then(() => {
      console.log('Ruffle player loaded successfully');
    }).catch((error: Error) => {
      console.error('Error loading Ruffle player:', error);
    });
  } catch (error) {
    console.error('Error creating Ruffle player:', error);
  }
};

/**
 * Before unmount lifecycle hook.
 */
onBeforeUnmount(() => {
  if (ruffleInstance.value && typeof ruffleInstance.value.destroy === 'function') {
    ruffleInstance.value.destroy();
  }
  
  if (scriptElement.value && document.body.contains(scriptElement.value)) {
    document.body.removeChild(scriptElement.value);
  }
});

/**
 * Declare global window object for TypeScript.
 */
declare global {
  interface Window {
    RufflePlayer: any;
  }
}
</script>

<template>
  <div 
    ref="ruffleContainer" 
    class="ruffle-player-container"
    :style="{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }"
  >
    <slot>
      <p>
        Your browser doesn't support Flash content. 
        <a href="https://ruffle.rs/" target="_blank" rel="noopener noreferrer">
          See Ruffle documentation
        </a>
        for more information.
      </p>
    </slot>
  </div>
</template>

<style scoped>
.ruffle-player-container {
  position: relative;
  display: block;
  background-color: black;
  text-align: center;
}

:deep(ruffle-player) {
  width: 100%;
  height: 100%;
}
</style>