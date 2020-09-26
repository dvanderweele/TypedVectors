const int8Vector = require("../../src/int8Vector.js");

QUnit.module("int8Vector");

QUnit.test("Instantiation.", assert => {
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

QUnit.test("at method.", assert => {
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

QUnit.test("set method.", assert => {
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

QUnit.test("front method.", assert => {
  const v1 = int8Vector();
  const v2 = int8Vector(1,13);
  assert.equal(v1.front(), undefined);
  assert.equal(v2.front(), 13);
});

QUnit.test("back method.", assert => {
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

QUnit.test("doubleCapacity method.", assert => {
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

QUnit.test("pushBack method.", assert =>{
  const v1 = int8Vector(3, 3);
  assert.equal(v1.getCapacity(), 3);
  v1.pushBack(4);
  assert.equal(v1.getCapacity(), 6);
  assert.equal(v1.getSize(), 4);
  assert.equal(v1.at(3), 4);
  v1.pushBack(5);
  assert.equal(v1.getCapacity(), 6);
  assert.equal(v1.getSize(), 5);
  assert.equal(v1.at(4), 5);
});

QUnit.test("popBack method.", assert => {
  const v1 = int8Vector();
  assert.equal(v1.popBack(), undefined);
  v1.pushBack(1);
  assert.equal(v1.popBack(), 1);
  assert.equal(v1.getSize(), 0);
  assert.equal(v1.getCapacity(), 1);
});

QUnit.test("shrinkToFit method.", assert => {
  const v1 = int8Vector(4, 4);
  v1.shrinkToFit();
  assert.equal(v1.getCapacity(), 4);
  v1.pushBack(5);
  assert.equal(v1.getCapacity(), 8);
  v1.shrinkToFit();
  assert.equal(v1.getCapacity(), 5);
});

QUnit.test("empty and clear methods.", assert => {
  const v1 = int8Vector();
  assert.true(v1.empty());
  assert.equal(v1.getCapacity(), 0);
  v1.pushBack(9);
  assert.false(v1.empty());
  assert.equal(v1.getCapacity(), 1);
  v1.clear();
});

QUnit.test("reserve method.", assert => {
  const v1 = int8Vector();
  assert.equal(v1.reserve(0), undefined);
  v1.reserve(25);
  assert.equal(v1.getCapacity(), 25);
  const v2 = int8Vector(2, 13);
  v2.reserve(3);
  assert.equal(v2.at(0), 13);
  assert.equal(v2.at(1), 13);
  assert.equal(v2.getCapacity(), 3);
  assert.equal(v2.getSize(), 2);
});

QUnit.test("forEach method.", assert => {
  const v1 = int8Vector(4, 5);
  const gbv = [];
  const gbi = [];
  function cb(val, idx){
    gbv.push(val);
    gbi.push(idx);
  }
  v1.forEach(cb);
  assert.equal(gbv.length, 4);
  assert.equal(gbi.length, 4);
  assert.equal(gbv[0], 5);
  assert.equal(gbv[3], 5);
  assert.equal(gbi[0], 0);
  assert.equal(gbi[1], 1);
  assert.equal(gbi[2], 2);
  assert.equal(gbi[3], 3);
});

QUnit.test("map method.", assert => {
  const v1 = int8Vector(3, 2);
  function cb(val, idx){
    return val + idx;
  }
  const v2 = v1.map(cb);
  assert.equal(v1.at(0), 2);
  assert.equal(v1.at(1), 2);
  assert.equal(v1.at(2), 2);
  assert.equal(v2.getSize(), 3);
  assert.equal(v2.at(0), 2);
  assert.equal(v2.at(1), 3);
  assert.equal(v2.at(2), 4);
});

QUnit.test("mapInPlace method.", assert => {
  const v1 = int8Vector(3, 2);
  assert.equal(v1.at(0), 2);
  assert.equal(v1.at(1), 2);
  assert.equal(v1.at(2), 2);
  function cb(val, idx){
    return val + idx;
  }
  assert.equal(v1.mapInPlace(cb), undefined);
  assert.equal(v1.getSize(), 3);
  assert.equal(v1.at(0), 2);
  assert.equal(v1.at(1), 3);
  assert.equal(v1.at(2), 4);
});

QUnit.test("reduce method.", assert => {
  const v1 = int8Vector(3, 2);
  function cb(acc, cur, idx){
    return acc + (cur * idx);
  }
  assert.equal(v1.reduce(cb), 6);
  assert.equal(v1.reduce(cb, 5), 11);
});

QUnit.test("reduceRight method.", assert => {
  const v1 = int8Vector(3);
  v1.set(2, 1);
  v1.set(1, 2);
  v1.set(0, 3);
  function cb(acc, cur, idx){
    return acc - (cur * idx);
  }
  assert.equal(v1.reduceRight(cb), -4);
  assert.equal(v1.reduceRight(cb,-2), -6);
});

QUnit.test("swap method.", assert => {
  const v1 = int8Vector(3, 2);
  v1.pushBack(3);
  v1.pushBack(4);
  assert.equal(v1.getSize(), 5);
  const v2 = int8Vector();
  v2.swap(v1);
  assert.equal(v2.getSize(), 5);
  assert.equal(v2.getCapacity(), 6);
  assert.equal(v2.at(0), 2);
  assert.equal(v2.at(4), 4);
});

QUnit.test("iteration.", assert => {
  const v1 = int8Vector(3,13);
  const arr = [...v1];
  assert.equal(arr.length, 3);
  assert.equal(arr[0], 13);
  assert.equal(arr[1], 13);
  assert.equal(arr[2], 13);
});

QUnit.test("resize method.", assert => {
  const v1 = int8Vector();
  v1.resize(13);
  assert.equal(v1.getCapacity(), 13);
  assert.equal(v1.getSize(), 13);
  assert.equal(v1.at(0), 0);
  assert.equal(v1.at(12), 0);
  v1.resize(9);
  assert.equal(v1.getCapacity(), 13);
  assert.equal(v1.getSize(), 9);
  v1.resize(14, 17);
  assert.equal(v1.getCapacity(), 14);
  assert.equal(v1.getSize(), 14);
  assert.equal(v1.at(8), 0);
  assert.equal(v1.at(9), 17);
  assert.equal(v1.at(13), 17);
});

QUnit.test("MIN and MAX.", assert => {
  const v1 = int8Vector(4);
  v1.set(0, v1.MIN);
  v1.set(1, v1.MAX);
  v1.set(2, (v1.MIN - 1));
  v1.set(3, (v1.MAX + 1));
  assert.equal(v1.at(0), -128);
  assert.equal(v1.at(1), 127);
  assert.notEqual(v1.at(2), -129);
  assert.notEqual(v1.at(3), 128);
});

QUnit.test("insert method.", assert => {
  const v1 = int8Vector(5, 5);
  v1.insert();
  assert.equal(v1.getCapacity(), 6);
  assert.equal(v1.at(0), 0);
  assert.equal(v1.at(5), 5);
  v1.insert(6,7,2);
  assert.equal(v1.getCapacity(), 8);
  assert.equal(v1.getSize(), 8);
  assert.equal(v1.at(6), 7);
  assert.equal(v1.at(7), 7);
  assert.throws(()=>v1.insert(-1));
  assert.throws(()=>v1.insert(9));
  assert.throws(()=>v1.insert(1,1,0));
  assert.throws(()=>v1.insert(1,1,1.5));
  const v2 = int8Vector(5, 5);
  v2.insert(2,-5,3);
  assert.equal(v2.getCapacity(), 8);
  assert.equal(v2.getSize(), 8);
  assert.equal(v2.at(1), 5);
  assert.equal(v2.at(2), -5);
  assert.equal(v2.at(4), -5);
  assert.equal(v2.at(5), 5);
  assert.equal(v2.at(7), 5);
  assert.equal(v2.at(8), undefined);
  const v3 = int8Vector(5, 5);
  const v4 = int8Vector(5, 5);
  const v5 = int8Vector(5, 5);
  const b1 = new ArrayBuffer(2);
  const d1 = new DataView(b1);
  d1.setInt8(0, -5);
  d1.setInt8(1, -5);
  v3.insert(0, d1);
  assert.equal(v3.getCapacity(), 7);
  assert.equal(v3.getSize(), 7);
  assert.equal(v3.at(0), -5);
  assert.equal(v3.at(1), -5);
  assert.equal(v3.at(2), 5);
  assert.equal(v3.at(6), 5);
  assert.equal(v3.at(7), undefined);
  v4.insert(2, d1);
  assert.equal(v4.getCapacity(), 7);
  assert.equal(v4.getSize(), 7);
  assert.equal(v4.at(0), 5);
  assert.equal(v4.at(1), 5);
  assert.equal(v4.at(2), -5);
  assert.equal(v4.at(3), -5);
  assert.equal(v4.at(4), 5);
  assert.equal(v4.at(6), 5);
  assert.equal(v4.at(7), undefined);
  v5.insert(5, d1);
  assert.equal(v5.getCapacity(), 7);
  assert.equal(v5.getSize(), 7);
  assert.equal(v5.at(0), 5);
  assert.equal(v5.at(4), 5);
  assert.equal(v5.at(5), -5);
  assert.equal(v5.at(6), -5);
  assert.equal(v5.at(7), undefined);
  // next is testing instanceof Int8Array section of insert
});