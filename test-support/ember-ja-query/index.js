import Ember from 'ember';

const {
  A: emberArray,
  String: { w, dasherize },
  Object: EmberObject,
  computed: { bool, oneWay },
  computed,
  assert,
  get,
  isPresent,
  set,
  setProperties,
  typeOf
} = Ember;
const assign = Ember.assign || Ember.merge;
const childKey = '__children__';
const includedKey = '__included__';
const supportedArrayMethods = w('filter reject find filterBy rejectBy findBy');

function computedTypeOf(dependentKey, type) {
  return computed(dependentKey, function() {
    return typeOf(get(this, dependentKey)) === type;
  }).readOnly();
}

export const JaQueryObject = EmberObject.extend({
  __isJaQueryObject__: true,
  response: null,
  shouldUnwrapArrayMethods: true,

  data: oneWay('response.data'),
  included: oneWay('response.included'),
  links: oneWay('response.links'),
  attributes: oneWay('data.attributes'),

  relationships: computed('data.relationships', 'hasIncluded', 'included.[]', function() {
    let flattened = {};
    let relationships = get(this, 'data.relationships');

    // map included to relationships
    if (get(this, 'hasIncluded')) {
      for (let key in relationships) {
        let { data } = relationships[key];

        if (typeOf(data) === 'array') {
          flattened[key] = this._mapMany(data);
        } else {
          flattened[key] = this._mapOne(data);
        }
      }
    } else {
      for (let key in relationships) {
        flattened[key] = relationships[key].data;
      }
    }

    return flattened;
  }),

  isObject: computedTypeOf('data', 'object'),
  isArray: computedTypeOf('data', 'array'),
  hasIncluded: bool('included'),
  hasRelationships: bool('relationships'),

  init() {
    this._super(...arguments);
    let isArray = get(this, 'isArray');
    let isObject = get(this, 'isObject');
    let hasIncluded = get(this, 'hasIncluded');
    set(this, 'response', this.response);

    if (isArray) {
      set(this, childKey, emberArray(get(this, 'data').map((data) => new JaQuery({ data }))));
      supportedArrayMethods.forEach((method) => {
        this[method] = function proxyArrayMethod(...args) {
          return this._proxyArrayMethod(method, ...args);
        };
      });
    }

    if (hasIncluded) {
      set(this, includedKey, emberArray(get(this, 'included').map((data) => new JaQuery({ data }))));
      get(this, childKey).forEach((child) => {
        setProperties(child, {
          included: get(this, 'included'),
          [includedKey]: get(this, includedKey)
        });
      });
    }

    assert('Not a valid JSON API response', isObject || isArray);
  },

  toString() {
    return `ja-query:${get(this, 'response').toString()}`;
  },

  /**
  * Invoked when using `get` or `Ember.get` on this object. Proxies to:
  *
  * 1. Top level keys
  * 2. Attributes
  * 3. Relationships
  *
  * @public
  * @param  {String} key
  * @return {Any}
  */
  unknownProperty(key) {
    if (get(this, 'isObject')) {
      let dasherizedKey = dasherize(key);
      let data = get(this, 'data');
      let attributes = get(this, 'attributes');
      let relationships = get(this, 'relationships');

    return get(data, dasherizedKey) ||
      get(attributes, dasherizedKey) ||
      get(relationships, dasherizedKey);
    }
  },

  /**
   * Returns the original response, with an optional function applied to it.
   *
   * @public
   * @param  {Function} func
   * @return {Object}
   */
  unwrap(func) {
   let response = get(this, 'response');

   if (isPresent(func)) {
     return func(response);
   }

   return response;
  },

  /**
   * Proxy to an array method on children.
   *
   * @private
   * @param  {String}    methodName
   * @param  {...Any} invocationArgs
   * @return {Any}
   */
  _proxyArrayMethod(methodName, ...invocationArgs) {
    let shouldUnwrapArrayMethods = get(this, 'shouldUnwrapArrayMethods');
    let children = get(this, childKey);
    let isArray = get(this, 'isArray');

    assert(`"${methodName}" is not a valid array method`, typeOf(children[methodName]) === 'function');
    assert('Cannot invoke array method on a non-array', isArray);

    let result = children[methodName].apply(children, invocationArgs);

    if (shouldUnwrapArrayMethods) {
      if (typeOf(result) === 'array' && result.length === 0) {
        let data = [];

        return { data };
      }

      if (typeOf(result) === 'array') {
        let data = emberArray(result).mapBy.call(result, 'response.data');

        return { data };
      }

      if (typeOf(result) === 'instance' || typeOf(result) === 'object') {
        return { data: result.get('response.data') };
      }

      return { data: {} };
    }

    return result;
  },

  _mapOne(data) {
    let { id, type } = data;
    let included = get(this, 'included');
    let found = emberArray(emberArray(included).filterBy('type', type)).findBy('id', id);

    return new JaQuery({ data: found });
  },

  _mapMany(data) {
    return data.map((d) => this._mapOne(d));
  }
});

export default class JaQuery {
  constructor(response) {
    return JaQueryObject.create({ response });
  }
}
