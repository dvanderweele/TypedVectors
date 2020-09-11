class Int8Vector {
	constructor(length = 0, value = 0) {
		if (length < 0)
			throw new Error(
				"Int8Vector can't be initialized to negative length."
			);
		if (length % 1 !== 0)
			throw new Error(
				"Int8Vector's length can't be initialized with a non-integer value."
			);
		this._buffer = new ArrayBuffer(length);
		this._view = new DataView(this._buffer);
		this.size = length
		this.capacity = length
		if(length > 0){
		  for(var i = 0; i < length; i++){
		    this._view.setInt8(i, value)
		  }
		}
	}
	at(index){
	  if(index >= this.size) throw Error("Out of bounds Int8Vector access.")
	  return this._view.getInt8(index)
	}
	pushBack(value){
	  if(this.size == this.capacity){
	    this.doubleCapacity()
	  }
	  this._view.setInt8(this.size, value)
	  this.size++
	}
	popBack(){
	  if(this.size === 0) throw new Error("Int8Vector of size 0 has nothing to popBack.")
	  return this._view.getInt8((this.size-- - 1))
	}
	doubleCapacity(){
	  const tmpb = new ArrayBuffer((this.capacity * 2))
    const tmpv = new DataView(tmpb)
    for(var i = 0; i < this.size; i++){
      tmpv.setInt8(i, this._view.getInt8(i))
    }
    this._buffer = tmpb
    this._view = tmpv
    this.capacity *= 2
	}
  shrinkToFit(){
    if(this.capacity > this.size){
      const tmpb = new ArrayBuffer(this.size);
      const tmpv = new DataView(tmpb);
      for(var i = 0; i < this.size; i++){
        tmpv.setInt8(i, this._view.getInt8(i));
      }
      this.capacity = this.size;
      this._buffer = tmpb;
      this._view = tmpv;
    }
  }
  empty(){
    return this.size === 0
  }
  reserve(capacity){
    if(capacity > this.capacity){
      const tmpb = new ArrayBuffer(capacity);
      const tmpv = new DataView(tmpb);
      for(var i = 0; i < this.size; i++){
        tmpv.setInt8(i, this._view.getInt8(i));
      }
      this.capacity = capacity;
    }
  }
  clear(){
    this.size = 0;
  }
  insert(index, value, count = 1){
    if(count >= 1 && count % 1 === 0 
    && index < this.size && index >= 0 
    && index % 1 === 0){
      if(this.size + count > this.capacity){
        this.reserveCapacity((this.size + count))
      }
      if(count === 1){
        let tmpa, tmpb;
        tmpa = this._view.getInt8(index);
        tmpb = this._view.getInt8((index + 1));
        this._view.setInt8(index, value);
        for(var i = (index + 1); i < this.capacity; i++){
          this._view.setInt(i, tmpa);
          tmpa = tmpb;
          if(i + 1 < this.capacity) tmpb = this._view.getInt8((i + 1));
        }
      } else {

      }
      this.size = this.size + count;
    }
  }
}

export { Int8Vector }