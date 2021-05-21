import notify from '@components/message.notify.js';
export default class PaginationPlaceholder {
  constructor({ template, selector }) {
    this.template = template;
    this.selector = selector;
  }
  getReference(selector) {
    const list = document.querySelector(`${selector}`);
    return { list };
  }
  init() {
    this.refs = this.getReference(this.selector);
    this.openEventBindLink = this.openCardEvent.bind(this);
    this.refs.list.addEventListener('click', this.openEventBindLink);
  }
  destroy() {
    if (this.refs?.list) {
      this.refs.list.removeEventListener('click', this.openEventBindLink);
    }
  }

  async openCardEvent(event) {
    event.preventDefault();
    const targetEl = event.target;
    if (targetEl.nodeName === 'LI') {
      //await this.movieCardModal.update({});
    }
  }

  draw(holder, data) {
    holder.innerHTML = this.template({ data });
    if (!data || data.length === 0) {
      notify.showInfo({ code: "Data records are empty", message: "Oops ... Empty" });
    }
  }

  scroll() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  update(holder, data) {
    this.destroy();
    this.draw(holder, data);
    this.init();
    this.scroll();
  }
}


