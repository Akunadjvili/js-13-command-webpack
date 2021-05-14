//initialization
import storage from '@scripts/storage/event.storage';
import firebaseAPI from '@scripts/api/api.firebase.service';
//do not touch this records
import '@components/button.backtotop';


import teamMarkUpTpl from '@templates/dynamic/team.info.hbs';
import TeamModalForm from '@components/team.modal.form'

import PaginationBar from '@components/pagination.bar';
import PaginationPlaceholder from '@components/pagination.placeholder.js';
import RandomEventProvider from '@providers/random.events.provider.js';
import SearchEventProvider from '@providers/search.events.provider.js';

import InfoEventModalForm from '@scripts/components/info.event.modal.form.js';
import StandardFireBaseAuth from '@scripts/components/firebase.auth';

import templateEventCard from '@templates/dynamic/event.info.modal.hbs';
import templateEventsList from '@templates/dynamic/events.list.hbs';


const teamLinkRef = document.querySelector('.team-link');
teamLinkRef.addEventListener('click', openFormHandler);

async function openFormHandler(event) {
    event.preventDefault();
    const modal = new TeamModalForm({
        modal: '.js-modal',
        template: teamMarkUpTpl,
    })
    await modal.show.bind(modal)();
}

const eventModal = new InfoEventModalForm({
    modal: '.js-modal',
    template: templateEventCard,
});

new StandardFireBaseAuth({ placeholder: '.header-auth', entry });

function fabricPagination(provider, action, params,) {
    new PaginationBar({
        container: '.pagination-container',
        viewProvider: new PaginationPlaceholder({
            selector: '.pgn__cards-holder',
            template: templateEventsList,
        }),
        dataProvider: new provider(),
        action,
        params,
    });
}

async function entry() {
    fabricPagination(RandomEventProvider, eventModal.openEvent.bind(eventModal));
}


const queryInput = document.querySelector('.js-search-input');
const searchForm = document.querySelector('.search-form');
const countrySelect = document.querySelector('.js-country-select');

const find = function (event) {
    event.preventDefault();
    const data = {
        query: queryInput.value,
        country: countrySelect.value
    }

    fabricPagination(SearchEventProvider, eventModal.openEvent.bind(eventModal), data);
}

searchForm.addEventListener('submit', find);
countrySelect.addEventListener('change', find);