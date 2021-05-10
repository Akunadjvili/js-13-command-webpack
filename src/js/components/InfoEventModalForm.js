import { eventById } from "@scripts/ticketmaster/features"
import storage from "@scripts/storage/event.storage"
import notify from '@components/notify.js';

export default class InfoEventModalForm {
  constructor({ modal, template }) {
    this.template = template;
    this.modal = modal;
  }

  setBinds() {
    return {
      hideEvent: this.hideEvent.bind(this),
      keyEvent: this.keyEvent.bind(this)
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
      [this.refs.close, this.refs.overlay].forEach(elm =>
        elm.addEventListener('click', this.binds.hideEvent)
      );

      const id = Number(targetEl.dataset.attr);
      const data = { ... await eventById(`${id}`), ...storage.event(id) }
      // console.log(data);
      this.refs.overlay.classList.remove('is-hidden');
      document.body.classList.toggle("modal-open")
      this.refs.content.innerHTML = this.template(data);
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
    this.refs.controls = document.querySelector('[data-controls]');
    if (this.refs.controls) this.refs.controls.addEventListener('click', this.controlsHandler)
  }

  removeEvents() {
    if (this.refs.controls) this.refs.controls.removeEventListener('click', this.controlsHandler)
  }

  controlsHandler(event) {
    const targetEl = event.target;
    if (targetEl.dataset.action && targetEl.dataset.id) {
      const [action, id] = [targetEl.dataset.action, Number(targetEl.dataset.id)];
      const state = storage.event(id);
      state[action] = !state[action]
      storage.update(id, state);
      if (state[action]) {
        targetEl.classList.add("event__button--active");
      } else {
        targetEl.classList.remove("event__button--active");
      }
    }
  }


  #close() {
    this.refs.overlay.classList.add('is-hidden');
    this.removeEvents();
    this.refs.content.innerHTML = ""
    document.body.classList.toggle("modal-open")
    window.removeEventListener('keydown', this.binds.keyEvent);
  }

  hideEvent(event) {
    if (event.target === event.currentTarget) {
      console.log("===1");
      event.preventDefault();
      this.#close();
    }
  }

  keyEvent(event) {
    switch (event.key) {
      case 'Escape':
        console.log("===2");
        // this.hideEvent(event);
        this.#close();
        break;
    }
  }
};


