<script lang="ts" setup>
import { useButtonSize } from "./composables/UseButtonSize";
import { useButtonVariant } from "./composables/UseButtonVariant";

type ButtonProps = {
  /**
   * Additional classes to add to the button.
   */
  class?: string;
  /**
   * Button type.
   */
  type?: "button" | "submit" | "reset";
  /**
   * Button variant.
   */
  variant?: "primary" | "secondary";
  /**
   * Button size.
   */
  size?: "sm" | "xs" | "md" | "lg";
  /**
   * Checks if the button is disabled.
   */
  disabled?: boolean;
  /**
   * Icon to display.
   */
  icon?: string;
}

/**
 * Deinfes the props for the button component.
 */
const props = withDefaults(defineProps<ButtonProps>(), {
  type: "button",
  variant: "primary",
  size: "md",
  disabled: false,
  icon: "",
});

/**
 * Gets the button variant.
 */
const buttonVariant = computed(() => useButtonVariant(toRefs(props)));

/**
 * Gets the button size.
 */
const buttonSize = computed(() => useButtonSize(toRefs(props)));
</script>

<template>
  <button 
    :disabled="props.disabled"
    :type="props.type"
    :class="[buttonVariant.value, buttonSize.value, props.class]"
    class="flex font-medium items-center justify-center px-4 py-2 relative rounded transition-colors whitespace-nowrap"
    >

    <!-- Icon -->
    <Icon v-if="props.icon" :icon="props.icon" size="xs" class="w-4 h-4 mr-1" />

    <slot />
  </button>
</template>