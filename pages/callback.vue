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

    const { state } = params;
    const token = params.access_token;

    await this.$store.commit('code', token);

    this.$nextTick(() => {
      if (token && (state == null || state !== this.$store.state.authState)) {
        this.$toast.error('There was an error during the authentication.');
        this.$store.commit('clear');
        this.$router.push('/');
      }

      this.$router.push('/search');
    });
  },
};
</script>
