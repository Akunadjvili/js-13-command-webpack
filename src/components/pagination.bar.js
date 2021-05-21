import pgnTemplate from '@templates/dynamic/pagination.hbs';
import debounce from 'lodash.debounce';
import utils from '@scripts/utils/utils.js';

function getAnyClass(obj) {
  if (typeof obj === "undefined") return "undefined";
  if (obj === null) return "null";
  return obj.constructor.name;
}

export default class PaginationBar {
  PgnPgsBtn = 5;
  constructor({
    container,
    viewProvider,
    dataProvider,
    action,
    page = 1,
    desktop = true,
    params,
  }) {
    this.dataProvider = dataProvider;

    this.viewProvider = viewProvider;
    this.params = params;
    this.desktop = desktop;
    // this.desktop = utils.currentViewPortWidth() > 320 ? true : false;
    this.refs = this.getReference(container);
    if (action) {
      this.refs.cards.addEventListener('click', action);
    }
    this.refs.container.setAttribute("provider", getAnyClass(dataProvider))
    this.hidePagination();
    this.dataProvider.observe(this, this.update);
    this.dataProvider.getData(page, this.params);
    // this.binders = { "resize": debounce(this.resize.bind(this), 100) }
    this.init();
  }

  getReference(selector) {
    function find(selector) {
      return container.querySelector(`${selector}`);
    }
    function findAll(selector) {
      return container.querySelectorAll(`${selector}`);
    }
    const container = document.querySelector(`${selector}`);
    container.innerHTML = '';
    this.renderPagineMarkup(container);

    const cards = find('.pgn__cards-holder');
    const controls = find('.pgn__controls');
    const startEmpty = find('.pgn__btn--empty-start');
    const finishEmpty = find('.pgn__btn--empty-finish');
    const previous = find('.pgn__btn--previous');
    const next = find('.pgn__btn--next');
    const pagesList = findAll('.pgn__btn--pages');

    return {
      container,
      controls,
      startEmpty,
      finishEmpty,
      previous,
      next,
      pagesList,
      cards,
    };
  }

  renderPagineMarkup(container) {
    container.insertAdjacentHTML(
      'beforeend',
      pgnTemplate({ count: this.PgnPgsBtn }),
    );
  }

  configurePgn(options) {
    function add(element, className) {
      if (!element.classList.contains(className)) {
        element.classList.add(className);
      }
    }

    function remove(element, className) {
      element.classList.remove(className);
    }
    add(this.refs.previous, 'visually-hidden');
    add(this.refs.next, 'visually-hidden');
    this.refs.previous.dataset.page = -Infinity;
    this.refs.next.dataset.page = Infinity;

    if (!options.previous) {
      add(this.refs.startEmpty, 'visually-hidden');
    } else {
      remove(this.refs.startEmpty, 'visually-hidden');
    }

    if (!options.next) {
      add(this.refs.finishEmpty, 'visually-hidden');
    } else {
      remove(this.refs.finishEmpty, 'visually-hidden');
    }

    if (!options.desktop) {
      add(this.refs.startEmpty, 'visually-hidden');
      add(this.refs.finishEmpty, 'visually-hidden');
    }

    this.refs.pagesList.forEach(element => {
      element.dataset.page = NaN;
      add(element, 'visually-hidden');
    });
    let neededButtons;

    const btn = Array.from(this.refs.pagesList);

    if (options.next) {
      neededButtons = [
        btn[0],
        ...btn.slice(1, 1 + (options.buttons.length - 2)),
        btn[btn.length - 1],
      ];
    } else {
      neededButtons = [...btn];
    }

    for (let i = 0; i < options.buttons.length; i += 1) {
      remove(neededButtons[i], 'visually-hidden');
      neededButtons[i].textContent = options.buttons[i];
      neededButtons[i].dataset.page = options.buttons[i];
    }
  }

  blanks(activePageIndex, totalButtons, totalPages) {
    if (totalButtons + 2 >= totalPages) {
      return { previous: false, next: false };
    }
    const previous =
      activePageIndex - (~~(totalButtons / 2) + 1) > 1 ? true : false;
    const next =
      totalPages - (activePageIndex + (~~(totalButtons / 2) + 1)) >= 1
        ? true
        : false;
    return { previous, next };
  }

  pages(
    activePageIndex,
    totalButtons,
    totalPages,
    { previous, next },
    desktop,
  ) {
    let result;
    if (previous && next) {
      result = this.#generate(
        activePageIndex - ~~(totalButtons / 2),
        activePageIndex + ~~(totalButtons / 2) + 1,
      );
      if (desktop) {
        result.unshift(1);
        result.push(totalPages);
      }
    }

