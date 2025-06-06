type UseButtonClassesProps = {
  variant: Ref<"primary" | "secondary">;
};

/**
 * Get the variant for the button.
 * @returns 
 */
const getVariant = (variant: string): string => {
  switch (variant) {
    case "primary":
      return "bg-black text-white rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-150 w-full";
    case "secondary":
    default:
      return "bg-white text-black rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 w-full";
  }
};

/**
 * Handles the button variant.
 */
export const useButtonVariant = (props: UseButtonClassesProps) => {
  const buttonClasses = computed(() => {
    if (props.variant.value) return getVariant(props.variant.value);
  });
  return buttonClasses;
};