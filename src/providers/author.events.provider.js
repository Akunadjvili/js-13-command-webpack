import Provider from './common/provider.js';
import notify from '@components/message.notify.js';
import { eventsByAuthor } from "@scripts/api/api.ticketmaster.features"
import storage from "@scripts/storage/event.storage"

export default class AuthorEventProvider extends Provider {

  constructor({ recordsForPage = 20 } = {}) {
    super();
    this.data = [];
    this.recordsForPage = recordsForPage;
  }

  getDataTotalSize(data) {
    return this.data.length
  }

  getPageDataSize() {
    return this.recordsForPage;
  }

  async getData(page, { ids0 = [] }) {
    this.data = [...ids0];
    console.log("--", this.data);
    try {
      const ids = this.data.map((id) => id);
      console.log("---", ids0);
      const interval = [
        (page - 1) * this.getPageDataSize(),
        (page - 1) * this.getPageDataSize() + this.getPageDataSize(),
      ];
      const data = await eventsByAuthor(ids.slice(...interval))
      console.log(ids.slice(...interval), data);
      const events = data.reduce((acc, value) => {
        if (value?.name) {
          acc.push(value);
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


