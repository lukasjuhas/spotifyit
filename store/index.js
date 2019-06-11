export const state = () => ({
  result: {},
  code: null,
});

export const mutations = {
  code(localState, code) {
    localState.code = code;
  },
};

export const actions = {
  async auth() {
    const params = {
      response_type: 'token',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'playlist-modify-private playlist-modify-public',
      redirect_uri: 'http://localhost:3000/callback/',
    };

    const urlParams = Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&');

    window.location = `https://accounts.spotify.com/authorize?${urlParams}`;
  },

  async search(ctx, query) {
    try {
      const response = await this.$axios.$get(
        'https://api.spotify.com/v1/search',
        {
          params: {
            q: query,
            type: 'track',
          },
          headers: { Authorization: `Bearer ${ctx.state.code}` },
        },
      );

      console.log(response);
      // commit('operator', response);

      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};
