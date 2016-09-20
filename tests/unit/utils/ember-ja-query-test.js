import JaQuery from 'dummy/tests/ember-ja-query';
import { module, test } from 'qunit';

const one = {
  "id": "1",
  "type": "user",
  "attributes": {
    "first-name": "Ricky",
    "last-name": "Bobby"
  },
  "relationships": {
    "job": {
      "data": {
        "id": "1",
        "name": "ceo"
      }
    }
  }
};
const two = {
  "id": "2",
  "type": "user",
  "attributes": {
    "first-name": "Jane",
    "last-name": "Smith"
  },
  "relationships": {
    "job": {
      "data": {
        "id": "2",
        "name": "Engineer"
      }
    }
  }
};
const three = {
  "id": "3",
  "type": "user",
  "attributes": {
    "first-name": "Milton",
    "last-name": "Waddams"
  },
  "relationships": {
    "job": {
      "data": {
        "id": "2",
        "name": "Engineer"
      }
    }
  }
};
const arrayResponse = { data: [one, two, three] };
const singleResponse = { data: one };

module('Unit | Utility | ja query');

test('unwrap', function(assert) {
  let result = new JaQuery(singleResponse);

  assert.deepEqual(result.unwrap(), singleResponse);
});

test('response', function(assert) {
  let result = new JaQuery(singleResponse);

  assert.deepEqual(result.get('response'), singleResponse);
});

test('data', function(assert) {
  let result = new JaQuery(singleResponse);

  assert.deepEqual(result.get('data'), singleResponse.data);
});

test('attributes', function(assert) {
  let result = new JaQuery(singleResponse);

  assert.deepEqual(result.get('attributes'), singleResponse.data.attributes);
});

test('relationships', function(assert) {
  let result = new JaQuery(singleResponse);

  assert.deepEqual(result.get('relationships'), { job: { id: '1', name: 'ceo' }});
});

test('isObject', function(assert) {
  assert.ok(new JaQuery(singleResponse).get('isObject'));
  assert.notOk(new JaQuery(arrayResponse).get('isObject'));
});

test('isArray', function(assert) {
  assert.notOk(new JaQuery(singleResponse).get('isArray'));
  assert.ok(new JaQuery(arrayResponse).get('isArray'));
});

test('single response: get', function(assert) {
  let result = new JaQuery(singleResponse);

  assert.equal(result.get('id'), '1');
  assert.equal(result.get('job.name'), 'ceo');
});

test('array response: find', function(assert) {
  let result = new JaQuery(arrayResponse);

  assert.deepEqual(result.find((r) => r.get('id') === '1'), { data: one });
  assert.deepEqual(result.find((r) => r.get('id') === '0'), { data: {} });

  result.set('shouldUnwrapArrayMethods', false);
  assert.ok(result.find((r) => r.get('id') === '1').get('__isJaQueryObject__'));
});

test('array response: findBy', function(assert) {
  let result = new JaQuery(arrayResponse);

  assert.deepEqual(result.findBy('id', '1'), { data: one });
  assert.deepEqual(result.findBy('id', '0'), { data: {} });

  result.set('shouldUnwrapArrayMethods', false);
  assert.ok(result.findBy('id', '1').get('__isJaQueryObject__'));
});

test('array response: filter', function(assert) {
  let result = new JaQuery(arrayResponse);

  assert.deepEqual(result.filter((r) => r.get('firstName') === 'Ricky'), { data: [one] });
  assert.deepEqual(result.filter((r) => r.get('firstName') === 'Not here'), { data: [] });

  result.set('shouldUnwrapArrayMethods', false);
  assert.ok(result.filter((r) => r.get('firstName') === 'Ricky')[0].get('__isJaQueryObject__'));
});

test('array response: filterBy', function(assert) {
  let result = new JaQuery(arrayResponse);

  assert.deepEqual(result.filterBy('firstName', 'Ricky'), { data: [one] });
  assert.deepEqual(result.filterBy('firstName', 'Not here'), { data: [] });

  result.set('shouldUnwrapArrayMethods', false);
  assert.ok(result.filterBy('firstName', 'Ricky')[0].get('__isJaQueryObject__'));
});

test('array response: reject', function(assert) {
  let result = new JaQuery(arrayResponse);

  assert.deepEqual(result.reject((r) => r.get('job.id') === '2'), { data: [one] });
  assert.deepEqual(result.reject((r) => r.get('job.id') === '1'), { data: [two, three] });

  result.set('shouldUnwrapArrayMethods', false);
  assert.ok(result.reject((r) => r.get('job.id') === '2')[0].get('__isJaQueryObject__'));
});

test('array response: rejectBy', function(assert) {
  let result = new JaQuery(arrayResponse);

  assert.deepEqual(result.rejectBy('job.id', '2'), { data: [one] });
  assert.deepEqual(result.rejectBy('job.id', '1'), { data: [two, three] });

  result.set('shouldUnwrapArrayMethods', false);
  assert.ok(result.rejectBy('job.id', '2')[0].get('__isJaQueryObject__'));
});

