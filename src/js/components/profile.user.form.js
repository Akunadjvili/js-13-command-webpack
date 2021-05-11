// import notify from '@components/message.notify.js';
import firebaseAPI from '@scripts/api/api.firebase.service';
import storageAPI from '@scripts/storage/event.storage';

// import signInTemplate from '@templates/dynamic/user.signin.form.hbs';
// import AuthorizationModalForm from '@components/authorization.modal.form.js';

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
            signOutClickHandler: this.signOutClickHandler.bind(this),
        }
    }

    #getReference(place) {
        const content = place;
        return { content };
    }

    addEvents() {
        this.refs.signOut = document.querySelector('[data-attr="signOut"]');
        this.refs.signOut.addEventListener('click', this.binds.signOutClickHandler);
    }

    removeEvents() {
        this.refs.signOut.removeEventListener('click', this.binds.signOutClickHandler);
        this.refs.content.innerHTML = ""
    }

    async signOutClickHandler(event) {
        event.preventDefault();
        firebaseAPI.signOut();
        storageAPI.clear();

    }
};


