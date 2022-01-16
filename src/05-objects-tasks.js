/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */
const Selector = require('./selector');
/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const newObj = JSON.parse(json);
  const objToCreate = {};
  const keys = Object.keys(newObj);
  keys.forEach((key) => {
    objToCreate[key] = {
      value: newObj[key],
      writable: true,
      enumerable: true,
      configurable: true,
    };
  });
  return Object.create(proto, objToCreate);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class SelectorElem extends Selector.Selector {
  element(value) {
    if (!this.isElExist) {
      this.add(value, 'element');
      this.isElExist = true;
    } else {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    return this;
  }

  id(value) {
    if (!this.isIdExist) {
      this.add(`#${value}`, 'id');
      this.isIdExist = true;
    } else {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    return this;
  }

  class(value) {
    this.add(`.${value}`, 'class');
    return this;
  }

  attr(value) {
    this.add(`[${value}]`, 'attribute');
    return this;
  }

  pseudoClass(value) {
    this.add(`:${value}`, 'pseudo-class');
    return this;
  }

  pseudoElement(value) {
    if (!this.isPseudoElExist) {
      this.add(`::${value}`, 'pseudo-element');
      this.isPseudoElExist = true;
    } else {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    return this;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new SelectorElem().element(value);
  },

  id(value) {
    return new SelectorElem().id(value);
  },

  class(value) {
    return new SelectorElem().class(value);
  },

  attr(value) {
    return new SelectorElem().attr(value);
  },

  pseudoClass(value) {
    return new SelectorElem().pseudoClass(value);
  },

  pseudoElement(value) {
    return new SelectorElem().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const str1 = selector1.stringify();
    const str2 = selector2.stringify();

    return new SelectorElem().add(`${str1} ${combinator} ${str2}`);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
