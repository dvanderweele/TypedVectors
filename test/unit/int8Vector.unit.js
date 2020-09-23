const int8Vector = require("../../src/int8Vector.js");

QUnit.module("int8Vector");

QUnit.test("Instantiate int8Vector.", assert => {
  const v1 = int8Vector(3, 2);
  assert.equal(v1.getSize(), 3, "size of 3");
  assert.equal(v1.getCapacity(), 3, "capacity of 3");
  assert.throws(()=>int8Vector(-1, 1));
  assert.true(v1.getArrayBuffer() instanceof ArrayBuffer);
  assert.true(v1.getDataView() instanceof DataView);
  v1.pushBack(7);
  assert.equal(v1.getSize(), 4, "size of 4");
  assert.equal(v1.getCapacity(), 6, "capacity of 6");
});

QUnit.test("int8Vector: at method.", assert => {
  const v1 = int8Vector(3, 2);
  assert.equal(v1.at(), 2);
  assert.equal(v1.at(0), 2);
  assert.equal(v1.at(0.1), 2);
  assert.equal(v1.at(1), 2);
  assert.equal(v1.at(2), 2);
  assert.equal(v1.at(-1), undefined);
  assert.equal(v1.at(3), undefined);
  const v2 = int8Vector();
  assert.equal(v2.at(), undefined);
});

QUnit.test("int8Vector: set method.", assert => {
  const v1 = int8Vector(3, 2);
  v1.set();
  assert.equal(v1.at(), 0);
  assert.equal(v1.at(1), 2);
  v1.set(2, 3);
  v1.set(1, 3);
  assert.equal(v1.at(2), 3);
  assert.equal(v1.at(1), 3);
  assert.equal(v1.set(-1),  undefined);
  assert.equal(v1.set(3), undefined);
  assert.equal(v1.set(2), null);
});

QUnit.test("int8Vector: front method.", assert => {
  const v1 = int8Vector();
  const v2 = int8Vector(1,13);
  assert.equal(v1.front(), undefined);
  assert.equal(v2.front(), 13);
});

QUnit.test("int8Vector: back method.", assert => {
  const v1 = int8Vector();
  const v2 = int8Vector(1, 7);
  const v3 = int8Vector(2, 3);
  assert.equal(v1.back(), undefined);
  assert.equal(v2.front(), v2.back());
  assert.equal(v3.front(), v3.back());
  v3.set(0, 4);
  v3.set(1, 5);
  assert.equal(v3.back(), 5);
  assert.equal(v3.front(), 4);
});

QUnit.test("int8Vector: doubleCapacity method.", assert => {
  const v1 = int8Vector();
  assert.equal(v1.getCapacity(), 0);
  v1.doubleCapacity();
  assert.equal(v1.getCapacity(), 1);
  v1.doubleCapacity();
  v1.doubleCapacity();
  assert.equal(v1.getCapacity(), 4);
  const v2 = int8Vector(46, 2);
  assert.equal(v2.getCapacity(), 46);
  v2.doubleCapacity();
  assert.equal(v2.getCapacity(), 92);
});