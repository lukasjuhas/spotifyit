import leven from 'leven';

const getTrack = (response, query) => {
  if (typeof response.tracks !== 'undefined') {
    // take the important parts and calculate levensthein distance
    const tracks = response.tracks.items.map((item, key) => ({
      key,
      name: item.name,
      id: item.id,
      levenshteinDistance: leven(query, item.name),
    }));

    // sort tracks by levenshtein distance
    tracks.sort((a, b) => a.levenshteinDistance - b.levenshteinDistance);

    // take the first one
    const track = tracks[0];

    return track;
  }

  return null;
};

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

      const track = getTrack(response, query);
      console.log('track', track);
      // commit('operator', response);

      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};
