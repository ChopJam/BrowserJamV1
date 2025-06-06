<script lang="ts" setup>
import { useForm } from "vee-validate";

type FormProps = {
  /**
   * The form validation schema.
   */
  validationSchema?: object;

  /**
   * The form initial values.
   */
  initialValues?: object;
}

/**
 * The form's default props.
 */
const props = withDefaults(defineProps<FormProps>(), {
  validationSchema: () => ({}),
  initialValues: () => ({}),
});

/**
 * The form emiters.
 */
const emit = defineEmits<{
  /**
   * Handles the form submission.
   */
  (event: "submit", values: any): void;
}>();

/**
 * VeeValidate form context.
 */
const { handleSubmit, isSubmitting, submitCount, errors } = useForm({
  initialValues: props.initialValues,
  validationSchema: props.validationSchema,
});

/**
 * Handles the form submission.
 */
const onSubmit = handleSubmit<void>((values) => {
  emit("submit", values);
});
</script>

<template>
  <form @submit.prevent="onSubmit" v-bind="$attrs">
    <slot v-bind="{ isSubmitting, submitCount }" />
  </form>
</template>