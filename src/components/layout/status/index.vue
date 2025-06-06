<script lang="ts" setup>
type StatusBadgeProps = {
  /**
   * Status of the badge.
   */
  color: 'blue' | 'green' | 'red' | 'yellow' | 'black';
  /**
   * Optional icon for the badge.
   */
  icon?: string; // You can use a string to hold the icon name or path
};

const props = defineProps<StatusBadgeProps>();
</script>

<template>
  <div class="flex items-center justify-center w-fit">
    <div
      :class="[ 
        'flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium',
        props.color === 'green' ? 'bg-green-100 text-green-800' :
        props.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
        props.color === 'red' ? 'bg-red-100 text-red-800' :
        props.color === 'blue' ? 'bg-blue-100 text-blue-800' :
        props.color === 'black' ? 'bg-black text-white' :
        '',
        'md:px-4 md:py-1 md:text-sm'
      ]"
    >
      <!-- Render icon if provided -->
      <span v-if="props.icon" class="mr-1 md:mr-2">
        <Icon :icon="props.icon" size="md" />
      </span>
      <slot />
    </div>
  </div>
</template>
