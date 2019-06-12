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

    this.$nextTick(() => {
      this.$router.push('/');
    });
  },
};
</script>
