<script lang="ts" setup>
type DropDownProps = {
  /**
   * Additional classes to add to the button.
   */
  inlineBlock?: boolean;
};

const props = withDefaults(defineProps<DropDownProps>(), {
  inlineBlock: false,
});

import { createPopper } from '@popperjs/core';


/**
 * State to control the dropdown.
 */
const open = ref<boolean>(false);
const button = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

/**
 * Popper Instance.
 */
const popperInstance = ref<ReturnType<typeof createPopper> | null>(null);

/**
 * Toggle dropdown.
 */
const toggle = () => open.value = !open.value;

/**
 * Creates a new popper instance.
 */
const createPopperInstance = () => {
  console.log(button.value, content.value)
  if (button.value && content.value) {
    popperInstance.value = createPopper(button.value, content.value, {
      strategy: "fixed",
      placement: "bottom-start",
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 4],
          },
        },
      ],
    });
  }
};

onBeforeUnmount(() => {
  if (popperInstance.value) {
    popperInstance.value.destroy();
  }
});

watch(open, (newValue) => {
  if (newValue) {
    createPopperInstance();
  } else {
    if (popperInstance.value) {
      popperInstance.value.update();
    }
  }
});

onMounted(() => {
  if (open.value) {
    createPopperInstance();
  }
});
</script>


<template>
  <div>
    <!-- Trigger Button -->
    <div ref="button" @click="toggle" class="relative z-10" :class="{ 'inline-block': props.inlineBlock }">
      <slot name="dropdown-button"></slot>
    </div>

    <!-- Dropdown Content -->
    <div ref="content" class="z-10">
      <div v-show="open" class="w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5" role="menu"
        aria-orientation="vertical" aria-labelledby="options-menu">
        <div class="py-1">
          <slot name="dropdown-content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