    if (!previous && next) {
      const start = desktop
        ? 1
        : Math.max(activePageIndex - ~~(totalButtons / 2), 1);
      result = this.#generate(
        start,
        activePageIndex + ~~(totalButtons / 2) + 1,
      );
      if (desktop) {
        result.push(totalPages);
      }
      return result;
    }

    if (previous && !next) {
      const finish = desktop
        ? totalPages + 1
        : Math.min(activePageIndex + ~~(totalButtons / 2) + 1, totalPages + 1);
      result = this.#generate(activePageIndex - ~~(totalButtons / 2), finish);
      if (desktop) {
        result.unshift(1);
      }
      return result;
    }

    if (!previous && !next) {
      return this.#generate(1, totalPages + 1);
    }

    return result;
  }

  getOptionsPgn(totalDataSize, pageDataSize) {
    this.totalPages = Math.ceil(totalDataSize / pageDataSize);
    const showControls = this.blanks(
      this.activePgInd,
      this.PgnPgsBtn,
      this.totalPages,
    );

    const buttons = this.pages(
      this.activePgInd,
      this.PgnPgsBtn,
      this.totalPages,
      showControls,
      this.desktop,
    );
    return {
      beginValue: 1,
      endValue: this.totalPages,
      previous: showControls.previous,
      next: showControls.next,
      buttons: buttons,
      desktop: this.desktop,
    };
  }

  #generate(start, finish) {
    const result = [];
    for (let i = start; i < finish; i++) {
      result.push(i);
    }
    return result;
  }


  #addEvent(object, type, callback) {
    if (object == null || typeof (object) == 'undefined') return;
    if (object.addEventListener) {
      object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
      object.attachEvent("on" + type, callback);
    } else {
      object["on" + type] = callback;
    }
  };

  // resize(event) {
  //   console.log("width:", utils.currentViewPortWidth());
  //   const state = utils.currentViewPortWidth() > 320 ? true : false;
  //   if (this.desktop !== state) {
  //     this.desktop = state;
  //     this.dataProvider.getData(this.activePgInd, this.params);
  //   }

  // }


  init() {
    this.refs.controls.addEventListener(
      'click',
      this.onClickPageSelector.bind(this),
    );

    // window.addEventListener('resize', this.binders["resize"]);
  }

  destroy() {
    this.dataProvider.unobserve(this);
    this.refs.controls.removeEventListener('click', this.onClickPageSelector);
    // window.removeEventListener('resize', this.binders["resize"]);
    this.refs.cards.removeEventListener('click', action);
    this.container.innerHTML = '';
  }

  resetHighlightBtns() {
    const actElms = this.refs.controls.querySelectorAll('.pgn__btn--active');
    actElms.forEach(elm => {
      elm.classList.remove('pgn__btn--active');
    });
  }
  highlightBtn(page) {
    const buttons = this.refs.controls.querySelectorAll('.pgn__btn');
    const current = Array.from(buttons).find(btn => {
      return Number(btn?.dataset?.page) === page;
    });
    current.classList.add('pgn__btn--active');
  }

  async onClickPageSelector(event) {
    event.preventDefault();
    let page = Number(event.target.dataset.page);
    if (page === -Infinity) {
      page = this.activePgInd;
      page -= this.PgnPgsBtn;
      page = Math.max(page, 1);
    }
    if (page === Infinity) {
      page = this.activePgInd;
      page += this.PgnPgsBtn;
      page = Math.min(page, this.totalPages);
    }
    if (page) {
      this.activePgInd = page;
      await this.dataProvider.getData(page, this.params);
    }
  }

  update({ data, totalDataSize, pageDataSize, page }) {
    this.activePgInd = page;
    const options = this.getOptionsPgn(totalDataSize, pageDataSize);
    if (this.activePgInd <= this.totalPages) {
      this.resetHighlightBtns();
      this.configurePgn(options);
      this.viewProvider.update(this.refs.cards, data);
      this.showPagination();
      this.highlightBtn(this.activePgInd);
      this.showPaginationButton();
    } else {
      this.viewProvider.update(this.refs.cards, data);
      this.hidePaginationButton();
      this.showPagination();
    }
    // this.refs.cards.scrollIntoView({ behavior: "smooth" })
  }

  showPagination() {
    this.refs.container.classList.remove('visually-hidden');
  }
  hidePagination() {
    this.refs.container.classList.add('visually-hidden');
  }
  showPaginationButton() {
    this.refs.controls.classList.remove('visually-hidden');
  }
  hidePaginationButton() {
    this.refs.controls.classList.add('visually-hidden');
  }
}


