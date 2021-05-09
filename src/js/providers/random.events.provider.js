import Provider from './common/provider.js';
import notify from '@components/notify.js';
import { randomEventByPage } from "@scripts/ticketmaster/features"

export default class RandomEventProvider extends Provider {
    constructor({ recordsForPage = 20 } = {}) {
        super();
        this.recordsForPage = recordsForPage;
    }
    getDataTotalSize(data) {
    }
    getPageDataSize() {
    }
    async getData(page) {
        try {
            const data = await randomEventByPage(`${page}`, this.recordsForPage)
            //   const data=extdata;
            this.notify({
                data: data._embedded.events,
                totalDataSize: data.page.totalPages - 1,
                pageDataSize: this.recordsForPage,
                page
            });
        } catch (error) {
            notify.showError(error)
        }
        return this.data;
    }
}
