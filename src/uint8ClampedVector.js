module.exports = function uint8ClampedVector(length = 0, value = 0) {
  // Argument Validation
	if (length < 0) {
		throw new Error(
			"uint8ClampedVector can't be initialized to negative length."
		);
	}
	
	// Private Members
	var buffer = new ArrayBuffer(length);
	var view = new DataView(buffer);
	var size = Math.floor(length);
	var capacity = length;
  value = clamp(value);
	if(length > 0){
    for(let i = 0; i < length; i++){
	    view.setUint8(i, value);
	  }
	}
	
	// Public Accessors & Mutators
	var MIN = 0;
	var MAX = 255;
  function clamp(val = 0){
    return val < MIN ? MIN : val > MAX ? MAX : val;
  }
	function getDataView(){
	  return view;
	}
  function getArrayBuffer(){
    return buffer;
  }
	function getSize(){
	  return size;
	}
	function getCapacity(){
	  return capacity;
	}
	function at(index = 0){
	  if(index >= size || index < 0) return undefined;
	  return view.getUint8(index);
	}
	function set(index = 0, value = 0){
	  if(index >= size || index < 0) return undefined;
    value = clamp(value);
	  view.setUint8(index, value);
    return null;
	}
	function front(){
	  if(size === 0) return undefined;
	  return view.getInt8(0);
	}
	function back(){
	  if(size === 0) return undefined;
	  return view.getUint8(size - 1);
	}
	function pushBack(value){
	  if(size == capacity) doubleCapacity();
    value = clamp(value);
	  view.setUint8(size++, value);
	}
	function popBack(){
	  if(size === 0) return undefined;
	  return view.getUint8((size-- - 1));
	}
	function doubleCapacity(){
	  let tmpb;
	  let newc;
	  if(capacity < 1) {
	    newc = 1;
	  } else {
	    newc = capacity * 2;
	  }
	  tmpb = new ArrayBuffer(newc);
    const tmpv = new DataView(tmpb);
    for(var i = 0; i < size; i++){
      tmpv.setUint8(i, view.getUint8(i));
    }
    buffer = tmpb;
    view = tmpv;
    capacity = newc;
	}
  function shrinkToFit(){
    if(capacity > size){
      const tmpb = new ArrayBuffer(size);
      const tmpv = new DataView(tmpb);
      for(let i = 0; i < size; i++){
        tmpv.setUint8(i, view.getUint8(i));
      }
      capacity = size;
      buffer = tmpb;
      view = tmpv;
    }
  }
  function empty(){
    return size === 0;
  }
  function reserve(newCapacity){
    if(newCapacity > capacity){
      const tmpb = new ArrayBuffer(newCapacity);
      const tmpv = new DataView(tmpb);
      for(let i = 0; i < size; i++){
        tmpv.setUint8(i, view.getUint8(i));
      }
      capacity = newCapacity;
      buffer = tmpb;
      view = tmpv;
    }
  }
  function clear(){
    size = 0;
  }
  function insert(index = 0, value = 0, count = 1){
    // validate arguments
    if(index > size || index < 0){
      throw new Error("Value of 'index' passed to uint8ClampedVector.insert must be greater than or equal to 0 and no greater than the size of the vector.");
    }
    if(count < 1 || count % 1 !== 0){
      throw new Error("Value of 'count' parameter is optional, but if passed it must be an integer greater than or equal to 1.");
    }
    
    // insert element(s) based on type of value variable
    if(typeof value == "number"){
      value = clamp(value);
      // resize vector if needed
      if(size + count > capacity){
        reserve(size + count);
      }
      if(index === size){
        // simply append value(s)
        for(let i = size; i < size + count; i++){
           view.setUint8(i, value);
        }
      } else {
        // shift value(s) that are to right of insertion point
        for(let i = size - 1; i >= index; i--){
          view.setUint8((i + count), view.getUint8(i));
        }
        // insert value(s)
        for(let j = 0; j < count; j++){
          view.setUint8(index + j, value);
        }
      }
      size += count;
    } else if(value instanceof DataView) {
      const len = value.byteLength;
      // resize vector if needed
      if(size + len > capacity){
        reserve((size + len));
      }
      if(index === size){
        // simply append value(s)
        for(let i = 0; i < len; i++){
          view.setUint8(i + size, value.getUint8(i));
        }
      } else {
        // shift value(s) that are to right of insertion point
        for(let i = size - 1; i >= index; i--){
          view.setUint8((i + len), view.getUint8(i));
        }
        // insert value(s)
        for(let j = 0; j < len; j++){
          view.setUint8(index + j, value.getUint8(j));
        }
      }
      size += len;
    } else if(value instanceof Uint8Array) {
      const len = value.length;
      // resize vector if needed
      if(size + len > capacity){
        reserve((size + len));
      }
      if(index === size){
        // simply append value(s)
        for(let i = 0; i < len; i++){
          view.setUint8(i + size, value[i]);
        }
      } else {
        // shift value(s) that are to right of insertion point
        for(let i = size - 1; i >= index; i--){
          view.setUint8((i + len), view.getUint8(i));
        }
        // insert value(s)
        for(let j = 0; j < len; j++){
          view.setUint8(index + j, value[j]);
        }
      }
      size += len;
    } else if(value instanceof ArrayBuffer) {
      const tmpView = new DataView(value);
      const len = tmpView.byteLength;
      // resize vector if needed
      if(size + len > capacity){
        reserve((size + len));
      }
      if(index === size){
        // simply append value(s)
        for(let i = 0; i < len; i++){
          view.setUint8(i + size, tmpView.getUint8(i));
        }
      } else {
        // shift value(s) that are to right of insertion point
        for(let i = size - 1; i >= index; i--){
          view.setUint8((i + len), view.getUint8(i));
        }
        // insert value(s)
        for(let j = 0; j < len; j++){
          view.setUint8(index + j, tmpView.getUint8(j));
        }
      }
      size += len;
    } else {
      return undefined;
    }
    return null;
  }
  function erase(index = 0, quantity = 1){
    // validate arguments
    if(size > 0 && index >= 0 && index < size){
      if(quantity < 1 || quantity % 1 !== 0 || quantity > size - index){
        throw new Error("Quantity of values to erase must be a valid integer greater than or equal to one, and not more than the value calculated by subtracting the index (from which erasure is to start) from the current size of the vector.");
      }
      // only shift elements if erasure will not take us through end of vector
      if(index + quantity < size){
        for(let i = index + quantity; i < size; i++){
          const newIdx = i - quantity;
          view.setUint8(newIdx, view.getUint8(i));
        }
      }
      // set new size of vector
      size -= quantity;
    } else {
      return undefined;
    }
    return null;
  }
  function resize(newSize, value = 0){
    if(newSize > capacity){
      reserve(newSize);
    } 
    if(newSize > size){
      value = clamp(value);
      for(i = size; i < capacity; i++){
        view.setUint8(i, value);
      }
    }
    size = newSize;
  }
  function swap(otherVector){
    buffer = otherVector.getArrayBuffer();
    view = otherVector.getDataView();
    capacity = buffer.byteLength;
    size = otherVector.getSize();
  }
  function forEach(callback){
    for(let i = 0; i < size; i++){
      callback(view.getUint8(i), i);
    }
  }
  function map(callback, preserveCapacity = true){
    const res = uint8ClampedVector(preserveCapacity ? capacity : size, 0);
    for(let i = 0; i < size; i++){
      res.set(i, callback(view.getUint8(i), i));
    }
    return res;
  }
  function mapInPlace(callback){
    for(let i = 0; i < size; i++){
      view.setUint8(i, callback(view.getUint8(i), i));
    }
  }
  function reduce(callback, initialValue = 0){
    for(let i = 0; i < size; i++){
      initialValue = callback(initialValue, view.getUint8(i), i);
    }
    return initialValue;
  }
  function reduceRight(callback, initialValue = 0){
    for(let i = size - 1; i >= 0; i--){
      initialValue = callback(initialValue, view.getUint8(i), i);
    }
    return initialValue;
  }

  function filter(callback, preserveCapacity = true){
    const res = uint8ClampedVector(preserveCapacity ? capacity : size, 0);
    let gapStart = -1;
    let filterQty = 0;
    for(let i = 0; i < size; i++){
      if(callback(view.getUint8(i), i)){
        // keep current item, move if needed
        if(gapStart !== -1){
          res.set(gapStart, view.getUint8(i));
          gapStart++;
        } else {
          res.set(i, view.getUint8(i));
        }
        filterQty++;
      } else {
        if(gapStart === -1) gapStart = i;
      }
    }
    res.resize(filterQty);
    return res;
  }

  function filterInPlace(callback){
    let gapStart = -1;
    let filterQty = 0;
    for(let i = 0; i < size; i++){
      if(callback(view.getUint8(i), i)){
        // keep current item, move if needed
        if(gapStart !== -1){
          view.setUint8(gapStart, view.getUint8(i));
          gapStart++;
        } 
      } else {
        // don't keep current item
        filterQty++;
        if(gapStart === -1) gapStart = i;
      }
    }
    size -= filterQty;
  }
  
  const uint8ClampedVectorAPI = {
    MIN,
    MAX,
    clamp,
    at,
    set,
    front,
    back,
    pushBack,
    popBack,
    getSize,
    getCapacity,
    doubleCapacity,
    shrinkToFit,
    empty,
    clear,
    reserve,
    resize,
    insert,
    getDataView,
    getArrayBuffer,
    erase,
    forEach,
    map,
    mapInPlace,
    reduce,
    reduceRight,
    swap, 
    filter, 
    filterInPlace
  };
  
  uint8ClampedVectorAPI[Symbol.iterator] = function *(){
    for(let i = 0; i < size; i++){
      yield view.getUint8(i);
    }
  };
  
  Object.freeze(uint8ClampedVectorAPI);
  
  return uint8ClampedVectorAPI;
}