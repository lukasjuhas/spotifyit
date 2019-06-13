<template>
  <div class="flex flex-col content-center min-w-full">
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold">
        Spotify It
      </h1>
      <h2 class="text-2xl">
        Spotify my words into playlist.
      </h2>
    </div>
    <div class="container mx-auto p-4 max-w-2xl">
      <form
        method="post"
        @submit.prevent="submit"
      >
        <div class="mb-4">
          <input
            v-model="text"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border
              border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none
              focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="I love you Honeybear"
          >
        </div>

        <div class="mb-4">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Spotify It!
          </button>
        </div>
      </form>

      <button
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="search"
      >
        Search
      </button>

      <div
        v-if="items"
        class="rounded-lg bg-white shadow-xl max-w-lg mx-auto mt-4 py-2"
      >
        <h3 class="text-xl text-gray-900 leading-tightp p-2">
          Your playlist:
        </h3>

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

        <button
          type="button"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="createPlaylist"
        >
          Create my playlist
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: null,
      items: null,
    };
  },

  methods: {
    submit() {
      this.$store.dispatch('auth');
    },

    search() {
      // clear tracks in store
      this.$store.commit('clearTracks');

      // do a search
      this.$store.dispatch('search', this.text).then(() => {
        this.$toast.success('I\'m done!');
        this.items = this.$store.getters.tracks;
      }).catch((e) => {
        this.$toast.error(e);
      });
    },

    createPlaylist() {
      this.$store.dispatch('createPlaylist').then(() => {
        this.$toast.success('Your playlist is here!');
      });
    },
  },
};
</script>
