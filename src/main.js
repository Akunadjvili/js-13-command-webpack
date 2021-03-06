//initialization
import storage from '@scripts/storage/event.storage';
import firebaseAPI from '@scripts/api/api.firebase.service';
//do not touch this records
import '@components/button.backtotop';

import teamMarkUpTpl from '@templates/dynamic/team.info.hbs';
import TeamModalForm from '@components/team.modal.form';

import fabricPagination from '@components/pagination.fabric.js';
import RandomEventProvider from '@providers/random.events.provider.js';
import SearchEventProvider from '@providers/search.events.provider.js';

import InfoEventModalForm from '@scripts/components/info.event.modal.form.js';
import StandardFireBaseAuth from '@scripts/components/firebase.auth';

import templateEventCard from '@templates/dynamic/event.info.modal.hbs';

const teamLinkRef = document.querySelector('.team-link');
teamLinkRef.addEventListener('click', openFormHandler);

async function openFormHandler(event) {
  event.preventDefault();
  const modal = new TeamModalForm({
    modal: '.js-modal',
    template: teamMarkUpTpl,
  });
  await modal.show.bind(modal)();
}

const globalModal = new InfoEventModalForm({
  modal: '.js-modal',
  template: templateEventCard,
});

window.eventModal = globalModal.openEvent.bind(globalModal);

new StandardFireBaseAuth({ placeholder: '.header-auth', entry });
async function entry() {
  fabricPagination(RandomEventProvider, window.eventModal);
}

const queryInput = document.querySelector('.js-search-input');
const searchForm = document.querySelector('.search-form');
const countrySelect = document.querySelector('.js-country-select');


const find = function (event) {
  event.preventDefault();
  const data = {
    query: queryInput.value,
    country: countrySelect.value,
  };
  const eventsBtn = document.querySelector('.js-events-btn');
  const ticketsBtn = document.querySelector('.js-tickets-btn');
  eventsBtn?.classList.remove('active-header-button');
  ticketsBtn?.classList.remove('active-header-button');
  fabricPagination(SearchEventProvider, window.eventModal, data);
};

searchForm.addEventListener('submit', find);
countrySelect.addEventListener('change', find);
