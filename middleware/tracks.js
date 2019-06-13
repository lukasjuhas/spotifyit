export default async function ({ store, redirect }) {
  if (!store.getters.tracks.length) {
    redirect('/');
  }
}
