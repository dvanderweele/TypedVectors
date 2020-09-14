/** Class representing growable array of 8-bit signed integers. */
class Int8Vector {
  /** 
   * Constructor function for initializing vector.
   * @param {number} length - The starting size and capacity of the vector.
   * @param {number} value - The value to use for initializing each member of the array. If you provide a number outside of the range of 8-bit signed integers, the underlying engine's behavior will deal with it, probably by wrapping the number around (e.g. if you provide 128, it might wrap it down to -128). The integrity of neighboring members in memory should not be affected in that case, and an error will probably not be thrown even though I can't guarantee this. Basically, don't mess around by trying to store numbers outside of the range.
   * @throws Will throw an error if length is less than 0 or not an integer.
   */
	constructor(length = 0, value = 0) {
		if (length < 0)
			throw new Error(
				"Int8Vector can't be initialized to negative length."
			);
		if (length % 1 !== 0)
			throw new Error(
				"Int8Vector's length can't be initialized with a non-integer value."
			);
		/** 
		 * The member variable that holds the ArrayBuffer that ultimately holds data structure's sequence of 8-bit signed integers. The data structure reallocates this as necessary. The length of this in 8-bit signed integers should always be reflected in the capacity member variable. Direct access to this by user is possible but not encouraged as there is the potential to violate the integrity of this data structure.  
		 * @private
		 */	
		this._buffer = new ArrayBuffer(length);
		/** 
		 * The member variable that holds the DataView used by the data structure to access the ArrayBuffer held in _buffer member variable. Generally reallocated whenever _buffer is. Direct access by user is possible but not encouraged because there is the potential to violate the integrity of this data structure.
		 * @private
		 */
		this._view = new DataView(this._buffer);
		/** 
		 * This member variable indicates the length of the in-use portion of the vector. Can be less than or equal to capacity. You will probably break this data structure if you try to modify this member variable yourself.
		 * @example 
		 * The indexes 0 through 4 are occupied in a vector with 10 indexes. The capacity is 10, and the size is 5.
		 * @readonly
		 */
		this.size = length
		/** 
		 * This member variable indicates the currently usable length of the vector. Can be greater than or equal to size. You will probably break this data structure if you try to modify this member variable yourself.
		 * @example 
		 * The indexes 0 through 4 are occupied in a vector with 10 indexes. The capacity is 10, and the size is 5.
		 * @readonly
		 */
		this.capacity = length
		if(length > 0){
		  for(var i = 0; i < length; i++){
		    this._view.setInt8(i, value)
		  }
		}
	}
	/**
	 * Get an integer from the vector. 
	 * @param {number} index - The index at which the integer is stored.
	 * @returns {number} The integer stored at the provided index. 
	 * @throws If the index value passed is greater than or equal to the vector's size member variable (the vector is zero-indexed), an out of bounds error will be thrown. Accessing vector positions from the end by passing a negative index is not supported.
	 */
	at(index){
	  if(index >= this.size || index < 0) throw Error("Out of bounds Int8Vector access.")
	  return this._view.getInt8(index)
	}
	/**
	 * Append integer to the end of the vector, incrementing vector's size by one. If there is no more capacity, the vector's capacity is first doubled via vector's doubleCapacity method. 
	 * @param {number} value - An 8-bit signed integer value for appending to the vector.
	 */
	pushBack(value){
	  if(this.size == this.capacity){
	    this.doubleCapacity()
	  }
	  this._view.setInt8(this.size, value)
	  this.size++
	}
	/**
	 * Reduces size but not capacity of vector by 1, in effect "removing" the last element in the vector.
	 * @returns The integer stored at the tail end of the vector.
	 * @throws If vector's size is 0, even if the capacity is greater than 0, an error is thrown.
	 */
	popBack(){
	  if(this.size === 0) throw new Error("Int8Vector of size 0 has nothing to popBack.")
	  return this._view.getInt8((this.size-- - 1))
	}
	/** 
	 * Doubles the capacity of the vector. The size remains the same. Because this requires allocation of a new ArrayBuffer and DataView under the hood, this operation has time complexity of O(n) where n is size of vector, as all items from old buffer need to be copied to new buffer.
	 */
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
	/** 
	 * This method does nothing if called when vector's size and capacity are equal. If there is excess capacity to the vector (i.e. more slots than are being used as indicated by size member variable) calling this method shrinks the capacity to be equal to size in O(n) time where n is equal to size. Under the hood, the _buffer and _view are reallocated and items copied over.
	 */
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
  /** 
   * @returns {boolean} If size (i.e. in-use portion of vector) is 0, this returns true, otherwise this retuens false.
   */
  empty(){
    return this.size === 0
  }
  /** 
   * This method does nothing unless this parameter is greater than the current capacity of the vector. This method reallocates the underlying ArrayBuffer to a new one of the capcity you request, copying over all the old data in O(n) time where n is the size of the vector.
   * @param {number} capacity - The number of 8-bit signed integers that you want the vector to be able to store. 
   */
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
  /**
   * Capacity of the vector remains the same, but the in-use size is reduced to 0. This is done in O(1) time by simply reducing the size variable of the vector to zero. Technically any data you put into vector before calling this method is still in the _buffer afterwards, but I don't officially recommend that you go looking for it.
   */
  clear(){
    this.size = 0;
  }
  /**
   * @param {number} index - The index at which the new elements will be inserted into the vector. If the value of index is less than the vector's size, then this operation will trigger a "rightward" shift of all elements in the vector that come after the specified index prior to insertion. Reallocation of buffer will occur if new calculated size exceeds vector's capacity.
   * @param {number} value - 
   * @param {number} count - 
   */
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