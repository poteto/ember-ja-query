# ember-ja-query ![Download count all time](https://img.shields.io/npm/dt/ember-ja-query.svg) [![CircleCI](https://circleci.com/gh/poteto/ember-ja-query.svg?style=shield)](https://circleci.com/gh/poteto/ember-ja-query) [![npm version](https://badge.fury.io/js/ember-ja-query.svg)](https://badge.fury.io/js/ember-ja-query) [![Ember Observer Score](http://emberobserver.com/badges/ember-ja-query.svg)](http://emberobserver.com/addons/ember-ja-query)

`JaQuery` is a query interface around a [JSON-API](http://jsonapi.org/) (JA) object or array response that provides conveniences in tests. For example, this is useful if you need to work with (e.g. filter, find) canned JA responses via [`Pretender`](https://github.com/pretenderjs/pretender) and [`ember-cli-pretender`](https://github.com/rwjblue/ember-cli-pretender).

It will not be included in non-test environment builds.

```
ember install ember-ja-query
```

## Usage

Wrap your response with `JaQuery`:

```js
import JaQuery from 'my-app/tests/ember-ja-query';
import objectResponse from '...';
import arrayResponse from '...';

let user = new JaQuery(objectResponse);
let users = new JaQuery(arrayResponse);
```

You can wrap a JA response for both a single item or many items. Once wrapped, you can query the response like you would any Ember Object:

```js
// top level keys
wrapped.get('id') // "1";
wrapped.get('type') // "user";

// attributes
wrapped.get('firstName') // "Ricky";

// relationships
wrapped.get('job') // {id: "1", type: "jobs"};

// included relationships
wrapped.get('job.name') // "ceo"
```

If wrapping an array response, [supported array methods](#supported-array-methods) will "just work", but note that these will return the JA response and not the `JaQuery` child object:

```js
let ceo = wrapped.filter((user) => user.get('job.id') === '1');
let ceo = wrapped.filterBy('id', '1');
let ceo = wrapped.findBy('job.name', 'ceo');
let employees = wrapped.rejectBy('id', '1');
```

You can opt-out of this behaviour by setting `shouldUnwrapArrayMethods` to `false`. Array methods will then return the result wrapped in a `JaQuery` object.

Using with `ember-cli-pretender` in an acceptance test:

```js
import { test } from 'qunit';
import Pretender from 'Pretender';
import moduleForAcceptance from 'my-app/tests/helpers/module-for-acceptance';
import JaQuery from 'my-app/tests/ember-ja-query';
import usersResponse from '...';

moduleForAcceptance('Acceptance | some/route', {
  beforeEach() {
    this.server = new Pretender(function() {
      this.get(users, function({ queryParams }) {
        let { firstName } = queryParams;
        let data = new JaQuery(usersResponse).filterBy('firstName', firstName);

        return [200, { 'Content-Type': 'application/json' }, JSON.stringify(data));
      });
    })
  },
  afterEach() {
    this.server.shutdown();
  }
});

test('it should ...', function(assert) {
  visit('/users');

  andThen(() => assert.ok(...);
});
```

## API

* Properties
  + [`shouldUnwrapArrayMethods`](#shouldunwraparraymethods)
  + [`response`](#response)
  + [`data`](#data)
  + [`included`](#included)
  + [`links`](#links)
  + [`attributes`](#attributes)
  + [`relationships`](#relationships)
  + [`isObject`](#isobject)
  + [`isArray`](#isarray)
  + [`hasIncluded`](#hasincluded)
  + [`hasRelationships`](#hasrelationships)
* Methods
  + [`get`](#get)
  + [`unwrap`](#unwrap)

### Supported array methods
In addition to the above, if you wrap an array response, these array methods are available to use on the `JaQuery` object:

- `filter`
- `filterBy`
- `find`
- `findBy`
- `reject`
- `rejectBy`

#### `shouldUnwrapArrayMethods`

Defaults to `true`. 

If `true`, array methods will unwrap the response (returning the actual JA JSON response(s) that come back from that array method). 

```js
wrapped.filter((user) => user.get('job.id') === 1);

// returns:
{
  "data": [
    {
      "id": "1",
      "type": "event",
      "attributes": {
        ...
      },
      "relationships": {
        ...
      }
    }
  ]
}
```

Set to `false` prior to calling an array method to opt-out of this and instead return the wrapped child object:

```js
wrapped.set('shouldUnwrapArrayMethods', false);
let user = wrapped.findBy('id', '1'); // Class
user.get('job.name'); // "ceo"
```

**[⬆️ back to top](#api)**

#### `response`

Alias for the original JA response.

**[⬆️ back to top](#api)**

#### `data`

Alias for the `data` key on the JA response.

**[⬆️ back to top](#api)**

#### `included`

Alias for the `included` key on the JA response.

**[⬆️ back to top](#api)**

#### `links`

Alias for the `links` key on the JA response.

**[⬆️ back to top](#api)**

#### `attributes`

Alias for the `attributes` key on the JA response.

**[⬆️ back to top](#api)**

#### `relationships`

Alias for the `relationships` key on the JA response. 

**[⬆️ back to top](#api)**

#### `isObject`

Returns `true` if the wrapped response is an object response.

**[⬆️ back to top](#api)**

#### `isArray`

Returns `true` if the wrapped response is an array response.

**[⬆️ back to top](#api)**

#### `hasIncluded`

Returns `true` if the wrapped response has included relationships..

**[⬆️ back to top](#api)**

#### `hasRelationships`

Returns `true` if the wrapped response has relationships.

**[⬆️ back to top](#api)**

#### `get`

Get a property from a single object response.

```js
let wrapped = new JaQuery(response);
wrapped.get('firstName'); // "Jim Bob"
```

**[⬆️ back to top](#api)**

#### `unwrap`

Returns the original JA response. Optionally, pass in a function and the JA response will be wrapped with it.

```js
let wrapped = new JaQuery(response);
let log = (x) => { console.log(x); };
wrapped.unwrap(log);
```

**[⬆️ back to top](#api)**

## Installation

* `git clone <repository-url>` this repository
* `cd ember-ja-query`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
