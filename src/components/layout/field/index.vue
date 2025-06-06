<script lang="ts" setup>
import { nanoid } from "nanoid";
import { useField } from "vee-validate";

type InputProps = {
  /**
   * The id of the input.
   */
  id?: string;
  /**
   * The type of the input.
   */
  type: "text" | "select" | "password";
  /**
   * The name of the input.
   */
  name: string;
  /**
   * The label of the input.
   */
  label: string;
  /**
   * Icon to display.
   */
  icon?: string;
  /**
   * The placeholder of the input.
   */
  placeholder: string;
  /**
   * The required of the input.
   */
  required?: boolean;
}

/**
 * Deinfes the props for the input component.
 */
const props = defineProps<InputProps>();

/**
 * The name of the input field.
 */
const inputId = ref<string>();
inputId.value = props.id ?? nanoid();

/**
 * Field event emitters.
 */
const emit = defineEmits<{
  /**
   * Handles the input change.
   */
  (event: "update:modelValue", value: string): void;
}>();

/**
 * VeeValidate field context.
 */
const { errorMessage, value, handleChange } = useField(props.name, {
  validateOnValueUpdate: false,
});

/**
 * Computed validation listeners.
 */
const validationListeners = computed(() => {
  if (!errorMessage.value) {
    return {
      blur: handleChange,
      change: handleChange,
      input: (e: Event) => {
        handleChange(e, false);
        onInput(e);
      },
    };
  }
  return {
    blur: handleChange,
    change: handleChange,
    input: (e: Event) => {
      handleChange(e);
      onInput(e);
    },
  };
});

/**
 * Handles the input change.
 */
const onInput = (event: Event): void => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="relative w-full">
    <!-- Input Icon -->
    <span v-if="props.icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon :icon="props.icon" size="xs" class="text-gray-400" />
    </span>

    <!-- Select -->
    <select v-if="props.type === 'select'" :id="inputId" :name="props.name"
      :class="{ 'border-red-500': errorMessage, 'pl-10': props.icon }"
      class="px-4 py-2 border border-gray-300 text-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition duration-150 w-full"
      v-bind="validationListeners" v-model="value" @input="onInput">
      <slot />
    </select>

    <!-- Input -->
    <input v-else-if="props.type === 'text'" :id="inputId" :name="props.name" :placeholder="props.placeholder"
      :type="props.type" :class="{ 'border-red-500': errorMessage, 'pl-10': props.icon }"
      class="px-4 py-2 border border-gray-300 rounded-lg text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition duration-150 w-full"
      v-bind="validationListeners" v-model="value" @input="onInput" />


    <!-- Password -->
    <input v-else-if="props.type === 'password'" :id="inputId" :name="props.name" :placeholder="props.placeholder"
      :type="props.type" :class="{ 'border-red-500': errorMessage, 'pl-10': props.icon }"
      class="px-4 py-2 border border-gray-300 rounded-lg text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition duration-150 w-full"
      v-bind="validationListeners" v-model="value" @input="onInput" />
  </div>
</template>