import Observer from './Observer.js';

class Provider extends Observer {
  constructor() {
    super();
  }
  getDataTotalSize() {
    throw new Error('You should implement', 'getDataTotalSize');
  }

  getPageDataSize() {
    throw new Error('You should implement', 'getPageDataSize');
  }
  getData(data) {
    throw new Error('You should implement', 'getData');
  }
}

export default Provider;
