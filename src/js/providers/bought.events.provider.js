import Provider from './common/provider.js';
import notify from '@components/notify.js';
import { eventsByIds } from "@scripts/ticketmaster/features"
import storage from "@scripts/storage/event.storage"

export default class BoughtEventProvider extends Provider {

  constructor({ recordsForPage = 20 } = {}) {
    super();
    this.recordsForPage = recordsForPage;
  }

  getDataTotalSize(data) {
    return storage.bought().length
  }

  getPageDataSize() {
    return this.recordsForPage;
  }

  async getData(page) {
    try {
      const ids = storage.bought().map(({ id }) => id);
      const interval = [
        (page - 1) * this.getPageDataSize(),
        (page - 1) * this.getPageDataSize() + this.getPageDataSize(),
      ];
      const data = await eventsByIds(ids.slice(...interval))
      this.notify({
        data: data,
        totalDataSize: this.getDataTotalSize(),
        pageDataSize: this.getPageDataSize(),
        page,
      });
    } catch (error) {
      notify.showError(error)
    }
    return this.data;
  }
}


