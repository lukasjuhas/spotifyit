<template>
  <div class="flex flex-col content-center min-w-full">
    <div class="container mx-auto p-4">
      Loading...
    </div>
  </div>
</template>

<script>
export default {
  async mounted() {
    const hashes = this.$route.hash.replace('#', '').slice(this.$route.hash.indexOf('?') + 1).split('&');

    const params = {};
    hashes.map((hash) => {
      const [key, val] = hash.split('=');
      params[key] = decodeURIComponent(val);

      return params;
    });

    await this.$store.commit('code', params.access_token);

    // todo: sort this out cos for some reason redirect breaks the
    // token assignment
    await setTimeout(async () => {
      await this.$store.dispatch('me').then(() => {
        this.$toast.success('Successfully authenticated');

        // do a search
        this.$store.dispatch('search', this.$store.getters.query).then(() => {
          this.$toast.success('All done!');

          this.$router.push('/playlist');
        }).catch((e) => {
          this.$toast.error(e);
          this.$router.push('/');
        });
      }).catch((e) => {
        this.$toast.error(e);
        this.$store.dispatch('auth');
      });
    }, 3000);
  },
};
</script>
