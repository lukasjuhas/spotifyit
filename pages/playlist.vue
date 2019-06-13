<template>
  <div class="flex flex-col content-center min-w-full">
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold">
        Your playlist
      </h1>
      <h2 class="text-base">
        This is what your playlist will contain. If you are happy with this,
        just hit <br>create my playlist button.
      </h2>
    </div>
    <div class="container mx-auto p-4 max-w-2xl">
      <div
        v-if="items.length"
        class="rounded-lg bg-white shadow-xl max-w-lg mx-auto mt-4 py-2 mb-6"
      >
        <ul>
          <li
            v-for="(item, key) in items"
            :key="key"
            class="flex p-2"
          >
            <div class="flex-shirik-0 pr-2">
              {{ key + 1 }}.
            </div>

            <div class="flex-shrink-0">
              <img
                :src="item.cover"
                :alt="item.name"
                class="h-12 w-12"
              >
            </div>
            <div class="ml-2 pt-1 text-left">
              <h4 class="text-base text-gray-900 leading-tight">
                {{ item.name }}
              </h4>
              <p class="text-sm text-gray-600 leading-normal">
                {{ item.album }} - {{ item.artist }}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <button
        v-if="items.length"
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="createPlaylist"
      >
        Create my playlist
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
    };
  },

  mounted() {
    this.items = this.$store.getters.tracks;
  },

  methods: {
    createPlaylist() {
      this.$store.dispatch('createPlaylist').then(() => {
        this.$toast.success('Your playlist is here!');
      });
    },
  },
};
</script>
