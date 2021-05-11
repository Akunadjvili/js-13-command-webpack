import authTemplate from '@templates/dynamic/user.sign.selector.hbs';
import userTemplate from '@templates/dynamic/user.profile.hbs';

import firebaseAPI from '@scripts/api/api.firebase.service';
import storageAPI from '@scripts/storage/event.storage';


import AuthorizationModalForm from '@components/authorization.modal.form.js';

import SelectSignForm from '@components/select.sign.form.js';
import ProfileUserForm from '@components/profile.user.form.js';


import signInTemplate from '@templates/dynamic/user.signin.form.hbs';


class StandardFireBaseAuth {
  constructor({ placeholder, entry }) {
    this.refs = {};
    this.authContainer = document.querySelector(placeholder);
    this.entryPoint = entry;
    this.selector = undefined;
    this.profile = undefined;
    firebaseAPI.statusChanged(this.userStatusChanged.bind(this));
  }

  async userStatusChanged(user) {
    if (user) {
      const user = firebaseAPI.getUserProfile();
      this.selector?.removeEvents()
      this.profile = new ProfileUserForm({
        place: this.authContainer,
        template: userTemplate.bind(this, {
          name: user.displayName ? user.displayName : user.email,
          email: user.email,
          photoUrl: user.photoURL,
        }),
      });
      await storageAPI.load();
      this.entryPoint();
    } else {
      this.profile?.removeEvents()
      this.selector = new SelectSignForm({
        place: this.authContainer,
        template: authTemplate,
      });
      this.entryPoint();
    }
  }
}

export default StandardFireBaseAuth;
