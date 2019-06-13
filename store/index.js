import leven from 'leven';

const getTrack = (response, query) => {
  if (response.tracks.items.length) {
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
  code: null,
  tracks: [],
  popped: [],
});

export const mutations = {
  code(localState, code) {
    localState.code = code;
  },
  track(localState, track) {
    localState.tracks.push(track);
  },
  clearTracks(localState) {
    localState.tracks = [];
  },
  popped(localState, popped) {
    localState.popped.push(popped);
  },
  clearPopped(localState) {
    localState.popped = [];
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
    // Removes everything except alphanumeric characters and whitespace,
    // then collapses multiple adjacent characters to single spaces.
    const cleanQuery = query.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');

    try {
      // to the request
      const response = await this.$axios.$get(
        'https://api.spotify.com/v1/search',
        {
          params: {
            q: cleanQuery,
            type: 'track',
          },
          headers: { Authorization: `Bearer ${ctx.state.code}` },
        },
      );

      // try to get the track
      const track = getTrack(response, cleanQuery);

      if (track) {
        // if we got a track, add it
        ctx.commit('track', track);

        // if there are any remaning popped words, search for those
        if (ctx.state.popped.length) {
          // stash popped and clear them from store
          const poppedQuery = ctx.state.popped;
          ctx.commit('clearPopped');

          // do the new round of search
          await ctx.dispatch('search', poppedQuery.reverse().join(' '));
        }
      } else {
        // strng to array plus pop last word
        const words = cleanQuery.split(' ');
        const popped = words.pop();

        // use rest as the new searc query
        const newQuery = words.join(' ');

        // stash the last word of the sentence
        ctx.commit('popped', popped);

        // new search
        await ctx.dispatch('search', newQuery);
      }

      return track;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};
