import Provider from './common/provider.js';
import notify from '@components/message.notify.js';
import { eventSearchByPage } from "@scripts/api/api.ticketmaster.features"

export default class SearchEventProvider extends Provider {
  constructor({ recordsForPage = 20 } = {}) {
    super();
    this.recordsForPage = recordsForPage;
  }
  getDataTotalSize(data) {
  }
  getPageDataSize() {
  }
  async getData(page, { query = "", country = "", size = this.recordsForPage }) {
    try {
      const data = await eventSearchByPage(`${page}`, query, country, size)
      this.notify({
        data: data?._embedded?.events ? data._embedded.events : [],
        totalDataSize: Math.min(data.page.totalPages - 1, 400),//data.page.totalPages - 1,
        pageDataSize: this.recordsForPage,
        page
      });
    } catch (error) {
      notify.showError(error)
    }
    return this.data;
  }
}
