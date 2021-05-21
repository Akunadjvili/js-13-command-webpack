import { eventById } from "@scripts/api/api.ticketmaster.features"
import storage from "@scripts/storage/event.storage"
import firebaseAPI from '@scripts/api/api.firebase.service';
import notify from '@components/message.notify.js';
import templateEventCard from '@templates/dynamic/event.info.modal.hbs';


import fabricPagination from '@components/pagination.fabric.js';

import BookedEventProvider from '@providers/booked.events.provider.js';
import BoughtEventProvider from '@providers/bought.events.provider.js';
import SearchEventProvider from '@providers/search.events.provider.js';
import AuthorEventProvider from '@providers/author.events.provider.js';
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
    if (targetEl.dataset.attr && targetEl.nodeName !== "A") {
      this.refs = this.#getReference(this.modal);
      this.binds = this.setBinds();
      this.refs.close?.classList.add("visually-hidden");
      this.refs.close?.addEventListener('click', this.binds.hideEvent)
      this.refs.overlay?.addEventListener('click', this.binds.hideEvent)
      const id = targetEl.dataset.attr;
      const data = { ... await eventById(`${id}`), ...storage.event(id) }
      // console.log(data);
      this.refs.overlay.classList.remove('is-hidden');
      // this.refs.content.classList.add('animate__animated');
      document.body.classList.add("modal-open")
      this.refs.content.innerHTML = this.template({ ...data._embedded.events[0], ...storage.event(id), ...{ "auth": firebaseAPI.isAuth() } }); //._embedded.events[0]

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
  // findMore(event) {
  //   const targetEl = event.target;
  //   const ids0 = targetEl.dataset.id.trim().split(",").filter(id => id !== "");
  //   event.preventDefault();
  //   // console.log("---", ids0);
  //   const data = {
  //     ids0
  //   }
  //   fabricPagination(AuthorEventProvider, window.eventModal, data);
  //   this.#close();
  // }
  findMore(event) {
    const targetEl = event.target;
    const queryInput = document.querySelector('.js-search-input');
    const countrySelect = document.querySelector('.js-country-select');
    queryInput.value = targetEl.dataset.id;
    event.preventDefault();
    const eventsBtn = document.querySelector('.js-events-btn');
    const ticketsBtn = document.querySelector('.js-tickets-btn');
    const data = {
      query: queryInput.value,
      country: countrySelect.value
    }
    eventsBtn?.classList.remove('active-header-button');
    ticketsBtn?.classList.remove('active-header-button');
    fabricPagination(SearchEventProvider, window.eventModal, data);
    this.#close();
  }


  controlsHandler(event) {
    function update(provider) {
      switch (provider) {
        case "BoughtEventProvider":
          fabricPagination(BoughtEventProvider, window.eventModal);
          break
        case "BookedEventProvider":
          fabricPagination(BookedEventProvider, window.eventModal);
          break
      }
    }
    const targetEl = event.target;
    if (targetEl.dataset.action && targetEl.dataset.id) {
      if (targetEl.dataset.url) {
        window.open(targetEl.dataset.url, '_blank');
        return
      }

      const [action, id] = [targetEl.dataset.action, targetEl.dataset.id];
      const state = storage.event(id);
      state[action] = !state[action]

      storage.update(id, state);

      const container = document.querySelector(`.pagination-container`);
      const provider = container?.getAttribute("provider");

      if (action === "expensive" || action === "cheap") {
        if (state[action]) {
          targetEl.innerHTML = "SELL TICKETS"
          targetEl.classList.add("btn__status__buy");
        } else {
          targetEl.innerHTML = "BUY TICKETS"
          targetEl.classList.remove("btn__status__buy");
        }
      }

      if (action === "booked") {
        if (state[action]) {
          targetEl.innerHTML = "REMOVE EVENT"
          targetEl.classList.add("btn__status__save");
        } else {
          targetEl.innerHTML = "SAVE EVENT"
          targetEl.classList.remove("btn__status__save");

        }

      }
      update(provider);
    }
  }


  #close() {
    this.refs.overlay.classList.add('is-hidden');
    // this.refs.content.classList.remove('animate__animated');
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


