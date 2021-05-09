import authTemplate from '@templates/dynamic/user.signin.form.hbs';
import userTemplate from '@templates/dynamic/user.profile.hbs';

import firebaseAPI from '@scripts/firebase/api.service';
import storageAPI from '@scripts/storage/event.storage';

class StandardFireBaseAuth {
  constructor({ placeholder, entry }) {
    this.refs = {};
    this.authContainer = document.querySelector(placeholder);
    this.entryPoint = entry;
    this.binds = this.setBinds()
    firebaseAPI.statusChanged(this.userStatusChanged.bind(this));
  }

  setBinds() {
    return {
      signOutClickHandler: this.signOutClickHandler.bind(this),
      signInClickHandler: this.signInClickHandler.bind(this),
      signUpClickHandler: this.signUpClickHandler.bind(this),
      googleInClickHandler: this.googleInClickHandler.bind(this)
    }
  }
  // this.binds

  clearEvents() {
    if (this.refs.signOut)
      this.refs.signOut.removeEventListener(
        'click',
        this.binds.signOutClickHandler,
      );
    if (this.refs.signIn)
      this.refs.signIn.removeEventListener(
        'click',
        this.binds.signInClickHandler,
      );
    if (this.refs.signUp)
      this.refs.signUp.removeEventListener(
        'click',
        this.binds.signUpClickHandler,
      );
    if (this.refs.googleIn)
      this.refs.googleIn.removeEventListener(
        'click',
        this.binds.googleInClickHandler,
      );
  }

  setEvents() {
    if (this.refs.signOut)
      this.refs.signOut.addEventListener(
        'click',
        this.binds.signOutClickHandler,
      );
    if (this.refs.signIn)
      this.refs.signIn.addEventListener(
        'click',
        this.binds.signInClickHandler,
      );
    if (this.refs.signUp)
      this.refs.signUp.addEventListener(
        'click',
        this.binds.signUpClickHandler,
      );
    if (this.refs.googleIn)
      this.refs.googleIn.addEventListener(
        'click',
        this.binds.googleInClickHandler,
      );
  }

  renderUI() {
    this.refs.signForm = document.querySelector('[data-attr="signForm"]');
    this.refs.signIn = document.querySelector('[data-attr="signIn"]');
    this.refs.signUp = document.querySelector('[data-attr="signUp"]');
    this.refs.signOut = document.querySelector('[data-attr="signOut"]');
    this.refs.googleIn = document.querySelector('[data-attr="googleIn"]');
    this.setEvents();
  }

  async userStatusChanged(user) {
    if (user) {
      this.clearEvents();
      const user = firebaseAPI.getUserProfile();
      this.authContainer.innerHTML = userTemplate({
        name: user.displayName ? user.displayName : user.email,
        email: user.email,
        photoUrl: user.photoURL,
      });
      this.renderUI();
      await storageAPI.load();
      this.entryPoint();
    } else {
      this.clearEvents();
      this.authContainer.innerHTML = authTemplate();
      this.renderUI();
      // storageAPI.clear();
      this.entryPoint();
    }
  }

  getSubmittedData() {
    const data = this.refs.signForm.elements;
    return {
      email: data.email.value,
      password: data.password.value,
    };
  }

  async signUpClickHandler(event) {
    event.preventDefault();
    firebaseAPI.signUp(this.getSubmittedData());
  }

  async signOutClickHandler(event) {
    event.preventDefault();
    firebaseAPI.signOut();
    storageAPI.clear();
  }

  async signInClickHandler(event) {
    event.preventDefault();
    firebaseAPI.signIn(this.getSubmittedData());
  }

  async googleInClickHandler(event) {
    event.preventDefault();

    firebaseAPI.signInGoogle();
  }
}

export default StandardFireBaseAuth;
