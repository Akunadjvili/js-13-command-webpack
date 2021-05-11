import notify from '@components/message.notify.js';
class BrowserStorageApi {
  constructor({ storage = window.localStorage, storageKey = null } = {}) {
    this.storage = storage;
    this.storageKey = storageKey;
  }
  loadFromStorage(callback) {
    try {
      const state = this.storage.getItem(this.storageKey);
      if (callback)
        callback({
          key: this.storageKey,
          dataOld: null,
          dataNew: null,
          message: 'load',
        });
      return state === null ? undefined : JSON.parse(state);
    } catch (error) {
      notify.showError(error);
      console.log('Get state error', error);
    }
  }

  saveToStorage(value, callback) {

    try {
      const state = JSON.stringify(value);
      const oldState = JSON.stringify(this.loadFromStorage.apply(this, callback))
      this.storage.setItem(this.storageKey, state);
      if (callback)
        callback({
          key: this.storageKey,
          dataOld: oldState,
          dataNew: state,
          message: 'upload',
        });
    } catch (error) {
      notify.showError(error);
      console.log('Set state error', error);
    }
  }
  removeFromStorage(callback) {
    try {
      this.storage.removeItem(this.storageKey);
      if (callback)
        callback({
          key: this.storageKey,
          dataOld: null,
          dataNew: null,
          message: 'remove',
        });
    } catch (error) {
      notify.showError(error);
      console.log('Remove state error', error);
    }
  }

  updateStorage(value) {
    try {
      const state = JSON.stringify(value);
      this.storage.setItem(this.storageKey, state);
    } catch (error) {
      notify.showError(error);
      console.log('Set state error', error);
    }
  }
}

class StorageEventTrigger extends CustomEvent {
  constructor(name, data) {
    super(name, data);
  }
  throw() {
    window.dispatchEvent(this);
  }
}

export default class BrowserEventStorage extends BrowserStorageApi {
  event = {};
  constructor({
    storage = window.localStorage,
    eventCallback = console.log,
    eventName = null,
    storageKey = null,
  } = {}) {
    super({ storage, storageKey });
    this.event.name = `on${eventName}`;
    this.register(this.event.name, eventCallback);
  }

  register(name, event) {
    if (window.addEventListener) {
      window.addEventListener(name, event, false);
    } else {
      window.attachEvent(name, event);
    }
  }

  trigger(detail) {
    new StorageEventTrigger(this.event.name, { detail }).throw();
  }

  load() {
    return this.loadFromStorage(this.trigger.bind(this));
  }
  save(value) {
    this.saveToStorage(value, this.trigger.bind(this));
  }
  remove() {
    this.removeFromStorage(this.trigger.bind(this));
  }
  update(value) {
    this.updateStorage(value);
  }
}
