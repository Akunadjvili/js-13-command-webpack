import Provider from './common/provider.js';
import notify from '@components/message.notify.js';
import { eventsByIds } from "@scripts/api/api.ticketmaster.features"
import storage from "@scripts/storage/event.storage"

export default class BookedEventProvider extends Provider {

  constructor({ recordsForPage = 20 } = {}) {
    super();
    this.recordsForPage = recordsForPage;
  }

  getDataTotalSize(data) {
    return storage.booked().length
  }

  getPageDataSize() {
    return this.recordsForPage;
  }

  async getData(page) {
    try {
      const ids = storage.booked().map(({ id }) => id);
      const interval = [
        (page - 1) * this.getPageDataSize(),
        (page - 1) * this.getPageDataSize() + this.getPageDataSize(),
      ];
      const data = await eventsByIds(ids.slice(...interval))
      // console.log(data);
      const events = data.reduce((acc, value) => {
        if (value._embedded?.events) {
          acc.push(value._embedded.events[0]);
        }
        return acc
      }, [])
      this.notify({
        data: events,
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


