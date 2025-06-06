type UseButtonClassesProps ={
  size: Ref<"sm" | "xs" | "md" | "lg">
}

/**
 * Get the size for the button.
 * @returns 
 */
const getSize = (size: string): string => {
  switch (size) {
    case 'lg':
      return 'text-lg'
    case 'md':
      return 'text-md'
    case 'sm':
      return 'text-sm'
    case 'xs':
      return 'text-xs'
    default:
      return 'text-sm'
  }
}

/**
 * Handles the button size.
 */
export const useButtonSize = (props: UseButtonClassesProps) => {
  const buttonSize = computed(() => {
    if (props.size.value) return getSize(props.size.value)
  });
  return buttonSize
}