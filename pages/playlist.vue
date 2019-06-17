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
        <div class="p-2 pt-0">
          <input
            v-if="items.length && !playlistUrl"
            v-model="playlistName"
            class="appearance-none block w-full bg-white text-gray-700 border
              border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none
              focus:bg-white focus:border-gray-500"
            type="text"
            required
            placeholder="Enter playlist title... e.g. Greetings from John"
            :class="{'border-red-500 focus:border-red-500 bg-red-100': error}"
          >
        </div>

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
        v-if="items.length && !playlistUrl"
        type="button"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        @click="createPlaylist"
      >
        Create this playlist
      </button>

      <div
        v-if="items.length && !playlistUrl"
        class="text-sm italic p-2"
      >
        This playlist will be saved to your librabry.
      </div>

      <div
        v-if="playlistUrl"
        class="py-6"
      >
        Your playlist url:
        <a
          :href="playlistUrl"
          target="_blank"
          class="text-green-700 underline mb-6"
        >
          {{ playlistUrl }}
        </a>

        <h4 class="text-lg text-bold text-gray-900 my-4">
          Share your playlist:
        </h4>
        <social-sharing
          :url="playlistUrl"
          title="Greetings from Lukas"
          description="Playlist generated using spotifyit.io"
          inline-template
          class="p4 m-4"
        >
          <div>
            <network
              network="email"
            >
              <font-awesome-icon
                icon="envelope"
                class="cursor-pointer"
              />
            </network>
            <network
              network="facebook"
            >
              <font-awesome-icon
                :icon="['fab', 'facebook']"
                class="cursor-pointer"
              />
            </network>
            <network
              network="googleplus"
            >
              <font-awesome-icon
                :icon="['fab', 'google-plus']"
                class="cursor-pointer"
              />
            </network>
            <network
              network="linkedin"
            >
              <font-awesome-icon
                :icon="['fab', 'linkedin']"
                class="cursor-pointer"
              />
            </network>
            <network
              network="reddit"
            >
              <font-awesome-icon
                :icon="['fab', 'reddit']"
                class="cursor-pointer"
              />
            </network>
            <network
              network="skype"
            >
              <font-awesome-icon
                :icon="['fab', 'skype']"
                class="cursor-pointer"
              />
            </network>
            <network
              network="sms"
            >
              <font-awesome-icon
                icon="comments"
                class="cursor-pointer"
              />
            </network>
            <network
              network="telegram"
            >
              <font-awesome-icon
                :icon="['fab', 'telegram']"
                class="cursor-pointer"
              />
            </network>
            <network
              network="twitter"
            >
              <font-awesome-icon
                :icon="['fab', 'twitter']"
                class="cursor-pointer"
              />
            </network>
            <network
              network="whatsapp"
            >
              <font-awesome-icon
                :icon="['fab', 'whatsapp']"
                class="cursor-pointer"
              />
            </network>
          </div>
        </social-sharing>
      </div>


      <dir class="p-8">
        <div class="pb-4">
          or
        </div>

        <nuxt-link
          to="/"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Do a new search
        </nuxt-link>
      </dir>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['tracks'],

  data() {
    return {
      items: [],
      playlistUrl: null,
      playlistName: null,
      error: false,
    };
  },

  watch: {
    playlistName() {
      this.error = false;
    },
  },

  mounted() {
    this.items = this.$store.getters.tracks;
    if (Object.values(this.$store.getters.playlist).length) {
      this.playlistUrl = this.$store.getters.playlist.external_urls.spotify;
    }
  },

  methods: {
    createPlaylist() {
      if (!this.playlistName) {
        this.error = true;

        return false;
      }

      return this.$store.dispatch('createPlaylist', this.playlistName).then(() => {
        this.$toast.success('Your playlist was created and added to your librabry.');
        this.$toast.show('Adding tracks to the playlist...');

        this.playlistUrl = this.$store.getters.playlist.external_urls.spotify;

        this.$store.dispatch('addTracksToPlaylist').then(() => {
          this.$toast.success('Tracks added to your playlist.');
        }).catch(e => this.$toast.error(e));
      }).catch(e => this.$toast.error(e));
    },
  },
};
</script>
