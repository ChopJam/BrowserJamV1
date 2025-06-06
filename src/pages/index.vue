<script lang="ts" setup>
import { Form, Field, Button, Modal, Status } from '~/components/layout';
import { Masterpiece } from '~/components';
import { SearchValidation } from '~/validations';
import { useMasterpieceStore, useStatsStore } from '~/stores';
import { nextTick } from 'vue';

/**
 * Masterpiece store.
 * @see {@link useMasterpieceStore}
 */
const store = useMasterpieceStore();
const { masterpieces } = storeToRefs<typeof store>(store);
const formKey = ref(0);

const showModal = ref(false);
const selectedImage = ref<string | null>(null);
const masterpiecesSection = ref<HTMLElement | null>(null);

/**
 * Initial values for the form.
 */
 const initialValues = ref({
  username: "",
  game: "flash"
});

/**
 * Handles the search for masterpieces.
 * @param username The username to search for.
 * @param game The game to search for.
 */
const handleSearch = ({ username, game }: { username: string, game: string }) => {
  masterpieces.value = [];

  return store.fetchMasterpieces({
    username: username,
    game: game
  }).then(async () => {
    await nextTick();

    initialValues.value = {
      username: "",
      game: game
    };
    
    formKey.value++;
    if (masterpieces.value.length > 0 && masterpiecesSection.value) {
      masterpiecesSection.value.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

/**
 * Opens the modal.
 * @param image The image to display in the modal.
 */
const openModal = (image: string) => {
  selectedImage.value = image;
  showModal.value = true;

  // Save the image to the recent masterpieces array
  store.saveMasterpiece(image);
}

/**
 * Closes the modal.
 */
const closeModal = () => {
  selectedImage.value = null;
  showModal.value = false;
}
</script>

<template>
  <!-- Main Content -->
  <header class="bg-white h-screen w-full flex flex-col justify-between px-4 md:px-8">
    <div class="flex flex-col justify-center items-center flex-grow text-center">

      <Status color="black" icon="info-circle" class="mb-10">
        This site is still in development and may not work as expected.
      </Status>

      <h1
        class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4 animate-gradient">
        Animal Jam Masterpieces Viewer
      </h1>
      <p class="text-sm md:text-md text-gray-700 mb-4 md:mb-8">
        Discover the amazing masterpieces from the Animal Jam community!
      </p>

      <Form :key="formKey" :initial-values="initialValues" :validation-schema="SearchValidation" @submit="handleSearch"
        class="flex flex-col md:flex-row justify-center items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">

        <!-- Username Input -->
        <Field label="Username" name="username" type="text" placeholder="Enter Username" icon="paw" class="md:w-auto"
          required />

        <!-- Game Type Dropdown -->
        <Field label="Game" name="game" type="select" placeholder="" icon="gamepad" class="md:w-auto" required>
          <option value="flash">Classic</option>
          <option value="mobile">Play Wild</option>
        </Field>

        <!-- Button -->
        <Button type="submit" variant="primary" size="md" class="md:w-auto">
          View Masterpieces
        </Button>
      </Form>
    </div>
  </header>

  <!-- Masterpieces Section -->
  <section ref="masterpiecesSection" v-if="masterpieces.length" class="p-4 bg-black">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="(masterpiece, index) in masterpieces" :key="index"
        class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
        @click="openModal(masterpiece)">

        <Masterpiece :src="masterpiece" :index="index" :masterpiece="masterpieces" />
      </div>
    </div>
  </section>

  <!-- Modal -->
  <Modal v-if="showModal" :image="selectedImage" @close="closeModal" />
</template>


<style lang="scss">
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradientAnimation 3s ease infinite;
}
</style>
