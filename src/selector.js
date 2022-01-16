class Selector {
  constructor() {
    this.selectors = [];
    this.isIdExist = false;
    this.isElExist = false;
    this.isPseudoElExist = false;
    this.selectorsWeight = {
      '': 0,
      element: 1,
      id: 10,
      class: 20,
      attribute: 30,
      'pseudo-class': 40,
      'pseudo-element': 50,
    };
    this.selectorsTypes = [];
  }

  add(val, type = '') {
    if (this.isRightOrder(type)) {
      this.selectors.push(val);
      this.selectorsTypes.push(this.selectorsWeight[type]);
    }

    return this;
  }

  stringify() {
    const selectorStr = this.selectors.join('');
    this.selectors = [];
    this.isIdExist = false;
    this.isElExist = false;
    this.isPseudoElExist = false;
    return selectorStr;
  }

  isRightOrder(type) {
    if (this.selectorsTypes.length === 0) {
      return true;
    }
    const prevVal = this.selectorsTypes[this.selectorsTypes.length - 1];
    const currVal = this.selectorsWeight[type];

    if (currVal < prevVal) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    } else {
      return true;
    }
  }
}

module.exports = {
  Selector,
};
