import modalTemplate from '../../templates/dynamic/user.signin.form.hbs';

const refs = {
  openModalBtn: document.querySelector('[data-modal-open]'),
};

refs.openModalBtn.addEventListener('click', renderModal);

function renderModal() {
  // refs.modalContent = document.querySelector('.modal__content');
  // refs.modalContent.innerHTML = modalTemplate();

  document.body.innerHTML = modalTemplate();
  console.log((document.body.innerHTML = modalTemplate()));

  refs.modal = document.querySelector('[data-modal]');
  toggleModal();
  // refs.modal.classList.remove('is-hidden');
  refs.closeModalBtn = document.querySelector('[data-modal-close]');
  // refs.closeModalBtn.addEventListener('click', toggleModal);
  window.addEventListener('keydown', escapeClose);
}

function toggleModal() {
  refs.modal.classList.toggle('is-hidden');
}

function escapeClose(event) {
  if (event.code === 'Escape') {
    toggleModal();
  }
}
