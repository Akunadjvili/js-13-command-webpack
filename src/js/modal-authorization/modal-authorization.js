import AuthorizationModalForm from '@scripts/components/AuthorizationModalForm.js';
import signInTemplate from '@templates/dynamic/user.signin.form.hbs';
const openModalBtn = document.querySelector('[data-modal-open]');
openModalBtn.addEventListener('click', openSignFormHandler);

function openSignFormHandler(event) {
  new AuthorizationModalForm({
    modal: '.js-modal',
    template: signInTemplate,
  })
}