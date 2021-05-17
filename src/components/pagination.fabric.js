
import PaginationBar from '@components/pagination.bar';
import PaginationPlaceholder from '@components/pagination.placeholder.js';

import templateEventsList from '@templates/dynamic/events.list.hbs';

export default function fabricPagination(provider, action, params,) {
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