<script lang="ts" setup>
type ModalProps = {
  /**
   * The image to display in the modal.
   */
  image: string | null;
}

/**
 * Defines the props for the modal component.
 */
const props = defineProps<ModalProps>();

/**
 * Emits events for the modal.
 */
const emit = defineEmits<{
  (e: 'close'): void;
}>();

/**
 * Closes the modal.
 */
const close = () => {
  emit('close');
}

</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" @click.self="close">
    <div class="bg-white rounded-lg overflow-hidden shadow-lg relative">
      <img v-if="props.image" :src="props.image" alt="Masterpiece" class="w-full h-auto cursor-pointer" />
    </div>
  </div>
</template>