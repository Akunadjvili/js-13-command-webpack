class Observer {
  subscribers = [];
  constructor() {}

  observe(subscriber, callback) {
    pressent: {
      for (let i = 0; i < this.subscribers.length; i++) {
        const { subscriber: object } = this.subscribers[i];
        if (object === subscriber) {
          break pressent;
        }
      }
      this.subscribers.push({ subscriber, callback });
    }
  }
  unobserve(object = null) {
    if (!object) {
      this.subscribers = [];
      return;
    }
    for (let i = 0; i < this.subscribers.length; i++) {
      const { subscriber } = this.subscribers[i];
      if (object === subscriber) {
        this.subscribers.splice(i, 1);
        break;
      }
    }
  }

  notify(data) {
    for (const element of this.subscribers) {
      const { subscriber, callback } = element;
      callback.call(subscriber, data);
    }
  }
}
export default Observer;
