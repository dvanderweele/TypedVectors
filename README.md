# TypedVectors

Work in progress.

Typed Vector Data Structure for JS based on C++ Vectors (Array lists in other languages). Built on ArrayBuffers and DataViews.

## Error Philosophy

I have tried to follow the spirit of error-handling implemented by TypedArrays. Generally it's harder to get TypedArrays to throw errors than raw DataViews and ArrayBuffers. One way that they appear to differ is range errors. Whereas DataViews will throw an error when you attempt to access out of range indexes, TypedArrays appear to conceal this by simply returning 'undefined' in those cases. An exception to that is a negative
 or otherwise intractably nonsensical value passed as an argument to define the starting length of the new data structure; just like ArrayBuffers and TypedArrays, an error will be thrown. That's the approach 
That I'm implementing.

In cases where a non-integer index that is nonetheless in range of the vector is passed in, the underlying DataView behavior is consumed whereby the value of the index is typically coerced or truncated/floored and the resulting integer used for access.

If at any point a value other than an in-range value for that TypedVector's data type is submitted for storing in the vector, the default DataView behavior is consumed whereby the value is in some way truncated or wrapped around or coerced to be within range for that data type before storage. In the event that 'undefined' is submitted, according to the testing I've done it appears that the DataView will coerce that to be a 0. 
















