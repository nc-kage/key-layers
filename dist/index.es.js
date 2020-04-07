function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var guid = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
var Guid = /** @class */ (function () {
    function Guid(guid) {
        if (!guid) {
            throw new TypeError("Invalid argument; `value` has no value.");
        }
        this.value = Guid.EMPTY;
        if (guid && Guid.isGuid(guid)) {
            this.value = guid;
        }
    }
    Guid.isGuid = function (guid) {
        var value = guid.toString();
        return guid && (guid instanceof Guid || Guid.validator.test(value));
    };
    Guid.create = function () {
        return new Guid([Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-"));
    };
    Guid.createEmpty = function () {
        return new Guid("emptyguid");
    };
    Guid.parse = function (guid) {
        return new Guid(guid);
    };
    Guid.raw = function () {
        return [Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-");
    };
    Guid.gen = function (count) {
        var out = "";
        for (var i = 0; i < count; i++) {
            // tslint:disable-next-line:no-bitwise
            out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return out;
    };
    Guid.prototype.equals = function (other) {
        // Comparing string `value` against provided `guid` will auto-call
        // toString on `guid` for comparison
        return Guid.isGuid(other) && this.value === other.toString();
    };
    Guid.prototype.isEmpty = function () {
        return this.value === Guid.EMPTY;
    };
    Guid.prototype.toString = function () {
        return this.value;
    };
    Guid.prototype.toJSON = function () {
        return {
            value: this.value
        };
    };
    Guid.validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
    Guid.EMPTY = "00000000-0000-0000-0000-000000000000";
    return Guid;
}());
exports.Guid = Guid;
});

unwrapExports(guid);
var guid_1 = guid.Guid;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

var ID = guid_1.create().toString();
var RELEASE_DELAY = 150;
var EMITTER_FORCE_LAYER_TYPE = "EMITTER_FORCE_LAYER_TYPE_" + ID;
var EMITTER_TOP_LAYER_TYPE = "EMITTER_TOP_LAYER_TYPE_" + ID;
var isListenersSet = false;
var layersMap = [];
var listenersLayers = [];
var listenersPredefinedLayers = {};
var forceListeners = [];
var onEvent = function (e, type) {
    forceListeners.forEach(function (listener) {
        get(listener, type, noop)(e);
    });
    if (listenersLayers.length) {
        get(last(listenersLayers), type, noop)(e);
    }
    else {
        var layers = Object.keys(listenersPredefinedLayers)
            .filter(function (key) { return listenersPredefinedLayers[Number(key)].length > 0; })
            .sort(function (a, b) { return Number(a) - Number(b); });
        (listenersPredefinedLayers[Number(last(layers))] || [])
            .forEach(function (listener) {
            get(listener, type, noop)(e);
        });
    }
};
var clearTargetDownLists = function (target) {
    target.forEach(function (item) {
        item.instance.clearDownList();
    });
};
var onPress = function (e) {
    onEvent(e, 'onPress');
};
var onDown = function (e) {
    onEvent(e, 'onDown');
};
var onUp = function (e) {
    onEvent(e, 'onUp');
};
var onWindowBlur = function () {
    clearTargetDownLists(listenersLayers);
    clearTargetDownLists(forceListeners);
    Object.keys(listenersPredefinedLayers)
        .forEach(function (key) { return clearTargetDownLists(listenersPredefinedLayers[Number(key)]); });
};
var Emitter = /** @class */ (function () {
    /**
     * Constructor of the class.
     * @param {boolean|number|string} subscribeType - Layer type,
     * EMITTER_TOP_LAYER_TYPE - creates new layer at the top of the layers
     * EMITTER_FORCE_LAYER_TYPE - add to layer witch execute permanently
     * 5 - add to the layer with index 5.
     * @param {number} releaseDelay - Delay between keyDown and keyUp events for
     * fires keyRelease event.
     */
    function Emitter(subscribeType, releaseDelay) {
        var _this = this;
        if (releaseDelay === void 0) { releaseDelay = RELEASE_DELAY; }
        this.id = guid_1.create().toString();
        this.downList = [];
        this.releaseDictionary = {};
        this.pressReleaseDictionary = {};
        this.keyDownListeners = [];
        this.keyPressListeners = [];
        this.keyUpListeners = [];
        this.keyReleaseListeners = [];
        this.pressReleaseListeners = [];
        this.pressHandler = function (e) {
            var downList = _this.downList;
            var keyCode = Emitter.getEventKeyCode(e);
            var timeStamp = e.timeStamp;
            var downData = downList.find(function (item) { return item.timeStamp === timeStamp; });
            if (downData) {
                downData.pressKeyCode = keyCode;
                _this.keyPressListeners.forEach(function (listener) { return _this.executeCallback(e, listener, true); });
            }
        };
        this.downHandler = function (e) {
            var downList = _this.downList;
            var keyCode = Emitter.getEventKeyCode(e);
            if (!downList.find(function (item) { return item.keyCode === keyCode; })) {
                downList.push({ keyCode: keyCode, timeStamp: e.timeStamp });
            }
            _this.keyDownListeners.forEach(function (listener) { return _this.executeCallback(e, listener); });
        };
        this.upHandler = function (e) {
            var _a = _this, downList = _a.downList, releaseDictionary = _a.releaseDictionary, pressReleaseDictionary = _a.pressReleaseDictionary, releaseDelay = _a.releaseDelay;
            var keyCode = Emitter.getEventKeyCode(e);
            var keyDownInfo = null;
            for (var i = 0, ln = downList.length; i < ln; i += 1) {
                if (downList[i].keyCode === keyCode) {
                    keyDownInfo = downList[i];
                    downList.splice(i, 1);
                    break;
                }
            }
            _this.keyUpListeners.forEach(function (listener) { return _this.executeCallback(e, listener); });
            if (keyDownInfo && e.timeStamp - keyDownInfo.timeStamp <= releaseDelay) {
                releaseDictionary[keyDownInfo.keyCode] = keyDownInfo.timeStamp;
                _this.keyReleaseListeners.forEach(function (listener) { return _this.executeReleaseCallback(e, listener); });
                if (keyDownInfo.pressKeyCode) {
                    pressReleaseDictionary[keyDownInfo.keyCode] = keyDownInfo;
                    _this.pressReleaseListeners
                        .forEach(function (listener) { return _this.executeReleaseCallback(e, listener, true); });
                }
            }
        };
        this.subscribeType = subscribeType || EMITTER_TOP_LAYER_TYPE;
        this.releaseDelay = releaseDelay;
        Emitter.setGeneralListeners();
        this.addListeners();
    }
    /**
     * @public
     *
     * Sets names for layers indexes.
     * @param {string|number|array[]|object[]|object} firstParam - Name or id of the layer.
     * For array or object it's a
     * layers config.
     *
     * @param {string} firstParam.name - Name of the layer.
     * @param {number} firstParam.id - Id of the layer.
     * @example
     * Emitter.setLayersMap({ name: 'fileBrowsing', id: 1 })
     *
     * @param {string} firstParam[0] - Name of the layer.
     * @param {number} firstParam[1] - Id of the layer.
     * @example
     * Emitter.setLayersMap(['fileBrowsing', 1])
     *
     * @param {number} firstParam[0] - Id of the layer.
     * @param {string} firstParam[1] - Name of the layer.
     * @example
     * Emitter.setLayersMap([1, 'fileBrowsing'])
     *
     * @param {string} firstParam[].name - Name of the layer.
     * @param {number} firstParam[].id - Id of the layer.
     * @example
     * Emitter.setLayersMap([
     *    { name: 'fileBrowsing', id: 1 },
     *    { name: 'preview', id: 5},
     * ])
     *
     * @param {string} firstParam[][0] - Name of the layer.
     * @param {number} firstParam[][1] - Id of the layer.
     * @example
     * Emitter.setLayersMap([
     *    ['fileBrowsing', 1],
     *    ['preview', 5],
     * ])
     *
     * @param {number} firstParam[][0] - Id of the layer.
     * @param {string} firstParam[][1] - Name of the layer.
     * @example
     * Emitter.setLayersMap([
     *    [1, 'fileBrowsing'],
     *    [5, 'preview'],
     * ])
     *
     * @param {Object.<string, number>} firstParam - Map of the Layers with name/id pairs.
     * @example
     * Emitter.setLayersMap({
     *    fileBrowsing: 1,
     *    preview: 5
     * })
     *
     * @param {string|number} secondParam - Name or id of the Layer.
     * @example
     * Emitter.setLayersMap('fileBrowsing', 1);
     * @example
     * Emitter.setLayersMap(1, 'fileBrowsing');
     *
     * @returns {number} Count of the set names;
     */
    Emitter.setLayersMap = function (firstParam, secondParam) {
        if (typeof firstParam === 'string' && typeof secondParam === 'number') {
            return Number(Emitter.setLayerMap({ name: firstParam, id: secondParam }));
        }
        if (typeof firstParam === 'number' && typeof secondParam === 'string') {
            return Number(Emitter.setLayerMap({ name: secondParam, id: firstParam }));
        }
        if (isArray(firstParam) && firstParam.length === 2
            && typeof firstParam[0] === 'string' && typeof firstParam[1] === 'number') {
            return Emitter.setLayersMap(firstParam[0], firstParam[1]);
        }
        if (isArray(firstParam) && firstParam.length === 2
            && typeof firstParam[0] === 'number' && typeof firstParam[1] === 'string') {
            return Emitter.setLayersMap(firstParam[0], firstParam[1]);
        }
        if (isArray(firstParam) && isUndefined(secondParam)) {
            var setCount_1 = 0;
            firstParam.forEach(function (layerMap) {
                setCount_1 += Number(Emitter.setLayerMap(layerMap));
            });
            return setCount_1;
        }
        if (!isArray(firstParam) && typeof firstParam === 'object'
            && !isUndefined(firstParam.name) && !isUndefined(firstParam.id)) {
            return Number(Emitter.setLayerMap(firstParam));
        }
        if (!isArray(firstParam) && typeof firstParam === 'object') {
            var setCount_2 = 0;
            Object.keys(firstParam).forEach(function (key) {
                var id = firstParam[key];
                setCount_2 += Number(Emitter.setLayerMap({ id: id, name: key }));
            });
            return setCount_2;
        }
        return 0;
    };
    Emitter.setLayerMap = function (data) {
        if (typeof data === 'object' && !isArray(data)) {
            return Emitter.setLayerMapFromObject(data);
        }
        if (isArray(data)) {
            return Emitter.setLayerMapFromArray(data);
        }
        return false;
    };
    Emitter.setLayerMapFromObject = function (data) {
        var _a = data || { name: '', id: 0 }, name = _a.name, id = _a.id;
        if (name) {
            layersMap.push({ name: name, id: id });
            return true;
        }
        return false;
    };
    Emitter.setLayerMapFromArray = function (data) {
        var name = data[0];
        var id = data[1];
        if (typeof name === 'number' && typeof id === 'string') {
            name = data[1];
            id = data[0];
        }
        return Emitter.setLayerMapFromObject({ name: name, id: id });
    };
    Emitter.setGeneralListeners = function () {
        if (!isListenersSet) {
            window.addEventListener('keypress', onPress, true);
            window.addEventListener('keyup', onUp, true);
            window.addEventListener('keydown', onDown, true);
            window.addEventListener('blur', onWindowBlur, true);
            isListenersSet = true;
        }
    };
    Emitter.getEventKeyCode = function (e) {
        return e.which || e.keyCode;
    };
    Emitter.checkInputTarget = function (e) {
        return ['INPUT', 'TEXTAREA'].includes(get(e, 'target.tagName'));
    };
    Emitter.checkMainOptions = function (e, options) {
        var altKey = options.altKey, ctrlKey = options.ctrlKey, shiftKey = options.shiftKey, metaKey = options.metaKey, skipInput = options.skipInput;
        var isInputTarget = Emitter.checkInputTarget(e);
        return (altKey ? e.altKey : true)
            && (ctrlKey ? e.ctrlKey : true)
            && (shiftKey ? e.shiftKey : true)
            && (metaKey ? e.metaKey : true)
            && !(isInputTarget && skipInput);
    };
    Emitter.getListenersTarget = function (subscribeType) {
        if (typeof subscribeType === 'number') {
            if (!listenersPredefinedLayers[subscribeType]) {
                listenersPredefinedLayers[subscribeType] = [];
            }
            return listenersPredefinedLayers[subscribeType];
        }
        if (subscribeType === EMITTER_FORCE_LAYER_TYPE) {
            return forceListeners;
        }
        if (subscribeType === EMITTER_TOP_LAYER_TYPE) {
            return listenersLayers;
        }
        if (typeof subscribeType === 'string') {
            var layerId = get(layersMap.find(function (item) { return item.name === subscribeType; }), 'id');
            if (typeof layerId === 'number' && layerId >= 0) {
                return Emitter.getListenersTarget(layerId);
            }
        }
        return null;
    };
    Emitter.clearDownLists = function (subscribeType) {
        if (subscribeType === EMITTER_TOP_LAYER_TYPE) {
            Emitter.clearLayerDownLists();
            Emitter.clearPredefinedLayersDownLists();
        }
        else if ((subscribeType === 'string' && subscribeType !== EMITTER_FORCE_LAYER_TYPE)
            || typeof subscribeType === 'number') {
            var layerId = typeof subscribeType === 'string'
                ? get(layersMap.find(function (item) { return item.name === subscribeType; }), 'id')
                : subscribeType;
            var biggestLayerId = Math.max.apply(null, Object.keys(listenersPredefinedLayers)
                .map(function (key) { return Number(key); }));
            if (layerId && layerId >= biggestLayerId) {
                Emitter.clearPredefinedLayersDownLists([layerId]);
            }
        }
    };
    Emitter.clearLayerDownLists = function () {
        clearTargetDownLists(listenersLayers);
    };
    Emitter.clearPredefinedLayersDownLists = function (skip) {
        if (skip === void 0) { skip = []; }
        Object.keys(listenersPredefinedLayers).forEach(function (key) {
            var normalizedKey = Number(key);
            if (!skip.includes(normalizedKey)) {
                clearTargetDownLists(listenersPredefinedLayers[normalizedKey]);
            }
        });
    };
    Emitter.prototype.clearDownList = function () {
        this.downList = [];
        this.releaseDictionary = {};
        this.pressReleaseDictionary = {};
    };
    Emitter.prototype.addListener = function (type, callback, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        switch (type) {
            case 'keyDown':
                this.keyDownListeners.push({ callback: callback, options: options });
                break;
            case 'keyPress':
                this.keyPressListeners.push({ callback: callback, options: options });
                break;
            case 'keyUp':
                this.keyUpListeners.push({ callback: callback, options: options });
                break;
            case 'keyRelease':
                this.keyReleaseListeners.push({ callback: callback, options: options });
                break;
            case 'pressRelease':
                this.pressReleaseListeners.push({ callback: callback, options: options });
                break;
        }
        return function () { return _this.removeListener(type, callback); };
    };
    Emitter.prototype.removeListener = function (type, callback) {
        var collection = [];
        switch (type) {
            case 'keyDown':
                collection = this.keyDownListeners;
                break;
            case 'keyPress':
                collection = this.keyPressListeners;
                break;
            case 'keyUp':
                collection = this.keyUpListeners;
                break;
            case 'keyRelease':
                collection = this.keyReleaseListeners;
                break;
            case 'pressRelease':
                collection = this.pressReleaseListeners;
                break;
        }
        for (var i = 0, ln = collection.length; i < ln; i += 1) {
            if (collection[i].callback === callback) {
                collection.splice(i, 1);
                break;
            }
        }
    };
    Emitter.prototype.destroy = function () {
        this.removeListeners();
    };
    Emitter.prototype.addListeners = function () {
        var subscribeType = this.subscribeType;
        var listenersTarget = Emitter.getListenersTarget(subscribeType);
        Emitter.clearDownLists(subscribeType);
        if (listenersTarget) {
            listenersTarget.push({
                id: this.id,
                instance: this,
                onPress: this.pressHandler,
                onDown: this.downHandler,
                onUp: this.upHandler,
            });
        }
        else {
            console.warn('KeyLayersJS', 'Unknown subscribe type!');
        }
    };
    Emitter.prototype.removeListeners = function () {
        var listenersTarget = Emitter.getListenersTarget(this.subscribeType);
        if (listenersTarget) {
            for (var i = 0, ln = listenersTarget.length; i < ln; i += 1) {
                if (listenersTarget[i].id === this.id) {
                    listenersTarget.splice(i, 1);
                    break;
                }
            }
        }
    };
    Emitter.prototype.executeCallback = function (e, listener, isPressCheck) {
        if (isPressCheck === void 0) { isPressCheck = false; }
        var callback = listener.callback, options = listener.options;
        if (Emitter.checkMainOptions(e, options) && this.checkCodeOptions(e, options, isPressCheck)) {
            callback(e);
        }
    };
    Emitter.prototype.executeReleaseCallback = function (e, listener, isPressCheck) {
        if (isPressCheck === void 0) { isPressCheck = false; }
        var callback = listener.callback, options = listener.options;
        if (Emitter.checkMainOptions(e, options)
            && this.checkReleaseCodeOptions(e, options, isPressCheck)) {
            callback(e);
        }
    };
    Emitter.prototype.checkCodeOptions = function (e, options, isPressCheck) {
        if (isPressCheck === void 0) { isPressCheck = false; }
        var code = options.code;
        var _a = options.codes, codes = _a === void 0 ? [] : _a;
        var downList = this.downList;
        var keyCode = Emitter.getEventKeyCode(e);
        codes = code && !codes.length ? [code] : codes;
        if (codes.length) {
            if (!codes.includes(keyCode)) {
                return false;
            }
            var _loop_1 = function (i, ln) {
                var checkCode = codes[i];
                if (checkCode !== keyCode && !downList.find(function (item) { return isPressCheck
                    ? item.pressKeyCode === checkCode : item.keyCode === checkCode; })) {
                    return { value: false };
                }
            };
            for (var i = 0, ln = codes.length; i < ln; i += 1) {
                var state_1 = _loop_1(i, ln);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        return true;
    };
    Emitter.prototype.checkReleaseCodeOptions = function (e, options, isPressCheck) {
        if (isPressCheck === void 0) { isPressCheck = false; }
        var code = options.code;
        var _a = options.codes, codes = _a === void 0 ? [] : _a;
        var _b = this, releaseDictionary = _b.releaseDictionary, pressReleaseDictionary = _b.pressReleaseDictionary, releaseDelay = _b.releaseDelay;
        var keyCode = Emitter.getEventKeyCode(e);
        if (isPressCheck) {
            var keyPressInfo = pressReleaseDictionary[keyCode];
            if (e.timeStamp - keyPressInfo.timeStamp <= releaseDelay) {
                keyCode = keyPressInfo.pressKeyCode || 0;
            }
        }
        var timeStamp = e.timeStamp;
        codes = code && !codes.length ? [code] : codes;
        if (codes.length) {
            if (!codes.includes(keyCode)) {
                return false;
            }
            var _loop_2 = function (i, ln) {
                var checkCode = codes[i];
                var releaseCheckTimestamp = 0;
                if (isPressCheck) {
                    var pressKey = Object.keys(pressReleaseDictionary).find(function (key) {
                        return pressReleaseDictionary[Number(key)].pressKeyCode === checkCode;
                    });
                    releaseCheckTimestamp = pressKey ? pressReleaseDictionary[Number(pressKey)].timeStamp : 0;
                }
                else {
                    releaseCheckTimestamp = releaseDictionary[checkCode];
                }
                if (checkCode !== keyCode && !(releaseCheckTimestamp
                    && timeStamp - releaseCheckTimestamp <= releaseDelay)) {
                    return { value: false };
                }
            };
            for (var i = 0, ln = codes.length; i < ln; i += 1) {
                var state_2 = _loop_2(i, ln);
                if (typeof state_2 === "object")
                    return state_2.value;
            }
        }
        return true;
    };
    return Emitter;
}());

export { EMITTER_FORCE_LAYER_TYPE, EMITTER_TOP_LAYER_TYPE, Emitter };
//# sourceMappingURL=index.es.js.map
