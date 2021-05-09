class Progress {
  constructor({ selector, key }) {
    this.key = key;
    this.spinner = document.querySelector(`${selector}`);
  }
  getReference(selector) {
    const spinner = document.querySelector(`${selector}`);
    return { spinner };
  }

  show() {
    const element = this.spinner;
    const className = this.key;
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    }
  }
  hide() {
    const element = this.spinner;
    const className = this.key;
    element.classList.remove(className);
  }
}

export const progress = new Progress({
  selector: '.spinner',
  key: 'is-open',
})


export default { progress };
