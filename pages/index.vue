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
            placeholder="I would love to work with you"
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: null,
    };
  },

  mounted() {
    this.items = this.$store.getters.tracks;
  },

  methods: {
    submit() {
      // save the query
      this.$store.commit('query', this.text);

      // clear stash
      this.$store.commit('clearPopped');

      // clear tracks in store
      this.$store.commit('clearTracks');

      // clear previous playlist stuff
      this.$store.commit('clearPlaylist');

      // go ahead to auth as first step
      this.$store.dispatch('auth');
    },
  },
};
</script>
