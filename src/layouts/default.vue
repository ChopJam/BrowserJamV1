<script lang="ts" setup>
import { Navigation, Footer } from '~/components/layout';
</script>

<template>
  <div class="flex flex-col min-h-screen">

    <!-- Navigation -->
    <Navigation :items="[
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Converter', path: '/masterpiece' },
      { name: 'Play', path: '/play'}
    ]" />

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <Footer>
      <template #footer-content>
        <p class="text-md text-black">
          Made with ❤️ by <a class="font-bold text-black" href="https://github.com/sxip">Sxip</a>
        </p>
      </template>
    </Footer>
  </div>
</template>
