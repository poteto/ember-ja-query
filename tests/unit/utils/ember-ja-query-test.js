import JaQuery from 'dummy/tests/ember-ja-query';
import { module, test } from 'qunit';
import { one, two, three, arrayResponse, singleResponse } from '../../helpers/responses/user';
import blogResponse from '../../helpers/responses/blog';

module('Unit | Utility | ja query');

test('unwrap', function(assert) {
  let wrapped = new JaQuery(singleResponse);

  assert.deepEqual(wrapped.unwrap(), singleResponse);
});

test('response', function(assert) {
  let wrapped = new JaQuery(singleResponse);

  assert.deepEqual(wrapped.get('response'), singleResponse);
});

test('data', function(assert) {
  let wrapped = new JaQuery(singleResponse);

  assert.deepEqual(wrapped.get('data'), singleResponse.data);
});

test('attributes', function(assert) {
  let wrapped = new JaQuery(singleResponse);

  assert.deepEqual(wrapped.get('attributes'), singleResponse.data.attributes);
});

test('relationships', function(assert) {
  let wrapped = new JaQuery(singleResponse);

  assert.deepEqual(wrapped.get('relationships'), { job: { id: '1', name: 'ceo' }});
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
  let wrapped = new JaQuery(singleResponse);

  assert.equal(wrapped.get('id'), '1');
  assert.equal(wrapped.get('job.name'), 'ceo');
});

test('array response: find', function(assert) {
  let wrapped = new JaQuery(arrayResponse);

  assert.deepEqual(wrapped.find((r) => r.get('id') === '1'), { data: one });
  assert.deepEqual(wrapped.find((r) => r.get('id') === '0'), { data: {} });

  wrapped.set('shouldUnwrapArrayMethods', false);
  assert.ok(wrapped.find((r) => r.get('id') === '1').get('__isJaQueryObject__'));
});

test('array response: findBy', function(assert) {
  let wrapped = new JaQuery(arrayResponse);

  assert.deepEqual(wrapped.findBy('id', '1'), { data: one });
  assert.deepEqual(wrapped.findBy('id', '0'), { data: {} });

  wrapped.set('shouldUnwrapArrayMethods', false);
  assert.ok(wrapped.findBy('id', '1').get('__isJaQueryObject__'));
});

test('array response: filter', function(assert) {
  let wrapped = new JaQuery(arrayResponse);

  assert.deepEqual(wrapped.filter((r) => r.get('firstName') === 'Ricky'), { data: [one] });
  assert.deepEqual(wrapped.filter((r) => r.get('firstName') === 'Not here'), { data: [] });

  wrapped.set('shouldUnwrapArrayMethods', false);
  assert.ok(wrapped.filter((r) => r.get('firstName') === 'Ricky')[0].get('__isJaQueryObject__'));
});

test('array response: filterBy', function(assert) {
  let wrapped = new JaQuery(arrayResponse);

  assert.deepEqual(wrapped.filterBy('firstName', 'Ricky'), { data: [one] });
  assert.deepEqual(wrapped.filterBy('firstName', 'Not here'), { data: [] });

  wrapped.set('shouldUnwrapArrayMethods', false);
  assert.ok(wrapped.filterBy('firstName', 'Ricky')[0].get('__isJaQueryObject__'));
});

test('array response: reject', function(assert) {
  let wrapped = new JaQuery(arrayResponse);

  assert.deepEqual(wrapped.reject((r) => r.get('job.id') === '2'), { data: [one] });
  assert.deepEqual(wrapped.reject((r) => r.get('job.id') === '1'), { data: [two, three] });

  wrapped.set('shouldUnwrapArrayMethods', false);
  assert.ok(wrapped.reject((r) => r.get('job.id') === '2')[0].get('__isJaQueryObject__'));
});

test('array response: rejectBy', function(assert) {
  let wrapped = new JaQuery(arrayResponse);

  assert.deepEqual(wrapped.rejectBy('job.id', '2'), { data: [one] });
  assert.deepEqual(wrapped.rejectBy('job.id', '1'), { data: [two, three] });

  wrapped.set('shouldUnwrapArrayMethods', false);
  assert.ok(wrapped.rejectBy('job.id', '2')[0].get('__isJaQueryObject__'));
});

test('included relationships are mapped correctly', function(assert) {
  let wrapped = new JaQuery(blogResponse);

  assert.ok(wrapped.findBy('author.twitter', 'dgeb'));
});
