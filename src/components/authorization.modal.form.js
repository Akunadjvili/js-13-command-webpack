import notify from '@components/message.notify.js';
import firebaseAPI from '@scripts/api/api.firebase.service';
import storageAPI from '@scripts/storage/event.storage';

export default class AuthorizationModalForm {
    constructor({ modal, template }) {
        this.template = template;
        this.refs = this.#getReference(modal);
        this.binds = this.setBinds();
        this.refs.overlay.classList.remove('is-hidden');
        document.body.classList.add("modal-open")
        this.refs.content.innerHTML = this.template();
        this.addEvents();
        window.addEventListener('keydown', this.binds.keyEvent);
        [this.refs.close, this.refs.overlay].forEach(elm =>
            elm.addEventListener('click', this.binds.hideEvent)
        );
    }

    setBinds() {
        return {
            hideEvent: this.hideEvent.bind(this),
            keyEvent: this.keyEvent.bind(this),
            signInClickHandler: this.signInClickHandler.bind(this),
            signUpClickHandler: this.signUpClickHandler.bind(this),
            googleInClickHandler: this.googleInClickHandler.bind(this),
            googleUpClickHandler: this.googleInClickHandler.bind(this),
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
        this.refs.close?.classList.add("visually-hidden");
        this.refs.signForm = document.querySelector('[data-attr="signForm"]');
        this.refs.signIn = document.querySelector('[data-attr="signIn"]');
        this.refs.signUp = document.querySelector('[data-attr="signUp"]');
        this.refs.googleIn = document.querySelector('[data-attr="googleIn"]');
        this.refs.googleUp = document.querySelector('[data-attr="googleUp"]');
        this.refs.closeCustom = document.querySelector('button[data-action="close-modal-custom"]');
        this.refs?.closeCustom?.addEventListener('click', this.binds.hideEvent)


        this.refs.signIn.addEventListener('click', this.binds.signInClickHandler);
        this.refs.signUp.addEventListener('click', this.binds.signUpClickHandler);
        this.refs.googleIn.addEventListener('click', this.binds.googleInClickHandler);
        this.refs.googleUp.addEventListener('click', this.binds.googleUpClickHandler);

    }

    removeEvents() {
        this.refs.signIn.removeEventListener('click', this.binds.signInClickHandler);
        this.refs.signUp.removeEventListener('click', this.binds.signUpClickHandler);
        this.refs.googleIn.removeEventListener('click', this.binds.googleInClickHandler);
        this.refs.googleUp.removeEventListener('click', this.binds.googleUpClickHandler);
        this.refs?.closeCustom?.addEventListener('click', this.binds.hideEvent)
    }

    getSubmittedData(signIn) {
        const data = this.refs.signForm.elements;
        if (signIn) {
            return {
                email: data.emailIn.value,
                password: data.passwordIn.value,
            };
        } else {
            return {
                email: data.emailUp.value,
                password: data.passwordUp.value,
            };
        }
    }

    async signUpClickHandler(event) {
        event.preventDefault();
        await firebaseAPI.signUp(this.getSubmittedData());
        this.#close();
    }

    async signInClickHandler(event) {
        event.preventDefault();
        await firebaseAPI.signIn(this.getSubmittedData(true));
        this.#close();
    }

    async googleInClickHandler(event) {
        event.preventDefault();
        await firebaseAPI.signInGoogle();
        this.#close();
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
                event.preventDefault();
                this.#close();
                break;
        }
    }
};


