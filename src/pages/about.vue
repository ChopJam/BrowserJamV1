<template>
  <div class="container mx-auto px-4 py-9 mt-6">
    <div class="bg-white p-6 md:p-8 text-center transition-transform transform">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">About This Project</h1>
      <p class="text-lg text-gray-700 mb-4">
        This project was created for fun.
      </p>

      <p class="text-lg text-gray-700 mb-6">
        By using this site, you acknowledge that you are doing so at your own risk. The creators of this project do not take any responsibility for any issues or consequences that may arise from its use.
      </p>

      <p class="text-lg text-gray-700 mb-8">
        Enjoy exploring the content, and feel free to reach out with any feedback!
      </p>

      <div class="flex justify-center items-center space-x-6 mt-8">
        <a
          href="https://github.com/sxip"
          target="_blank"
          class="text-gray-700 hover:text-black transition-colors flex items-center space-x-2"
        >
          <Icon :icon="['fab', 'github']" class="h-6 w-6" />
          <span class="hidden md:inline">GitHub</span>
        </a>
      </div>
    </div>
  </div>
</template>
