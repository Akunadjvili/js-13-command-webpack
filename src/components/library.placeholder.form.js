import libraryTemplate from '@templates/dynamic/library.placeholder.hbs';
import InfoEventModalForm from '@scripts/components/info.event.modal.form.js';


import fabricPagination from '@components/pagination.fabric.js';

import PaginationBar from '@components/pagination.bar';
import PaginationPlaceholder from '@components/pagination.placeholder.js';

import templateEventCard from '@templates/dynamic/event.info.modal.hbs';
import templateEventsList from '@templates/dynamic/events.list.hbs';

import BookedEventProvider from '@providers/booked.events.provider.js';
import BoughtEventProvider from '@providers/bought.events.provider.js';

export default class LibraryContainer {
    constructor() {
        this.template = libraryTemplate;
        this.refs = this.#getReference(".js-personal-account");
        this.binds = this.setBinds();
        this.refs.content.innerHTML = this.template();

        this.addEvents();
        //this.binds.loadSavedEvents();
    }
    setBinds() {
        return {
            loadSavedEvents: this.loadSavedEvents.bind(this),
            loadSavedTickets: this.loadSavedTickets.bind(this),
        }
    }

    #getReference(place) {
        const content = document.querySelector(place);
        return { content };
    }
    addEvents() {
        this.refs.loadSavedEvents = document.querySelector('.js-events-btn');
        this.refs.loadSavedEvents.addEventListener('click', this.binds.loadSavedEvents);
        this.refs.loadSavedTickets = document.querySelector('.js-tickets-btn');
        this.refs.loadSavedTickets.addEventListener('click', this.binds.loadSavedTickets);
    }
    removeEvents() {
        this.refs.loadSavedEvents.removeEventListener('click', this.binds.loadSavedEvents)
        this.refs.loadSavedTickets.removeEventListener('click', this.binds.loadSavedTickets)
        this.refs.content.innerHTML = ""
    }

    loadSavedEvents() {
        this.refs.loadSavedEvents.classList.add('active-header-button')
        this.refs.loadSavedTickets.classList.remove('active-header-button')
        fabricPagination(BookedEventProvider, window.eventModal);
    }

    loadSavedTickets() {
        this.refs.loadSavedEvents.classList.remove('active-header-button')
        this.refs.loadSavedTickets.classList.add('active-header-button')
        fabricPagination(BoughtEventProvider, window.eventModal);
    }

};


