//initialization
import storage from '@scripts/storage/event.storage';
import firebaseAPI from '@scripts/firebase/api.service';
//do not touch this records

import PaginationBar from '@components/PaginationBar';
import PaginationPlaceholder from './components/PaginationPlaceholder.js';

import RandomEventProvider from '@providers/random.events.provider.js';
import InfoEventModalForm from '@scripts/components/InfoEventModalForm.js';

import templateEventCard from '@templates/dynamic/event.info.modal.hbs';
import templateEventsList from '@templates/dynamic/events.list.hbs';

import StandardFireBaseAuth from '@scripts/components/StandardFireBaseAuth';

const eventModal = new InfoEventModalForm({
    modal: '.js-modal',
    template: templateEventCard,
});



new StandardFireBaseAuth({ placeholder: '.header-auth', entry });


function fabricPagination(provider, params) {
    new PaginationBar({
        container: '.pagination-container',
        viewProvider: new PaginationPlaceholder({
            selector: '.pgn__cards-holder',
            template: templateEventsList,
        }),
        dataProvider: new provider(),
        action: eventModal.openEvent.bind(eventModal),
        params,
    });
}


async function entry() {
    fabricPagination(RandomEventProvider);
}