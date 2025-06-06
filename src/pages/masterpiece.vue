<script lang="ts" setup>
import { Field, Form, Button, Status } from '~/components/layout';
import { MasterpieceValidation } from '~/validations';
import { useUploaderStore } from '~/stores';

const store = useUploaderStore();
const { files } = storeToRefs<typeof store>(store);

const fileInput = ref<HTMLInputElement | null>(null);

/**
 * Initial values for the form.
 */
const inintialValues = {
  username: "",
  files: [] as File[]
};

/**
 * Handles Submitting the form.
 * @param values 
 */
const handleUpload = (values: any) => {
  store.setUsername(values.username);
  store.processQueue();
}

/**
 * Handles the file drop.
 * @param event The file drop event.
 */
const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files;
  if (files) {
    inintialValues.files = Array.from(event.dataTransfer?.files);
    for (let i = 0; i < files.length; i++) store.addFileToQueue(files[i]);
  }
}

/**
 * Handles the file change.
 */
const selectFile = () => {
  const input = fileInput.value;
  if (input) input.click();
}

/**
 * Handles the file change.
 * @param event The file change event.
 */
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    inintialValues.files = Array.from(target.files);
    for (let i = 0; i < target.files.length; i++) store.addFileToQueue(target.files[i]);
  }
}

/**
 * Handles queue status color.
 * @param status 
 */
const statusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'green';
    case 'Queued':
      return 'black';
    case 'Failed':
      return 'red';
    default:
      return 'yellow';
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center">
      <div class="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-2xl font-bold mb-4 text-center">Upload Your Image Files</h2>

        <!-- Status Message -->
        <Status color="black" icon="info-circle">
          Using this tool, you can upload any image file you have and view them in Animal Jam Classic!
        </Status>

        <Form :initial-values="inintialValues" :validation-schema="MasterpieceValidation" @submit="handleUpload">
          <!-- Username Input -->
          <div class="mt-5 mb-4">
            <Field label="Username" name="username" type="text" placeholder="Enter Your Username" icon="paw" required />
          </div>

          <!-- Drag & Drop Area. Ugly Validation workaround for now -->
          <div @drop.prevent="handleDrop" @dragover.prevent
            class="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer transition hover:bg-gray-100"
            @click="selectFile" name="files" label="Files">
            <p class="text-gray-600">Drag & Drop your files here or click to upload</p>
            <input type="file" ref="fileInput" @change="handleFileChange" class="hidden" multiple />
          </div>

          <Button type="submit" variant="primary" size="md" class="mt-4 w-full">
            Convert All To Masterpieces
          </Button>
        </Form>

        <!-- File Queue  -->
        <div v-if="files.length" class="mt-4 overflow-x-auto">
          <div class="flex flex-col space-y-4">
            <!-- Files -->
            <div v-for="(file, index) in files" :key="index"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
              <!-- File Info and Status -->
              <div class="flex items-center space-x-4 flex-grow">
                <!-- File Name -->
                <p class="text-sm font-semibold text-gray-700">{{ file.name }}</p>
                <!-- Status -->
                <Status :color="statusColor(file.status)" icon="check-circle" class="ml-2">
                  {{ file.status }}
                </Status>
              </div>

              <!-- Remove Button -->
              <Button variant="secondary" size="xs" icon="trash"
                class="w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition duration-20 md:w-auto md:h-auto"
                @click="store.removeFile(index)">
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>