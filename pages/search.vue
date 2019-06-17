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
    await this.$store.dispatch('me').then(() => {
      this.$toast.success('Successfully authenticated');

      // do a search
      this.$store.dispatch('search', this.$store.getters.query).then(() => {
        this.$toast.success('All done!');

        this.$router.push('/playlist');
      }).catch((e) => {
        this.$toast.error(e);
        this.$store.commit('clear');
        this.$router.push('/');
      });
    }).catch((e) => {
      // clear everything
      this.$toast.error(e);
      this.$store.commit('clear');
      this.$router.push('/');
    });
  },
};
</script>
