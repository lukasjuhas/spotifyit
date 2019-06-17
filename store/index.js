import leven from 'leven';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const getTrack = (response, query) => {
  if (response.tracks.items.length) {
    // take the important parts and calculate levensthein distance
    const tracks = response.tracks.items.map((item, key) => ({
      key,
      name: item.name,
      album: item.album.name,
      artist: item.artists.map(artist => artist.name).join(', '),
      cover: item.album.images[0].url,
      id: item.id,
      uri: item.uri,
      levenshteinDistance: leven(query, item.name),
    }));

    // sort tracks by levenshtein distance
    tracks.sort((a, b) => a.levenshteinDistance - b.levenshteinDistance);

    // take the first one
    const track = tracks[0];

    // if it's not close enough result, just return null to trigger a new search
    if (track.levenshteinDistance > 5) {
      return null;
    }

    return track;
  }

  return null;
};

export const state = () => ({
  code: null,
  authState: null,
  me: {},
  query: null,
  tracks: [],
  popped: [],
  playlist: {},
  playlistSnapshotId: null,
});

export const mutations = {
  setAuthState(localState, value) {
    localState.authState = value;
  },
  clearAuthState(localState) {
    localState.authState = null;
  },
  clear(localState) {
    localState.authState = null;
    localState.code = null;
    localState.me = {};
    localState.query = null;
    localState.tracks = [];
    localState.popped = [];
    localState.playlist = {};
    localState.playlistSnapshotId = null;
  },
  code(localState, code) {
    localState.code = code;
  },
  me(localState, me) {
    localState.me = me;
  },
  query(localState, query) {
    localState.query = query;
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
  playlist(localState, playlist) {
    localState.playlist = playlist;
  },
  playlistSnapshotId(localState, playlistSnapshotId) {
    localState.playlistSnapshotId = playlistSnapshotId;
  },
  clearPlaylist(localState) {
    localState.playlist = {};
    localState.playlistSnapshotId = null;
  },
};

export const actions = {
  async auth(ctx) {
    const authState = generateRandomString(16);

    console.log('ctx.state.authState', ctx.state.authState);

    ctx.commit('setAuthState', authState);

    const params = {
      response_type: 'token',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'playlist-modify-private playlist-modify-public',
      redirect_uri: process.env.SPOTIFY_REDIRECT_URL,
      state: authState,
    };

    console.log('ctx.state.authState', ctx.state.authState);

    const urlParams = Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&');

    setTimeout(() => {
      window.location = `https://accounts.spotify.com/authorize?${urlParams}`;
    }, 5000);
  },

  async search(ctx, query) {
    if (!query) {
      return null;
    }

    // Removes everything except alphanumeric characters and whitespace,
    // then collapses multiple adjacent characters to single spaces.
    const cleanQuery = query.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');

    try {
      // to the request
      const response = await this.$axios.$get(
        'https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search',
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
    } catch (error) {
      throw new Error(error.response.data.error.message);
    }
  },

  async me(ctx) {
    try {
      const response = await this.$axios.$get(
        'https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/me',
        {
          headers: { Authorization: `Bearer ${ctx.state.code}` },
        },
      );

      ctx.commit('me', response);
    } catch (error) {
      throw new Error(error.response.data.error.message);
    }
  },

  async createPlaylist(ctx, name) {
    try {
      const response = await this.$axios.$post(
        `https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${ctx.state.me.id}/playlists`,
        {
          name,
          description: 'Playlist generated using spotifyit.io',
        },
        {
          headers: {
            Authorization: `Bearer ${ctx.state.code}`,
          },
        },
      );

      ctx.commit('playlist', response);

      return response;
    } catch (error) {
      throw new Error(error.response.data.error.message);
    }
  },

  async addTracksToPlaylist(ctx) {
    try {
      const response = await this.$axios.$post(
        `https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/playlists/${ctx.state.playlist.id}/tracks`,
        {
          uris: ctx.state.tracks.map(item => item.uri),
        },
        {
          headers: {
            Authorization: `Bearer ${ctx.state.code}`,
          },
        },
      );

      ctx.commit('playlistSnapshotId', response.snapshot_id);

      return response;
    } catch (error) {
      throw new Error(error.response.data.error.message);
    }
  },
};

export const getters = {
  tracks: localState => localState.tracks,
  query: localState => localState.query,
  playlist: localState => localState.playlist,
  authState: localState => localState.authState,
};
