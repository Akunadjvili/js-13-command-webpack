import notify from '@components/message.notify.js';
import fetchTeam from '@scripts/api/api.team.service';

export default class AuthorizationModalForm {
    constructor({ modal, template }) {
        this.template = template;
        this.modal = modal;
    }
    async show() {
        try {
            const data = await fetchTeam();
            this.refs = this.#getReference(this.modal);
            this.binds = this.setBinds();
            this.refs.overlay.classList.remove('is-hidden');
            document.body.classList.add("modal-open")
            this.refs.content.innerHTML = this.template(data);
            this.addEvents();
            window.addEventListener('keydown', this.binds.keyEvent);
            [this.refs.close, this.refs.overlay].forEach(elm =>
                elm.addEventListener('click', this.binds.hideEvent)
            );
        } catch (error) {
            notify.showError(error);
        }

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

    addEvents() {
        this.refs.close?.classList.remove("visually-hidden");
    }

    removeEvents() {

    }

    #close() {
        this.refs.overlay.classList.add('is-hidden');
        document.body.classList.remove("modal-open")
        this.removeEvents();
        this.refs.content.innerHTML = ""
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
                this.#close();
                break;
        }
    }
};


