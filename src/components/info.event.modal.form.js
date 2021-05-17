import { eventById } from "@scripts/api/api.ticketmaster.features"
import storage from "@scripts/storage/event.storage"
import notify from '@components/message.notify.js';
import fabricPagination from '@components/pagination.fabric.js';
import templateEventCard from '@templates/dynamic/event.info.modal.hbs';
import SearchEventProvider from '@providers/search.events.provider.js';

export default class InfoEventModalForm {
  constructor({ modal, template }) {
    this.template = template;
    this.modal = modal;
  }

  setBinds() {
    return {
      hideEvent: this.hideEvent.bind(this),
      keyEvent: this.keyEvent.bind(this),
      findMore: this.findMore.bind(this),
    }
  }

  #getReference(selector) {
    const modal = document.querySelector(selector);
    const overlay = document.querySelector('.modal__overlay');
    const content = document.querySelector('.modal__content');
    const close = document.querySelector('button[data-action="close-modal"]');

    return { modal, overlay, content, close };
  }

  async openEvent(event) {
    const targetEl = event.target;
    if (targetEl.dataset.attr) {
      this.refs = this.#getReference(this.modal);
      this.binds = this.setBinds();
      this.refs.close?.classList.add("visually-hidden");
      this.refs.close?.addEventListener('click', this.binds.hideEvent)
      this.refs.overlay?.addEventListener('click', this.binds.hideEvent)
      const id = targetEl.dataset.attr;
      const data = { ... await eventById(`${id}`), ...storage.event(id) }

      this.refs.overlay.classList.remove('is-hidden');
      document.body.classList.add("modal-open")
      this.refs.content.innerHTML = this.template({ ...data._embedded.events[0], ...storage.event(id) }); //._embedded.events[0]

      this.addEvents();

      window.addEventListener('keydown', this.binds.keyEvent);

      event.preventDefault();
    } else {
      if (targetEl.nodeName === "A") {
        window.open(targetEl.href, '_blank');
      }

    }
  }

  addEvents() {
    this.refs.controls = document.querySelectorAll('[data-controls]');
    this.refs.find = document.querySelector('[data-find]');
    this.refs.closeCustom = document.querySelector('button[data-action="close-modal-custom"]');
    this.refs?.closeCustom?.addEventListener('click', this.binds.hideEvent)
    this.refs?.controls?.forEach(control => control?.addEventListener('click', this.controlsHandler))
    this.refs?.find?.addEventListener('click', this.binds.findMore)
  }

  removeEvents() {
    this.refs?.controls?.forEach(control => control?.removeEventListener('click', this.controlsHandler))
    this.refs?.closeCustom?.removeEventListener('click', this.binds.hideEvent)
    this.refs?.find?.removeEventListener('click', this.binds.findMore)
  }

  findMore(event) {
    const targetEl = event.target;
    const queryInput = document.querySelector('.js-search-input');
    const countrySelect = document.querySelector('.js-country-select');
    queryInput.value = targetEl.dataset.id;
    event.preventDefault();

    const data = {
      query: queryInput.value,
      country: countrySelect.value
    }
    fabricPagination(SearchEventProvider, window.eventModal, data);
    this.#close();
  }

  controlsHandler(event) {
    const targetEl = event.target;
    if (targetEl.dataset.action && targetEl.dataset.id) {

      const [action, id] = [targetEl.dataset.action, targetEl.dataset.id];
      const state = storage.event(id);
      console.log("state", state);
      state[action] = !state[action]
      storage.update(id, state);
      if (state[action]) {
        targetEl.classList.add("modal__event__button--active");
      } else {
        targetEl.classList.remove("modal__event__button--active");
      }
    }
  }



  #close() {
    this.refs.overlay.classList.add('is-hidden');
    this.removeEvents();
    this.refs.content.innerHTML = ""
    document.body.classList.remove("modal-open")
    window.removeEventListener('keydown', this.binds.keyEvent);
  }

  hideEvent(event) {
    if (event.target === event.currentTarget) {
      event.preventDefault();
      this.#close();
    }
  }

  keyEvent(event) {
    switch (event.key) {
      case 'Escape':
        this.hideEvent(event);
        this.#close();
        break;
    }
  }
};


