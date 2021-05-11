// import notify from '@components/message.notify.js';
// import firebaseAPI from '@scripts/api/api.firebase.service';
// import storageAPI from '@scripts/storage/event.storage';

import signInTemplate from '@templates/dynamic/user.signin.form.hbs';

import AuthorizationModalForm from '@components/authorization.modal.form.js';

export default class SelectSignForm {
    constructor({ place, template }) {
        this.template = template;
        this.refs = this.#getReference(place);
        this.binds = this.setBinds();
        this.refs.content.innerHTML = this.template();
        this.addEvents();
    }
    setBinds() {
        return {
            signSelectHandler: this.openSignSelector.bind(this)
        }
    }

    #getReference(place) {
        const content = place;
        return { content };
    }
    addEvents() {
        this.refs.signSelect = document.querySelector('[data-attr="signSelect"]');
        this.refs.signSelect.addEventListener('click', this.binds.signSelectHandler);
    }
    removeEvents() {
        this.refs.signSelect.removeEventListener('click', this.binds.signSelectHandler)
        this.refs.content.innerHTML = ""
    }


    openSignSelector() {
        new AuthorizationModalForm({
            modal: '.js-modal',
            template: signInTemplate,
        })
        // this.#close.bind(this);
    }

};


