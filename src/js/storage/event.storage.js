'use strict';
const KEY_STORAGE_FIREBASE = 'firebase-storage';
const KEY_STORAGE_LOCAL = 'storage';
import BrowserEventStorage from './storage.js';
import firebaseAPI from "@scripts/firebase/api.service"
import notify from '@components/notify.js';

const storage = new BrowserEventStorage({
  storageKey: KEY_STORAGE_FIREBASE,
  eventName: 'EventBaseUpdate',
  eventCallback: storageChangeHandler,
});

const lStorage = new BrowserEventStorage({
  storageKey: KEY_STORAGE_LOCAL,
  eventName: 'EventLocalUpdate',
  eventCallback: localStorageChangeHandler,
});

async function localStorageChangeHandler(data) {
  const Type = {
    upload: 'upload',
    remove: 'remove',
  };
  if (data['detail']) {
    const { key = undefined, dataOld, dataNew, message } = data['detail'];
    switch (key) {
      case KEY_STORAGE_LOCAL: {
        switch (message) {
          case Type.upload: {
            if (dataOld !== undefined) {
              console.log(`Updated ${KEY_STORAGE_LOCAL}:${message}`);
              const changes = findDifference(
                JSON.parse(dataNew), JSON.parse(dataOld),
              );
              // await store(changes);
            }
            break;
          }

          case Type.remove: {
            console.log(`Updated ${KEY_STORAGE_LOCAL}:${message}`);
            break;
          }
        }

        break;
      }
    }
  }
}

storage.remove();

function decode(list) {
  return list.reduce((pool, entry) => {
    const hash = Object.keys(entry)[0];
    const data = entry[hash];
    pool.push({ hash, ...data });
    return pool;
  }, []);
}

function encode(list) {
  return list.reduce((pool, { hash, id, booked, bought }) => {
    pool.push({ [hash]: { id, booked, bought } });
    return pool;
  }, []);
}

async function load() {
  if (firebaseAPI.isAuth()) {
    try {
      const userId = firebaseAPI.getUserProfile().uid;
      const path = `users/${userId}/event`;
      const data = await firebaseAPI.getList(path);
      currentStorage().save(decode(data))
    } catch (error) {
      notify.showError(error);
    }
  }
}

function currentStorage() {
  return firebaseAPI.isAuth() ? storage : lStorage;
}

function refresh(id, type, hash) {
  const saved = currentStorage().load() || [];
  const data = [];
  for (let cursor = 0; cursor < saved.length; cursor++) {
    const { id: idc } = saved[cursor];
    if (id === idc) {
      switch (type) {
        case "add": {
          data.push({ ...saved[cursor], hash })
          break;
        }
        case "remove": {
          break;
        }
      }
    } else {
      data.push(saved[cursor])
    }
  }
  currentStorage().update(data);
}

async function store(list) {
  if (firebaseAPI.isAuth()) {
    try {
      const userId = firebaseAPI.getUserProfile().uid;
      for (const { hash, id, booked, bought, state } of list) {
        switch (state) {
          case "add": {
            let path = `users/${userId}/event/`;
            const hash = await firebaseAPI.getKey(path);
            refresh(+id, state, hash)
            path = `users/${userId}/event/${hash}/`;
            await firebaseAPI.set(path, { id, booked, bought });
            // console.log(`ADD==>${id}`);
            break;
          }
          case "change": {
            const path = `users/${userId}/event/${hash}/`;
            await firebaseAPI.set(path, { id, booked, bought });
            // console.log(`CHANGE==>${id}`);
            break;
          }
          case "remove": {
            const path = `users/${userId}/event/${hash}/`;
            await firebaseAPI.set(path, null);
            refresh(+id, state, hash)
            // console.log(`REMOVE==>${id}`);
            break;
          }
        }
      }
    } catch (error) {
      notify.showError(error);
    }
  } else {
    // local
  }

}

function bought() {
  const list = currentStorage().load() || [];
  return list.filter(({ bought }) => bought)
}
function booked() {
  const list = currentStorage().load() || [];
  return list.filter(({ booked }) => booked)
}

function clear() {
  return currentStorage().remove();
}

function event(id) {
  const list = currentStorage().load() || [];
  for (let cursor = 0; cursor < list.length; cursor++) {
    const { id: idc } = list[cursor];
    if (id === idc) {
      return { ...list[cursor] }
    }
  }
  // throw new Error("Wrong id")
  return { booked: false, bought: false }
}

async function update(id, data = { booked: false, bought: false }) {
  const list = currentStorage().load() || [];
  old: {
    for (let cursor = 0; cursor < list.length; cursor++) {
      const { id: idc } = list[cursor];
      if (id === idc) {

        list[cursor] = { ...list[cursor], ...data };
        break old;
      }
    }
    if (data.booked || data.bought) {
      list.push({ hash: `Temporary ${id}`, id, ...data });
    }
  }
  currentStorage().save(list)
}


function compare(currentMovie, previousMovie) {
  return currentMovie.booked !== previousMovie.booked ||
    currentMovie.bought !== previousMovie.bought
    ? currentMovie
    : null;
}

function findDifference(currentMovies, previousMovies) {

  const result = [];

  const extractIds = ({ id }) => id;

  const currentMoviesIds = currentMovies.map(extractIds);
  const previousMoviesIds = previousMovies.map(extractIds);


  for (const movieId of currentMoviesIds) {
    if (!previousMoviesIds.includes(movieId)) {
      const movie = currentMovies.find(({ id }) => id === movieId);
      movie['state'] = 'add';
      result.push(movie);
    } else {
      const currentMovie = currentMovies.find(({ id }) => id === movieId);
      const previousMovie = previousMovies.find(({ id }) => id === movieId);
      const movie = compare(currentMovie, previousMovie);
      if (movie && (movie.booked || movie.bought)) {
        movie['state'] = 'change';
        result.push(movie);
      }
    }
  }
  result.push(
    ...currentMovies
      .filter(({ booked, bought }) => !booked && !bought)
      .map(movie => {
        movie['state'] = 'remove'; return movie;
      }),
  );

  return result;
}

async function storageChangeHandler(data) {
  const Type = {
    upload: 'upload',
    remove: 'remove',
  };
  if (data['detail']) {
    const { key = undefined, dataOld, dataNew, message } = data['detail'];
    switch (key) {
      case KEY_STORAGE_FIREBASE: {
        switch (message) {
          case Type.upload: {
            if (dataOld !== undefined) {
              // console.log(`Updated ${KEY_STORAGE_FIREBASE}:${message}`);
              const changes = findDifference(
                JSON.parse(dataNew), JSON.parse(dataOld),
              );
              await store(changes);
            }
            break;
          }

          case Type.remove: {
            // console.log(`Updated ${KEY_STORAGE_FIREBASE}:${message}`);
            break;
          }
        }

        break;
      }
    }
  }
}

// clear()

export default { load, clear, event, update, bought, booked }