<script lang="ts" setup>
import { Form, Field, Button, Status } from '~/components/layout';
import { AuthenticationValidation } from '~/validations';
import { useAnimalJamStore } from '~/stores';
import { useRouter } from 'vue-router';

// Get the store and router
const store = useAnimalJamStore();
const router = useRouter();

// Set loading state
const isLoading = ref(false);
const loginError = ref('');

/**
 * Initial values for the form.
 */
const initialValues = {
  screen_name: "",
  password: ""
};

/**
 * Handles the login submission.
 * @param values The form values.
 */
const handleLogin = async (values: { screen_name: string, password: string }) => {
  try {
    isLoading.value = true;
    loginError.value = '';
    
    await store.authtenticate(values.screen_name, values.password);
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center bg-white px-4 md:px-8">
      <div class="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-2xl font-bold mb-4 text-center">Log in to Animal Jam</h2>
        
        <!-- Error Message -->
        <Status v-if="loginError" color="red" icon="exclamation-circle" class="mb-6">
          {{ loginError }}
        </Status>
        
        <!-- Info Message -->
        <Status color="black" icon="info-circle" class="mb-6">
          Enter your Animal Jam screen name and password to access Animal Jam from the web.
        </Status>

        <Form :initial-values="initialValues" :validation-schema="AuthenticationValidation" @submit="handleLogin">
          <!-- Screen Name Input -->
          <div class="mb-4">
            <Field 
              label="Screen Name" 
              name="screen_name" 
              type="text" 
              placeholder="Enter Your Screen Name" 
              icon="user" 
              required 
            />
          </div>

          <!-- Password Input -->
          <div class="mb-6">
            <Field 
              label="Password" 
              name="password" 
              type="password" 
              placeholder="Enter Your Password" 
              icon="lock" 
              required 
            />
          </div>

          <!-- Login Button -->
          <Button type="submit" variant="primary" size="md" class="w-full" :disabled="isLoading">
            <span v-if="isLoading">Logging in...</span>
            <span v-else>Log In</span>
          </Button>
        </Form>

        <!-- Additional Links -->
        <div class="mt-4 text-center text-sm text-gray-600">
          <p>Don't have an account? <a href="https://www.animaljam.com/create" class="text-blue-500 hover:underline" target="_blank">Sign up for Animal Jam</a></p>
          <p class="mt-2">
            <a href="https://www.animaljam.com/forgot-password" class="text-blue-500 hover:underline" target="_blank">Forgot your password?</a>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
