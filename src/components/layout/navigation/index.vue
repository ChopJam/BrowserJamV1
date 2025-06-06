<script lang="ts" setup>
import { Dropdown, Modal, Button } from '~/components/layout';
import { useMasterpieceStore } from '~/stores';

const store = useMasterpieceStore();
const { recentMasterpieces } = storeToRefs<typeof store>(store);

type NavigationItem = {
  /**
   * The name of the item.
   */
  name: string;
  /**
   * The icon to display.
   */
  icon?: string;
  /**
   * The path to navigate to.
   */
  path: string;
}

type NavigationProps = {
  /**
   * Additional classes to add to the navigation.
   */
  class?: string;
  /**
   * The items to display in the navigation.
   */
  items: NavigationItem[];
};

/**
 * Navigation Items.
 */
const props = defineProps<NavigationProps>();

/**
 * Checks if mobile menu is open or not.
 */
const isMenuOpen = ref<boolean>(false);
const isModalOpen = ref(false);
const selectedImage = ref<string | null>(null);

/**
 * Toggles opening the mobile menu
 */
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;

/**
 * Opens the modal.
 * @param image The image to display in the modal.
 */
const openModal = (image: string) => {
  selectedImage.value = image;
  isModalOpen.value = true;
}

/**
 * Closes the modal.
 */
const closeModal = () => {
  selectedImage.value = null;
  isModalOpen.value = false;
}

/**
 * Clears all saved images.
 */
const clearAllImages = () => store.clearRecentMasterpieces();
</script>

<template>
  <nav class="bg-white top-0 z-50 w-full">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo (fixed width, flex-shrink-0) -->
      <div class="flex items-center space-x-2" style="min-width: 140px;">
        <div class="bg-gray-900 w-8 h-8 rounded-md flex items-center justify-center">
          <img src="~/assets/images/palette.png" class="h-5 w-5" alt="Logo" />
        </div>
        <span class="text-lg font-bold text-black">Jam Exposed</span>
      </div>

      <!-- Centered Menu (flex-grow) -->
      <div class="hidden md:flex flex-grow justify-center items-center space-x-8">
        <template v-for="item in props.items" :key="item.name">
          <NuxtLink :to="item.path" :class="[$route.path.includes(item.path) ? 'text-gray-800' : 'text-black']"
            class="hover:text-gray-900 transition-colors text-bold">
            {{ item.name }}
          </NuxtLink>
        </template>
      </div>

      <!-- Dropdown Button (fixed width) -->
      <div class="flex-shrink-0 flex items-center space-x-4">
        <Dropdown>
          <!-- Dropdown Button -->
          <template #dropdown-button>
            <button class="text-white relative flex items-center rounded-full bg-black p-1">
              <Icon icon="paintbrush" class="h-4 w-4" />
            </button>
          </template>

          <!-- Dropdown Content -->
          <template #dropdown-content>
            <div class="flex flex-col space-y-2 p-2 items-center">
              <h4 class="text-sm font-bold mb-2">Recently Viewed</h4>

              <!-- If no images are saved, display a message -->
              <div v-if="recentMasterpieces.length === 0" class="text-gray-500">No Previous Masterpieces.</div>

              <!-- Display the saved images -->
              <ul class="grid grid-cols-2 gap-2">
                <li v-for="(image, index) in recentMasterpieces" :key="index" class="flex items-center justify-center">

                  <img :src="image.image" alt="Saved Image"
                    class="h-20 w-20 rounded-md object-cover border border-gray-300 transition-transform transform hover:scale-105 cursor-pointer"
                    @click="openModal(image.image)" />
                </li>
              </ul>

              <!-- Clear All Button -->
              <Button v-if="recentMasterpieces.length" class="w-full" variant="primary" size="sm"
                @click="clearAllImages">
                Clear All
              </Button>
            </div>
          </template>
        </Dropdown>

        <!-- Mobile Menu Button (visible only on mobile) -->
        <button class="block md:hidden text-gray-900" @click="toggleMenu">
          <Icon icon="bars" class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-gray-200">
      <div class="flex flex-col space-y-2 p-4">
        <template v-for="item in props.items" :key="item.name">
          <NuxtLink :to="item.path" :class="[$route.path.includes(item.path) ? 'text-gray-800' : 'text-black']"
            class="hover:text-gray-900 transition-colors">
            {{ item.name }}
          </NuxtLink>
        </template>
      </div>
    </div>

    <!-- Modal for Image Preview -->
    <Modal v-if="isModalOpen" :image="selectedImage" @close="closeModal" />
  </nav>
</template>