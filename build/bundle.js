module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	'use latest';
	
	var nconf = __webpack_require__(76);
	var Webtask = __webpack_require__(175);
	
	var logger = __webpack_require__(12);
	logger.info('Starting webtask.');
	
	var server = null;
	var getServer = function getServer(req, res) {
	  if (!server) {
	    nconf.defaults({
	      AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
	      AUTH0_CLIENT_ID: req.webtaskContext.secrets.AUTH0_CLIENT_ID,
	      AUTH0_CLIENT_SECRET: req.webtaskContext.secrets.AUTH0_CLIENT_SECRET,
	      EXTENSION_SECRET: req.webtaskContext.secrets.EXTENSION_SECRET,
	      NODE_ENV: 'production',
	      HOSTING_ENV: 'webtask',
	      CLIENT_VERSION: ("1.0.0"),
	      WT_URL: req.webtaskContext.secrets.WT_URL
	    });
	
	    // Start the server.
	    server = __webpack_require__(80)(req.webtaskContext.storage);
	  }
	
	  return server(req, res);
	};
	
	module.exports = Webtask.fromExpress(function (req, res) {
	  return getServer(req, res);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// Load modules
	
	var Crypto = __webpack_require__(47);
	var Path = __webpack_require__(22);
	var Util = __webpack_require__(77);
	var Escape = __webpack_require__(142);
	
	
	// Declare internals
	
	var internals = {};
	
	
	// Clone object or array
	
	exports.clone = function (obj, seen) {
	
	    if (typeof obj !== 'object' ||
	        obj === null) {
	
	        return obj;
	    }
	
	    seen = seen || { orig: [], copy: [] };
	
	    var lookup = seen.orig.indexOf(obj);
	    if (lookup !== -1) {
	        return seen.copy[lookup];
	    }
	
	    var newObj;
	    var cloneDeep = false;
	
	    if (!Array.isArray(obj)) {
	        if (Buffer.isBuffer(obj)) {
	            newObj = new Buffer(obj);
	        }
	        else if (obj instanceof Date) {
	            newObj = new Date(obj.getTime());
	        }
	        else if (obj instanceof RegExp) {
	            newObj = new RegExp(obj);
	        }
	        else {
	            var proto = Object.getPrototypeOf(obj);
	            if (proto &&
	                proto.isImmutable) {
	
	                newObj = obj;
	            }
	            else {
	                newObj = Object.create(proto);
	                cloneDeep = true;
	            }
	        }
	    }
	    else {
	        newObj = [];
	        cloneDeep = true;
	    }
	
	    seen.orig.push(obj);
	    seen.copy.push(newObj);
	
	    if (cloneDeep) {
	        var keys = Object.getOwnPropertyNames(obj);
	        for (var i = 0, il = keys.length; i < il; ++i) {
	            var key = keys[i];
	            var descriptor = Object.getOwnPropertyDescriptor(obj, key);
	            if (descriptor &&
	                (descriptor.get ||
	                 descriptor.set)) {
	
	                Object.defineProperty(newObj, key, descriptor);
	            }
	            else {
	                newObj[key] = exports.clone(obj[key], seen);
	            }
	        }
	    }
	
	    return newObj;
	};
	
	
	// Merge all the properties of source into target, source wins in conflict, and by default null and undefined from source are applied
	/*eslint-disable */
	exports.merge = function (target, source, isNullOverride /* = true */, isMergeArrays /* = true */) {
	/*eslint-enable */
	    exports.assert(target && typeof target === 'object', 'Invalid target value: must be an object');
	    exports.assert(source === null || source === undefined || typeof source === 'object', 'Invalid source value: must be null, undefined, or an object');
	
	    if (!source) {
	        return target;
	    }
	
	    if (Array.isArray(source)) {
	        exports.assert(Array.isArray(target), 'Cannot merge array onto an object');
	        if (isMergeArrays === false) {                                                  // isMergeArrays defaults to true
	            target.length = 0;                                                          // Must not change target assignment
	        }
	
	        for (var i = 0, il = source.length; i < il; ++i) {
	            target.push(exports.clone(source[i]));
	        }
	
	        return target;
	    }
	
	    var keys = Object.keys(source);
	    for (var k = 0, kl = keys.length; k < kl; ++k) {
	        var key = keys[k];
	        var value = source[key];
	        if (value &&
	            typeof value === 'object') {
	
	            if (!target[key] ||
	                typeof target[key] !== 'object' ||
	                (Array.isArray(target[key]) ^ Array.isArray(value)) ||
	                value instanceof Date ||
	                Buffer.isBuffer(value) ||
	                value instanceof RegExp) {
	
	                target[key] = exports.clone(value);
	            }
	            else {
	                exports.merge(target[key], value, isNullOverride, isMergeArrays);
	            }
	        }
	        else {
	            if (value !== null &&
	                value !== undefined) {                              // Explicit to preserve empty strings
	
	                target[key] = value;
	            }
	            else if (isNullOverride !== false) {                    // Defaults to true
	                target[key] = value;
	            }
	        }
	    }
	
	    return target;
	};
	
	
	// Apply options to a copy of the defaults
	
	exports.applyToDefaults = function (defaults, options, isNullOverride) {
	
	    exports.assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
	    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');
	
	    if (!options) {                                                 // If no options, return null
	        return null;
	    }
	
	    var copy = exports.clone(defaults);
	
	    if (options === true) {                                         // If options is set to true, use defaults
	        return copy;
	    }
	
	    return exports.merge(copy, options, isNullOverride === true, false);
	};
	
	
	// Clone an object except for the listed keys which are shallow copied
	
	exports.cloneWithShallow = function (source, keys) {
	
	    if (!source ||
	        typeof source !== 'object') {
	
	        return source;
	    }
	
	    var storage = internals.store(source, keys);    // Move shallow copy items to storage
	    var copy = exports.clone(source);               // Deep copy the rest
	    internals.restore(copy, source, storage);       // Shallow copy the stored items and restore
	    return copy;
	};
	
	
	internals.store = function (source, keys) {
	
	    var storage = {};
	    for (var i = 0, il = keys.length; i < il; ++i) {
	        var key = keys[i];
	        var value = exports.reach(source, key);
	        if (value !== undefined) {
	            storage[key] = value;
	            internals.reachSet(source, key, undefined);
	        }
	    }
	
	    return storage;
	};
	
	
	internals.restore = function (copy, source, storage) {
	
	    var keys = Object.keys(storage);
	    for (var i = 0, il = keys.length; i < il; ++i) {
	        var key = keys[i];
	        internals.reachSet(copy, key, storage[key]);
	        internals.reachSet(source, key, storage[key]);
	    }
	};
	
	
	internals.reachSet = function (obj, key, value) {
	
	    var path = key.split('.');
	    var ref = obj;
	    for (var i = 0, il = path.length; i < il; ++i) {
	        var segment = path[i];
	        if (i + 1 === il) {
	            ref[segment] = value;
	        }
	
	        ref = ref[segment];
	    }
	};
	
	
	// Apply options to defaults except for the listed keys which are shallow copied from option without merging
	
	exports.applyToDefaultsWithShallow = function (defaults, options, keys) {
	
	    exports.assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
	    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');
	    exports.assert(keys && Array.isArray(keys), 'Invalid keys');
	
	    if (!options) {                                                 // If no options, return null
	        return null;
	    }
	
	    var copy = exports.cloneWithShallow(defaults, keys);
	
	    if (options === true) {                                         // If options is set to true, use defaults
	        return copy;
	    }
	
	    var storage = internals.store(options, keys);   // Move shallow copy items to storage
	    exports.merge(copy, options, false, false);     // Deep copy the rest
	    internals.restore(copy, options, storage);      // Shallow copy the stored items and restore
	    return copy;
	};
	
	
	// Deep object or array comparison
	
	exports.deepEqual = function (obj, ref, options, seen) {
	
	    options = options || { prototype: true };
	
	    var type = typeof obj;
	
	    if (type !== typeof ref) {
	        return false;
	    }
	
	    if (type !== 'object' ||
	        obj === null ||
	        ref === null) {
	
	        if (obj === ref) {                                                      // Copied from Deep-eql, copyright(c) 2013 Jake Luer, jake@alogicalparadox.com, MIT Licensed, https://github.com/chaijs/deep-eql
	            return obj !== 0 || 1 / obj === 1 / ref;        // -0 / +0
	        }
	
	        return obj !== obj && ref !== ref;                  // NaN
	    }
	
	    seen = seen || [];
	    if (seen.indexOf(obj) !== -1) {
	        return true;                            // If previous comparison failed, it would have stopped execution
	    }
	
	    seen.push(obj);
	
	    if (Array.isArray(obj)) {
	        if (!Array.isArray(ref)) {
	            return false;
	        }
	
	        if (!options.part && obj.length !== ref.length) {
	            return false;
	        }
	
	        for (var i = 0, il = obj.length; i < il; ++i) {
	            if (options.part) {
	                var found = false;
	                for (var r = 0, rl = ref.length; r < rl; ++r) {
	                    if (exports.deepEqual(obj[i], ref[r], options, seen)) {
	                        found = true;
	                        break;
	                    }
	                }
	
	                return found;
	            }
	
	            if (!exports.deepEqual(obj[i], ref[i], options, seen)) {
	                return false;
	            }
	        }
	
	        return true;
	    }
	
	    if (Buffer.isBuffer(obj)) {
	        if (!Buffer.isBuffer(ref)) {
	            return false;
	        }
	
	        if (obj.length !== ref.length) {
	            return false;
	        }
	
	        for (var j = 0, jl = obj.length; j < jl; ++j) {
	            if (obj[j] !== ref[j]) {
	                return false;
	            }
	        }
	
	        return true;
	    }
	
	    if (obj instanceof Date) {
	        return (ref instanceof Date && obj.getTime() === ref.getTime());
	    }
	
	    if (obj instanceof RegExp) {
	        return (ref instanceof RegExp && obj.toString() === ref.toString());
	    }
	
	    if (options.prototype) {
	        if (Object.getPrototypeOf(obj) !== Object.getPrototypeOf(ref)) {
	            return false;
	        }
	    }
	
	    var keys = Object.getOwnPropertyNames(obj);
	
	    if (!options.part && keys.length !== Object.getOwnPropertyNames(ref).length) {
	        return false;
	    }
	
	    for (var k = 0, kl = keys.length; k < kl; ++k) {
	        var key = keys[k];
	        var descriptor = Object.getOwnPropertyDescriptor(obj, key);
	        if (descriptor.get) {
	            if (!exports.deepEqual(descriptor, Object.getOwnPropertyDescriptor(ref, key), options, seen)) {
	                return false;
	            }
	        }
	        else if (!exports.deepEqual(obj[key], ref[key], options, seen)) {
	            return false;
	        }
	    }
	
	    return true;
	};
	
	
	// Remove duplicate items from array
	
	exports.unique = function (array, key) {
	
	    var index = {};
	    var result = [];
	
	    for (var i = 0, il = array.length; i < il; ++i) {
	        var id = (key ? array[i][key] : array[i]);
	        if (index[id] !== true) {
	
	            result.push(array[i]);
	            index[id] = true;
	        }
	    }
	
	    return result;
	};
	
	
	// Convert array into object
	
	exports.mapToObject = function (array, key) {
	
	    if (!array) {
	        return null;
	    }
	
	    var obj = {};
	    for (var i = 0, il = array.length; i < il; ++i) {
	        if (key) {
	            if (array[i][key]) {
	                obj[array[i][key]] = true;
	            }
	        }
	        else {
	            obj[array[i]] = true;
	        }
	    }
	
	    return obj;
	};
	
	
	// Find the common unique items in two arrays
	
	exports.intersect = function (array1, array2, justFirst) {
	
	    if (!array1 || !array2) {
	        return [];
	    }
	
	    var common = [];
	    var hash = (Array.isArray(array1) ? exports.mapToObject(array1) : array1);
	    var found = {};
	    for (var i = 0, il = array2.length; i < il; ++i) {
	        if (hash[array2[i]] && !found[array2[i]]) {
	            if (justFirst) {
	                return array2[i];
	            }
	
	            common.push(array2[i]);
	            found[array2[i]] = true;
	        }
	    }
	
	    return (justFirst ? null : common);
	};
	
	
	// Test if the reference contains the values
	
	exports.contain = function (ref, values, options) {
	
	    /*
	        string -> string(s)
	        array -> item(s)
	        object -> key(s)
	        object -> object (key:value)
	    */
	
	    var valuePairs = null;
	    if (typeof ref === 'object' &&
	        typeof values === 'object' &&
	        !Array.isArray(ref) &&
	        !Array.isArray(values)) {
	
	        valuePairs = values;
	        values = Object.keys(values);
	    }
	    else {
	        values = [].concat(values);
	    }
	
	    options = options || {};            // deep, once, only, part
	
	    exports.assert(arguments.length >= 2, 'Insufficient arguments');
	    exports.assert(typeof ref === 'string' || typeof ref === 'object', 'Reference must be string or an object');
	    exports.assert(values.length, 'Values array cannot be empty');
	
	    var compare, compareFlags;
	    if (options.deep) {
	        compare = exports.deepEqual;
	
	        var hasOnly = options.hasOwnProperty('only'), hasPart = options.hasOwnProperty('part');
	
	        compareFlags = {
	            prototype: hasOnly ? options.only : hasPart ? !options.part : false,
	            part: hasOnly ? !options.only : hasPart ? options.part : true
	        };
	    }
	    else {
	        compare = function (a, b) {
	
	            return a === b;
	        };
	    }
	
	    var misses = false;
	    var matches = new Array(values.length);
	    for (var i = 0, il = matches.length; i < il; ++i) {
	        matches[i] = 0;
	    }
	
	    if (typeof ref === 'string') {
	        var pattern = '(';
	        for (i = 0, il = values.length; i < il; ++i) {
	            var value = values[i];
	            exports.assert(typeof value === 'string', 'Cannot compare string reference to non-string value');
	            pattern += (i ? '|' : '') + exports.escapeRegex(value);
	        }
	
	        var regex = new RegExp(pattern + ')', 'g');
	        var leftovers = ref.replace(regex, function ($0, $1) {
	
	            var index = values.indexOf($1);
	            ++matches[index];
	            return '';          // Remove from string
	        });
	
	        misses = !!leftovers;
	    }
	    else if (Array.isArray(ref)) {
	        for (i = 0, il = ref.length; i < il; ++i) {
	            for (var j = 0, jl = values.length, matched = false; j < jl && matched === false; ++j) {
	                matched = compare(values[j], ref[i], compareFlags) && j;
	            }
	
	            if (matched !== false) {
	                ++matches[matched];
	            }
	            else {
	                misses = true;
	            }
	        }
	    }
	    else {
	        var keys = Object.keys(ref);
	        for (i = 0, il = keys.length; i < il; ++i) {
	            var key = keys[i];
	            var pos = values.indexOf(key);
	            if (pos !== -1) {
	                if (valuePairs &&
	                    !compare(valuePairs[key], ref[key], compareFlags)) {
	
	                    return false;
	                }
	
	                ++matches[pos];
	            }
	            else {
	                misses = true;
	            }
	        }
	    }
	
	    var result = false;
	    for (i = 0, il = matches.length; i < il; ++i) {
	        result = result || !!matches[i];
	        if ((options.once && matches[i] > 1) ||
	            (!options.part && !matches[i])) {
	
	            return false;
	        }
	    }
	
	    if (options.only &&
	        misses) {
	
	        return false;
	    }
	
	    return result;
	};
	
	
	// Flatten array
	
	exports.flatten = function (array, target) {
	
	    var result = target || [];
	
	    for (var i = 0, il = array.length; i < il; ++i) {
	        if (Array.isArray(array[i])) {
	            exports.flatten(array[i], result);
	        }
	        else {
	            result.push(array[i]);
	        }
	    }
	
	    return result;
	};
	
	
	// Convert an object key chain string ('a.b.c') to reference (object[a][b][c])
	
	exports.reach = function (obj, chain, options) {
	
	    if (chain === false ||
	        chain === null ||
	        typeof chain === 'undefined') {
	
	        return obj;
	    }
	
	    options = options || {};
	    if (typeof options === 'string') {
	        options = { separator: options };
	    }
	
	    var path = chain.split(options.separator || '.');
	    var ref = obj;
	    for (var i = 0, il = path.length; i < il; ++i) {
	        var key = path[i];
	        if (key[0] === '-' && Array.isArray(ref)) {
	            key = key.slice(1, key.length);
	            key = ref.length - key;
	        }
	
	        if (!ref ||
	            !ref.hasOwnProperty(key) ||
	            (typeof ref !== 'object' && options.functions === false)) {         // Only object and function can have properties
	
	            exports.assert(!options.strict || i + 1 === il, 'Missing segment', key, 'in reach path ', chain);
	            exports.assert(typeof ref === 'object' || options.functions === true || typeof ref !== 'function', 'Invalid segment', key, 'in reach path ', chain);
	            ref = options.default;
	            break;
	        }
	
	        ref = ref[key];
	    }
	
	    return ref;
	};
	
	
	exports.reachTemplate = function (obj, template, options) {
	
	    return template.replace(/{([^}]+)}/g, function ($0, chain) {
	
	        var value = exports.reach(obj, chain, options);
	        return (value === undefined || value === null ? '' : value);
	    });
	};
	
	
	exports.formatStack = function (stack) {
	
	    var trace = [];
	    for (var i = 0, il = stack.length; i < il; ++i) {
	        var item = stack[i];
	        trace.push([item.getFileName(), item.getLineNumber(), item.getColumnNumber(), item.getFunctionName(), item.isConstructor()]);
	    }
	
	    return trace;
	};
	
	
	exports.formatTrace = function (trace) {
	
	    var display = [];
	
	    for (var i = 0, il = trace.length; i < il; ++i) {
	        var row = trace[i];
	        display.push((row[4] ? 'new ' : '') + row[3] + ' (' + row[0] + ':' + row[1] + ':' + row[2] + ')');
	    }
	
	    return display;
	};
	
	
	exports.callStack = function (slice) {
	
	    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
	
	    var v8 = Error.prepareStackTrace;
	    Error.prepareStackTrace = function (err, stack) {
	
	        return stack;
	    };
	
	    var capture = {};
	    Error.captureStackTrace(capture, arguments.callee);     /*eslint no-caller:0 */
	    var stack = capture.stack;
	
	    Error.prepareStackTrace = v8;
	
	    var trace = exports.formatStack(stack);
	
	    if (slice) {
	        return trace.slice(slice);
	    }
	
	    return trace;
	};
	
	
	exports.displayStack = function (slice) {
	
	    var trace = exports.callStack(slice === undefined ? 1 : slice + 1);
	
	    return exports.formatTrace(trace);
	};
	
	
	exports.abortThrow = false;
	
	
	exports.abort = function (message, hideStack) {
	
	    if (("production") === 'test' || exports.abortThrow === true) {
	        throw new Error(message || 'Unknown error');
	    }
	
	    var stack = '';
	    if (!hideStack) {
	        stack = exports.displayStack(1).join('\n\t');
	    }
	    console.log('ABORT: ' + message + '\n\t' + stack);
	    process.exit(1);
	};
	
	
	exports.assert = function (condition /*, msg1, msg2, msg3 */) {
	
	    if (condition) {
	        return;
	    }
	
	    if (arguments.length === 2 && arguments[1] instanceof Error) {
	        throw arguments[1];
	    }
	
	    var msgs = [];
	    for (var i = 1, il = arguments.length; i < il; ++i) {
	        if (arguments[i] !== '') {
	            msgs.push(arguments[i]);            // Avoids Array.slice arguments leak, allowing for V8 optimizations
	        }
	    }
	
	    msgs = msgs.map(function (msg) {
	
	        return typeof msg === 'string' ? msg : msg instanceof Error ? msg.message : exports.stringify(msg);
	    });
	    throw new Error(msgs.join(' ') || 'Unknown error');
	};
	
	
	exports.Timer = function () {
	
	    this.ts = 0;
	    this.reset();
	};
	
	
	exports.Timer.prototype.reset = function () {
	
	    this.ts = Date.now();
	};
	
	
	exports.Timer.prototype.elapsed = function () {
	
	    return Date.now() - this.ts;
	};
	
	
	exports.Bench = function () {
	
	    this.ts = 0;
	    this.reset();
	};
	
	
	exports.Bench.prototype.reset = function () {
	
	    this.ts = exports.Bench.now();
	};
	
	
	exports.Bench.prototype.elapsed = function () {
	
	    return exports.Bench.now() - this.ts;
	};
	
	
	exports.Bench.now = function () {
	
	    var ts = process.hrtime();
	    return (ts[0] * 1e3) + (ts[1] / 1e6);
	};
	
	
	// Escape string for Regex construction
	
	exports.escapeRegex = function (string) {
	
	    // Escape ^$.*+-?=!:|\/()[]{},
	    return string.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&');
	};
	
	
	// Base64url (RFC 4648) encode
	
	exports.base64urlEncode = function (value, encoding) {
	
	    var buf = (Buffer.isBuffer(value) ? value : new Buffer(value, encoding || 'binary'));
	    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
	};
	
	
	// Base64url (RFC 4648) decode
	
	exports.base64urlDecode = function (value, encoding) {
	
	    if (value &&
	        !/^[\w\-]*$/.test(value)) {
	
	        return new Error('Invalid character');
	    }
	
	    try {
	        var buf = new Buffer(value, 'base64');
	        return (encoding === 'buffer' ? buf : buf.toString(encoding || 'binary'));
	    }
	    catch (err) {
	        return err;
	    }
	};
	
	
	// Escape attribute value for use in HTTP header
	
	exports.escapeHeaderAttribute = function (attribute) {
	
	    // Allowed value characters: !#$%&'()*+,-./:;<=>?@[]^_`{|}~ and space, a-z, A-Z, 0-9, \, "
	
	    exports.assert(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~\"\\]*$/.test(attribute), 'Bad attribute value (' + attribute + ')');
	
	    return attribute.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');                             // Escape quotes and slash
	};
	
	
	exports.escapeHtml = function (string) {
	
	    return Escape.escapeHtml(string);
	};
	
	
	exports.escapeJavaScript = function (string) {
	
	    return Escape.escapeJavaScript(string);
	};
	
	
	exports.nextTick = function (callback) {
	
	    return function () {
	
	        var args = arguments;
	        process.nextTick(function () {
	
	            callback.apply(null, args);
	        });
	    };
	};
	
	
	exports.once = function (method) {
	
	    if (method._hoekOnce) {
	        return method;
	    }
	
	    var once = false;
	    var wrapped = function () {
	
	        if (!once) {
	            once = true;
	            method.apply(null, arguments);
	        }
	    };
	
	    wrapped._hoekOnce = true;
	
	    return wrapped;
	};
	
	
	exports.isAbsolutePath = function (path, platform) {
	
	    if (!path) {
	        return false;
	    }
	
	    if (Path.isAbsolute) {                      // node >= 0.11
	        return Path.isAbsolute(path);
	    }
	
	    platform = platform || process.platform;
	
	    // Unix
	
	    if (platform !== 'win32') {
	        return path[0] === '/';
	    }
	
	    // Windows
	
	    return !!/^(?:[a-zA-Z]:[\\\/])|(?:[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/])/.test(path);        // C:\ or \\something\something
	};
	
	
	exports.isInteger = function (value) {
	
	    return (typeof value === 'number' &&
	            parseFloat(value) === parseInt(value, 10) &&
	            !isNaN(value));
	};
	
	
	exports.ignore = function () { };
	
	
	exports.inherits = Util.inherits;
	
	
	exports.format = Util.format;
	
	
	exports.transform = function (source, transform, options) {
	
	    exports.assert(source === null || source === undefined || typeof source === 'object' || Array.isArray(source), 'Invalid source object: must be null, undefined, an object, or an array');
	
	    if (Array.isArray(source)) {
	        var results = [];
	        for (var i = 0, il = source.length; i < il; ++i) {
	            results.push(exports.transform(source[i], transform, options));
	        }
	        return results;
	    }
	
	    var result = {};
	    var keys = Object.keys(transform);
	
	    for (var k = 0, kl = keys.length; k < kl; ++k) {
	        var key = keys[k];
	        var path = key.split('.');
	        var sourcePath = transform[key];
	
	        exports.assert(typeof sourcePath === 'string', 'All mappings must be "." delineated strings');
	
	        var segment;
	        var res = result;
	
	        while (path.length > 1) {
	            segment = path.shift();
	            if (!res[segment]) {
	                res[segment] = {};
	            }
	            res = res[segment];
	        }
	        segment = path.shift();
	        res[segment] = exports.reach(source, sourcePath, options);
	    }
	
	    return result;
	};
	
	
	exports.uniqueFilename = function (path, extension) {
	
	    if (extension) {
	        extension = extension[0] !== '.' ? '.' + extension : extension;
	    }
	    else {
	        extension = '';
	    }
	
	    path = Path.resolve(path);
	    var name = [Date.now(), process.pid, Crypto.randomBytes(8).toString('hex')].join('-') + extension;
	    return Path.join(path, name);
	};
	
	
	exports.stringify = function () {
	
	    try {
	        return JSON.stringify.apply(null, arguments);
	    }
	    catch (err) {
	        return '[Cannot display object: ' + err.message + ']';
	    }
	};
	
	
	exports.shallow = function (source) {
	
	    var target = {};
	    var keys = Object.keys(source);
	    for (var i = 0, il = keys.length; i < il; ++i) {
	        var key = keys[i];
	        target[key] = source[key];
	    }
	
	    return target;
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Hoek = __webpack_require__(1);
	const Ref = __webpack_require__(10);
	const Errors = __webpack_require__(146);
	let Alternatives = null;                // Delay-loaded to prevent circular dependencies
	let Cast = null;
	
	
	// Declare internals
	
	const internals = {};
	
	
	internals.defaults = {
	    abortEarly: true,
	    convert: true,
	    allowUnknown: false,
	    skipFunctions: false,
	    stripUnknown: false,
	    language: {},
	    presence: 'optional',
	    raw: false,
	    strip: false,
	    noDefaults: false
	
	    // context: null
	};
	
	
	internals.checkOptions = function (options) {
	
	    const Schemas = __webpack_require__(149);
	    const result = Schemas.options.validate(options);
	    if (result.error) {
	        throw new Error(result.error.details[0].message);
	    }
	};
	
	
	module.exports = internals.Any = function () {
	
	    Cast = Cast || __webpack_require__(20);
	
	    this.isJoi = true;
	    this._type = 'any';
	    this._settings = null;
	    this._valids = new internals.Set();
	    this._invalids = new internals.Set();
	    this._tests = [];
	    this._refs = [];
	    this._flags = {
	    /*
	        presence: 'optional',                   // optional, required, forbidden, ignore
	        allowOnly: false,
	        allowUnknown: undefined,
	        default: undefined,
	        forbidden: false,
	        encoding: undefined,
	        insensitive: false,
	        trim: false,
	        case: undefined,                        // upper, lower
	        empty: undefined,
	        func: false
	    */
	    };
	
	    this._description = null;
	    this._unit = null;
	    this._notes = [];
	    this._tags = [];
	    this._examples = [];
	    this._meta = [];
	
	    this._inner = {};                           // Hash of arrays of immutable objects
	};
	
	
	internals.Any.prototype.createError = Errors.create;
	
	
	internals.Any.prototype.isImmutable = true;     // Prevents Hoek from deep cloning schema objects
	
	
	internals.Any.prototype.clone = function () {
	
	    const obj = Object.create(Object.getPrototypeOf(this));
	
	    obj.isJoi = true;
	    obj._type = this._type;
	    obj._settings = internals.concatSettings(this._settings);
	    obj._valids = Hoek.clone(this._valids);
	    obj._invalids = Hoek.clone(this._invalids);
	    obj._tests = this._tests.slice();
	    obj._refs = this._refs.slice();
	    obj._flags = Hoek.clone(this._flags);
	
	    obj._description = this._description;
	    obj._unit = this._unit;
	    obj._notes = this._notes.slice();
	    obj._tags = this._tags.slice();
	    obj._examples = this._examples.slice();
	    obj._meta = this._meta.slice();
	
	    obj._inner = {};
	    const inners = Object.keys(this._inner);
	    for (let i = 0; i < inners.length; ++i) {
	        const key = inners[i];
	        obj._inner[key] = this._inner[key] ? this._inner[key].slice() : null;
	    }
	
	    return obj;
	};
	
	
	internals.Any.prototype.concat = function (schema) {
	
	    Hoek.assert(schema && schema.isJoi, 'Invalid schema object');
	    Hoek.assert(this._type === 'any' || schema._type === 'any' || schema._type === this._type, 'Cannot merge type', this._type, 'with another type:', schema._type);
	
	    let obj = this.clone();
	
	    if (this._type === 'any' && schema._type !== 'any') {
	
	        // Reset values as if we were "this"
	        const tmpObj = schema.clone();
	        const keysToRestore = ['_settings', '_valids', '_invalids', '_tests', '_refs', '_flags', '_description', '_unit',
	            '_notes', '_tags', '_examples', '_meta', '_inner'];
	
	        for (let i = 0; i < keysToRestore.length; ++i) {
	            tmpObj[keysToRestore[i]] = obj[keysToRestore[i]];
	        }
	
	        obj = tmpObj;
	    }
	
	    obj._settings = obj._settings ? internals.concatSettings(obj._settings, schema._settings) : schema._settings;
	    obj._valids.merge(schema._valids, schema._invalids);
	    obj._invalids.merge(schema._invalids, schema._valids);
	    obj._tests = obj._tests.concat(schema._tests);
	    obj._refs = obj._refs.concat(schema._refs);
	    Hoek.merge(obj._flags, schema._flags);
	
	    obj._description = schema._description || obj._description;
	    obj._unit = schema._unit || obj._unit;
	    obj._notes = obj._notes.concat(schema._notes);
	    obj._tags = obj._tags.concat(schema._tags);
	    obj._examples = obj._examples.concat(schema._examples);
	    obj._meta = obj._meta.concat(schema._meta);
	
	    const inners = Object.keys(schema._inner);
	    const isObject = obj._type === 'object';
	    for (let i = 0; i < inners.length; ++i) {
	        const key = inners[i];
	        const source = schema._inner[key];
	        if (source) {
	            const target = obj._inner[key];
	            if (target) {
	                if (isObject && key === 'children') {
	                    const keys = {};
	
	                    for (let j = 0; j < target.length; ++j) {
	                        keys[target[j].key] = j;
	                    }
	
	                    for (let j = 0; j < source.length; ++j) {
	                        const sourceKey = source[j].key;
	                        if (keys[sourceKey] >= 0) {
	                            target[keys[sourceKey]] = {
	                                key: sourceKey,
	                                schema: target[keys[sourceKey]].schema.concat(source[j].schema)
	                            };
	                        }
	                        else {
	                            target.push(source[j]);
	                        }
	                    }
	                }
	                else {
	                    obj._inner[key] = obj._inner[key].concat(source);
	                }
	            }
	            else {
	                obj._inner[key] = source.slice();
	            }
	        }
	    }
	
	    return obj;
	};
	
	
	internals.Any.prototype._test = function (name, arg, func) {
	
	    const obj = this.clone();
	    obj._tests.push({ func, name, arg });
	    return obj;
	};
	
	
	internals.Any.prototype.options = function (options) {
	
	    Hoek.assert(!options.context, 'Cannot override context');
	    internals.checkOptions(options);
	
	    const obj = this.clone();
	    obj._settings = internals.concatSettings(obj._settings, options);
	    return obj;
	};
	
	
	internals.Any.prototype.strict = function (isStrict) {
	
	    const obj = this.clone();
	    obj._settings = obj._settings || {};
	    obj._settings.convert = isStrict === undefined ? false : !isStrict;
	    return obj;
	};
	
	
	internals.Any.prototype.raw = function (isRaw) {
	
	    const obj = this.clone();
	    obj._settings = obj._settings || {};
	    obj._settings.raw = isRaw === undefined ? true : isRaw;
	    return obj;
	};
	
	
	internals.Any.prototype.error = function (err) {
	
	    Hoek.assert(err && err instanceof Error, 'Must provide a valid Error object');
	
	    const obj = this.clone();
	    obj._settings = obj._settings || {};
	    obj._settings.error = err;
	    return obj;
	};
	
	
	internals.Any.prototype._allow = function () {
	
	    const values = Hoek.flatten(Array.prototype.slice.call(arguments));
	    for (let i = 0; i < values.length; ++i) {
	        const value = values[i];
	
	        Hoek.assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
	        this._invalids.remove(value);
	        this._valids.add(value, this._refs);
	    }
	};
	
	
	internals.Any.prototype.allow = function () {
	
	    const obj = this.clone();
	    obj._allow.apply(obj, arguments);
	    return obj;
	};
	
	
	internals.Any.prototype.valid = internals.Any.prototype.only = internals.Any.prototype.equal = function () {
	
	    const obj = this.allow.apply(this, arguments);
	    obj._flags.allowOnly = true;
	    return obj;
	};
	
	
	internals.Any.prototype.invalid = internals.Any.prototype.disallow = internals.Any.prototype.not = function (value) {
	
	    const obj = this.clone();
	    const values = Hoek.flatten(Array.prototype.slice.call(arguments));
	    for (let i = 0; i < values.length; ++i) {
	        value = values[i];
	
	        Hoek.assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
	        obj._valids.remove(value);
	        obj._invalids.add(value, this._refs);
	    }
	
	    return obj;
	};
	
	
	internals.Any.prototype.required = internals.Any.prototype.exist = function () {
	
	    const obj = this.clone();
	    obj._flags.presence = 'required';
	    return obj;
	};
	
	
	internals.Any.prototype.optional = function () {
	
	    const obj = this.clone();
	    obj._flags.presence = 'optional';
	    return obj;
	};
	
	
	internals.Any.prototype.forbidden = function () {
	
	    const obj = this.clone();
	    obj._flags.presence = 'forbidden';
	    return obj;
	};
	
	
	internals.Any.prototype.strip = function () {
	
	    const obj = this.clone();
	    obj._flags.strip = true;
	    return obj;
	};
	
	
	internals.Any.prototype.applyFunctionToChildren = function (children, fn, args, root) {
	
	    children = [].concat(children);
	
	    if (children.length !== 1 || children[0] !== '') {
	        root = root ? (root + '.') : '';
	
	        const extraChildren = (children[0] === '' ? children.slice(1) : children).map((child) => {
	
	            return root + child;
	        });
	
	        throw new Error('unknown key(s) ' + extraChildren.join(', '));
	    }
	
	    return this[fn].apply(this, args);
	};
	
	
	internals.Any.prototype.default = function (value, description) {
	
	    if (typeof value === 'function' &&
	        !Ref.isRef(value)) {
	
	        if (!value.description &&
	            description) {
	
	            value.description = description;
	        }
	
	        if (!this._flags.func) {
	            Hoek.assert(typeof value.description === 'string' && value.description.length > 0, 'description must be provided when default value is a function');
	        }
	    }
	
	    const obj = this.clone();
	    obj._flags.default = value;
	    Ref.push(obj._refs, value);
	    return obj;
	};
	
	
	internals.Any.prototype.empty = function (schema) {
	
	    const obj = this.clone();
	    obj._flags.empty = schema === undefined ? undefined : Cast.schema(schema);
	    return obj;
	};
	
	
	internals.Any.prototype.when = function (ref, options) {
	
	    Hoek.assert(options && typeof options === 'object', 'Invalid options');
	    Hoek.assert(options.then !== undefined || options.otherwise !== undefined, 'options must have at least one of "then" or "otherwise"');
	
	    const then = options.hasOwnProperty('then') ? this.concat(Cast.schema(options.then)) : undefined;
	    const otherwise = options.hasOwnProperty('otherwise') ? this.concat(Cast.schema(options.otherwise)) : undefined;
	
	    Alternatives = Alternatives || __webpack_require__(45);
	    const obj = Alternatives.when(ref, { is: options.is, then, otherwise });
	    obj._flags.presence = 'ignore';
	    obj._settings = internals.concatSettings(obj._settings, { baseType: this });
	
	    return obj;
	};
	
	
	internals.Any.prototype.description = function (desc) {
	
	    Hoek.assert(desc && typeof desc === 'string', 'Description must be a non-empty string');
	
	    const obj = this.clone();
	    obj._description = desc;
	    return obj;
	};
	
	
	internals.Any.prototype.notes = function (notes) {
	
	    Hoek.assert(notes && (typeof notes === 'string' || Array.isArray(notes)), 'Notes must be a non-empty string or array');
	
	    const obj = this.clone();
	    obj._notes = obj._notes.concat(notes);
	    return obj;
	};
	
	
	internals.Any.prototype.tags = function (tags) {
	
	    Hoek.assert(tags && (typeof tags === 'string' || Array.isArray(tags)), 'Tags must be a non-empty string or array');
	
	    const obj = this.clone();
	    obj._tags = obj._tags.concat(tags);
	    return obj;
	};
	
	internals.Any.prototype.meta = function (meta) {
	
	    Hoek.assert(meta !== undefined, 'Meta cannot be undefined');
	
	    const obj = this.clone();
	    obj._meta = obj._meta.concat(meta);
	    return obj;
	};
	
	
	internals.Any.prototype.example = function (value) {
	
	    Hoek.assert(arguments.length, 'Missing example');
	    const result = this._validate(value, null, internals.defaults);
	    Hoek.assert(!result.errors, 'Bad example:', result.errors && Errors.process(result.errors, value));
	
	    const obj = this.clone();
	    obj._examples.push(value);
	    return obj;
	};
	
	
	internals.Any.prototype.unit = function (name) {
	
	    Hoek.assert(name && typeof name === 'string', 'Unit name must be a non-empty string');
	
	    const obj = this.clone();
	    obj._unit = name;
	    return obj;
	};
	
	
	internals._try = function (fn, arg) {
	
	    let err;
	    let result;
	
	    try {
	        result = fn.call(null, arg);
	    }
	    catch (e) {
	        err = e;
	    }
	
	    return {
	        value: result,
	        error: err
	    };
	};
	
	
	internals.Any.prototype._validate = function (value, state, options, reference) {
	
	    const originalValue = value;
	
	    // Setup state and settings
	
	    state = state || { key: '', path: '', parent: null, reference };
	
	    if (this._settings) {
	        options = internals.concatSettings(options, this._settings);
	    }
	
	    let errors = [];
	    const finish = () => {
	
	        let finalValue;
	
	        if (!this._flags.strip) {
	            if (value !== undefined) {
	                finalValue = options.raw ? originalValue : value;
	            }
	            else if (options.noDefaults) {
	                finalValue = originalValue;
	            }
	            else if (Ref.isRef(this._flags.default)) {
	                finalValue = this._flags.default(state.parent, options);
	            }
	            else if (typeof this._flags.default === 'function' &&
	                    !(this._flags.func && !this._flags.default.description)) {
	
	                let arg;
	
	                if (state.parent !== null &&
	                    this._flags.default.length > 0) {
	
	                    arg = Hoek.clone(state.parent);
	                }
	
	                const defaultValue = internals._try(this._flags.default, arg);
	                finalValue = defaultValue.value;
	                if (defaultValue.error) {
	                    errors.push(this.createError('any.default', defaultValue.error, state, options));
	                }
	            }
	            else {
	                finalValue = Hoek.clone(this._flags.default);
	            }
	        }
	
	        return {
	            value: finalValue,
	            errors: errors.length ? errors : null
	        };
	    };
	
	    // Check presence requirements
	
	    const presence = this._flags.presence || options.presence;
	    if (presence === 'optional') {
	        if (value === undefined) {
	            const isDeepDefault = this._flags.hasOwnProperty('default') && this._flags.default === undefined;
	            if (isDeepDefault && this._type === 'object') {
	                value = {};
	            }
	            else {
	                return finish();
	            }
	        }
	    }
	    else if (presence === 'required' &&
	            value === undefined) {
	
	        errors.push(this.createError('any.required', null, state, options));
	        return finish();
	    }
	    else if (presence === 'forbidden') {
	        if (value === undefined) {
	            return finish();
	        }
	
	        errors.push(this.createError('any.unknown', null, state, options));
	        return finish();
	    }
	
	    if (this._flags.empty && !this._flags.empty._validate(value, null, internals.defaults).errors) {
	        value = undefined;
	        return finish();
	    }
	
	    // Check allowed and denied values using the original value
	
	    if (this._valids.has(value, state, options, this._flags.insensitive)) {
	        return finish();
	    }
	
	    if (this._invalids.has(value, state, options, this._flags.insensitive)) {
	        errors.push(this.createError(value === '' ? 'any.empty' : 'any.invalid', null, state, options));
	        if (options.abortEarly ||
	            value === undefined) {          // No reason to keep validating missing value
	
	            return finish();
	        }
	    }
	
	    // Convert value and validate type
	
	    if (this._base) {
	        const base = this._base.call(this, value, state, options);
	        if (base.errors) {
	            value = base.value;
	            errors = errors.concat(base.errors);
	            return finish();                            // Base error always aborts early
	        }
	
	        if (base.value !== value) {
	            value = base.value;
	
	            // Check allowed and denied values using the converted value
	
	            if (this._valids.has(value, state, options, this._flags.insensitive)) {
	                return finish();
	            }
	
	            if (this._invalids.has(value, state, options, this._flags.insensitive)) {
	                errors.push(this.createError(value === '' ? 'any.empty' : 'any.invalid', null, state, options));
	                if (options.abortEarly) {
	                    return finish();
	                }
	            }
	        }
	    }
	
	    // Required values did not match
	
	    if (this._flags.allowOnly) {
	        errors.push(this.createError('any.allowOnly', { valids: this._valids.values({ stripUndefined: true }) }, state, options));
	        if (options.abortEarly) {
	            return finish();
	        }
	    }
	
	    // Helper.validate tests
	
	    for (let i = 0; i < this._tests.length; ++i) {
	        const test = this._tests[i];
	        const err = test.func.call(this, value, state, options);
	        if (err) {
	            errors.push(err);
	            if (options.abortEarly) {
	                return finish();
	            }
	        }
	    }
	
	    return finish();
	};
	
	
	internals.Any.prototype._validateWithOptions = function (value, options, callback) {
	
	    if (options) {
	        internals.checkOptions(options);
	    }
	
	    const settings = internals.concatSettings(internals.defaults, options);
	    const result = this._validate(value, null, settings);
	    const errors = Errors.process(result.errors, value);
	
	    if (callback) {
	        return callback(errors, result.value);
	    }
	
	    return { error: errors, value: result.value };
	};
	
	
	internals.Any.prototype.validate = function (value, options, callback) {
	
	    if (typeof options === 'function') {
	        return this._validateWithOptions(value, null, options);
	    }
	
	    return this._validateWithOptions(value, options, callback);
	};
	
	
	internals.Any.prototype.describe = function () {
	
	    const description = {
	        type: this._type
	    };
	
	    const flags = Object.keys(this._flags);
	    if (flags.length) {
	        if (this._flags.hasOwnProperty('empty') || this._flags.hasOwnProperty('default') || this._flags.lazy) {
	            description.flags = {};
	            for (let i = 0; i < flags.length; ++i) {
	                const flag = flags[i];
	                if (flag === 'empty') {
	                    description.flags[flag] = this._flags[flag].describe();
	                }
	                else if (flag === 'default') {
	                    if (Ref.isRef(this._flags[flag])) {
	                        description.flags[flag] = this._flags[flag].toString();
	                    }
	                    else if (typeof this._flags[flag] === 'function') {
	                        description.flags[flag] = this._flags[flag].description;
	                    }
	                    else {
	                        description.flags[flag] = this._flags[flag];
	                    }
	                }
	                else if (flag === 'lazy') {
	                    // We don't want it in the description
	                }
	                else {
	                    description.flags[flag] = this._flags[flag];
	                }
	            }
	        }
	        else {
	            description.flags = this._flags;
	        }
	    }
	
	    if (this._description) {
	        description.description = this._description;
	    }
	
	    if (this._notes.length) {
	        description.notes = this._notes;
	    }
	
	    if (this._tags.length) {
	        description.tags = this._tags;
	    }
	
	    if (this._meta.length) {
	        description.meta = this._meta;
	    }
	
	    if (this._examples.length) {
	        description.examples = this._examples;
	    }
	
	    if (this._unit) {
	        description.unit = this._unit;
	    }
	
	    const valids = this._valids.values();
	    if (valids.length) {
	        description.valids = valids.map((v) => {
	
	            return Ref.isRef(v) ? v.toString() : v;
	        });
	    }
	
	    const invalids = this._invalids.values();
	    if (invalids.length) {
	        description.invalids = invalids.map((v) => {
	
	            return Ref.isRef(v) ? v.toString() : v;
	        });
	    }
	
	    description.rules = [];
	
	    for (let i = 0; i < this._tests.length; ++i) {
	        const validator = this._tests[i];
	        const item = { name: validator.name };
	        if (validator.arg !== void 0) {
	            item.arg = Ref.isRef(validator.arg) ? validator.arg.toString() : validator.arg;
	        }
	        description.rules.push(item);
	    }
	
	    if (!description.rules.length) {
	        delete description.rules;
	    }
	
	    const label = Hoek.reach(this._settings, 'language.label');
	    if (label) {
	        description.label = label;
	    }
	
	    return description;
	};
	
	
	internals.Any.prototype.label = function (name) {
	
	    Hoek.assert(name && typeof name === 'string', 'Label name must be a non-empty string');
	
	    const obj = this.clone();
	    const options = { language: { label: name } };
	
	    obj._settings = internals.concatSettings(obj._settings, options);
	    return obj;
	};
	
	
	// Set
	
	internals.Set = function () {
	
	    this._set = [];
	};
	
	
	internals.Set.prototype.add = function (value, refs) {
	
	    if (!Ref.isRef(value) && this.has(value, null, null, false)) {
	
	        return;
	    }
	
	    if (refs !== undefined) { // If it's a merge, we don't have any refs
	        Ref.push(refs, value);
	    }
	
	    this._set.push(value);
	};
	
	
	internals.Set.prototype.merge = function (add, remove) {
	
	    for (let i = 0; i < add._set.length; ++i) {
	        this.add(add._set[i]);
	    }
	
	    for (let i = 0; i < remove._set.length; ++i) {
	        this.remove(remove._set[i]);
	    }
	};
	
	
	internals.Set.prototype.remove = function (value) {
	
	    this._set = this._set.filter((item) => value !== item);
	};
	
	
	internals.Set.prototype.has = function (value, state, options, insensitive) {
	
	    for (let i = 0; i < this._set.length; ++i) {
	        let items = this._set[i];
	
	        if (state && Ref.isRef(items)) { // Only resolve references if there is a state, otherwise it's a merge
	            items = items(state.reference || state.parent, options);
	        }
	
	        if (!Array.isArray(items)) {
	            items = [items];
	        }
	
	        for (let j = 0; j < items.length; ++j) {
	            const item = items[j];
	            if (typeof value !== typeof item) {
	                continue;
	            }
	
	            if (value === item ||
	                (value instanceof Date && item instanceof Date && value.getTime() === item.getTime()) ||
	                (insensitive && typeof value === 'string' && value.toLowerCase() === item.toLowerCase()) ||
	                (Buffer.isBuffer(value) && Buffer.isBuffer(item) && value.length === item.length && value.toString('binary') === item.toString('binary'))) {
	
	                return true;
	            }
	        }
	    }
	
	    return false;
	};
	
	
	internals.Set.prototype.values = function (options) {
	
	    if (options && options.stripUndefined) {
	        const values = [];
	
	        for (let i = 0; i < this._set.length; ++i) {
	            const item = this._set[i];
	            if (item !== undefined) {
	                values.push(item);
	            }
	        }
	
	        return values;
	    }
	
	    return this._set.slice();
	};
	
	
	internals.concatSettings = function (target, source) {
	
	    // Used to avoid cloning context
	
	    if (!target &&
	        !source) {
	
	        return null;
	    }
	
	    const obj = {};
	
	    if (target) {
	        Object.assign(obj, target);
	    }
	
	    if (source) {
	        const sKeys = Object.keys(source);
	        for (let i = 0; i < sKeys.length; ++i) {
	            const key = sKeys[i];
	            if (key !== 'language' ||
	                !obj.hasOwnProperty(key)) {
	
	                obj[key] = source[key];
	            }
	            else {
	                obj[key] = Hoek.applyToDefaults(obj[key], source[key]);
	            }
	        }
	    }
	
	    return obj;
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 4 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var nconf = __webpack_require__(76);
	
	var provider = null;
	var setProvider = exports.setProvider = function setProvider(providerFunction) {
	  provider = providerFunction;
	};
	
	exports.default = function (key) {
	  if (provider) {
	    return provider(key);
	  }
	
	  return nconf.get(key);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(17)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 7 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(16)
	  , IE8_DOM_DEFINE = __webpack_require__(55)
	  , toPrimitive    = __webpack_require__(42)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(118)
	  , defined = __webpack_require__(31);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Hoek = __webpack_require__(1);
	
	
	// Declare internals
	
	const internals = {};
	
	
	exports.create = function (key, options) {
	
	    Hoek.assert(typeof key === 'string', 'Invalid reference key:', key);
	
	    const settings = Hoek.clone(options);         // options can be reused and modified
	
	    const ref = function (value, validationOptions) {
	
	        return Hoek.reach(ref.isContext ? validationOptions.context : value, ref.key, settings);
	    };
	
	    ref.isContext = (key[0] === ((settings && settings.contextPrefix) || '$'));
	    ref.key = (ref.isContext ? key.slice(1) : key);
	    ref.path = ref.key.split((settings && settings.separator) || '.');
	    ref.depth = ref.path.length;
	    ref.root = ref.path[0];
	    ref.isJoi = true;
	
	    ref.toString = function () {
	
	        return (ref.isContext ? 'context:' : 'ref:') + ref.key;
	    };
	
	    return ref;
	};
	
	
	exports.isRef = function (ref) {
	
	    return typeof ref === 'function' && ref.isJoi;
	};
	
	
	exports.push = function (array, ref) {
	
	    if (exports.isRef(ref) &&
	        !ref.isContext) {
	
	        array.push(ref.root);
	    }
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var winston = __webpack_require__(176);
	winston.emitErrs = true;
	
	var logger = new winston.Logger({
	  transports: [new winston.transports.Console({
	    timestamp: true,
	    level: 'debug',
	    handleExceptions: true,
	    json: false,
	    colorize: true
	  })],
	  exitOnError: false
	});
	
	module.exports = logger;
	module.exports.stream = {
	  write: function write(message) {
	    logger.info(message.replace(/\n$/, ''));
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(4)
	  , core      = __webpack_require__(3)
	  , ctx       = __webpack_require__(53)
	  , hide      = __webpack_require__(14)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(8)
	  , createDesc = __webpack_require__(29);
	module.exports = __webpack_require__(6) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(39)('wks')
	  , uid        = __webpack_require__(30)
	  , Symbol     = __webpack_require__(4).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(61)
	  , enumBugKeys = __webpack_require__(32);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Hoek = __webpack_require__(1);
	const Ref = __webpack_require__(10);
	
	// Type modules are delay-loaded to prevent circular dependencies
	
	
	// Declare internals
	
	const internals = {
	    any: null,
	    date: __webpack_require__(46),
	    string: __webpack_require__(68),
	    number: __webpack_require__(66),
	    boolean: __webpack_require__(64),
	    alt: null,
	    object: null
	};
	
	
	exports.schema = function (config) {
	
	    internals.any = internals.any || new (__webpack_require__(2))();
	    internals.alt = internals.alt || __webpack_require__(45);
	    internals.object = internals.object || __webpack_require__(67);
	
	    if (config !== undefined && config !== null && typeof config === 'object') {
	
	        if (config.isJoi) {
	            return config;
	        }
	
	        if (Array.isArray(config)) {
	            return internals.alt.try(config);
	        }
	
	        if (config instanceof RegExp) {
	            return internals.string.regex(config);
	        }
	
	        if (config instanceof Date) {
	            return internals.date.valid(config);
	        }
	
	        return internals.object.keys(config);
	    }
	
	    if (typeof config === 'string') {
	        return internals.string.valid(config);
	    }
	
	    if (typeof config === 'number') {
	        return internals.number.valid(config);
	    }
	
	    if (typeof config === 'boolean') {
	        return internals.boolean.valid(config);
	    }
	
	    if (Ref.isRef(config)) {
	        return internals.any.valid(config);
	    }
	
	    Hoek.assert(config === null, 'Invalid schema content:', config);
	
	    return internals.any.valid(null);
	};
	
	
	exports.ref = function (id) {
	
	    return Ref.isRef(id) ? id : Ref.create(id);
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.managementClient = exports.validateHookToken = exports.errorHandler = exports.requireUser = exports.dashboardAdmins = undefined;
	
	var _dashboardAdmins2 = __webpack_require__(87);
	
	var _dashboardAdmins3 = _interopRequireDefault(_dashboardAdmins2);
	
	var _requireUser2 = __webpack_require__(90);
	
	var _requireUser3 = _interopRequireDefault(_requireUser2);
	
	var _errorHandler2 = __webpack_require__(88);
	
	var _errorHandler3 = _interopRequireDefault(_errorHandler2);
	
	var _validateHookToken2 = __webpack_require__(91);
	
	var _validateHookToken3 = _interopRequireDefault(_validateHookToken2);
	
	var _managementClient2 = __webpack_require__(89);
	
	var _managementClient3 = _interopRequireDefault(_managementClient2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.dashboardAdmins = _dashboardAdmins3.default;
	exports.requireUser = _requireUser3.default;
	exports.errorHandler = _errorHandler3.default;
	exports.validateHookToken = _validateHookToken3.default;
	exports.managementClient = _managementClient3.default;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(108), __esModule: true };

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(101);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(103);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(100);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(51);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(51);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(16)
	  , dPs         = __webpack_require__(124)
	  , enumBugKeys = __webpack_require__(32)
	  , IE_PROTO    = __webpack_require__(38)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(54)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(117).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 36 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(8).f
	  , has = __webpack_require__(7)
	  , TAG = __webpack_require__(15)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(39)('keys')
	  , uid    = __webpack_require__(30);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(31);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(18);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(4)
	  , core           = __webpack_require__(3)
	  , LIBRARY        = __webpack_require__(34)
	  , wksExt         = __webpack_require__(44)
	  , defineProperty = __webpack_require__(8).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(15);

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Hoek = __webpack_require__(1);
	const Any = __webpack_require__(2);
	const Cast = __webpack_require__(20);
	const Ref = __webpack_require__(10);
	
	
	// Declare internals
	
	const internals = {};
	
	
	internals.Alternatives = function () {
	
	    Any.call(this);
	    this._type = 'alternatives';
	    this._invalids.remove(null);
	    this._inner.matches = [];
	};
	
	Hoek.inherits(internals.Alternatives, Any);
	
	
	internals.Alternatives.prototype._base = function (value, state, options) {
	
	    let errors = [];
	    const il = this._inner.matches.length;
	    const baseType = this._settings && this._settings.baseType;
	
	    for (let i = 0; i < il; ++i) {
	        const item = this._inner.matches[i];
	        const schema = item.schema;
	        if (!schema) {
	            const failed = item.is._validate(item.ref(state.parent, options), null, options, state.parent).errors;
	
	            if (failed) {
	                if (item.otherwise) {
	                    return item.otherwise._validate(value, state, options);
	                }
	                else if (baseType && i  === (il - 1)) {
	                    return baseType._validate(value, state, options);
	                }
	            }
	            else if (item.then || baseType) {
	                return (item.then || baseType)._validate(value, state, options);
	            }
	
	            continue;
	        }
	
	        const result = schema._validate(value, state, options);
	        if (!result.errors) {     // Found a valid match
	            return result;
	        }
	
	        errors = errors.concat(result.errors);
	    }
	
	    return { errors: errors.length ? errors : this.createError('alternatives.base', null, state, options) };
	};
	
	
	internals.Alternatives.prototype.try = function (/* schemas */) {
	
	    const schemas = Hoek.flatten(Array.prototype.slice.call(arguments));
	    Hoek.assert(schemas.length, 'Cannot add other alternatives without at least one schema');
	
	    const obj = this.clone();
	
	    for (let i = 0; i < schemas.length; ++i) {
	        const cast = Cast.schema(schemas[i]);
	        if (cast._refs.length) {
	            obj._refs = obj._refs.concat(cast._refs);
	        }
	        obj._inner.matches.push({ schema: cast });
	    }
	
	    return obj;
	};
	
	
	internals.Alternatives.prototype.when = function (ref, options) {
	
	    Hoek.assert(Ref.isRef(ref) || typeof ref === 'string', 'Invalid reference:', ref);
	    Hoek.assert(options, 'Missing options');
	    Hoek.assert(typeof options === 'object', 'Invalid options');
	    Hoek.assert(options.hasOwnProperty('is'), 'Missing "is" directive');
	    Hoek.assert(options.then !== undefined || options.otherwise !== undefined, 'options must have at least one of "then" or "otherwise"');
	
	    const obj = this.clone();
	    let is = Cast.schema(options.is);
	
	    if (options.is === null || !options.is.isJoi) {
	
	        // Only apply required if this wasn't already a schema, we'll suppose people know what they're doing
	        is = is.required();
	    }
	
	    const item = {
	        ref: Cast.ref(ref),
	        is,
	        then: options.then !== undefined ? Cast.schema(options.then) : undefined,
	        otherwise: options.otherwise !== undefined ? Cast.schema(options.otherwise) : undefined
	    };
	
	    if (obj._settings && obj._settings.baseType) {
	        item.then = item.then && obj._settings.baseType.concat(item.then);
	        item.otherwise = item.otherwise && obj._settings.baseType.concat(item.otherwise);
	    }
	
	    Ref.push(obj._refs, item.ref);
	    obj._refs = obj._refs.concat(item.is._refs);
	
	    if (item.then && item.then._refs) {
	        obj._refs = obj._refs.concat(item.then._refs);
	    }
	
	    if (item.otherwise && item.otherwise._refs) {
	        obj._refs = obj._refs.concat(item.otherwise._refs);
	    }
	
	    obj._inner.matches.push(item);
	
	    return obj;
	};
	
	
	internals.Alternatives.prototype.describe = function () {
	
	    const description = Any.prototype.describe.call(this);
	    const alternatives = [];
	    for (let i = 0; i < this._inner.matches.length; ++i) {
	        const item = this._inner.matches[i];
	        if (item.schema) {
	
	            // try()
	
	            alternatives.push(item.schema.describe());
	        }
	        else {
	
	            // when()
	
	            const when = {
	                ref: item.ref.toString(),
	                is: item.is.describe()
	            };
	
	            if (item.then) {
	                when.then = item.then.describe();
	            }
	
	            if (item.otherwise) {
	                when.otherwise = item.otherwise.describe();
	            }
	
	            alternatives.push(when);
	        }
	    }
	
	    description.alternatives = alternatives;
	    return description;
	};
	
	
	module.exports = new internals.Alternatives();


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Any = __webpack_require__(2);
	const Ref = __webpack_require__(10);
	const Hoek = __webpack_require__(1);
	const Moment = __webpack_require__(167);
	
	
	// Declare internals
	
	const internals = {};
	
	internals.isoDate = /^(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/;
	internals.invalidDate = new Date('');
	internals.isIsoDate = (() => {
	
	    const isoString = internals.isoDate.toString();
	
	    return (date) => {
	
	        return date && (date.toString() === isoString);
	    };
	})();
	
	internals.Date = function () {
	
	    Any.call(this);
	    this._type = 'date';
	};
	
	Hoek.inherits(internals.Date, Any);
	
	internals.Date.prototype._base = function (value, state, options) {
	
	    const result = {
	        value: (options.convert && internals.toDate(value, this._flags.format, this._flags.timestamp, this._flags.multiplier)) || value
	    };
	
	    if (result.value instanceof Date && !isNaN(result.value.getTime())) {
	        result.errors = null;
	    }
	    else if (!options.convert) {
	        result.errors = this.createError('date.strict', null, state, options);
	    }
	    else {
	        let type;
	        if (internals.isIsoDate(this._flags.format)) {
	            type = 'isoDate';
	        }
	        else if (this._flags.timestamp) {
	            type = 'timestamp.' + this._flags.timestamp;
	        }
	        else {
	            type = 'base';
	        }
	
	        result.errors = this.createError('date.' + type, null, state, options);
	    }
	
	    return result;
	};
	
	internals.toDate = function (value, format, timestamp, multiplier) {
	
	    if (value instanceof Date) {
	        return value;
	    }
	
	    if (typeof value === 'string' ||
	        (typeof value === 'number' && !isNaN(value) && isFinite(value))) {
	
	        if (typeof value === 'string' &&
	            /^[+-]?\d+(\.\d+)?$/.test(value)) {
	
	            value = parseFloat(value);
	        }
	
	        let date;
	        if (format) {
	            if (internals.isIsoDate(format)) {
	                date = format.test(value) ? new Date(value) : internals.invalidDate;
	            }
	            else {
	                date = Moment(value, format, true);
	                date = date.isValid() ? date.toDate() : internals.invalidDate;
	            }
	        }
	        else if (timestamp && multiplier) {
	            date = new Date(value * multiplier);
	        }
	        else {
	            date = new Date(value);
	        }
	
	        if (!isNaN(date.getTime())) {
	            return date;
	        }
	    }
	
	    return null;
	};
	
	internals.compare = function (type, compare) {
	
	    return function (date) {
	
	        const isNow = date === 'now';
	        const isRef = Ref.isRef(date);
	
	        if (!isNow && !isRef) {
	            date = internals.toDate(date);
	        }
	
	        Hoek.assert(date, 'Invalid date format');
	
	        return this._test(type, date, (value, state, options) => {
	
	            let compareTo;
	            if (isNow) {
	                compareTo = Date.now();
	            }
	            else if (isRef) {
	                compareTo = internals.toDate(date(state.parent, options));
	
	                if (!compareTo) {
	                    return this.createError('date.ref', { ref: date.key }, state, options);
	                }
	
	                compareTo = compareTo.getTime();
	            }
	            else {
	                compareTo = date.getTime();
	            }
	
	            if (compare(value.getTime(), compareTo)) {
	                return null;
	            }
	
	            return this.createError('date.' + type, { limit: new Date(compareTo) }, state, options);
	        });
	    };
	};
	
	internals.Date.prototype.min = internals.compare('min', (value, date) => value >= date);
	internals.Date.prototype.max = internals.compare('max', (value, date) => value <= date);
	
	internals.Date.prototype.format = function (format) {
	
	    Hoek.assert(typeof format === 'string' || (Array.isArray(format) && format.every((f) => typeof f === 'string')), 'Invalid format.');
	
	    const obj = this.clone();
	    obj._flags.format = format;
	    return obj;
	};
	
	internals.Date.prototype.iso = function () {
	
	    const obj = this.clone();
	    obj._flags.format = internals.isoDate;
	    return obj;
	};
	
	internals.Date.prototype.timestamp = function (type) {
	
	    type = type || 'javascript';
	
	    const allowed = ['javascript', 'unix'];
	    Hoek.assert(allowed.indexOf(type) !== -1, '"type" must be one of "' + allowed.join('", "') + '"');
	
	    const obj = this.clone();
	    obj._flags.timestamp = type;
	    obj._flags.multiplier = type === 'unix' ? 1000 : 1;
	    return obj;
	};
	
	internals.Date.prototype._isIsoDate = function (value) {
	
	    return internals.isoDate.test(value);
	};
	
	module.exports = new internals.Date();


/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getForAccessToken = exports.getForClient = exports.getAccessToken = undefined;
	
	var _ms = __webpack_require__(169);
	
	var _ms2 = _interopRequireDefault(_ms);
	
	var _bluebird = __webpack_require__(70);
	
	var _bluebird2 = _interopRequireDefault(_bluebird);
	
	var _lruMemoizer = __webpack_require__(154);
	
	var _lruMemoizer2 = _interopRequireDefault(_lruMemoizer);
	
	var _requestPromise = __webpack_require__(173);
	
	var _requestPromise2 = _interopRequireDefault(_requestPromise);
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var auth0 = __webpack_require__(159);
	if ((0, _config2.default)('HOSTING_ENV') === 'webtask') {
	  auth0 = __webpack_require__(160);
	}
	
	var getAccessToken = exports.getAccessToken = _bluebird2.default.promisify((0, _lruMemoizer2.default)({
	  load: function load(domain, clientId, clientSecret, callback) {
	    var options = {
	      uri: 'https://' + domain + '/oauth/token',
	      body: {
	        audience: 'https://' + domain + '/api/v2/',
	        grant_type: 'client_credentials',
	        client_id: clientId,
	        client_secret: clientSecret
	      },
	      json: true
	    };
	
	    return _requestPromise2.default.post(options).then(function (data) {
	      return callback(null, data.access_token);
	    }).catch(function (err) {
	      return callback(err);
	    });
	  },
	  hash: function hash(domain, clientId, clientSecret) {
	    return domain + '/' + clientId + '/' + clientSecret;
	  },
	  max: 100,
	  maxAge: (0, _ms2.default)('1h')
	}));
	
	var getForClient = exports.getForClient = function getForClient(domain, clientId, clientSecret) {
	  return getAccessToken(domain, clientId, clientSecret).then(function (accessToken) {
	    return new auth0.ManagementClient({ domain: domain, token: accessToken });
	  });
	};
	
	var getForAccessToken = exports.getForAccessToken = function getForAccessToken(domain, accessToken) {
	  return _bluebird2.default.resolve(new auth0.ManagementClient({ domain: domain, token: accessToken }));
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _lodash = __webpack_require__(21);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _express = __webpack_require__(11);
	
	var _middlewares = __webpack_require__(23);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var uuid = __webpack_require__(158);
	var csv = __webpack_require__(161);
	var each = __webpack_require__(163);
	var Email = __webpack_require__(81);
	
	var email = null;
	
	/*
	 * List all users.
	 */
	var getUsers = function getUsers() {
	  return function (req, res, next) {
	    var options = {
	      sort: 'last_login:-1',
	      q: 'app_metadata.invite.status:' + req.query.filter,
	      per_page: req.query.per_page || 100,
	      page: req.query.page || 0,
	      include_totals: true,
	      fields: 'user_id,name,email,app_metadata',
	      search_engine: 'v2'
	    };
	
	    return req.auth0.users.getAll(options).then(function (result) {
	      return res.json({
	        result: result,
	        filter: req.query.filter
	      });
	    }).catch(next);
	  };
	};
	
	/*
	 * Add a new user.
	 */
	var createUser = function createUser() {
	  return function (req, res) {
	    var token = uuid.v4();
	    var options = {
	      "connection": req.body.user.connection,
	      "email": req.body.user.email,
	      "password": uuid.v4(), // required field
	      "app_metadata": {
	        "invite": {
	          "status": "pending", // default status
	          "token": token
	        }
	      }
	    };
	    var transportOptions = {
	      to: options.email
	    };
	    var templateData = {
	      name: 'Auth0 Customer',
	      token: token
	    };
	
	    var result = null;
	    return req.auth0.users.create(options, function onCreateUser(err, user) {
	      result = user;
	      if (err) {
	        return res.status(500).send({ error: err ? err : 'There was an error when creating the user.' });
	      }
	      email.sendEmail(transportOptions, templateData, function (err, emailResult) {
	        if (err) {
	          return res.status(500).send({ error: err ? err : 'There was an error when sending the email.' });
	        }
	        return res.json(result);
	      });
	    });
	  };
	};
	
	/*
	 * Updates user "email_verified" field.
	 */
	var updateEmailVerified = function updateEmailVerified(auth0, user, callback) {
	
	  return auth0.users.update({ id: user.user_id }, {
	    "email_verified": true
	  }).then(function (user) {
	    if (!user) {
	      return callback({ error: 'There was a problem when updating the user email_verified field.' });
	    }
	    return callback(null, user);
	  }).catch(callback);
	};
	
	var validateToken = function validateToken(auth0, token, callback) {
	
	  var options = {
	    sort: 'last_login:-1',
	    q: 'app_metadata.invite.token:' + token,
	    include_totals: false,
	    fields: 'user_id,email,email_verified,app_metadata',
	    search_engine: 'v2'
	  };
	
	  return auth0.users.get(options).then(function (users) {
	    if (!users || !users.length || users.length !== 1) {
	      return callback({ error: 'Token is invalid or user was not found.' });
	    }
	    return callback(null, users[0]);
	  }).catch(callback);
	};
	
	/*
	 * Validates user token.
	 */
	var validateUserToken = function validateUserToken() {
	  return function (req, res, next) {
	
	    var token = req.query.token;
	
	    validateToken(req.auth0, token, function (err, user) {
	
	      if (err || !user) {
	        return res.status(500).send({ error: err.error ? err.error : 'There was an error when validating the token.' });
	      }
	
	      if (user.email_verified) {
	        return res.json(user);
	      }
	
	      updateEmailVerified(req.auth0, user, function (err, result) {
	        if (err) {
	          return res.status(500).send({ error: err.error ? err.error : 'There was an error when updating field.' });
	        }
	        return res.json(result);
	      });
	    });
	  };
	};
	
	/*
	 * Updates user with a new password. This also removes token and updates status.
	 */
	var savePassword = function savePassword() {
	  return function (req, res, next) {
	    var _req$body = req.body;
	    var id = _req$body.id;
	    var password = _req$body.password;
	    var token = _req$body.token;
	
	
	    validateToken(req.auth0, token, function (err, user) {
	
	      if (err || !user || user.user_id !== id) {
	        return res.status(500).send({ error: err.error ? err.error : 'There was an error when saving the user.' });
	      }
	
	      return req.auth0.users.update({ id: id }, {
	        "password": password,
	        "app_metadata": {
	          "invite": {
	            "status": "accepted"
	          }
	        }
	      }).then(function (user) {
	        if (!user) {
	          return res.status(500).send({ error: 'There was a problem when saving the user.' });
	        }
	        return res.sendStatus(200);
	      }).catch(next);
	    });
	  };
	};
	
	var configureEmail = function configureEmail(emailTransport, templates) {
	  email = new Email(emailTransport, templates);
	};
	
	module.exports = {
	  getUsers: getUsers,
	  createUser: createUser,
	  validateUserToken: validateUserToken,
	  savePassword: savePassword,
	  configureEmail: configureEmail
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(105);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(104);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(113);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18)
	  , document = __webpack_require__(4).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(6) && !__webpack_require__(17)(function(){
	  return Object.defineProperty(__webpack_require__(54)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(34)
	  , $export        = __webpack_require__(13)
	  , redefine       = __webpack_require__(63)
	  , hide           = __webpack_require__(14)
	  , has            = __webpack_require__(7)
	  , Iterators      = __webpack_require__(33)
	  , $iterCreate    = __webpack_require__(120)
	  , setToStringTag = __webpack_require__(37)
	  , getPrototypeOf = __webpack_require__(60)
	  , ITERATOR       = __webpack_require__(15)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(36)
	  , createDesc     = __webpack_require__(29)
	  , toIObject      = __webpack_require__(9)
	  , toPrimitive    = __webpack_require__(42)
	  , has            = __webpack_require__(7)
	  , IE8_DOM_DEFINE = __webpack_require__(55)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(6) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(61)
	  , hiddenKeys = __webpack_require__(32).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(7)
	  , toObject    = __webpack_require__(41)
	  , IE_PROTO    = __webpack_require__(38)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(7)
	  , toIObject    = __webpack_require__(9)
	  , arrayIndexOf = __webpack_require__(115)(false)
	  , IE_PROTO     = __webpack_require__(38)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(13)
	  , core    = __webpack_require__(3)
	  , fails   = __webpack_require__(17);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(14);

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Any = __webpack_require__(2);
	const Hoek = __webpack_require__(1);
	
	
	// Declare internals
	
	const internals = {};
	
	
	internals.Boolean = function () {
	
	    Any.call(this);
	    this._type = 'boolean';
	};
	
	Hoek.inherits(internals.Boolean, Any);
	
	
	internals.Boolean.prototype._base = function (value, state, options) {
	
	    const result = {
	        value
	    };
	
	    if (typeof value === 'string' &&
	        options.convert) {
	
	        const lower = value.toLowerCase();
	        result.value = (lower === 'true' || lower === 'yes' || lower === 'on' ? true
	                                                                              : (lower === 'false' || lower === 'no' || lower === 'off' ? false : value));
	    }
	
	    result.errors = (typeof result.value === 'boolean') ? null : this.createError('boolean.base', null, state, options);
	    return result;
	};
	
	
	module.exports = new internals.Boolean();


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Hoek = __webpack_require__(1);
	const Any = __webpack_require__(2);
	const Cast = __webpack_require__(20);
	const Lazy = __webpack_require__(148);
	const Ref = __webpack_require__(10);
	
	
	// Declare internals
	
	const internals = {
	    alternatives: __webpack_require__(45),
	    array: __webpack_require__(144),
	    boolean: __webpack_require__(64),
	    binary: __webpack_require__(145),
	    date: __webpack_require__(46),
	    number: __webpack_require__(66),
	    object: __webpack_require__(67),
	    string: __webpack_require__(68)
	};
	
	
	internals.root = function () {
	
	    const any = new Any();
	
	    const root = any.clone();
	    root.any = function () {
	
	        return any;
	    };
	
	    root.alternatives = root.alt = function () {
	
	        return arguments.length ? internals.alternatives.try.apply(internals.alternatives, arguments) : internals.alternatives;
	    };
	
	    root.array = function () {
	
	        return internals.array;
	    };
	
	    root.boolean = root.bool = function () {
	
	        return internals.boolean;
	    };
	
	    root.binary = function () {
	
	        return internals.binary;
	    };
	
	    root.date = function () {
	
	        return internals.date;
	    };
	
	    root.func = function () {
	
	        return internals.object._func();
	    };
	
	    root.number = function () {
	
	        return internals.number;
	    };
	
	    root.object = function () {
	
	        return arguments.length ? internals.object.keys.apply(internals.object, arguments) : internals.object;
	    };
	
	    root.string = function () {
	
	        return internals.string;
	    };
	
	    root.ref = function () {
	
	        return Ref.create.apply(null, arguments);
	    };
	
	    root.isRef = function (ref) {
	
	        return Ref.isRef(ref);
	    };
	
	    root.validate = function (value /*, [schema], [options], callback */) {
	
	        const last = arguments[arguments.length - 1];
	        const callback = typeof last === 'function' ? last : null;
	
	        const count = arguments.length - (callback ? 1 : 0);
	        if (count === 1) {
	            return any.validate(value, callback);
	        }
	
	        const options = count === 3 ? arguments[2] : {};
	        const schema = root.compile(arguments[1]);
	
	        return schema._validateWithOptions(value, options, callback);
	    };
	
	    root.describe = function () {
	
	        const schema = arguments.length ? root.compile(arguments[0]) : any;
	        return schema.describe();
	    };
	
	    root.compile = function (schema) {
	
	        try {
	            return Cast.schema(schema);
	        }
	        catch (err) {
	            if (err.hasOwnProperty('path')) {
	                err.message = err.message + '(' + err.path + ')';
	            }
	            throw err;
	        }
	    };
	
	    root.assert = function (value, schema, message) {
	
	        root.attempt(value, schema, message);
	    };
	
	    root.attempt = function (value, schema, message) {
	
	        const result = root.validate(value, schema);
	        const error = result.error;
	        if (error) {
	            if (!message) {
	                error.message = error.annotate();
	                throw error;
	            }
	
	            if (!(message instanceof Error)) {
	                error.message = message + ' ' + error.annotate();
	                throw error;
	            }
	
	            throw message;
	        }
	
	        return result.value;
	    };
	
	    root.reach = function (schema, path) {
	
	        Hoek.assert(schema && schema.isJoi, 'you must provide a joi schema');
	        Hoek.assert(typeof path === 'string', 'path must be a string');
	
	        if (path === '') {
	            return schema;
	        }
	
	        const parts = path.split('.');
	        const children = schema._inner.children;
	        if (!children) {
	            return;
	        }
	
	        const key = parts[0];
	        for (let i = 0; i < children.length; ++i) {
	            const child = children[i];
	            if (child.key === key) {
	                return this.reach(child.schema, path.substr(key.length + 1));
	            }
	        }
	    };
	
	    root.lazy = function (fn) {
	
	        return Lazy.set(fn);
	    };
	
	    return root;
	};
	
	
	module.exports = internals.root();


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Any = __webpack_require__(2);
	const Ref = __webpack_require__(10);
	const Hoek = __webpack_require__(1);
	
	
	// Declare internals
	
	const internals = {};
	
	
	internals.Number = function () {
	
	    Any.call(this);
	    this._type = 'number';
	    this._invalids.add(Infinity);
	    this._invalids.add(-Infinity);
	};
	
	Hoek.inherits(internals.Number, Any);
	
	internals.compare = function (type, compare) {
	
	    return function (limit) {
	
	        const isRef = Ref.isRef(limit);
	        const isNumber = typeof limit === 'number' && !isNaN(limit);
	
	        Hoek.assert(isNumber || isRef, 'limit must be a number or reference');
	
	        return this._test(type, limit, (value, state, options) => {
	
	            let compareTo;
	            if (isRef) {
	                compareTo = limit(state.parent, options);
	
	                if (!(typeof compareTo === 'number' && !isNaN(compareTo))) {
	                    return this.createError('number.ref', { ref: limit.key }, state, options);
	                }
	            }
	            else {
	                compareTo = limit;
	            }
	
	            if (compare(value, compareTo)) {
	                return null;
	            }
	
	            return this.createError('number.' + type, { limit: compareTo, value }, state, options);
	        });
	    };
	};
	
	
	internals.Number.prototype._base = function (value, state, options) {
	
	    const result = {
	        errors: null,
	        value
	    };
	
	    if (typeof value === 'string' &&
	        options.convert) {
	
	        const number = parseFloat(value);
	        result.value = (isNaN(number) || !isFinite(value)) ? NaN : number;
	    }
	
	    const isNumber = typeof result.value === 'number' && !isNaN(result.value);
	
	    if (options.convert && 'precision' in this._flags && isNumber) {
	
	        // This is conceptually equivalent to using toFixed but it should be much faster
	        const precision = Math.pow(10, this._flags.precision);
	        result.value = Math.round(result.value * precision) / precision;
	    }
	
	    result.errors = isNumber ? null : this.createError('number.base', null, state, options);
	    return result;
	};
	
	
	internals.Number.prototype.min = internals.compare('min', (value, limit) => value >= limit);
	internals.Number.prototype.max = internals.compare('max', (value, limit) => value <= limit);
	internals.Number.prototype.greater = internals.compare('greater', (value, limit) => value > limit);
	internals.Number.prototype.less = internals.compare('less', (value, limit) => value < limit);
	
	
	internals.Number.prototype.multiple = function (base) {
	
	    Hoek.assert(Hoek.isInteger(base), 'multiple must be an integer');
	    Hoek.assert(base > 0, 'multiple must be greater than 0');
	
	    return this._test('multiple', base, (value, state, options) => {
	
	        if (value % base === 0) {
	            return null;
	        }
	
	        return this.createError('number.multiple', { multiple: base, value }, state, options);
	    });
	};
	
	
	internals.Number.prototype.integer = function () {
	
	    return this._test('integer', undefined, (value, state, options) => {
	
	        return Hoek.isInteger(value) ? null : this.createError('number.integer', { value }, state, options);
	    });
	};
	
	
	internals.Number.prototype.negative = function () {
	
	    return this._test('negative', undefined, (value, state, options) => {
	
	        if (value < 0) {
	            return null;
	        }
	
	        return this.createError('number.negative', { value }, state, options);
	    });
	};
	
	
	internals.Number.prototype.positive = function () {
	
	    return this._test('positive', undefined, (value, state, options) => {
	
	        if (value > 0) {
	            return null;
	        }
	
	        return this.createError('number.positive', { value }, state, options);
	    });
	};
	
	
	internals.precisionRx = /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/;
	
	
	internals.Number.prototype.precision = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit), 'limit must be an integer');
	    Hoek.assert(!('precision' in this._flags), 'precision already set');
	
	    const obj = this._test('precision', limit, (value, state, options) => {
	
	        const places = value.toString().match(internals.precisionRx);
	        const decimals = Math.max((places[1] ? places[1].length : 0) - (places[2] ? parseInt(places[2], 10) : 0), 0);
	        if (decimals <= limit) {
	            return null;
	        }
	
	        return this.createError('number.precision', { limit, value }, state, options);
	    });
	
	    obj._flags.precision = limit;
	    return obj;
	};
	
	
	module.exports = new internals.Number();


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Hoek = __webpack_require__(1);
	const Topo = __webpack_require__(156);
	const Any = __webpack_require__(2);
	const Cast = __webpack_require__(20);
	
	
	// Declare internals
	
	const internals = {};
	
	
	internals.Object = function () {
	
	    Any.call(this);
	    this._type = 'object';
	    this._inner.children = null;
	    this._inner.renames = [];
	    this._inner.dependencies = [];
	    this._inner.patterns = [];
	};
	
	Hoek.inherits(internals.Object, Any);
	
	internals.safeParse = function (value) {
	
	    try {
	        return JSON.parse(value);
	    }
	    catch (parseErr) {}
	
	    return value;
	};
	
	internals.Object.prototype._base = function (value, state, options) {
	
	    let target = value;
	    const errors = [];
	    const finish = () => {
	
	        return {
	            value: target,
	            errors: errors.length ? errors : null
	        };
	    };
	
	    if (typeof value === 'string' &&
	        options.convert) {
	
	        value = internals.safeParse(value);
	    }
	
	    const type = this._flags.func ? 'function' : 'object';
	    if (!value ||
	        typeof value !== type ||
	        Array.isArray(value)) {
	
	        errors.push(this.createError(type + '.base', null, state, options));
	        return finish();
	    }
	
	    // Skip if there are no other rules to test
	
	    if (!this._inner.renames.length &&
	        !this._inner.dependencies.length &&
	        !this._inner.children &&                    // null allows any keys
	        !this._inner.patterns.length) {
	
	        target = value;
	        return finish();
	    }
	
	    // Ensure target is a local copy (parsed) or shallow copy
	
	    if (target === value) {
	        if (type === 'object') {
	            target = Object.create(Object.getPrototypeOf(value));
	        }
	        else {
	            target = function () {
	
	                return value.apply(this, arguments);
	            };
	
	            target.prototype = Hoek.clone(value.prototype);
	        }
	
	        const valueKeys = Object.keys(value);
	        for (let i = 0; i < valueKeys.length; ++i) {
	            target[valueKeys[i]] = value[valueKeys[i]];
	        }
	    }
	    else {
	        target = value;
	    }
	
	    // Rename keys
	
	    const renamed = {};
	    for (let i = 0; i < this._inner.renames.length; ++i) {
	        const rename = this._inner.renames[i];
	
	        if (rename.options.ignoreUndefined && target[rename.from] === undefined) {
	            continue;
	        }
	
	        if (!rename.options.multiple &&
	            renamed[rename.to]) {
	
	            errors.push(this.createError('object.rename.multiple', { from: rename.from, to: rename.to }, state, options));
	            if (options.abortEarly) {
	                return finish();
	            }
	        }
	
	        if (Object.prototype.hasOwnProperty.call(target, rename.to) &&
	            !rename.options.override &&
	            !renamed[rename.to]) {
	
	            errors.push(this.createError('object.rename.override', { from: rename.from, to: rename.to }, state, options));
	            if (options.abortEarly) {
	                return finish();
	            }
	        }
	
	        if (target[rename.from] === undefined) {
	            delete target[rename.to];
	        }
	        else {
	            target[rename.to] = target[rename.from];
	        }
	
	        renamed[rename.to] = true;
	
	        if (!rename.options.alias) {
	            delete target[rename.from];
	        }
	    }
	
	    // Validate schema
	
	    if (!this._inner.children &&            // null allows any keys
	        !this._inner.patterns.length &&
	        !this._inner.dependencies.length) {
	
	        return finish();
	    }
	
	    const unprocessed = Hoek.mapToObject(Object.keys(target));
	
	    // Children mustn't inherit the current label if it exists
	    const childOptions = options.language && options.language.label ?
	        Hoek.applyToDefaults(options, { language: { label: null } }, true) :
	        options;
	
	    if (this._inner.children) {
	        for (let i = 0; i < this._inner.children.length; ++i) {
	            const child = this._inner.children[i];
	            const key = child.key;
	            const item = target[key];
	
	            delete unprocessed[key];
	
	            const localState = { key, path: (state.path || '') + (state.path && key ? '.' : '') + key, parent: target, reference: state.reference };
	            const result = child.schema._validate(item, localState, childOptions);
	            if (result.errors) {
	                errors.push(this.createError('object.child', { key, reason: result.errors }, localState, childOptions));
	
	                if (options.abortEarly) {
	                    return finish();
	                }
	            }
	
	            if (child.schema._flags.strip || (result.value === undefined && result.value !== item)) {
	                delete target[key];
	            }
	            else if (result.value !== undefined) {
	                target[key] = result.value;
	            }
	        }
	    }
	
	    // Unknown keys
	
	    let unprocessedKeys = Object.keys(unprocessed);
	    if (unprocessedKeys.length &&
	        this._inner.patterns.length) {
	
	        for (let i = 0; i < unprocessedKeys.length; ++i) {
	            const key = unprocessedKeys[i];
	            const localState = { key, path: (state.path ? state.path + '.' : '') + key, parent: target, reference: state.reference };
	            const item = target[key];
	
	            for (let j = 0; j < this._inner.patterns.length; ++j) {
	                const pattern = this._inner.patterns[j];
	
	                if (pattern.regex.test(key)) {
	                    delete unprocessed[key];
	
	                    const result = pattern.rule._validate(item, localState, options);
	                    if (result.errors) {
	                        errors.push(this.createError('object.child', { key, reason: result.errors }, localState, options));
	
	                        if (options.abortEarly) {
	                            return finish();
	                        }
	                    }
	
	                    if (result.value !== undefined) {
	                        target[key] = result.value;
	                    }
	                }
	            }
	        }
	
	        unprocessedKeys = Object.keys(unprocessed);
	    }
	
	    if ((this._inner.children || this._inner.patterns.length) && unprocessedKeys.length) {
	        if (options.stripUnknown ||
	            options.skipFunctions) {
	
	            const stripUnknown = options.stripUnknown
	                ? (options.stripUnknown === true ? true : !!options.stripUnknown.objects)
	                : false;
	
	
	            for (let i = 0; i < unprocessedKeys.length; ++i) {
	                const key = unprocessedKeys[i];
	
	                if (stripUnknown) {
	                    delete target[key];
	                    delete unprocessed[key];
	                }
	                else if (typeof target[key] === 'function') {
	                    delete unprocessed[key];
	                }
	            }
	
	            unprocessedKeys = Object.keys(unprocessed);
	        }
	
	        if (unprocessedKeys.length &&
	            (this._flags.allowUnknown !== undefined ? !this._flags.allowUnknown : !options.allowUnknown)) {
	
	            for (let i = 0; i < unprocessedKeys.length; ++i) {
	                errors.push(this.createError('object.allowUnknown', null, { key: unprocessedKeys[i], path: state.path + (state.path ? '.' : '') + unprocessedKeys[i] }, childOptions));
	            }
	        }
	    }
	
	    // Validate dependencies
	
	    for (let i = 0; i < this._inner.dependencies.length; ++i) {
	        const dep = this._inner.dependencies[i];
	        const err = internals[dep.type].call(this, dep.key !== null && value[dep.key], dep.peers, target, { key: dep.key, path: (state.path || '') + (dep.key ? '.' + dep.key : '') }, options);
	        if (err) {
	            errors.push(err);
	            if (options.abortEarly) {
	                return finish();
	            }
	        }
	    }
	
	    return finish();
	};
	
	
	internals.Object.prototype._func = function () {
	
	    const obj = this.clone();
	    obj._flags.func = true;
	    return obj;
	};
	
	
	internals.Object.prototype.keys = function (schema) {
	
	    Hoek.assert(schema === null || schema === undefined || typeof schema === 'object', 'Object schema must be a valid object');
	    Hoek.assert(!schema || !schema.isJoi, 'Object schema cannot be a joi schema');
	
	    const obj = this.clone();
	
	    if (!schema) {
	        obj._inner.children = null;
	        return obj;
	    }
	
	    const children = Object.keys(schema);
	
	    if (!children.length) {
	        obj._inner.children = [];
	        return obj;
	    }
	
	    const topo = new Topo();
	    if (obj._inner.children) {
	        for (let i = 0; i < obj._inner.children.length; ++i) {
	            const child = obj._inner.children[i];
	
	            // Only add the key if we are not going to replace it later
	            if (children.indexOf(child.key) === -1) {
	                topo.add(child, { after: child._refs, group: child.key });
	            }
	        }
	    }
	
	    for (let i = 0; i < children.length; ++i) {
	        const key = children[i];
	        const child = schema[key];
	        try {
	            const cast = Cast.schema(child);
	            topo.add({ key, schema: cast }, { after: cast._refs, group: key });
	        }
	        catch (castErr) {
	            if (castErr.hasOwnProperty('path')) {
	                castErr.path = key + '.' + castErr.path;
	            }
	            else {
	                castErr.path = key;
	            }
	            throw castErr;
	        }
	    }
	
	    obj._inner.children = topo.nodes;
	
	    return obj;
	};
	
	
	internals.Object.prototype.unknown = function (allow) {
	
	    const obj = this.clone();
	    obj._flags.allowUnknown = (allow !== false);
	    return obj;
	};
	
	
	internals.Object.prototype.length = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('length', limit, (value, state, options) => {
	
	        if (Object.keys(value).length === limit) {
	            return null;
	        }
	
	        return this.createError('object.length', { limit }, state, options);
	    });
	};
	
	internals.Object.prototype.arity = function (n) {
	
	    Hoek.assert(Hoek.isInteger(n) && n >= 0, 'n must be a positive integer');
	
	    return this._test('arity', n, (value, state, options) => {
	
	        if (value.length === n) {
	            return null;
	        }
	
	        return this.createError('function.arity', { n }, state, options);
	    });
	};
	
	internals.Object.prototype.minArity = function (n) {
	
	    Hoek.assert(Hoek.isInteger(n) && n > 0, 'n must be a strict positive integer');
	
	    return this._test('minArity', n, (value, state, options) => {
	
	        if (value.length >= n) {
	            return null;
	        }
	
	        return this.createError('function.minArity', { n }, state, options);
	    });
	};
	
	internals.Object.prototype.maxArity = function (n) {
	
	    Hoek.assert(Hoek.isInteger(n) && n >= 0, 'n must be a positive integer');
	
	    return this._test('maxArity', n, (value, state, options) => {
	
	        if (value.length <= n) {
	            return null;
	        }
	
	        return this.createError('function.maxArity', { n }, state, options);
	    });
	};
	
	
	internals.Object.prototype.min = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('min', limit, (value, state, options) => {
	
	        if (Object.keys(value).length >= limit) {
	            return null;
	        }
	
	        return this.createError('object.min', { limit }, state, options);
	    });
	};
	
	
	internals.Object.prototype.max = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('max', limit, (value, state, options) => {
	
	        if (Object.keys(value).length <= limit) {
	            return null;
	        }
	
	        return this.createError('object.max', { limit }, state, options);
	    });
	};
	
	
	internals.Object.prototype.pattern = function (pattern, schema) {
	
	    Hoek.assert(pattern instanceof RegExp, 'Invalid regular expression');
	    Hoek.assert(schema !== undefined, 'Invalid rule');
	
	    pattern = new RegExp(pattern.source, pattern.ignoreCase ? 'i' : undefined);         // Future version should break this and forbid unsupported regex flags
	
	    try {
	        schema = Cast.schema(schema);
	    }
	    catch (castErr) {
	        if (castErr.hasOwnProperty('path')) {
	            castErr.message = castErr.message + '(' + castErr.path + ')';
	        }
	
	        throw castErr;
	    }
	
	
	    const obj = this.clone();
	    obj._inner.patterns.push({ regex: pattern, rule: schema });
	    return obj;
	};
	
	
	internals.Object.prototype.with = function (key, peers) {
	
	    return this._dependency('with', key, peers);
	};
	
	
	internals.Object.prototype.without = function (key, peers) {
	
	    return this._dependency('without', key, peers);
	};
	
	
	internals.Object.prototype.xor = function () {
	
	    const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this._dependency('xor', null, peers);
	};
	
	
	internals.Object.prototype.or = function () {
	
	    const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this._dependency('or', null, peers);
	};
	
	
	internals.Object.prototype.and = function () {
	
	    const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this._dependency('and', null, peers);
	};
	
	
	internals.Object.prototype.nand = function () {
	
	    const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this._dependency('nand', null, peers);
	};
	
	
	internals.Object.prototype.requiredKeys = function (children) {
	
	    children = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this.applyFunctionToChildren(children, 'required');
	};
	
	
	internals.Object.prototype.optionalKeys = function (children) {
	
	    children = Hoek.flatten(Array.prototype.slice.call(arguments));
	    return this.applyFunctionToChildren(children, 'optional');
	};
	
	
	internals.renameDefaults = {
	    alias: false,                   // Keep old value in place
	    multiple: false,                // Allow renaming multiple keys into the same target
	    override: false                 // Overrides an existing key
	};
	
	
	internals.Object.prototype.rename = function (from, to, options) {
	
	    Hoek.assert(typeof from === 'string', 'Rename missing the from argument');
	    Hoek.assert(typeof to === 'string', 'Rename missing the to argument');
	    Hoek.assert(to !== from, 'Cannot rename key to same name:', from);
	
	    for (let i = 0; i < this._inner.renames.length; ++i) {
	        Hoek.assert(this._inner.renames[i].from !== from, 'Cannot rename the same key multiple times');
	    }
	
	    const obj = this.clone();
	
	    obj._inner.renames.push({
	        from,
	        to,
	        options: Hoek.applyToDefaults(internals.renameDefaults, options || {})
	    });
	
	    return obj;
	};
	
	
	internals.groupChildren = function (children) {
	
	    children.sort();
	
	    const grouped = {};
	
	    for (let i = 0; i < children.length; ++i) {
	        const child = children[i];
	        Hoek.assert(typeof child === 'string', 'children must be strings');
	        const group = child.split('.')[0];
	        const childGroup = grouped[group] = (grouped[group] || []);
	        childGroup.push(child.substring(group.length + 1));
	    }
	
	    return grouped;
	};
	
	
	internals.Object.prototype.applyFunctionToChildren = function (children, fn, args, root) {
	
	    children = [].concat(children);
	    Hoek.assert(children.length > 0, 'expected at least one children');
	
	    const groupedChildren = internals.groupChildren(children);
	    let obj;
	
	    if ('' in groupedChildren) {
	        obj = this[fn].apply(this, args);
	        delete groupedChildren[''];
	    }
	    else {
	        obj = this.clone();
	    }
	
	    if (obj._inner.children) {
	        root = root ? (root + '.') : '';
	
	        for (let i = 0; i < obj._inner.children.length; ++i) {
	            const child = obj._inner.children[i];
	            const group = groupedChildren[child.key];
	
	            if (group) {
	                obj._inner.children[i] = {
	                    key: child.key,
	                    _refs: child._refs,
	                    schema: child.schema.applyFunctionToChildren(group, fn, args, root + child.key)
	                };
	
	                delete groupedChildren[child.key];
	            }
	        }
	    }
	
	    const remaining = Object.keys(groupedChildren);
	    Hoek.assert(remaining.length === 0, 'unknown key(s)', remaining.join(', '));
	
	    return obj;
	};
	
	
	internals.Object.prototype._dependency = function (type, key, peers) {
	
	    peers = [].concat(peers);
	    for (let i = 0; i < peers.length; ++i) {
	        Hoek.assert(typeof peers[i] === 'string', type, 'peers must be a string or array of strings');
	    }
	
	    const obj = this.clone();
	    obj._inner.dependencies.push({ type, key, peers });
	    return obj;
	};
	
	
	internals.with = function (value, peers, parent, state, options) {
	
	    if (value === undefined) {
	        return null;
	    }
	
	    for (let i = 0; i < peers.length; ++i) {
	        const peer = peers[i];
	        if (!Object.prototype.hasOwnProperty.call(parent, peer) ||
	            parent[peer] === undefined) {
	
	            return this.createError('object.with', { peer }, state, options);
	        }
	    }
	
	    return null;
	};
	
	
	internals.without = function (value, peers, parent, state, options) {
	
	    if (value === undefined) {
	        return null;
	    }
	
	    for (let i = 0; i < peers.length; ++i) {
	        const peer = peers[i];
	        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
	            parent[peer] !== undefined) {
	
	            return this.createError('object.without', { peer }, state, options);
	        }
	    }
	
	    return null;
	};
	
	
	internals.xor = function (value, peers, parent, state, options) {
	
	    const present = [];
	    for (let i = 0; i < peers.length; ++i) {
	        const peer = peers[i];
	        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
	            parent[peer] !== undefined) {
	
	            present.push(peer);
	        }
	    }
	
	    if (present.length === 1) {
	        return null;
	    }
	
	    if (present.length === 0) {
	        return this.createError('object.missing', { peers }, state, options);
	    }
	
	    return this.createError('object.xor', { peers }, state, options);
	};
	
	
	internals.or = function (value, peers, parent, state, options) {
	
	    for (let i = 0; i < peers.length; ++i) {
	        const peer = peers[i];
	        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
	            parent[peer] !== undefined) {
	            return null;
	        }
	    }
	
	    return this.createError('object.missing', { peers }, state, options);
	};
	
	
	internals.and = function (value, peers, parent, state, options) {
	
	    const missing = [];
	    const present = [];
	    const count = peers.length;
	    for (let i = 0; i < count; ++i) {
	        const peer = peers[i];
	        if (!Object.prototype.hasOwnProperty.call(parent, peer) ||
	            parent[peer] === undefined) {
	
	            missing.push(peer);
	        }
	        else {
	            present.push(peer);
	        }
	    }
	
	    const aon = (missing.length === count || present.length === count);
	    return !aon ? this.createError('object.and', { present, missing }, state, options) : null;
	};
	
	
	internals.nand = function (value, peers, parent, state, options) {
	
	    const present = [];
	    for (let i = 0; i < peers.length; ++i) {
	        const peer = peers[i];
	        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
	            parent[peer] !== undefined) {
	
	            present.push(peer);
	        }
	    }
	
	    const values = Hoek.clone(peers);
	    const main = values.splice(0, 1)[0];
	    const allPresent = (present.length === peers.length);
	    return allPresent ? this.createError('object.nand', { main, peers: values }, state, options) : null;
	};
	
	
	internals.Object.prototype.describe = function (shallow) {
	
	    const description = Any.prototype.describe.call(this);
	
	    if (description.rules) {
	        for (let i = 0; i < description.rules.length; ++i) {
	            const rule = description.rules[i];
	            // Coverage off for future-proof descriptions, only object().assert() is use right now
	            if (/* $lab:coverage:off$ */rule.arg &&
	                typeof rule.arg === 'object' &&
	                rule.arg.schema &&
	                rule.arg.ref /* $lab:coverage:on$ */) {
	                rule.arg = {
	                    schema: rule.arg.schema.describe(),
	                    ref: rule.arg.ref.toString()
	                };
	            }
	        }
	    }
	
	    if (this._inner.children &&
	        !shallow) {
	
	        description.children = {};
	        for (let i = 0; i < this._inner.children.length; ++i) {
	            const child = this._inner.children[i];
	            description.children[child.key] = child.schema.describe();
	        }
	    }
	
	    if (this._inner.dependencies.length) {
	        description.dependencies = Hoek.clone(this._inner.dependencies);
	    }
	
	    if (this._inner.patterns.length) {
	        description.patterns = [];
	
	        for (let i = 0; i < this._inner.patterns.length; ++i) {
	            const pattern = this._inner.patterns[i];
	            description.patterns.push({ regex: pattern.regex.toString(), rule: pattern.rule.describe() });
	        }
	    }
	
	    return description;
	};
	
	
	internals.Object.prototype.assert = function (ref, schema, message) {
	
	    ref = Cast.ref(ref);
	    Hoek.assert(ref.isContext || ref.depth > 1, 'Cannot use assertions for root level references - use direct key rules instead');
	    message = message || 'pass the assertion test';
	
	    try {
	        schema = Cast.schema(schema);
	    }
	    catch (castErr) {
	        if (castErr.hasOwnProperty('path')) {
	            castErr.message = castErr.message + '(' + castErr.path + ')';
	        }
	
	        throw castErr;
	    }
	
	    const key = ref.path[ref.path.length - 1];
	    const path = ref.path.join('.');
	
	    return this._test('assert', { schema, ref }, (value, state, options) => {
	
	        const result = schema._validate(ref(value), null, options, value);
	        if (!result.errors) {
	            return null;
	        }
	
	        const localState = Hoek.merge({}, state);
	        localState.key = key;
	        localState.path = path;
	        return this.createError('object.assert', { ref: localState.path, message }, localState, options);
	    });
	};
	
	
	internals.Object.prototype.type = function (constructor, name) {
	
	    Hoek.assert(typeof constructor === 'function', 'type must be a constructor function');
	    name = name || constructor.name;
	
	    return this._test('type', name, (value, state, options) => {
	
	        if (value instanceof constructor) {
	            return null;
	        }
	
	        return this.createError('object.type', { type: name }, state, options);
	    });
	};
	
	
	module.exports = new internals.Object();


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Net = __webpack_require__(170);
	const Hoek = __webpack_require__(1);
	const Isemail = __webpack_require__(143);
	const Any = __webpack_require__(2);
	const Ref = __webpack_require__(10);
	const JoiDate = __webpack_require__(46);
	const Uri = __webpack_require__(151);
	const Ip = __webpack_require__(150);
	
	// Declare internals
	
	const internals = {
	    uriRegex: Uri.createUriRegex(),
	    ipRegex: Ip.createIpRegex(['ipv4', 'ipv6', 'ipvfuture'], 'optional')
	};
	
	internals.String = function () {
	
	    Any.call(this);
	    this._type = 'string';
	    this._invalids.add('');
	};
	
	Hoek.inherits(internals.String, Any);
	
	internals.compare = function (type, compare) {
	
	    return function (limit, encoding) {
	
	        const isRef = Ref.isRef(limit);
	
	        Hoek.assert((Hoek.isInteger(limit) && limit >= 0) || isRef, 'limit must be a positive integer or reference');
	        Hoek.assert(!encoding || Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);
	
	        return this._test(type, limit, (value, state, options) => {
	
	            let compareTo;
	            if (isRef) {
	                compareTo = limit(state.parent, options);
	
	                if (!Hoek.isInteger(compareTo)) {
	                    return this.createError('string.ref', { ref: limit.key }, state, options);
	                }
	            }
	            else {
	                compareTo = limit;
	            }
	
	            if (compare(value, compareTo, encoding)) {
	                return null;
	            }
	
	            return this.createError('string.' + type, { limit: compareTo, value, encoding }, state, options);
	        });
	    };
	};
	
	internals.String.prototype._base = function (value, state, options) {
	
	    if (typeof value === 'string' &&
	        options.convert) {
	
	        if (this._flags.case) {
	            value = (this._flags.case === 'upper' ? value.toLocaleUpperCase() : value.toLocaleLowerCase());
	        }
	
	        if (this._flags.trim) {
	            value = value.trim();
	        }
	
	        if (this._inner.replacements) {
	
	            for (let i = 0; i < this._inner.replacements.length; ++i) {
	                const replacement = this._inner.replacements[i];
	                value = value.replace(replacement.pattern, replacement.replacement);
	            }
	        }
	
	        if (this._flags.truncate) {
	            for (let i = 0; i < this._tests.length; ++i) {
	                const test = this._tests[i];
	                if (test.name === 'max') {
	                    value = value.slice(0, test.arg);
	                    break;
	                }
	            }
	        }
	    }
	
	    return {
	        value,
	        errors: (typeof value === 'string') ? null : this.createError('string.base', { value }, state, options)
	    };
	};
	
	
	internals.String.prototype.insensitive = function () {
	
	    const obj = this.clone();
	    obj._flags.insensitive = true;
	    return obj;
	};
	
	
	internals.String.prototype.min = internals.compare('min', (value, limit, encoding) => {
	
	    const length = encoding ? Buffer.byteLength(value, encoding) : value.length;
	    return length >= limit;
	});
	
	
	internals.String.prototype.max = internals.compare('max', (value, limit, encoding) => {
	
	    const length = encoding ? Buffer.byteLength(value, encoding) : value.length;
	    return length <= limit;
	});
	
	
	internals.String.prototype.creditCard = function () {
	
	    return this._test('creditCard', undefined, (value, state, options) => {
	
	        let i = value.length;
	        let sum = 0;
	        let mul = 1;
	
	        while (i--) {
	            const char = value.charAt(i) * mul;
	            sum = sum + (char - (char > 9) * 9);
	            mul = mul ^ 3;
	        }
	
	        const check = (sum % 10 === 0) && (sum > 0);
	        return check ? null : this.createError('string.creditCard', { value }, state, options);
	    });
	};
	
	internals.String.prototype.length = internals.compare('length', (value, limit, encoding) => {
	
	    const length = encoding ? Buffer.byteLength(value, encoding) : value.length;
	    return length === limit;
	});
	
	
	internals.String.prototype.regex = function (pattern, name) {
	
	    Hoek.assert(pattern instanceof RegExp, 'pattern must be a RegExp');
	
	    pattern = new RegExp(pattern.source, pattern.ignoreCase ? 'i' : undefined);         // Future version should break this and forbid unsupported regex flags
	
	    return this._test('regex', pattern, (value, state, options) => {
	
	        if (pattern.test(value)) {
	            return null;
	        }
	
	        return this.createError((name ? 'string.regex.name' : 'string.regex.base'), { name, pattern, value }, state, options);
	    });
	};
	
	
	internals.String.prototype.alphanum = function () {
	
	    return this._test('alphanum', undefined, (value, state, options) => {
	
	        if (/^[a-zA-Z0-9]+$/.test(value)) {
	            return null;
	        }
	
	        return this.createError('string.alphanum', { value }, state, options);
	    });
	};
	
	
	internals.String.prototype.token = function () {
	
	    return this._test('token', undefined, (value, state, options) => {
	
	        if (/^\w+$/.test(value)) {
	            return null;
	        }
	
	        return this.createError('string.token', { value }, state, options);
	    });
	};
	
	
	internals.String.prototype.email = function (isEmailOptions) {
	
	    if (isEmailOptions) {
	        Hoek.assert(typeof isEmailOptions === 'object', 'email options must be an object');
	        Hoek.assert(typeof isEmailOptions.checkDNS === 'undefined', 'checkDNS option is not supported');
	        Hoek.assert(typeof isEmailOptions.tldWhitelist === 'undefined' ||
	            typeof isEmailOptions.tldWhitelist === 'object', 'tldWhitelist must be an array or object');
	        Hoek.assert(typeof isEmailOptions.minDomainAtoms === 'undefined' ||
	            Hoek.isInteger(isEmailOptions.minDomainAtoms) && isEmailOptions.minDomainAtoms > 0,
	            'minDomainAtoms must be a positive integer');
	        Hoek.assert(typeof isEmailOptions.errorLevel === 'undefined' || typeof isEmailOptions.errorLevel === 'boolean' ||
	            (Hoek.isInteger(isEmailOptions.errorLevel) && isEmailOptions.errorLevel >= 0),
	            'errorLevel must be a non-negative integer or boolean');
	    }
	
	    return this._test('email', isEmailOptions, (value, state, options) => {
	
	        try {
	            const result = Isemail.validate(value, isEmailOptions);
	            if (result === true || result === 0) {
	                return null;
	            }
	        }
	        catch (e) { }
	
	        return this.createError('string.email', { value }, state, options);
	    });
	};
	
	
	internals.String.prototype.ip = function (ipOptions) {
	
	    let regex = internals.ipRegex;
	    ipOptions = ipOptions || {};
	    Hoek.assert(typeof ipOptions === 'object', 'options must be an object');
	
	    if (ipOptions.cidr) {
	        Hoek.assert(typeof ipOptions.cidr === 'string', 'cidr must be a string');
	        ipOptions.cidr = ipOptions.cidr.toLowerCase();
	
	        Hoek.assert(ipOptions.cidr in Ip.cidrs, 'cidr must be one of ' + Object.keys(Ip.cidrs).join(', '));
	
	        // If we only received a `cidr` setting, create a regex for it. But we don't need to create one if `cidr` is "optional" since that is the default
	        if (!ipOptions.version && ipOptions.cidr !== 'optional') {
	            regex = Ip.createIpRegex(['ipv4', 'ipv6', 'ipvfuture'], ipOptions.cidr);
	        }
	    }
	    else {
	
	        // Set our default cidr strategy
	        ipOptions.cidr = 'optional';
	    }
	
	    let versions;
	    if (ipOptions.version) {
	        if (!Array.isArray(ipOptions.version)) {
	            ipOptions.version = [ipOptions.version];
	        }
	
	        Hoek.assert(ipOptions.version.length >= 1, 'version must have at least 1 version specified');
	
	        versions = [];
	        for (let i = 0; i < ipOptions.version.length; ++i) {
	            let version = ipOptions.version[i];
	            Hoek.assert(typeof version === 'string', 'version at position ' + i + ' must be a string');
	            version = version.toLowerCase();
	            Hoek.assert(Ip.versions[version], 'version at position ' + i + ' must be one of ' + Object.keys(Ip.versions).join(', '));
	            versions.push(version);
	        }
	
	        // Make sure we have a set of versions
	        versions = Hoek.unique(versions);
	
	        regex = Ip.createIpRegex(versions, ipOptions.cidr);
	    }
	
	    return this._test('ip', ipOptions, (value, state, options) => {
	
	        if (regex.test(value)) {
	            return null;
	        }
	
	        if (versions) {
	            return this.createError('string.ipVersion', { value, cidr: ipOptions.cidr, version: versions }, state, options);
	        }
	
	        return this.createError('string.ip', { value, cidr: ipOptions.cidr }, state, options);
	    });
	};
	
	
	internals.String.prototype.uri = function (uriOptions) {
	
	    let customScheme = '';
	    let allowRelative = false;
	    let regex = internals.uriRegex;
	
	    if (uriOptions) {
	        Hoek.assert(typeof uriOptions === 'object', 'options must be an object');
	
	        if (uriOptions.scheme) {
	            Hoek.assert(uriOptions.scheme instanceof RegExp || typeof uriOptions.scheme === 'string' || Array.isArray(uriOptions.scheme), 'scheme must be a RegExp, String, or Array');
	
	            if (!Array.isArray(uriOptions.scheme)) {
	                uriOptions.scheme = [uriOptions.scheme];
	            }
	
	            Hoek.assert(uriOptions.scheme.length >= 1, 'scheme must have at least 1 scheme specified');
	
	            // Flatten the array into a string to be used to match the schemes.
	            for (let i = 0; i < uriOptions.scheme.length; ++i) {
	                const scheme = uriOptions.scheme[i];
	                Hoek.assert(scheme instanceof RegExp || typeof scheme === 'string', 'scheme at position ' + i + ' must be a RegExp or String');
	
	                // Add OR separators if a value already exists
	                customScheme = customScheme + (customScheme ? '|' : '');
	
	                // If someone wants to match HTTP or HTTPS for example then we need to support both RegExp and String so we don't escape their pattern unknowingly.
	                if (scheme instanceof RegExp) {
	                    customScheme = customScheme + scheme.source;
	                }
	                else {
	                    Hoek.assert(/[a-zA-Z][a-zA-Z0-9+-\.]*/.test(scheme), 'scheme at position ' + i + ' must be a valid scheme');
	                    customScheme = customScheme + Hoek.escapeRegex(scheme);
	                }
	            }
	        }
	
	        if (uriOptions.allowRelative) {
	            allowRelative = true;
	        }
	    }
	
	    if (customScheme || allowRelative) {
	        regex = Uri.createUriRegex(customScheme, allowRelative);
	    }
	
	    return this._test('uri', uriOptions, (value, state, options) => {
	
	        if (regex.test(value)) {
	            return null;
	        }
	
	        if (customScheme) {
	            return this.createError('string.uriCustomScheme', { scheme: customScheme, value }, state, options);
	        }
	
	        return this.createError('string.uri', { value }, state, options);
	    });
	};
	
	
	internals.String.prototype.isoDate = function () {
	
	    return this._test('isoDate', undefined, (value, state, options) => {
	
	        if (JoiDate._isIsoDate(value)) {
	            return null;
	        }
	
	        return this.createError('string.isoDate', { value }, state, options);
	    });
	};
	
	
	internals.String.prototype.guid = function () {
	
	    const regex = /^[A-F0-9]{8}(?:-?[A-F0-9]{4}){3}-?[A-F0-9]{12}$/i;
	    const regex2 = /^\{[A-F0-9]{8}(?:-?[A-F0-9]{4}){3}-?[A-F0-9]{12}\}$/i;
	
	    return this._test('guid', undefined, (value, state, options) => {
	
	        if (regex.test(value) || regex2.test(value)) {
	            return null;
	        }
	
	        return this.createError('string.guid', { value }, state, options);
	    });
	};
	
	
	internals.String.prototype.hex = function () {
	
	    const regex = /^[a-f0-9]+$/i;
	
	    return this._test('hex', regex, (value, state, options) => {
	
	        if (regex.test(value)) {
	            return null;
	        }
	
	        return this.createError('string.hex', { value }, state, options);
	    });
	};
	
	
	internals.String.prototype.hostname = function () {
	
	    const regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
	
	    return this._test('hostname', undefined, (value, state, options) => {
	
	        if ((value.length <= 255 && regex.test(value)) ||
	            Net.isIPv6(value)) {
	
	            return null;
	        }
	
	        return this.createError('string.hostname', { value }, state, options);
	    });
	};
	
	
	internals.String.prototype.lowercase = function () {
	
	    const obj = this._test('lowercase', undefined, (value, state, options) => {
	
	        if (options.convert ||
	            value === value.toLocaleLowerCase()) {
	
	            return null;
	        }
	
	        return this.createError('string.lowercase', { value }, state, options);
	    });
	
	    obj._flags.case = 'lower';
	    return obj;
	};
	
	
	internals.String.prototype.uppercase = function () {
	
	    const obj = this._test('uppercase', undefined, (value, state, options) => {
	
	        if (options.convert ||
	            value === value.toLocaleUpperCase()) {
	
	            return null;
	        }
	
	        return this.createError('string.uppercase', { value }, state, options);
	    });
	
	    obj._flags.case = 'upper';
	    return obj;
	};
	
	
	internals.String.prototype.trim = function () {
	
	    const obj = this._test('trim', undefined, (value, state, options) => {
	
	        if (options.convert ||
	            value === value.trim()) {
	
	            return null;
	        }
	
	        return this.createError('string.trim', { value }, state, options);
	    });
	
	    obj._flags.trim = true;
	    return obj;
	};
	
	
	internals.String.prototype.replace = function (pattern, replacement) {
	
	    if (typeof pattern === 'string') {
	        pattern = new RegExp(Hoek.escapeRegex(pattern), 'g');
	    }
	
	    Hoek.assert(pattern instanceof RegExp, 'pattern must be a RegExp');
	    Hoek.assert(typeof replacement === 'string', 'replacement must be a String');
	
	    // This can not be considere a test like trim, we can't "reject"
	    // anything from this rule, so just clone the current object
	    const obj = this.clone();
	
	    if (!obj._inner.replacements) {
	        obj._inner.replacements = [];
	    }
	
	    obj._inner.replacements.push({
	        pattern,
	        replacement
	    });
	
	    return obj;
	};
	
	internals.String.prototype.truncate = function (enabled) {
	
	    const obj = this.clone();
	    obj._flags.truncate = enabled === undefined ? true : !!enabled;
	    return obj;
	};
	
	module.exports = new internals.String();


/***/ },
/* 69 */
/***/ function(module, exports) {

	'use strict';
	
	// Load modules
	
	
	// Delcare internals
	
	const internals = {
	    rfc3986: {}
	};
	
	
	internals.generate = function () {
	
	    /**
	     * elements separated by forward slash ("/") are alternatives.
	     */
	    const or = '|';
	
	    /**
	     * DIGIT = %x30-39 ; 0-9
	     */
	    const digit = '0-9';
	    const digitOnly = '[' + digit + ']';
	
	    /**
	     * ALPHA = %x41-5A / %x61-7A   ; A-Z / a-z
	     */
	    const alpha = 'a-zA-Z';
	    const alphaOnly = '[' + alpha + ']';
	
	    /**
	     * cidr       = DIGIT                ; 0-9
	     *            / %x31-32 DIGIT         ; 10-29
	     *            / "3" %x30-32           ; 30-32
	     */
	    internals.rfc3986.cidr = digitOnly + or + '[1-2]' + digitOnly + or + '3' + '[0-2]';
	
	    /**
	     * HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
	     */
	    const hexDigit = digit + 'A-Fa-f';
	    const hexDigitOnly = '[' + hexDigit + ']';
	
	    /**
	     * unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
	     */
	    const unreserved = alpha + digit + '-\\._~';
	
	    /**
	     * sub-delims = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
	     */
	    const subDelims = '!\\$&\'\\(\\)\\*\\+,;=';
	
	    /**
	     * pct-encoded = "%" HEXDIG HEXDIG
	     */
	    const pctEncoded = '%' + hexDigit;
	
	    /**
	     * pchar = unreserved / pct-encoded / sub-delims / ":" / "@"
	     */
	    const pchar = unreserved + pctEncoded + subDelims + ':@';
	    const pcharOnly = '[' + pchar + ']';
	
	    /**
	     * Rule to support zero-padded addresses.
	     */
	    const zeroPad = '0?';
	
	    /**
	     * dec-octet   = DIGIT                 ; 0-9
	     *            / %x31-39 DIGIT         ; 10-99
	     *            / "1" 2DIGIT            ; 100-199
	     *            / "2" %x30-34 DIGIT     ; 200-249
	     *            / "25" %x30-35          ; 250-255
	     */
	    const decOctect = '(?:' + zeroPad + zeroPad + digitOnly + or + zeroPad + '[1-9]' + digitOnly + or + '1' + digitOnly + digitOnly + or + '2' + '[0-4]' + digitOnly + or + '25' + '[0-5])';
	
	    /**
	     * IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet
	     */
	    internals.rfc3986.IPv4address = '(?:' + decOctect + '\\.){3}' + decOctect;
	
	    /**
	     * h16 = 1*4HEXDIG ; 16 bits of address represented in hexadecimal
	     * ls32 = ( h16 ":" h16 ) / IPv4address ; least-significant 32 bits of address
	     * IPv6address =                            6( h16 ":" ) ls32
	     *             /                       "::" 5( h16 ":" ) ls32
	     *             / [               h16 ] "::" 4( h16 ":" ) ls32
	     *             / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
	     *             / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
	     *             / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
	     *             / [ *4( h16 ":" ) h16 ] "::"              ls32
	     *             / [ *5( h16 ":" ) h16 ] "::"              h16
	     *             / [ *6( h16 ":" ) h16 ] "::"
	     */
	    const h16 = hexDigitOnly + '{1,4}';
	    const ls32 = '(?:' + h16 + ':' + h16 + '|' + internals.rfc3986.IPv4address + ')';
	    const IPv6SixHex = '(?:' + h16 + ':){6}' + ls32;
	    const IPv6FiveHex = '::(?:' + h16 + ':){5}' + ls32;
	    const IPv6FourHex = '(?:' + h16 + ')?::(?:' + h16 + ':){4}' + ls32;
	    const IPv6ThreeHex = '(?:(?:' + h16 + ':){0,1}' + h16 + ')?::(?:' + h16 + ':){3}' + ls32;
	    const IPv6TwoHex = '(?:(?:' + h16 + ':){0,2}' + h16 + ')?::(?:' + h16 + ':){2}' + ls32;
	    const IPv6OneHex = '(?:(?:' + h16 + ':){0,3}' + h16 + ')?::' + h16 + ':' + ls32;
	    const IPv6NoneHex = '(?:(?:' + h16 + ':){0,4}' + h16 + ')?::' + ls32;
	    const IPv6NoneHex2 = '(?:(?:' + h16 + ':){0,5}' + h16 + ')?::' + h16;
	    const IPv6NoneHex3 = '(?:(?:' + h16 + ':){0,6}' + h16 + ')?::';
	    internals.rfc3986.IPv6address = '(?:' + IPv6SixHex + or + IPv6FiveHex + or + IPv6FourHex + or + IPv6ThreeHex + or + IPv6TwoHex + or + IPv6OneHex + or + IPv6NoneHex + or + IPv6NoneHex2 + or + IPv6NoneHex3 + ')';
	
	    /**
	     * IPvFuture = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
	     */
	    internals.rfc3986.IPvFuture = 'v' + hexDigitOnly + '+\\.[' + unreserved + subDelims + ':]+';
	
	    /**
	     * scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
	     */
	    internals.rfc3986.scheme = alphaOnly + '[' + alpha + digit + '+-\\.]*';
	
	    /**
	     * userinfo = *( unreserved / pct-encoded / sub-delims / ":" )
	     */
	    const userinfo = '[' + unreserved + pctEncoded + subDelims + ':]*';
	
	    /**
	     * IP-literal = "[" ( IPv6address / IPvFuture  ) "]"
	     */
	    const IPLiteral = '\\[(?:' + internals.rfc3986.IPv6address + or + internals.rfc3986.IPvFuture + ')\\]';
	
	    /**
	     * reg-name = *( unreserved / pct-encoded / sub-delims )
	     */
	    const regName = '[' + unreserved + pctEncoded + subDelims + ']{0,255}';
	
	    /**
	     * host = IP-literal / IPv4address / reg-name
	     */
	    const host = '(?:' + IPLiteral + or + internals.rfc3986.IPv4address + or + regName + ')';
	
	    /**
	     * port = *DIGIT
	     */
	    const port = digitOnly + '*';
	
	    /**
	     * authority   = [ userinfo "@" ] host [ ":" port ]
	     */
	    const authority = '(?:' + userinfo + '@)?' + host + '(?::' + port + ')?';
	
	    /**
	     * segment       = *pchar
	     * segment-nz    = 1*pchar
	     * path          = path-abempty    ; begins with "/" or is empty
	     *               / path-absolute   ; begins with "/" but not "//"
	     *               / path-noscheme   ; begins with a non-colon segment
	     *               / path-rootless   ; begins with a segment
	     *               / path-empty      ; zero characters
	     * path-abempty  = *( "/" segment )
	     * path-absolute = "/" [ segment-nz *( "/" segment ) ]
	     * path-rootless = segment-nz *( "/" segment )
	     */
	    const segment = pcharOnly + '*';
	    const segmentNz = pcharOnly + '+';
	    const segmentNzNc = '[' + unreserved + pctEncoded + subDelims + '@' + ']+';
	    const pathEmpty = '';
	    const pathAbEmpty = '(?:\\/' + segment + ')*';
	    const pathAbsolute = '\\/(?:' + segmentNz + pathAbEmpty + ')?';
	    const pathRootless = segmentNz + pathAbEmpty;
	    const pathNoScheme = segmentNzNc + pathAbEmpty;
	
	    /**
	     * hier-part = "//" authority path
	     */
	    internals.rfc3986.hierPart = '(?:' + '(?:\\/\\/' + authority + pathAbEmpty + ')' + or + pathAbsolute + or + pathRootless + ')';
	
	    /**
	     * relative-part = "//" authority path-abempty
	     *                 / path-absolute
	     *                 / path-noscheme
	     *                 / path-empty
	     */
	    internals.rfc3986.relativeRef = '(?:' + '(?:\\/\\/' + authority + pathAbEmpty  + ')' + or + pathAbsolute + or + pathNoScheme + or + pathEmpty + ')';
	
	    /**
	     * query = *( pchar / "/" / "?" )
	     */
	    internals.rfc3986.query = '[' + pchar + '\\/\\?]*(?=#|$)'; //Finish matching either at the fragment part or end of the line.
	
	    /**
	     * fragment = *( pchar / "/" / "?" )
	     */
	    internals.rfc3986.fragment = '[' + pchar + '\\/\\?]*';
	};
	
	
	internals.generate();
	
	module.exports = internals.rfc3986;


/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = require("bluebird");

/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = require("ejs");

/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = require("jsonwebtoken");

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = require("lru-cache");

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = require("nconf");

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var LRU     = __webpack_require__(75);
	var request = __webpack_require__(172);
	var _       = __webpack_require__(21);
	
	var secretsCacheOptions = {
	  // 5 M unicode points => ~10 MB
	  max: 1024 * 1024 * 5,
	  length: function (s) { return s.length; },
	  maxAge: 1000 * 60 * 5
	};
	
	var secretsCache = LRU(secretsCacheOptions);
	
	function certToPEM (cert) {
	  cert = cert.match(/.{1,64}/g).join('\n');
	  cert = "-----BEGIN CERTIFICATE-----\n" + cert;
	  cert = cert + "\n-----END CERTIFICATE-----\n";
	  return cert;
	}
	
	module.exports = function (opt) {
	  opt           = opt || {};
	  opt.strictSSL = typeof opt.strictSSL === 'undefined' ? true : opt.strictSSL;
	
	  return function secretCallback (req, header, payload, cb){
	    var cacheKey = payload.iss + '|' + payload.aud ;
	    var cachedSecret = secretsCache.get(cacheKey);
	
	    if (cachedSecret) {
	      return cb(null, cachedSecret);
	    }
	
	    switch (header.alg) {
	      case 'RS256': // asymmetric keys
	        var url = payload.iss + '.well-known/jwks.json';
	
	        request.get(url, { json: true, strictSSL: opt.strictSSL }, function (err, resp, jwks) {
	          if (err) {
	            return cb(err);
	          }
	          if (resp.statusCode !== 200) {
	            return cb(new Error('Failed to obtain JWKS from ' + payload.iss));
	          }
	
	          // TODO: Make this more resilient to JWKS and tokens that don't indicate a kid.
	          var key = _.find(jwks.keys, function(key) {
	            return key.kid == header.kid;
	          });
	
	          if (!key) {
	            return cb(new Error('Failed to obtain signing key used by ' + payload.iss));
	          }
	          // TODO: Make this more resilient to keys that don't include x5c
	          var publicKey = certToPEM(key.x5c[0]);
	          secretsCache.set(cacheKey, publicKey);
	          return cb(null, publicKey);
	        });
	        break;
	      default:
	        return cb(new Error('Unsupported JWT algorithm: ' + header.alg));
	    }
	  };
	}


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var express       = __webpack_require__(11);
	var jade          = __webpack_require__(166);
	var expressJwt    = __webpack_require__(165);
	var url           = __webpack_require__(48);
	var rsaValidation = __webpack_require__(78);
	var bodyParser    = __webpack_require__(71);
	var jwt           = __webpack_require__(74);
	var request       = __webpack_require__(174);
	
	var getClass = {}.toString;
	function isFunction(object) {
	  return object && getClass.call(object) == '[object Function]';
	}
	
	function fetchUserInfo (rootTenantAuthority) {
	  return function (req, res, next) {
	    request
	      .get(rootTenantAuthority + '/userinfo')
	      .set('Authorization', 'Bearer ' + req.body.access_token)
	      .end(function(err, userInfo){
	        if (err) {
	          res.redirect(res.locals.baseUrl);
	          return;
	        }
	
	        req.userInfo = userInfo.body;
	
	        next();
	      });
	  };
	}
	
	function generateApiToken (secretParam, expiresIn) {
	  return function (req, res, next) {
	    var secret = secretParam;
	    if (isFunction(secretParam)) {
	      secret = secretParam(req);
	    }
	
	    req.apiToken = jwt.sign(req.userInfo, secret, {
	      algorithm: 'HS256',
	      issuer: res.locals.baseUrl,
	      expiresIn: expiresIn
	    });
	
	    delete req.userinfo;
	    next();
	  };
	}
	
	module.exports = function (opt) {
	  var ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
	  var router              = express.Router();
	  var noop                = function (req, res, next) { next(); };
	  var callbackMiddlewares = [noop];
	
	  opt                     = opt || {};
	  opt.clientName          = opt.clientName || 'Auth0 Extension';
	  opt.clientId            = opt.clientId;
	  opt.exp                 = opt.exp || ONE_DAY_IN_MILLISECONDS;
	  // If we defaults to true all the routes will require authentication
	  opt.credentialsRequired = typeof opt.credentialsRequired === 'undefined' ? false : opt.credentialsRequired;
	  opt.scopes              = opt.scopes + ' openid profile';
	  opt.responseType        = opt.responseType || 'token';
	  opt.tokenExpiresIn      = opt.tokenExpiresIn || '10h';
	  opt.rootTenantAuthority = opt.rootTenantAuthority || 'https://auth0.auth0.com';
	  opt.authenticatedCallback = opt.authenticatedCallback || function(req, res, accessToken, next) {
	    next();
	  };
	
	  if (opt.apiToken && !opt.apiToken.secret) {
	    console.log('You are using a "development secret" for API token generation. Please setup your secret on "apiToken.secret".');
	    opt.apiToken.secret = __webpack_require__(47).randomBytes(32).toString('hex');
	  }
	
	  if (opt.apiToken && opt.apiToken.secret) {
	    callbackMiddlewares = [fetchUserInfo(opt.rootTenantAuthority), opt.apiToken.payload || noop, generateApiToken(opt.apiToken.secret, opt.tokenExpiresIn)];
	  }
	
	  router.use(function (req, res, next) {
	    var protocol = 'https';
	    var pathname = url.parse(req.originalUrl).pathname
	                      .replace(req.path, '');
	
	    if (false) {
	      protocol = req.protocol;
	      opt.clientId = opt.clientId || 'N3PAwyqXomhNu6IWivtsa3drBfFjmWJL';
	    }
	
	    res.locals.baseUrl = url.format({
	      protocol: protocol,
	      host:     req.get('host'),
	      pathname: pathname
	    });
	
	    next();
	  });
	
	  router.use(bodyParser.urlencoded({ extended: false }));
	
	  router.use(expressJwt({
	    secret:     rsaValidation(),
	    algorithms: ['RS256'],
	    credentialsRequired: opt.credentialsRequired
	  }).unless({path: ['/login', '/callback']}));
	
	  router.get('/login', function (req, res) {
	    var redirectUri = res.locals.baseUrl + '/callback';
	    if (req.query.returnTo){
	      redirectUri += '?returnTo=' + encodeURIComponent(req.query.returnTo);
	    }
	    var audience;
	    if (typeof opt.audience === 'string') {
	      audience = '&audience=' + encodeURIComponent(opt.audience);
	    }
	    else if (typeof opt.audience === 'function') {
	      var a = opt.audience(req);
	      if (typeof a === 'string') {
	        audience = '&audience=' + encodeURIComponent(a);
	      }
	    }
	    var authorizationUrl = [
	      opt.rootTenantAuthority + '/i/oauth2/authorize',
	      '?client_id=' + (opt.clientId || res.locals.baseUrl),
	      '&response_type=' + opt.responseType,
	      '&response_mode=form_post',
	      '&scope=' + encodeURIComponent(opt.scopes),
	      '&expiration=' + opt.exp,
	      '&redirect_uri=' + redirectUri,
	      audience
	    ].join('');
	
	    res.redirect(authorizationUrl);
	  });
	
	  router.get('/logout', function (req, res) {
	    var template = [
	      'html',
	      '  head',
	      '    script.',
	      '      sessionStorage.removeItem(\'token\')',
	      '      sessionStorage.removeItem(\'apiToken\')',
	      '      window.location.href = \'' + opt.rootTenantAuthority + '/v2/logout?returnTo=#{baseUrl}\';',
	      '  body'
	    ].join('\n');
	    var content = jade.compile(template)({
	      baseUrl: res.locals.baseUrl
	    });
	
	    res.header("Content-Type", 'text/html');
	    res.status(200).send(content);
	  });
	
	  router.post('/callback', callbackMiddlewares, function (req, res) {
	    opt.authenticatedCallback(req, res, req.body.access_token, function(err) {
	      if (err) {
	        return res.sendStatus(500);
	      }
	
	      var template = [
	        'html',
	        '  head',
	        '    script.',
	        '      sessionStorage.setItem(\'token\', \'' + req.body.access_token + '\');',
	        callbackMiddlewares.length === 1 ? '' : '      sessionStorage.setItem(\'apiToken\', \'' + req.apiToken + '\');',
	        '      window.location.href = \'#{returnTo}\';',
	        '  body'
	      ].join('\n');
	      var content = jade.compile(template)({
	        returnTo: req.query.returnTo? req.query.returnTo : res.locals.baseUrl
	      });
	
	      res.header("Content-Type", 'text/html');
	      res.status(200).send(content);
	    });
	  });
	
	  router.get('/.well-known/oauth2-client-configuration', function (req, res) {
	    res.header("Content-Type", 'application/json');
	    res.status(200).send({
	      redirect_uris: [res.locals.baseUrl + '/callback'],
	      client_name:   opt.clientName,
	      post_logout_redirect_uris: [res.locals.baseUrl]
	    });
	  });
	
	  return router;
	};


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';
	
	var _path = __webpack_require__(22);
	
	var _path2 = _interopRequireDefault(_path);
	
	var _morgan = __webpack_require__(168);
	
	var _morgan2 = _interopRequireDefault(_morgan);
	
	var _express = __webpack_require__(11);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _bodyParser = __webpack_require__(71);
	
	var _bodyParser2 = _interopRequireDefault(_bodyParser);
	
	var _routes = __webpack_require__(97);
	
	var _routes2 = _interopRequireDefault(_routes);
	
	var _logger = __webpack_require__(12);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var _middlewares = __webpack_require__(23);
	
	var middlewares = _interopRequireWildcard(_middlewares);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = function (storageContext) {
	  var app = new _express2.default();
	  app.use((0, _morgan2.default)(':method :url :status :response-time ms - :res[content-length]', {
	    stream: _logger2.default.stream
	  }));
	  app.use(_bodyParser2.default.json({
	    verify: function verify(req, res, buf, encoding) {
	      if (buf && buf.length) {
	        req.rawBody = buf.toString(encoding || 'utf8');
	      }
	    }
	  }));
	  app.use(_bodyParser2.default.urlencoded({ extended: false }));
	
	  // Configure routes.
	  app.use('/app', _express2.default.static(_path2.default.join(__dirname, '../dist')));
	  app.use('/', (0, _routes2.default)(storageContext));
	
	  // Generic error handler.
	  app.use(middlewares.errorHandler);
	  return app;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var nodemailer = __webpack_require__(171);
	
	var transport;
	var sendFn;
	
	function sendEmail(emailOptions, templateData, callback) {
	  sendFn(emailOptions, templateData, callback);
	}
	
	module.exports = function configure(transportOptions, templates) {
	  transport = nodemailer.createTransport(transportOptions);
	  sendFn = transport.templateSender(templates);
	  return {
	    sendEmail: sendEmail
	  };
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(24);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(25);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(26);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(28);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(27);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ArgumentError = function (_Error) {
	  (0, _inherits3.default)(ArgumentError, _Error);
	
	  function ArgumentError(message) {
	    (0, _classCallCheck3.default)(this, ArgumentError);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ArgumentError).call(this, message));
	
	    Error.captureStackTrace(_this, _this.constructor);
	
	    _this.message = message;
	    _this.name = 'ArgumentError';
	    return _this;
	  }
	
	  (0, _createClass3.default)(ArgumentError, [{
	    key: 'toString',
	    value: function toString() {
	      return 'ArgumentError';
	    }
	  }]);
	  return ArgumentError;
	}(Error);
	
	exports.default = ArgumentError;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(24);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(25);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(26);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(28);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(27);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NotFoundError = function (_Error) {
	  (0, _inherits3.default)(NotFoundError, _Error);
	
	  function NotFoundError(message) {
	    (0, _classCallCheck3.default)(this, NotFoundError);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(NotFoundError).call(this, message));
	
	    Error.captureStackTrace(_this, _this.constructor);
	
	    _this.message = message;
	    _this.statusCode = 404;
	    _this.name = 'NotFoundError';
	    return _this;
	  }
	
	  (0, _createClass3.default)(NotFoundError, [{
	    key: 'toString',
	    value: function toString() {
	      return 'NotFoundError';
	    }
	  }]);
	  return NotFoundError;
	}(Error);
	
	exports.default = NotFoundError;

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(24);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(25);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(26);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(28);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(27);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var UnauthorizedError = function (_Error) {
	  (0, _inherits3.default)(UnauthorizedError, _Error);
	
	  function UnauthorizedError(message) {
	    (0, _classCallCheck3.default)(this, UnauthorizedError);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(UnauthorizedError).call(this, message));
	
	    Error.captureStackTrace(_this, _this.constructor);
	
	    _this.message = message;
	    _this.statusCode = 401;
	    _this.name = 'UnauthorizedError';
	    return _this;
	  }
	
	  (0, _createClass3.default)(UnauthorizedError, [{
	    key: 'toString',
	    value: function toString() {
	      return 'UnauthorizedError';
	    }
	  }]);
	  return UnauthorizedError;
	}(Error);
	
	exports.default = UnauthorizedError;

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(24);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(25);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(26);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(28);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(27);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ValidationError = function (_Error) {
	  (0, _inherits3.default)(ValidationError, _Error);
	
	  function ValidationError(message) {
	    (0, _classCallCheck3.default)(this, ValidationError);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ValidationError).call(this, message));
	
	    Error.captureStackTrace(_this, _this.constructor);
	
	    _this.message = message;
	    _this.name = 'ValidationError';
	    return _this;
	  }
	
	  (0, _createClass3.default)(ValidationError, [{
	    key: 'toString',
	    value: function toString() {
	      return 'ValidationError';
	    }
	  }]);
	  return ValidationError;
	}(Error);
	
	exports.default = ValidationError;

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ValidationError = exports.UnauthorizedError = exports.NotFoundError = exports.ArgumentError = undefined;
	
	var _ArgumentError2 = __webpack_require__(82);
	
	var _ArgumentError3 = _interopRequireDefault(_ArgumentError2);
	
	var _NotFoundError2 = __webpack_require__(83);
	
	var _NotFoundError3 = _interopRequireDefault(_NotFoundError2);
	
	var _UnauthorizedError2 = __webpack_require__(84);
	
	var _UnauthorizedError3 = _interopRequireDefault(_UnauthorizedError2);
	
	var _ValidationError2 = __webpack_require__(85);
	
	var _ValidationError3 = _interopRequireDefault(_ValidationError2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.ArgumentError = _ArgumentError3.default;
	exports.NotFoundError = _NotFoundError3.default;
	exports.UnauthorizedError = _UnauthorizedError3.default;
	exports.ValidationError = _ValidationError3.default;

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _url = __webpack_require__(48);
	
	var _url2 = _interopRequireDefault(_url);
	
	var _auth0Oauth2Express = __webpack_require__(79);
	
	var _auth0Oauth2Express2 = _interopRequireDefault(_auth0Oauth2Express);
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  var options = {
	    credentialsRequired: false,
	    clientName: 'Invite Only Extension',
	    audience: function audience() {
	      return 'https://' + (0, _config2.default)('AUTH0_DOMAIN') + '/api/v2/';
	    }
	  };
	
	  var middleware = (0, _auth0Oauth2Express2.default)(options);
	  return function (req, res, next) {
	    var protocol = 'https';
	    var pathname = _url2.default.parse(req.originalUrl).pathname.replace(req.path, '');
	    var baseUrl = _url2.default.format({
	      protocol: protocol,
	      host: req.get('host'),
	      pathname: pathname
	    });
	
	    options.clientId = baseUrl;
	    return middleware(req, res, next);
	  };
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _logger = __webpack_require__(12);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = function (err, req, res, next) {
	  _logger2.default.error(err);
	
	  if (err && err.name === 'NotFoundError') {
	    res.status(404);
	    return res.json({ error: err.message });
	  }
	
	  if (err && err.name === 'ValidationError') {
	    res.status(400);
	    return res.json({ error: err.message });
	  }
	
	  res.status(err.statusCode || 500);
	  if (true) {
	    res.json({
	      message: err.message
	    });
	  } else {
	    res.json({
	      message: err.message,
	      error: {
	        message: err.message,
	        statusCode: err.statusCode,
	        stack: err.stack
	      }
	    });
	  }
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _managementApiClient = __webpack_require__(49);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = function managementClientMiddleware(req, res, next) {
	  (0, _managementApiClient.getForClient)((0, _config2.default)('AUTH0_DOMAIN'), (0, _config2.default)('AUTH0_CLIENT_ID'), (0, _config2.default)('AUTH0_CLIENT_SECRET')).then(function (auth0) {
	    req.auth0 = auth0;
	    next();
	  }).catch(function (err) {
	    next(err);
	  });
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _errors = __webpack_require__(86);
	
	module.exports = function (req, res, next) {
	  if (!req.user) {
	    return next(new _errors.UnauthorizedError('Authentication required for this endpoint.'));
	  }
	
	  return next();
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _path = __webpack_require__(22);
	
	var _path2 = _interopRequireDefault(_path);
	
	var _jsonwebtoken = __webpack_require__(74);
	
	var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _logger = __webpack_require__(12);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = function (hookPath) {
	  return function (req, res, next) {
	    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
	      var token = req.headers.authorization.split(' ')[1];
	      _logger2.default.debug('Extension Hook validation token:', token);
	
	      var isValid = _jsonwebtoken2.default.verify(token, (0, _config2.default)('EXTENSION_SECRET'), {
	        audience: '' + (0, _config2.default)('WT_URL') + hookPath,
	        issuer: 'https://' + (0, _config2.default)('AUTH0_DOMAIN')
	      });
	
	      if (!isValid) {
	        _logger2.default.error('Invalid hook token:', token);
	        return res.sendStatus(401);
	      }
	
	      return next();
	    }
	
	    _logger2.default.error('Hook token is missing.');
	    return res.sendStatus(401);
	  };
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.writeSMTPConfig = exports.writeTemplateConfig = exports.writeStorage = exports.readStorage = undefined;
	
	var _lodash = __webpack_require__(21);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _bluebird = __webpack_require__(70);
	
	var _bluebird2 = _interopRequireDefault(_bluebird);
	
	var _logger = __webpack_require__(12);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var defaultStorage = {
	  templateConfig: {
	    subject: 'Welcome to Auth0',
	    message: '<h1>Welcome {{ email }}!\nClick <a href="{{ url }}">here</a> to set your password.'
	  },
	  smtpConfig: {}
	};
	
	/*
	 * Read from Webtask storage.
	 */
	var readStorage = exports.readStorage = function readStorage(storageContext) {
	  if (!storageContext) {
	    _logger2.default.debug('Unable to read storage. Context not available.');
	    return _bluebird2.default.resolve(defaultStorage);
	  }
	
	  return new _bluebird2.default(function (resolve, reject) {
	    storageContext.get(function (err, webtaskData) {
	      if (err) {
	        return reject(err);
	      }
	
	      var data = webtaskData || defaultStorage;
	      return resolve(data);
	    });
	  });
	};
	
	/*
	 * Write to Webtask storage.
	 */
	var writeStorage = exports.writeStorage = function writeStorage(storageContext, data) {
	  if (!storageContext) {
	    _logger2.default.debug('Unable to write storage. Context not available.');
	    return _bluebird2.default.resolve(data);
	  }
	
	  return new _bluebird2.default(function (resolve, reject) {
	    storageContext.set(data, { force: 1 }, function (err) {
	      if (err) {
	        return reject(err);
	      }
	
	      return resolve(data);
	    });
	  });
	};
	
	/*
	 * Write template config to Webtask storage.
	 */
	var writeTemplateConfig = exports.writeTemplateConfig = function writeTemplateConfig(storageContext, templateConfig) {
	  return readStorage(storageContext).then(function (data) {
	    data.smtpConfig = data.smtpConfig || {};
	    data.templateConfig = templateConfig || {};
	    return data;
	  }).then(function (data) {
	    return writeStorage(storageContext, data);
	  });
	};
	
	/*
	 * Write smtp config to Webtask storage.
	 */
	var writeSMTPConfig = exports.writeSMTPConfig = function writeSMTPConfig(storageContext, smtpConfig) {
	  return readStorage(storageContext).then(function (data) {
	    data.templateConfig = data.templateConfig || {};
	    data.smtpConfig = smtpConfig || {};
	    return data;
	  }).then(function (data) {
	    return writeStorage(storageContext, data);
	  });
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _users = __webpack_require__(50);
	
	var _users2 = _interopRequireDefault(_users);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Joi = __webpack_require__(65);
	
	var inviteUserSchema = Joi.object().keys({
	  email: Joi.string().email().required()
	});
	
	var inviteUsersSchema = Joi.object().keys({
	  csv: Joi.string().required()
	});
	
	var getInvitationsSchema = Joi.object().keys({
	  filter: Joi.string().valid('pending', 'accepted')
	});
	
	var getUserTokenSchema = Joi.object().keys({
	  token: Joi.string().required()
	});
	
	var getSavePasswordSchema = Joi.object().keys({
	  id: Joi.string().required(),
	  password: Joi.string().required(),
	  token: Joi.string().required()
	});
	
	var writeTemplateConfigSchema = Joi.object().keys({
	  from: Joi.string().email().required(),
	  subject: Joi.string().required(),
	  redirectTo: Joi.string().required(),
	  message: Joi.string().required()
	});
	
	var writeSMTPConfigSchema = Joi.object().keys({
	  host: Joi.string().required(),
	  port: Joi.number().required(),
	  secure: Joi.boolean().required(),
	  auth: Joi.object().keys({
	    user: Joi.string().required(),
	    pass: Joi.string().required()
	  })
	});
	
	function validateInviteUser(req, res, next) {
	
	  if (!req.is('application/json')) {
	    return res.status(500).send({ error: 'Missing JSON information about user.' });
	  }
	
	  var payload = {
	    email: req.body.user.email
	  };
	
	  Joi.validate(payload, inviteUserSchema, function (err, value) {
	    if (err) {
	      return res.status(500).send({ error: err });
	    }
	
	    next();
	  });
	}
	
	function validateInvitations(req, res, next) {
	
	  Joi.validate({ filter: req.query.filter }, getInvitationsSchema, function (err, value) {
	    if (err) {
	      return res.status(500).send({ error: err, filter: req.query.filter });
	    }
	
	    next();
	  });
	}
	
	function validateUserToken(req, res, next) {
	
	  Joi.validate(req.query, getUserTokenSchema, function (err, value) {
	    if (err) {
	      return res.status(500).send({ error: 'No token was provided.' });
	    }
	
	    next();
	  });
	}
	
	function validateSavePassword(req, res, next) {
	
	  console.log(req.body);
	  Joi.validate(req.body, getSavePasswordSchema, function (err, value) {
	    if (err) {
	      return res.status(500).send({ error: 'Missing information (user id, token or password).' });
	    }
	
	    next();
	  });
	}
	
	function validateWriteTemplateConfig(req, res, next) {
	
	  Joi.validate(req.body, writeTemplateConfigSchema, function (err, value) {
	    if (err) {
	      return res.status(500).send({ error: 'Missing information (from, subject, redirectTo or message).' });
	    }
	
	    next();
	  });
	}
	function validateWriteSMTPConfig(req, res, next) {
	
	  Joi.validate(req.body, writeSMTPConfigSchema, function (err, value) {
	    if (err) {
	      return res.status(500).send({ error: 'Missing information (host, port, user or password).' });
	    }
	
	    next();
	  });
	}
	
	module.exports = {
	  validateInviteUser: validateInviteUser,
	  validateInvitations: validateInvitations,
	  validateUserToken: validateUserToken,
	  validateSavePassword: validateSavePassword,
	  validateWriteTemplateConfig: validateWriteTemplateConfig,
	  validateWriteSMTPConfig: validateWriteSMTPConfig
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _lodash = __webpack_require__(21);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _express = __webpack_require__(11);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  var api = (0, _express.Router)();
	
	  /*
	   * List all connections.
	   */
	  api.get('/', function (req, res, next) {
	    req.auth0.connections.getAll({ fields: 'name', 'strategy': 'auth0' }).then(function (connections) {
	      return _lodash2.default.chain(connections).sortBy(function (conn) {
	        return conn.name.toLowerCase();
	      }).value();
	    }).then(function (connections) {
	      return _lodash2.default.map(connections, 'name');
	    }).then(function (connections) {
	      return res.json(connections);
	    }).catch(next);
	  });
	
	  return api;
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _express = __webpack_require__(11);
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _logger = __webpack_require__(12);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var _managementApiClient = __webpack_require__(49);
	
	var _middlewares = __webpack_require__(23);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  var hooks = (0, _express.Router)();
	  hooks.use('/on-uninstall', (0, _middlewares.validateHookToken)('/.extensions/on-uninstall'));
	  hooks.delete('/on-uninstall', function (req, res) {
	    _logger2.default.debug('Uninstall running...');
	
	    (0, _managementApiClient.getForClient)((0, _config2.default)('AUTH0_DOMAIN'), (0, _config2.default)('AUTH0_CLIENT_ID'), (0, _config2.default)('AUTH0_CLIENT_SECRET')).then(function (client) {
	      return client.clients.delete({ client_id: (0, _config2.default)('AUTH0_CLIENT_ID') });
	    }).then(function () {
	      _logger2.default.debug('Deleted client ' + (0, _config2.default)('AUTH0_CLIENT_ID'));
	      res.sendStatus(204);
	    }).catch(function (err) {
	      _logger2.default.debug('Error deleting client ' + (0, _config2.default)('AUTH0_CLIENT_ID'));
	      _logger2.default.error(err);
	      res.sendStatus(500);
	    });
	  });
	  return hooks;
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _fs = __webpack_require__(73);
	
	var _fs2 = _interopRequireDefault(_fs);
	
	var _url = __webpack_require__(48);
	
	var _url2 = _interopRequireDefault(_url);
	
	var _ejs = __webpack_require__(72);
	
	var _ejs2 = _interopRequireDefault(_ejs);
	
	var _path = __webpack_require__(22);
	
	var _path2 = _interopRequireDefault(_path);
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  var template = '\n  <!DOCTYPE html>\n  <html lang="en">\n  <head>\n    <title>Auth0 - User Invitations</title>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css">\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1715/css/index.min.css">\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.css">\n    <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>"><% } %>\n    <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="//cdn.auth0.com/extensions/auth0-user-invite-extension/assets/auth0-user-invite-extension.ui.<%= assets.version %>.css"><% } %>\n  </head>\n  <body class="a0-extension">\n    <div id="app"></div>\n    <script type="text/javascript" src="//cdn.auth0.com/js/lock-9.0.min.js"></script>\n    <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1715/js/bundle.js"></script>\n    <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>\n    <% if (assets.vendors) { %><script type="text/javascript" src="http://localhost:3000/app/<%= assets.vendors %>"></script><% } %>\n    <% if (assets.app) { %><script type="text/javascript" src="http://localhost:3000/app/<%= assets.app %>"></script><% } %>\n    <% if (assets.version) { %>\n    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-user-invite-extension/assets/auth0-user-invite-extension.ui.vendors.<%= assets.version %>.js"></script>\n    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-user-invite-extension/assets/auth0-user-invite-extension.ui.<%= assets.version %>.js"></script>\n    <% } %>\n  </body>\n  </html>\n  ';
	
	  return function (req, res) {
	    var settings = {
	      AUTH0_DOMAIN: (0, _config2.default)('AUTH0_DOMAIN'),
	      BASE_URL: _url2.default.format({
	        protocol: (0, _config2.default)('NODE_ENV') !== 'production' ? 'http' : 'https',
	        host: req.get('host'),
	        pathname: _url2.default.parse(req.originalUrl || '').pathname.replace(req.path, '')
	      }),
	      BASE_PATH: _url2.default.parse(req.originalUrl || '').pathname.replace(req.path, '') + (req.path === '/admins' ? '/admins' : '')
	    };
	
	    // Render from CDN.
	    var clientVersion = (0, _config2.default)('CLIENT_VERSION');
	    if (clientVersion) {
	      return res.send(_ejs2.default.render(template, {
	        config: settings,
	        assets: { version: clientVersion }
	      }));
	    }
	
	    // Render locally.
	    return _fs2.default.readFile(_path2.default.join(__dirname, '../../dist/manifest.json'), 'utf8', function (err, data) {
	      var locals = {
	        config: settings,
	        assets: {
	          app: 'bundle.js'
	        }
	      };
	
	      if (!err && data) {
	        locals.assets = JSON.parse(data);
	      }
	
	      // Render the HTML page.
	      res.send(_ejs2.default.render(template, locals));
	    });
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _keys = __webpack_require__(102);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _express = __webpack_require__(11);
	
	var _html = __webpack_require__(96);
	
	var _html2 = _interopRequireDefault(_html);
	
	var _changePassword = __webpack_require__(99);
	
	var _changePassword2 = _interopRequireDefault(_changePassword);
	
	var _meta = __webpack_require__(98);
	
	var _meta2 = _interopRequireDefault(_meta);
	
	var _hooks = __webpack_require__(95);
	
	var _hooks2 = _interopRequireDefault(_hooks);
	
	var _config = __webpack_require__(5);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _storage = __webpack_require__(92);
	
	var _middlewares = __webpack_require__(23);
	
	var _nodemailerStubTransport = __webpack_require__(155);
	
	var _nodemailerStubTransport2 = _interopRequireDefault(_nodemailerStubTransport);
	
	var _validations = __webpack_require__(93);
	
	var _validations2 = _interopRequireDefault(_validations);
	
	var _users = __webpack_require__(50);
	
	var _users2 = _interopRequireDefault(_users);
	
	var _connections = __webpack_require__(94);
	
	var _connections2 = _interopRequireDefault(_connections);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var configureEmail = function configureEmail(data) {
	  var smtpConfig = data.smtpConfig;
	  if (!smtpConfig || (0, _keys2.default)(smtpConfig) == 0) {
	    smtpConfig = (0, _nodemailerStubTransport2.default)();
	  }
	  _users2.default.configureEmail(smtpConfig, data.templateConfig);
	};
	
	exports.default = function (storageContext) {
	  (0, _storage.readStorage)(storageContext).then(function (data) {
	    configureEmail(data);
	  });
	
	  var routes = (0, _express.Router)();
	  routes.use('/.extensions', (0, _hooks2.default)());
	  routes.use('/', (0, _middlewares.dashboardAdmins)());
	
	  // specific client routes
	  routes.get('/', (0, _html2.default)());
	  routes.get('/configuration', (0, _html2.default)());
	  routes.get('/changepassword/*', (0, _changePassword2.default)());
	
	  routes.use('/meta', (0, _meta2.default)());
	
	  routes.use(_middlewares.managementClient);
	
	  routes.get('/api/config/template', _middlewares.requireUser, function (req, res) {
	    (0, _storage.readStorage)(storageContext).then(function (data) {
	      res.json(data.templateConfig || {});
	    });
	  });
	
	  routes.patch('/api/config/template', _middlewares.requireUser, _validations2.default.validateWriteTemplateConfig, function (req, res) {
	    (0, _storage.writeTemplateConfig)(storageContext, req.body).then(function (data) {
	      configureEmail(data);
	      res.sendStatus(200);
	    });
	  });
	
	  routes.get('/api/config/smtp', _middlewares.requireUser, function (req, res) {
	    (0, _storage.readStorage)(storageContext).then(function (data) {
	      res.json(data.smtpConfig || {});
	    });
	  });
	
	  routes.patch('/api/config/smtp', _middlewares.requireUser, _validations2.default.validateWriteSMTPConfig, function (req, res) {
	    (0, _storage.writeSMTPConfig)(storageContext, req.body).then(function (data) {
	      configureEmail(data);
	      res.sendStatus(200);
	    });
	  });
	
	  routes.use('/api/connections', _middlewares.requireUser, (0, _connections2.default)());
	
	  routes.post('/api/invitations/user', _middlewares.requireUser, _validations2.default.validateInviteUser, _users2.default.createUser());
	
	  routes.get('/api/invitations', _middlewares.requireUser, _validations2.default.validateInvitations, _users2.default.getUsers());
	
	  routes.put('/api/changepassword', _validations2.default.validateUserToken, _users2.default.validateUserToken());
	
	  routes.post('/api/changepassword', _validations2.default.validateSavePassword, _users2.default.savePassword());
	
	  return routes;
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _express = __webpack_require__(11);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _webtask = __webpack_require__(153);
	
	var _webtask2 = _interopRequireDefault(_webtask);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  var api = _express2.default.Router();
	  api.get('/', function (req, res) {
	    res.status(200).send(_webtask2.default);
	  });
	
	  return api;
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ejs = __webpack_require__(72);
	
	var _ejs2 = _interopRequireDefault(_ejs);
	
	var _fs = __webpack_require__(73);
	
	var _path = __webpack_require__(22);
	
	var _path2 = _interopRequireDefault(_path);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	
	  var formTemplate = (0, _fs.readFileSync)(_path2.default.join(__dirname, './formTemplate.html'), 'utf-8');
	  var changePassword = (0, _fs.readFileSync)(_path2.default.join(__dirname, './changePassword.html'), 'utf-8');
	
	  return function (req, res) {
	    res.send(_ejs2.default.render(changePassword, {
	      formTemplate: formTemplate.split(/\n/g).join('')
	    }, {
	      escape: false
	    }));
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(106), __esModule: true };

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(107), __esModule: true };

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(109), __esModule: true };

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(110), __esModule: true };

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(111), __esModule: true };

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(112), __esModule: true };

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(131);
	var $Object = __webpack_require__(3).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(132);
	var $Object = __webpack_require__(3).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(133);
	module.exports = __webpack_require__(3).Object.getPrototypeOf;

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(134);
	module.exports = __webpack_require__(3).Object.keys;

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(135);
	module.exports = __webpack_require__(3).Object.setPrototypeOf;

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(138);
	__webpack_require__(136);
	__webpack_require__(139);
	__webpack_require__(140);
	module.exports = __webpack_require__(3).Symbol;

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(137);
	__webpack_require__(141);
	module.exports = __webpack_require__(44).f('iterator');

/***/ },
/* 113 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 114 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(9)
	  , toLength  = __webpack_require__(129)
	  , toIndex   = __webpack_require__(128);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(19)
	  , gOPS    = __webpack_require__(59)
	  , pIE     = __webpack_require__(36);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4).document && document.documentElement;

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(52);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(52);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(35)
	  , descriptor     = __webpack_require__(29)
	  , setToStringTag = __webpack_require__(37)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(14)(IteratorPrototype, __webpack_require__(15)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 121 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(19)
	  , toIObject = __webpack_require__(9);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(30)('meta')
	  , isObject = __webpack_require__(18)
	  , has      = __webpack_require__(7)
	  , setDesc  = __webpack_require__(8).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(17)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(8)
	  , anObject = __webpack_require__(16)
	  , getKeys  = __webpack_require__(19);
	
	module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(9)
	  , gOPN      = __webpack_require__(58).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(18)
	  , anObject = __webpack_require__(16);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(53)(Function.call, __webpack_require__(57).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(40)
	  , defined   = __webpack_require__(31);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(40)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(40)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(114)
	  , step             = __webpack_require__(121)
	  , Iterators        = __webpack_require__(33)
	  , toIObject        = __webpack_require__(9);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(56)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(13)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(35)});

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(13);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(6), 'Object', {defineProperty: __webpack_require__(8).f});

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(41)
	  , $getPrototypeOf = __webpack_require__(60);
	
	__webpack_require__(62)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(41)
	  , $keys    = __webpack_require__(19);
	
	__webpack_require__(62)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(13);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(126).set});

/***/ },
/* 136 */
/***/ function(module, exports) {



/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(127)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(56)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(4)
	  , has            = __webpack_require__(7)
	  , DESCRIPTORS    = __webpack_require__(6)
	  , $export        = __webpack_require__(13)
	  , redefine       = __webpack_require__(63)
	  , META           = __webpack_require__(123).KEY
	  , $fails         = __webpack_require__(17)
	  , shared         = __webpack_require__(39)
	  , setToStringTag = __webpack_require__(37)
	  , uid            = __webpack_require__(30)
	  , wks            = __webpack_require__(15)
	  , wksExt         = __webpack_require__(44)
	  , wksDefine      = __webpack_require__(43)
	  , keyOf          = __webpack_require__(122)
	  , enumKeys       = __webpack_require__(116)
	  , isArray        = __webpack_require__(119)
	  , anObject       = __webpack_require__(16)
	  , toIObject      = __webpack_require__(9)
	  , toPrimitive    = __webpack_require__(42)
	  , createDesc     = __webpack_require__(29)
	  , _create        = __webpack_require__(35)
	  , gOPNExt        = __webpack_require__(125)
	  , $GOPD          = __webpack_require__(57)
	  , $DP            = __webpack_require__(8)
	  , $keys          = __webpack_require__(19)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(58).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(36).f  = $propertyIsEnumerable;
	  __webpack_require__(59).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(34)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(14)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(43)('asyncIterator');

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(43)('observable');

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(130);
	var global        = __webpack_require__(4)
	  , hide          = __webpack_require__(14)
	  , Iterators     = __webpack_require__(33)
	  , TO_STRING_TAG = __webpack_require__(15)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 142 */
/***/ function(module, exports) {

	// Declare internals
	
	var internals = {};
	
	
	exports.escapeJavaScript = function (input) {
	
	    if (!input) {
	        return '';
	    }
	
	    var escaped = '';
	
	    for (var i = 0, il = input.length; i < il; ++i) {
	
	        var charCode = input.charCodeAt(i);
	
	        if (internals.isSafe(charCode)) {
	            escaped += input[i];
	        }
	        else {
	            escaped += internals.escapeJavaScriptChar(charCode);
	        }
	    }
	
	    return escaped;
	};
	
	
	exports.escapeHtml = function (input) {
	
	    if (!input) {
	        return '';
	    }
	
	    var escaped = '';
	
	    for (var i = 0, il = input.length; i < il; ++i) {
	
	        var charCode = input.charCodeAt(i);
	
	        if (internals.isSafe(charCode)) {
	            escaped += input[i];
	        }
	        else {
	            escaped += internals.escapeHtmlChar(charCode);
	        }
	    }
	
	    return escaped;
	};
	
	
	internals.escapeJavaScriptChar = function (charCode) {
	
	    if (charCode >= 256) {
	        return '\\u' + internals.padLeft('' + charCode, 4);
	    }
	
	    var hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
	    return '\\x' + internals.padLeft(hexValue, 2);
	};
	
	
	internals.escapeHtmlChar = function (charCode) {
	
	    var namedEscape = internals.namedHtml[charCode];
	    if (typeof namedEscape !== 'undefined') {
	        return namedEscape;
	    }
	
	    if (charCode >= 256) {
	        return '&#' + charCode + ';';
	    }
	
	    var hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
	    return '&#x' + internals.padLeft(hexValue, 2) + ';';
	};
	
	
	internals.padLeft = function (str, len) {
	
	    while (str.length < len) {
	        str = '0' + str;
	    }
	
	    return str;
	};
	
	
	internals.isSafe = function (charCode) {
	
	    return (typeof internals.safeCharCodes[charCode] !== 'undefined');
	};
	
	
	internals.namedHtml = {
	    '38': '&amp;',
	    '60': '&lt;',
	    '62': '&gt;',
	    '34': '&quot;',
	    '160': '&nbsp;',
	    '162': '&cent;',
	    '163': '&pound;',
	    '164': '&curren;',
	    '169': '&copy;',
	    '174': '&reg;'
	};
	
	
	internals.safeCharCodes = (function () {
	
	    var safe = {};
	
	    for (var i = 32; i < 123; ++i) {
	
	        if ((i >= 97) ||                    // a-z
	            (i >= 65 && i <= 90) ||         // A-Z
	            (i >= 48 && i <= 57) ||         // 0-9
	            i === 32 ||                     // space
	            i === 46 ||                     // .
	            i === 44 ||                     // ,
	            i === 45 ||                     // -
	            i === 58 ||                     // :
	            i === 95) {                     // _
	
	            safe[i] = null;
	        }
	    }
	
	    return safe;
	}());


/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Dns = __webpack_require__(162);
	
	
	// Declare internals
	
	const internals = {
	    hasOwn: Object.prototype.hasOwnProperty,
	    indexOf: Array.prototype.indexOf,
	    defaultThreshold: 16,
	    maxIPv6Groups: 8,
	
	    categories: {
	        valid: 1,
	        dnsWarn: 7,
	        rfc5321: 15,
	        cfws: 31,
	        deprecated: 63,
	        rfc5322: 127,
	        error: 255
	    },
	
	    diagnoses: {
	
	        // Address is valid
	
	        valid: 0,
	
	        // Address is valid, but the DNS check failed
	
	        dnsWarnNoMXRecord: 5,
	        dnsWarnNoRecord: 6,
	
	        // Address is valid for SMTP but has unusual elements
	
	        rfc5321TLD: 9,
	        rfc5321TLDNumeric: 10,
	        rfc5321QuotedString: 11,
	        rfc5321AddressLiteral: 12,
	
	        // Address is valid for message, but must be modified for envelope
	
	        cfwsComment: 17,
	        cfwsFWS: 18,
	
	        // Address contains deprecated elements, but may still be valid in some contexts
	
	        deprecatedLocalPart: 33,
	        deprecatedFWS: 34,
	        deprecatedQTEXT: 35,
	        deprecatedQP: 36,
	        deprecatedComment: 37,
	        deprecatedCTEXT: 38,
	        deprecatedIPv6: 39,
	        deprecatedCFWSNearAt: 49,
	
	        // Address is only valid according to broad definition in RFC 5322, but is otherwise invalid
	
	        rfc5322Domain: 65,
	        rfc5322TooLong: 66,
	        rfc5322LocalTooLong: 67,
	        rfc5322DomainTooLong: 68,
	        rfc5322LabelTooLong: 69,
	        rfc5322DomainLiteral: 70,
	        rfc5322DomainLiteralOBSDText: 71,
	        rfc5322IPv6GroupCount: 72,
	        rfc5322IPv62x2xColon: 73,
	        rfc5322IPv6BadCharacter: 74,
	        rfc5322IPv6MaxGroups: 75,
	        rfc5322IPv6ColonStart: 76,
	        rfc5322IPv6ColonEnd: 77,
	
	        // Address is invalid for any purpose
	
	        errExpectingDTEXT: 129,
	        errNoLocalPart: 130,
	        errNoDomain: 131,
	        errConsecutiveDots: 132,
	        errATEXTAfterCFWS: 133,
	        errATEXTAfterQS: 134,
	        errATEXTAfterDomainLiteral: 135,
	        errExpectingQPair: 136,
	        errExpectingATEXT: 137,
	        errExpectingQTEXT: 138,
	        errExpectingCTEXT: 139,
	        errBackslashEnd: 140,
	        errDotStart: 141,
	        errDotEnd: 142,
	        errDomainHyphenStart: 143,
	        errDomainHyphenEnd: 144,
	        errUnclosedQuotedString: 145,
	        errUnclosedComment: 146,
	        errUnclosedDomainLiteral: 147,
	        errFWSCRLFx2: 148,
	        errFWSCRLFEnd: 149,
	        errCRNoLF: 150,
	        errUnknownTLD: 160,
	        errDomainTooShort: 161
	    },
	
	    components: {
	        localpart: 0,
	        domain: 1,
	        literal: 2,
	        contextComment: 3,
	        contextFWS: 4,
	        contextQuotedString: 5,
	        contextQuotedPair: 6
	    }
	};
	
	
	// $lab:coverage:off$
	internals.defer = typeof process !== 'undefined' && process && typeof process.nextTick === 'function' ?
	    process.nextTick.bind(process) :
	    function (callback) {
	
	        return setTimeout(callback, 0);
	    };
	// $lab:coverage:on$
	
	
	internals.specials = function () {
	
	    const specials = '()<>[]:;@\\,."';        // US-ASCII visible characters not valid for atext (http://tools.ietf.org/html/rfc5322#section-3.2.3)
	    const lookup = new Array(0x100);
	    for (let i = 0xff; i >= 0; --i) {
	        lookup[i] = false;
	    }
	
	    for (let i = 0; i < specials.length; ++i) {
	        lookup[specials.charCodeAt(i)] = true;
	    }
	
	    return function (code) {
	
	        return lookup[code];
	    };
	}();
	
	
	internals.regex = {
	    ipV4: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
	    ipV6: /^[a-fA-F\d]{0,4}$/
	};
	
	
	internals.checkIpV6 = function (items) {
	
	    return items.every((value) => internals.regex.ipV6.test(value));
	};
	
	
	internals.validDomain = function (tldAtom, options) {
	
	    if (options.tldBlacklist) {
	        if (Array.isArray(options.tldBlacklist)) {
	            return internals.indexOf.call(options.tldBlacklist, tldAtom) === -1;
	        }
	
	        return !internals.hasOwn.call(options.tldBlacklist, tldAtom);
	    }
	
	    if (Array.isArray(options.tldWhitelist)) {
	        return internals.indexOf.call(options.tldWhitelist, tldAtom) !== -1;
	    }
	
	    return internals.hasOwn.call(options.tldWhitelist, tldAtom);
	};
	
	
	/**
	 * Check that an email address conforms to RFCs 5321, 5322 and others
	 *
	 * We distinguish clearly between a Mailbox as defined by RFC 5321 and an
	 * addr-spec as defined by RFC 5322. Depending on the context, either can be
	 * regarded as a valid email address. The RFC 5321 Mailbox specification is
	 * more restrictive (comments, white space and obsolete forms are not allowed).
	 *
	 * @param {string} email The email address to check. See README for specifics.
	 * @param {Object} options The (optional) options:
	 *   {boolean} checkDNS If true then will check DNS for MX records. If
	 *     true this call to isEmail _will_ be asynchronous.
	 *   {*} errorLevel Determines the boundary between valid and invalid
	 *     addresses.
	 *   {*} tldBlacklist The set of domains to consider invalid.
	 *   {*} tldWhitelist The set of domains to consider valid.
	 *   {*} minDomainAtoms The minimum number of domain atoms which must be present
	 *     for the address to be valid.
	 * @param {function(number|boolean)} callback The (optional) callback handler.
	 * @return {*}
	 */
	
	exports.validate = internals.validate = function (email, options, callback) {
	
	    options = options || {};
	
	    if (typeof options === 'function') {
	        callback = options;
	        options = {};
	    }
	
	    if (typeof callback !== 'function') {
	        if (options.checkDNS) {
	            throw new TypeError('expected callback function for checkDNS option');
	        }
	
	        callback = null;
	    }
	
	    let diagnose;
	    let threshold;
	
	    if (typeof options.errorLevel === 'number') {
	        diagnose = true;
	        threshold = options.errorLevel;
	    }
	    else {
	        diagnose = !!options.errorLevel;
	        threshold = internals.diagnoses.valid;
	    }
	
	    if (options.tldWhitelist) {
	        if (typeof options.tldWhitelist === 'string') {
	            options.tldWhitelist = [options.tldWhitelist];
	        }
	        else if (typeof options.tldWhitelist !== 'object') {
	            throw new TypeError('expected array or object tldWhitelist');
	        }
	    }
	
	    if (options.tldBlacklist) {
	        if (typeof options.tldBlacklist === 'string') {
	            options.tldBlacklist = [options.tldBlacklist];
	        }
	        else if (typeof options.tldBlacklist !== 'object') {
	            throw new TypeError('expected array or object tldBlacklist');
	        }
	    }
	
	    if (options.minDomainAtoms && (options.minDomainAtoms !== ((+options.minDomainAtoms) | 0) || options.minDomainAtoms < 0)) {
	        throw new TypeError('expected positive integer minDomainAtoms');
	    }
	
	    let maxResult = internals.diagnoses.valid;
	    const updateResult = (value) => {
	
	        if (value > maxResult) {
	            maxResult = value;
	        }
	    };
	
	    const context = {
	        now: internals.components.localpart,
	        prev: internals.components.localpart,
	        stack: [internals.components.localpart]
	    };
	
	    let prevToken = '';
	
	    const parseData = {
	        local: '',
	        domain: ''
	    };
	    const atomData = {
	        locals: [''],
	        domains: ['']
	    };
	
	    let elementCount = 0;
	    let elementLength = 0;
	    let crlfCount = 0;
	    let charCode;
	
	    let hyphenFlag = false;
	    let assertEnd = false;
	
	    const emailLength = email.length;
	
	    let token;                                      // Token is used outside the loop, must declare similarly
	    for (let i = 0; i < emailLength; ++i) {
	        token = email[i];
	
	        switch (context.now) {
	            // Local-part
	            case internals.components.localpart:
	                // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                //   local-part      =   dot-atom / quoted-string / obs-local-part
	                //
	                //   dot-atom        =   [CFWS] dot-atom-text [CFWS]
	                //
	                //   dot-atom-text   =   1*atext *("." 1*atext)
	                //
	                //   quoted-string   =   [CFWS]
	                //                       DQUOTE *([FWS] qcontent) [FWS] DQUOTE
	                //                       [CFWS]
	                //
	                //   obs-local-part  =   word *("." word)
	                //
	                //   word            =   atom / quoted-string
	                //
	                //   atom            =   [CFWS] 1*atext [CFWS]
	                switch (token) {
	                    // Comment
	                    case '(':
	                        if (elementLength === 0) {
	                            // Comments are OK at the beginning of an element
	                            updateResult(elementCount === 0 ? internals.diagnoses.cfwsComment : internals.diagnoses.deprecatedComment);
	                        }
	                        else {
	                            updateResult(internals.diagnoses.cfwsComment);
	                            // Cannot start a comment in an element, should be end
	                            assertEnd = true;
	                        }
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextComment;
	                        break;
	
	                        // Next dot-atom element
	                    case '.':
	                        if (elementLength === 0) {
	                            // Another dot, already?
	                            updateResult(elementCount === 0 ? internals.diagnoses.errDotStart : internals.diagnoses.errConsecutiveDots);
	                        }
	                        else {
	                            // The entire local-part can be a quoted string for RFC 5321; if one atom is quoted it's an RFC 5322 obsolete form
	                            if (assertEnd) {
	                                updateResult(internals.diagnoses.deprecatedLocalPart);
	                            }
	
	                            // CFWS & quoted strings are OK again now we're at the beginning of an element (although they are obsolete forms)
	                            assertEnd = false;
	                            elementLength = 0;
	                            ++elementCount;
	                            parseData.local += token;
	                            atomData.locals[elementCount] = '';
	                        }
	
	                        break;
	
	                        // Quoted string
	                    case '"':
	                        if (elementLength === 0) {
	                            // The entire local-part can be a quoted string for RFC 5321; if one atom is quoted it's an RFC 5322 obsolete form
	                            updateResult(elementCount === 0 ? internals.diagnoses.rfc5321QuotedString : internals.diagnoses.deprecatedLocalPart);
	
	                            parseData.local += token;
	                            atomData.locals[elementCount] += token;
	                            ++elementLength;
	
	                            // Quoted string must be the entire element
	                            assertEnd = true;
	                            context.stack.push(context.now);
	                            context.now = internals.components.contextQuotedString;
	                        }
	                        else {
	                            updateResult(internals.diagnoses.errExpectingATEXT);
	                        }
	
	                        break;
	
	                        // Folding white space
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errCRNoLF);
	                            break;
	                        }
	
	                        // Fallthrough
	
	                    case ' ':
	                    case '\t':
	                        if (elementLength === 0) {
	                            updateResult(elementCount === 0 ? internals.diagnoses.cfwsFWS : internals.diagnoses.deprecatedFWS);
	                        }
	                        else {
	                            // We can't start FWS in the middle of an element, better be end
	                            assertEnd = true;
	                        }
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextFWS;
	                        prevToken = token;
	                        break;
	
	                    case '@':
	                        // At this point we should have a valid local-part
	                        // $lab:coverage:off$
	                        if (context.stack.length !== 1) {
	                            throw new Error('unexpected item on context stack');
	                        }
	                        // $lab:coverage:on$
	
	                        if (parseData.local.length === 0) {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errNoLocalPart);
	                        }
	                        else if (elementLength === 0) {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errDotEnd);
	                        }
	                            // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.1 the maximum total length of a user name or other local-part is 64
	                            //    octets
	                        else if (parseData.local.length > 64) {
	                            updateResult(internals.diagnoses.rfc5322LocalTooLong);
	                        }
	                            // http://tools.ietf.org/html/rfc5322#section-3.4.1 comments and folding white space SHOULD NOT be used around "@" in the
	                            //    addr-spec
	                            //
	                            // http://tools.ietf.org/html/rfc2119
	                            // 4. SHOULD NOT this phrase, or the phrase "NOT RECOMMENDED" mean that there may exist valid reasons in particular
	                            //    circumstances when the particular behavior is acceptable or even useful, but the full implications should be understood
	                            //    and the case carefully weighed before implementing any behavior described with this label.
	                        else if (context.prev === internals.components.contextComment || context.prev === internals.components.contextFWS) {
	                            updateResult(internals.diagnoses.deprecatedCFWSNearAt);
	                        }
	
	                        // Clear everything down for the domain parsing
	                        context.now = internals.components.domain;
	                        context.stack[0] = internals.components.domain;
	                        elementCount = 0;
	                        elementLength = 0;
	                        assertEnd = false; // CFWS can only appear at the end of the element
	                        break;
	
	                        // ATEXT
	                    default:
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
	                        //    atext = ALPHA / DIGIT / ; Printable US-ASCII
	                        //            "!" / "#" /     ;  characters not including
	                        //            "$" / "%" /     ;  specials.  Used for atoms.
	                        //            "&" / "'" /
	                        //            "*" / "+" /
	                        //            "-" / "/" /
	                        //            "=" / "?" /
	                        //            "^" / "_" /
	                        //            "`" / "{" /
	                        //            "|" / "}" /
	                        //            "~"
	                        if (assertEnd) {
	                            // We have encountered atext where it is no longer valid
	                            switch (context.prev) {
	                                case internals.components.contextComment:
	                                case internals.components.contextFWS:
	                                    updateResult(internals.diagnoses.errATEXTAfterCFWS);
	                                    break;
	
	                                case internals.components.contextQuotedString:
	                                    updateResult(internals.diagnoses.errATEXTAfterQS);
	                                    break;
	
	                                    // $lab:coverage:off$
	                                default:
	                                    throw new Error('more atext found where none is allowed, but unrecognized prev context: ' + context.prev);
	                                    // $lab:coverage:on$
	                            }
	                        }
	                        else {
	                            context.prev = context.now;
	                            charCode = token.charCodeAt(0);
	
	                            // Especially if charCode == 10
	                            if (charCode < 33 || charCode > 126 || internals.specials(charCode)) {
	
	                                // Fatal error
	                                updateResult(internals.diagnoses.errExpectingATEXT);
	                            }
	
	                            parseData.local += token;
	                            atomData.locals[elementCount] += token;
	                            ++elementLength;
	                        }
	                }
	
	                break;
	
	            case internals.components.domain:
	                // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                //   domain          =   dot-atom / domain-literal / obs-domain
	                //
	                //   dot-atom        =   [CFWS] dot-atom-text [CFWS]
	                //
	                //   dot-atom-text   =   1*atext *("." 1*atext)
	                //
	                //   domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
	                //
	                //   dtext           =   %d33-90 /          ; Printable US-ASCII
	                //                       %d94-126 /         ;  characters not including
	                //                       obs-dtext          ;  "[", "]", or "\"
	                //
	                //   obs-domain      =   atom *("." atom)
	                //
	                //   atom            =   [CFWS] 1*atext [CFWS]
	
	                // http://tools.ietf.org/html/rfc5321#section-4.1.2
	                //   Mailbox        = Local-part "@" ( Domain / address-literal )
	                //
	                //   Domain         = sub-domain *("." sub-domain)
	                //
	                //   address-literal  = "[" ( IPv4-address-literal /
	                //                    IPv6-address-literal /
	                //                    General-address-literal ) "]"
	                //                    ; See Section 4.1.3
	
	                // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                //      Note: A liberal syntax for the domain portion of addr-spec is
	                //      given here.  However, the domain portion contains addressing
	                //      information specified by and used in other protocols (e.g.,
	                //      [RFC1034], [RFC1035], [RFC1123], [RFC5321]).  It is therefore
	                //      incumbent upon implementations to conform to the syntax of
	                //      addresses for the context in which they are used.
	                //
	                // is_email() author's note: it's not clear how to interpret this in
	                // he context of a general email address validator. The conclusion I
	                // have reached is this: "addressing information" must comply with
	                // RFC 5321 (and in turn RFC 1035), anything that is "semantically
	                // invisible" must comply only with RFC 5322.
	                switch (token) {
	                    // Comment
	                    case '(':
	                        if (elementLength === 0) {
	                            // Comments at the start of the domain are deprecated in the text, comments at the start of a subdomain are obs-domain
	                            // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                            updateResult(elementCount === 0 ? internals.diagnoses.deprecatedCFWSNearAt : internals.diagnoses.deprecatedComment);
	                        }
	                        else {
	                            // We can't start a comment mid-element, better be at the end
	                            assertEnd = true;
	                            updateResult(internals.diagnoses.cfwsComment);
	                        }
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextComment;
	                        break;
	
	                        // Next dot-atom element
	                    case '.':
	                        if (elementLength === 0) {
	                            // Another dot, already? Fatal error.
	                            updateResult(elementCount === 0 ? internals.diagnoses.errDotStart : internals.diagnoses.errConsecutiveDots);
	                        }
	                        else if (hyphenFlag) {
	                            // Previous subdomain ended in a hyphen. Fatal error.
	                            updateResult(internals.diagnoses.errDomainHyphenEnd);
	                        }
	                        else if (elementLength > 63) {
	                            // Nowhere in RFC 5321 does it say explicitly that the domain part of a Mailbox must be a valid domain according to the
	                            // DNS standards set out in RFC 1035, but this *is* implied in several places. For instance, wherever the idea of host
	                            // routing is discussed the RFC says that the domain must be looked up in the DNS. This would be nonsense unless the
	                            // domain was designed to be a valid DNS domain. Hence we must conclude that the RFC 1035 restriction on label length
	                            // also applies to RFC 5321 domains.
	                            //
	                            // http://tools.ietf.org/html/rfc1035#section-2.3.4
	                            // labels          63 octets or less
	
	                            updateResult(internals.diagnoses.rfc5322LabelTooLong);
	                        }
	
	                        // CFWS is OK again now we're at the beginning of an element (although
	                        // it may be obsolete CFWS)
	                        assertEnd = false;
	                        elementLength = 0;
	                        ++elementCount;
	                        atomData.domains[elementCount] = '';
	                        parseData.domain += token;
	
	                        break;
	
	                        // Domain literal
	                    case '[':
	                        if (parseData.domain.length === 0) {
	                            // Domain literal must be the only component
	                            assertEnd = true;
	                            ++elementLength;
	                            context.stack.push(context.now);
	                            context.now = internals.components.literal;
	                            parseData.domain += token;
	                            atomData.domains[elementCount] += token;
	                            parseData.literal = '';
	                        }
	                        else {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errExpectingATEXT);
	                        }
	
	                        break;
	
	                        // Folding white space
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errCRNoLF);
	                            break;
	                        }
	
	                        // Fallthrough
	
	                    case ' ':
	                    case '\t':
	                        if (elementLength === 0) {
	                            updateResult(elementCount === 0 ? internals.diagnoses.deprecatedCFWSNearAt : internals.diagnoses.deprecatedFWS);
	                        }
	                        else {
	                            // We can't start FWS in the middle of an element, so this better be the end
	                            updateResult(internals.diagnoses.cfwsFWS);
	                            assertEnd = true;
	                        }
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextFWS;
	                        prevToken = token;
	                        break;
	
	                        // This must be ATEXT
	                    default:
	                        // RFC 5322 allows any atext...
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
	                        //    atext = ALPHA / DIGIT / ; Printable US-ASCII
	                        //            "!" / "#" /     ;  characters not including
	                        //            "$" / "%" /     ;  specials.  Used for atoms.
	                        //            "&" / "'" /
	                        //            "*" / "+" /
	                        //            "-" / "/" /
	                        //            "=" / "?" /
	                        //            "^" / "_" /
	                        //            "`" / "{" /
	                        //            "|" / "}" /
	                        //            "~"
	
	                        // But RFC 5321 only allows letter-digit-hyphen to comply with DNS rules
	                        //   (RFCs 1034 & 1123)
	                        // http://tools.ietf.org/html/rfc5321#section-4.1.2
	                        //   sub-domain     = Let-dig [Ldh-str]
	                        //
	                        //   Let-dig        = ALPHA / DIGIT
	                        //
	                        //   Ldh-str        = *( ALPHA / DIGIT / "-" ) Let-dig
	                        //
	                        if (assertEnd) {
	                            // We have encountered ATEXT where it is no longer valid
	                            switch (context.prev) {
	                                case internals.components.contextComment:
	                                case internals.components.contextFWS:
	                                    updateResult(internals.diagnoses.errATEXTAfterCFWS);
	                                    break;
	
	                                case internals.components.literal:
	                                    updateResult(internals.diagnoses.errATEXTAfterDomainLiteral);
	                                    break;
	
	                                    // $lab:coverage:off$
	                                default:
	                                    throw new Error('more atext found where none is allowed, but unrecognized prev context: ' + context.prev);
	                                    // $lab:coverage:on$
	                            }
	                        }
	
	                        charCode = token.charCodeAt(0);
	                        // Assume this token isn't a hyphen unless we discover it is
	                        hyphenFlag = false;
	
	                        if (charCode < 33 || charCode > 126 || internals.specials(charCode)) {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errExpectingATEXT);
	                        }
	                        else if (token === '-') {
	                            if (elementLength === 0) {
	                                // Hyphens cannot be at the beginning of a subdomain, fatal error
	                                updateResult(internals.diagnoses.errDomainHyphenStart);
	                            }
	
	                            hyphenFlag = true;
	                        }
	                            // Check if it's a neither a number nor a latin letter
	                        else if (charCode < 48 || charCode > 122 || (charCode > 57 && charCode < 65) || (charCode > 90 && charCode < 97)) {
	                            // This is not an RFC 5321 subdomain, but still OK by RFC 5322
	                            updateResult(internals.diagnoses.rfc5322Domain);
	                        }
	
	                        parseData.domain += token;
	                        atomData.domains[elementCount] += token;
	                        ++elementLength;
	                }
	
	                break;
	
	                // Domain literal
	            case internals.components.literal:
	                // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                //   domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
	                //
	                //   dtext           =   %d33-90 /          ; Printable US-ASCII
	                //                       %d94-126 /         ;  characters not including
	                //                       obs-dtext          ;  "[", "]", or "\"
	                //
	                //   obs-dtext       =   obs-NO-WS-CTL / quoted-pair
	                switch (token) {
	                    // End of domain literal
	                    case ']':
	                        if (maxResult < internals.categories.deprecated) {
	                            // Could be a valid RFC 5321 address literal, so let's check
	
	                            // http://tools.ietf.org/html/rfc5321#section-4.1.2
	                            //   address-literal  = "[" ( IPv4-address-literal /
	                            //                    IPv6-address-literal /
	                            //                    General-address-literal ) "]"
	                            //                    ; See Section 4.1.3
	                            //
	                            // http://tools.ietf.org/html/rfc5321#section-4.1.3
	                            //   IPv4-address-literal  = Snum 3("."  Snum)
	                            //
	                            //   IPv6-address-literal  = "IPv6:" IPv6-addr
	                            //
	                            //   General-address-literal  = Standardized-tag ":" 1*dcontent
	                            //
	                            //   Standardized-tag  = Ldh-str
	                            //                     ; Standardized-tag MUST be specified in a
	                            //                     ; Standards-Track RFC and registered with IANA
	                            //
	                            //   dcontent      = %d33-90 / ; Printable US-ASCII
	                            //                 %d94-126 ; excl. "[", "\", "]"
	                            //
	                            //   Snum          = 1*3DIGIT
	                            //                 ; representing a decimal integer
	                            //                 ; value in the range 0 through 255
	                            //
	                            //   IPv6-addr     = IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp
	                            //
	                            //   IPv6-hex      = 1*4HEXDIG
	                            //
	                            //   IPv6-full     = IPv6-hex 7(":" IPv6-hex)
	                            //
	                            //   IPv6-comp     = [IPv6-hex *5(":" IPv6-hex)] "::"
	                            //                 [IPv6-hex *5(":" IPv6-hex)]
	                            //                 ; The "::" represents at least 2 16-bit groups of
	                            //                 ; zeros.  No more than 6 groups in addition to the
	                            //                 ; "::" may be present.
	                            //
	                            //   IPv6v4-full   = IPv6-hex 5(":" IPv6-hex) ":" IPv4-address-literal
	                            //
	                            //   IPv6v4-comp   = [IPv6-hex *3(":" IPv6-hex)] "::"
	                            //                 [IPv6-hex *3(":" IPv6-hex) ":"]
	                            //                 IPv4-address-literal
	                            //                 ; The "::" represents at least 2 16-bit groups of
	                            //                 ; zeros.  No more than 4 groups in addition to the
	                            //                 ; "::" and IPv4-address-literal may be present.
	
	                            let index = -1;
	                            let addressLiteral = parseData.literal;
	                            const matchesIP = internals.regex.ipV4.exec(addressLiteral);
	
	                            // Maybe extract IPv4 part from the end of the address-literal
	                            if (matchesIP) {
	                                index = matchesIP.index;
	                                if (index !== 0) {
	                                    // Convert IPv4 part to IPv6 format for futher testing
	                                    addressLiteral = addressLiteral.slice(0, index) + '0:0';
	                                }
	                            }
	
	                            if (index === 0) {
	                                // Nothing there except a valid IPv4 address, so...
	                                updateResult(internals.diagnoses.rfc5321AddressLiteral);
	                            }
	                            else if (addressLiteral.slice(0, 5).toLowerCase() !== 'ipv6:') {
	                                updateResult(internals.diagnoses.rfc5322DomainLiteral);
	                            }
	                            else {
	                                const match = addressLiteral.slice(5);
	                                let maxGroups = internals.maxIPv6Groups;
	                                const groups = match.split(':');
	                                index = match.indexOf('::');
	
	                                if (!~index) {
	                                    // Need exactly the right number of groups
	                                    if (groups.length !== maxGroups) {
	                                        updateResult(internals.diagnoses.rfc5322IPv6GroupCount);
	                                    }
	                                }
	                                else if (index !== match.lastIndexOf('::')) {
	                                    updateResult(internals.diagnoses.rfc5322IPv62x2xColon);
	                                }
	                                else {
	                                    if (index === 0 || index === match.length - 2) {
	                                        // RFC 4291 allows :: at the start or end of an address with 7 other groups in addition
	                                        ++maxGroups;
	                                    }
	
	                                    if (groups.length > maxGroups) {
	                                        updateResult(internals.diagnoses.rfc5322IPv6MaxGroups);
	                                    }
	                                    else if (groups.length === maxGroups) {
	                                        // Eliding a single "::"
	                                        updateResult(internals.diagnoses.deprecatedIPv6);
	                                    }
	                                }
	
	                                // IPv6 testing strategy
	                                if (match[0] === ':' && match[1] !== ':') {
	                                    updateResult(internals.diagnoses.rfc5322IPv6ColonStart);
	                                }
	                                else if (match[match.length - 1] === ':' && match[match.length - 2] !== ':') {
	                                    updateResult(internals.diagnoses.rfc5322IPv6ColonEnd);
	                                }
	                                else if (internals.checkIpV6(groups)) {
	                                    updateResult(internals.diagnoses.rfc5321AddressLiteral);
	                                }
	                                else {
	                                    updateResult(internals.diagnoses.rfc5322IPv6BadCharacter);
	                                }
	                            }
	                        }
	                        else {
	                            updateResult(internals.diagnoses.rfc5322DomainLiteral);
	                        }
	
	                        parseData.domain += token;
	                        atomData.domains[elementCount] += token;
	                        ++elementLength;
	                        context.prev = context.now;
	                        context.now = context.stack.pop();
	                        break;
	
	                    case '\\':
	                        updateResult(internals.diagnoses.rfc5322DomainLiteralOBSDText);
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextQuotedPair;
	                        break;
	
	                        // Folding white space
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            updateResult(internals.diagnoses.errCRNoLF);
	                            break;
	                        }
	
	                        // Fallthrough
	
	                    case ' ':
	                    case '\t':
	                        updateResult(internals.diagnoses.cfwsFWS);
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextFWS;
	                        prevToken = token;
	                        break;
	
	                        // DTEXT
	                    default:
	                        // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                        //   dtext         =   %d33-90 /  ; Printable US-ASCII
	                        //                     %d94-126 / ;  characters not including
	                        //                     obs-dtext  ;  "[", "]", or "\"
	                        //
	                        //   obs-dtext     =   obs-NO-WS-CTL / quoted-pair
	                        //
	                        //   obs-NO-WS-CTL =   %d1-8 /    ; US-ASCII control
	                        //                     %d11 /     ;  characters that do not
	                        //                     %d12 /     ;  include the carriage
	                        //                     %d14-31 /  ;  return, line feed, and
	                        //                     %d127      ;  white space characters
	                        charCode = token.charCodeAt(0);
	
	                        // '\r', '\n', ' ', and '\t' have already been parsed above
	                        if (charCode > 127 || charCode === 0 || token === '[') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errExpectingDTEXT);
	                            break;
	                        }
	                        else if (charCode < 33 || charCode === 127) {
	                            updateResult(internals.diagnoses.rfc5322DomainLiteralOBSDText);
	                        }
	
	                        parseData.literal += token;
	                        parseData.domain += token;
	                        atomData.domains[elementCount] += token;
	                        ++elementLength;
	                }
	
	                break;
	
	                // Quoted string
	            case internals.components.contextQuotedString:
	                // http://tools.ietf.org/html/rfc5322#section-3.2.4
	                //   quoted-string = [CFWS]
	                //                   DQUOTE *([FWS] qcontent) [FWS] DQUOTE
	                //                   [CFWS]
	                //
	                //   qcontent      = qtext / quoted-pair
	                switch (token) {
	                    // Quoted pair
	                    case '\\':
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextQuotedPair;
	                        break;
	
	                        // Folding white space. Spaces are allowed as regular characters inside a quoted string - it's only FWS if we include '\t' or '\r\n'
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errCRNoLF);
	                            break;
	                        }
	
	                        // Fallthrough
	
	                    case '\t':
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.2
	                        //   Runs of FWS, comment, or CFWS that occur between lexical tokens in
	                        //   a structured header field are semantically interpreted as a single
	                        //   space character.
	
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.4
	                        //   the CRLF in any FWS/CFWS that appears within the quoted-string [is]
	                        //   semantically "invisible" and therefore not part of the
	                        //   quoted-string
	
	                        parseData.local += ' ';
	                        atomData.locals[elementCount] += ' ';
	                        ++elementLength;
	
	                        updateResult(internals.diagnoses.cfwsFWS);
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextFWS;
	                        prevToken = token;
	                        break;
	
	                        // End of quoted string
	                    case '"':
	                        parseData.local += token;
	                        atomData.locals[elementCount] += token;
	                        ++elementLength;
	                        context.prev = context.now;
	                        context.now = context.stack.pop();
	                        break;
	
	                        // QTEXT
	                    default:
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.4
	                        //   qtext          =   %d33 /             ; Printable US-ASCII
	                        //                      %d35-91 /          ;  characters not including
	                        //                      %d93-126 /         ;  "\" or the quote character
	                        //                      obs-qtext
	                        //
	                        //   obs-qtext      =   obs-NO-WS-CTL
	                        //
	                        //   obs-NO-WS-CTL  =   %d1-8 /            ; US-ASCII control
	                        //                      %d11 /             ;  characters that do not
	                        //                      %d12 /             ;  include the carriage
	                        //                      %d14-31 /          ;  return, line feed, and
	                        //                      %d127              ;  white space characters
	                        charCode = token.charCodeAt(0);
	
	                        if (charCode > 127 || charCode === 0 || charCode === 10) {
	                            updateResult(internals.diagnoses.errExpectingQTEXT);
	                        }
	                        else if (charCode < 32 || charCode === 127) {
	                            updateResult(internals.diagnoses.deprecatedQTEXT);
	                        }
	
	                        parseData.local += token;
	                        atomData.locals[elementCount] += token;
	                        ++elementLength;
	                }
	
	                // http://tools.ietf.org/html/rfc5322#section-3.4.1
	                //   If the string can be represented as a dot-atom (that is, it contains
	                //   no characters other than atext characters or "." surrounded by atext
	                //   characters), then the dot-atom form SHOULD be used and the quoted-
	                //   string form SHOULD NOT be used.
	
	                break;
	                // Quoted pair
	            case internals.components.contextQuotedPair:
	                // http://tools.ietf.org/html/rfc5322#section-3.2.1
	                //   quoted-pair     =   ("\" (VCHAR / WSP)) / obs-qp
	                //
	                //   VCHAR           =  %d33-126   ; visible (printing) characters
	                //   WSP             =  SP / HTAB  ; white space
	                //
	                //   obs-qp          =   "\" (%d0 / obs-NO-WS-CTL / LF / CR)
	                //
	                //   obs-NO-WS-CTL   =   %d1-8 /   ; US-ASCII control
	                //                       %d11 /    ;  characters that do not
	                //                       %d12 /    ;  include the carriage
	                //                       %d14-31 / ;  return, line feed, and
	                //                       %d127     ;  white space characters
	                //
	                // i.e. obs-qp       =  "\" (%d0-8, %d10-31 / %d127)
	                charCode = token.charCodeAt(0);
	
	                if (charCode > 127) {
	                    // Fatal error
	                    updateResult(internals.diagnoses.errExpectingQPair);
	                }
	                else if ((charCode < 31 && charCode !== 9) || charCode === 127) {
	                    // ' ' and '\t' are allowed
	                    updateResult(internals.diagnoses.deprecatedQP);
	                }
	
	                // At this point we know where this qpair occurred so we could check to see if the character actually needed to be quoted at all.
	                // http://tools.ietf.org/html/rfc5321#section-4.1.2
	                //   the sending system SHOULD transmit the form that uses the minimum quoting possible.
	
	                context.prev = context.now;
	                // End of qpair
	                context.now = context.stack.pop();
	                token = '\\' + token;
	
	                switch (context.now) {
	                    case internals.components.contextComment:
	                        break;
	
	                    case internals.components.contextQuotedString:
	                        parseData.local += token;
	                        atomData.locals[elementCount] += token;
	
	                        // The maximum sizes specified by RFC 5321 are octet counts, so we must include the backslash
	                        elementLength += 2;
	                        break;
	
	                    case internals.components.literal:
	                        parseData.domain += token;
	                        atomData.domains[elementCount] += token;
	
	                        // The maximum sizes specified by RFC 5321 are octet counts, so we must include the backslash
	                        elementLength += 2;
	                        break;
	
	                        // $lab:coverage:off$
	                    default:
	                        throw new Error('quoted pair logic invoked in an invalid context: ' + context.now);
	                        // $lab:coverage:on$
	                }
	                break;
	
	                // Comment
	            case internals.components.contextComment:
	                // http://tools.ietf.org/html/rfc5322#section-3.2.2
	                //   comment  = "(" *([FWS] ccontent) [FWS] ")"
	                //
	                //   ccontent = ctext / quoted-pair / comment
	                switch (token) {
	                    // Nested comment
	                    case '(':
	                        // Nested comments are ok
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextComment;
	                        break;
	
	                        // End of comment
	                    case ')':
	                        context.prev = context.now;
	                        context.now = context.stack.pop();
	                        break;
	
	                        // Quoted pair
	                    case '\\':
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextQuotedPair;
	                        break;
	
	                        // Folding white space
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errCRNoLF);
	                            break;
	                        }
	
	                        // Fallthrough
	
	                    case ' ':
	                    case '\t':
	                        updateResult(internals.diagnoses.cfwsFWS);
	
	                        context.stack.push(context.now);
	                        context.now = internals.components.contextFWS;
	                        prevToken = token;
	                        break;
	
	                        // CTEXT
	                    default:
	                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
	                        //   ctext         = %d33-39 /  ; Printable US-ASCII
	                        //                   %d42-91 /  ;  characters not including
	                        //                   %d93-126 / ;  "(", ")", or "\"
	                        //                   obs-ctext
	                        //
	                        //   obs-ctext     = obs-NO-WS-CTL
	                        //
	                        //   obs-NO-WS-CTL = %d1-8 /    ; US-ASCII control
	                        //                   %d11 /     ;  characters that do not
	                        //                   %d12 /     ;  include the carriage
	                        //                   %d14-31 /  ;  return, line feed, and
	                        //                   %d127      ;  white space characters
	                        charCode = token.charCodeAt(0);
	
	                        if (charCode > 127 || charCode === 0 || charCode === 10) {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errExpectingCTEXT);
	                            break;
	                        }
	                        else if (charCode < 32 || charCode === 127) {
	                            updateResult(internals.diagnoses.deprecatedCTEXT);
	                        }
	                }
	
	                break;
	
	                // Folding white space
	            case internals.components.contextFWS:
	                // http://tools.ietf.org/html/rfc5322#section-3.2.2
	                //   FWS     =   ([*WSP CRLF] 1*WSP) /  obs-FWS
	                //                                   ; Folding white space
	
	                // But note the erratum:
	                // http://www.rfc-editor.org/errata_search.php?rfc=5322&eid=1908:
	                //   In the obsolete syntax, any amount of folding white space MAY be
	                //   inserted where the obs-FWS rule is allowed.  This creates the
	                //   possibility of having two consecutive "folds" in a line, and
	                //   therefore the possibility that a line which makes up a folded header
	                //   field could be composed entirely of white space.
	                //
	                //   obs-FWS =   1*([CRLF] WSP)
	
	                if (prevToken === '\r') {
	                    if (token === '\r') {
	                        // Fatal error
	                        updateResult(internals.diagnoses.errFWSCRLFx2);
	                        break;
	                    }
	
	                    if (++crlfCount > 1) {
	                        // Multiple folds => obsolete FWS
	                        updateResult(internals.diagnoses.deprecatedFWS);
	                    }
	                    else {
	                        crlfCount = 1;
	                    }
	                }
	
	                switch (token) {
	                    case '\r':
	                        if (emailLength === ++i || email[i] !== '\n') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errCRNoLF);
	                        }
	
	                        break;
	
	                    case ' ':
	                    case '\t':
	                        break;
	
	                    default:
	                        if (prevToken === '\r') {
	                            // Fatal error
	                            updateResult(internals.diagnoses.errFWSCRLFEnd);
	                        }
	
	                        crlfCount = 0;
	
	                        // End of FWS
	                        context.prev = context.now;
	                        context.now = context.stack.pop();
	
	                        // Look at this token again in the parent context
	                        --i;
	                }
	
	                prevToken = token;
	                break;
	
	                // Unexpected context
	                // $lab:coverage:off$
	            default:
	                throw new Error('unknown context: ' + context.now);
	                // $lab:coverage:on$
	        } // Primary state machine
	
	        if (maxResult > internals.categories.rfc5322) {
	            // Fatal error, no point continuing
	            break;
	        }
	    } // Token loop
	
	    // Check for errors
	    if (maxResult < internals.categories.rfc5322) {
	        // Fatal errors
	        if (context.now === internals.components.contextQuotedString) {
	            updateResult(internals.diagnoses.errUnclosedQuotedString);
	        }
	        else if (context.now === internals.components.contextQuotedPair) {
	            updateResult(internals.diagnoses.errBackslashEnd);
	        }
	        else if (context.now === internals.components.contextComment) {
	            updateResult(internals.diagnoses.errUnclosedComment);
	        }
	        else if (context.now === internals.components.literal) {
	            updateResult(internals.diagnoses.errUnclosedDomainLiteral);
	        }
	        else if (token === '\r') {
	            updateResult(internals.diagnoses.errFWSCRLFEnd);
	        }
	        else if (parseData.domain.length === 0) {
	            updateResult(internals.diagnoses.errNoDomain);
	        }
	        else if (elementLength === 0) {
	            updateResult(internals.diagnoses.errDotEnd);
	        }
	        else if (hyphenFlag) {
	            updateResult(internals.diagnoses.errDomainHyphenEnd);
	        }
	
	            // Other errors
	        else if (parseData.domain.length > 255) {
	            // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.2
	            //   The maximum total length of a domain name or number is 255 octets.
	            updateResult(internals.diagnoses.rfc5322DomainTooLong);
	        }
	        else if (parseData.local.length + parseData.domain.length + /* '@' */ 1 > 254) {
	            // http://tools.ietf.org/html/rfc5321#section-4.1.2
	            //   Forward-path   = Path
	            //
	            //   Path           = "<" [ A-d-l ":" ] Mailbox ">"
	            //
	            // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.3
	            //   The maximum total length of a reverse-path or forward-path is 256 octets (including the punctuation and element separators).
	            //
	            // Thus, even without (obsolete) routing information, the Mailbox can only be 254 characters long. This is confirmed by this verified
	            // erratum to RFC 3696:
	            //
	            // http://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690
	            //   However, there is a restriction in RFC 2821 on the length of an address in MAIL and RCPT commands of 254 characters.  Since
	            //   addresses that do not fit in those fields are not normally useful, the upper limit on address lengths should normally be considered
	            //   to be 254.
	            updateResult(internals.diagnoses.rfc5322TooLong);
	        }
	        else if (elementLength > 63) {
	            // http://tools.ietf.org/html/rfc1035#section-2.3.4
	            // labels   63 octets or less
	            updateResult(internals.diagnoses.rfc5322LabelTooLong);
	        }
	        else if (options.minDomainAtoms && atomData.domains.length < options.minDomainAtoms) {
	            updateResult(internals.diagnoses.errDomainTooShort);
	        }
	        else if (options.tldWhitelist || options.tldBlacklist) {
	            const tldAtom = atomData.domains[elementCount];
	
	            if (!internals.validDomain(tldAtom, options)) {
	                updateResult(internals.diagnoses.errUnknownTLD);
	            }
	        }
	    } // Check for errors
	
	    let dnsPositive = false;
	    let finishImmediately = false;
	
	    const finish = () => {
	
	        if (!dnsPositive && maxResult < internals.categories.dnsWarn) {
	            // Per RFC 5321, domain atoms are limited to letter-digit-hyphen, so we only need to check code <= 57 to check for a digit
	            const code = atomData.domains[elementCount].charCodeAt(0);
	            if (code <= 57) {
	                updateResult(internals.diagnoses.rfc5321TLDNumeric);
	            }
	            else if (elementCount === 0) {
	                updateResult(internals.diagnoses.rfc5321TLD);
	            }
	        }
	
	        if (maxResult < threshold) {
	            maxResult = internals.diagnoses.valid;
	        }
	
	        const finishResult = diagnose ? maxResult : maxResult < internals.defaultThreshold;
	
	        if (callback) {
	            if (finishImmediately) {
	                callback(finishResult);
	            }
	            else {
	                internals.defer(callback.bind(null, finishResult));
	            }
	        }
	
	        return finishResult;
	    }; // Finish
	
	    if (options.checkDNS && maxResult < internals.categories.dnsWarn) {
	        // http://tools.ietf.org/html/rfc5321#section-2.3.5
	        //   Names that can be resolved to MX RRs or address (i.e., A or AAAA) RRs (as discussed in Section 5) are permitted, as are CNAME RRs whose
	        //   targets can be resolved, in turn, to MX or address RRs.
	        //
	        // http://tools.ietf.org/html/rfc5321#section-5.1
	        //   The lookup first attempts to locate an MX record associated with the name.  If a CNAME record is found, the resulting name is processed
	        //   as if it were the initial name. ... If an empty list of MXs is returned, the address is treated as if it was associated with an implicit
	        //   MX RR, with a preference of 0, pointing to that host.
	        //
	        // isEmail() author's note: We will regard the existence of a CNAME to be sufficient evidence of the domain's existence. For performance
	        // reasons we will not repeat the DNS lookup for the CNAME's target, but we will raise a warning because we didn't immediately find an MX
	        // record.
	        if (elementCount === 0) {
	            // Checking TLD DNS only works if you explicitly check from the root
	            parseData.domain += '.';
	        }
	
	        const dnsDomain = parseData.domain;
	        Dns.resolveMx(dnsDomain, (err, mxRecords) => {
	
	            // If we have a fatal error, then we must assume that there are no records
	            if (err && err.code !== Dns.NODATA) {
	                updateResult(internals.diagnoses.dnsWarnNoRecord);
	                return finish();
	            }
	
	            if (mxRecords && mxRecords.length) {
	                dnsPositive = true;
	                return finish();
	            }
	
	            let count = 3;
	            let done = false;
	            updateResult(internals.diagnoses.dnsWarnNoMXRecord);
	
	            const handleRecords = (ignoreError, records) => {
	
	                if (done) {
	                    return;
	                }
	
	                --count;
	
	                if (records && records.length) {
	                    done = true;
	                    return finish();
	                }
	
	                if (count === 0) {
	                    // No usable records for the domain can be found
	                    updateResult(internals.diagnoses.dnsWarnNoRecord);
	                    done = true;
	                    finish();
	                }
	            };
	
	            Dns.resolveCname(dnsDomain, handleRecords);
	            Dns.resolve4(dnsDomain, handleRecords);
	            Dns.resolve6(dnsDomain, handleRecords);
	        });
	
	        finishImmediately = true;
	    }
	    else {
	        const result = finish();
	        finishImmediately = true;
	        return result;
	    } // CheckDNS
	};
	
	
	exports.diagnoses = internals.validate.diagnoses = (function () {
	
	    const diag = {};
	    const keys = Object.keys(internals.diagnoses);
	    for (let i = 0; i < keys.length; ++i) {
	        const key = keys[i];
	        diag[key] = internals.diagnoses[key];
	    }
	
	    return diag;
	})();


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Any = __webpack_require__(2);
	const Cast = __webpack_require__(20);
	const Hoek = __webpack_require__(1);
	
	
	// Declare internals
	
	const internals = {};
	
	
	internals.fastSplice = function (arr, i) {
	
	    let pos = i;
	    while (pos < arr.length) {
	        arr[pos++] = arr[pos];
	    }
	
	    --arr.length;
	};
	
	
	internals.Array = function () {
	
	    Any.call(this);
	    this._type = 'array';
	    this._inner.items = [];
	    this._inner.ordereds = [];
	    this._inner.inclusions = [];
	    this._inner.exclusions = [];
	    this._inner.requireds = [];
	    this._flags.sparse = false;
	};
	
	Hoek.inherits(internals.Array, Any);
	
	
	internals.safeParse = function (value, result) {
	
	    try {
	        const converted = JSON.parse(value);
	        if (Array.isArray(converted)) {
	            result.value = converted;
	        }
	    }
	    catch (e) { }
	};
	
	internals.Array.prototype._base = function (value, state, options) {
	
	    const result = {
	        value
	    };
	
	    if (typeof value === 'string' &&
	        options.convert) {
	
	        internals.safeParse(value, result);
	    }
	
	    let isArray = Array.isArray(result.value);
	    const wasArray = isArray;
	    if (options.convert && this._flags.single && !isArray) {
	        result.value = [result.value];
	        isArray = true;
	    }
	
	    if (!isArray) {
	        result.errors = this.createError('array.base', null, state, options);
	        return result;
	    }
	
	    if (this._inner.inclusions.length ||
	        this._inner.exclusions.length ||
	        this._inner.requireds.length ||
	        this._inner.ordereds.length ||
	        !this._flags.sparse) {
	
	        // Clone the array so that we don't modify the original
	        if (wasArray) {
	            result.value = result.value.slice(0);
	        }
	
	        result.errors = internals.checkItems.call(this, result.value, wasArray, state, options);
	
	        if (result.errors && wasArray && options.convert && this._flags.single) {
	
	            // Attempt a 2nd pass by putting the array inside one.
	            const previousErrors = result.errors;
	
	            result.value = [result.value];
	            result.errors = internals.checkItems.call(this, result.value, wasArray, state, options);
	
	            if (result.errors) {
	
	                // Restore previous errors and value since this didn't validate either.
	                result.errors = previousErrors;
	                result.value = result.value[0];
	            }
	        }
	    }
	
	    return result;
	};
	
	
	internals.checkItems = function (items, wasArray, state, options) {
	
	    const errors = [];
	    let errored;
	
	    const requireds = this._inner.requireds.slice();
	    const ordereds = this._inner.ordereds.slice();
	    const inclusions = this._inner.inclusions.concat(requireds);
	
	    let il = items.length;
	    for (let i = 0; i < il; ++i) {
	        errored = false;
	        const item = items[i];
	        let isValid = false;
	        const key = wasArray ? i : state.key;
	        const path = wasArray ? (state.path ? state.path + '.' : '') + i : state.path;
	        const localState = { key, path, parent: items, reference: state.reference };
	        let res;
	
	        // Sparse
	
	        if (!this._flags.sparse && item === undefined) {
	            errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));
	
	            if (options.abortEarly) {
	                return errors;
	            }
	
	            continue;
	        }
	
	        // Exclusions
	
	        for (let j = 0; j < this._inner.exclusions.length; ++j) {
	            res = this._inner.exclusions[j]._validate(item, localState, {});                // Not passing options to use defaults
	
	            if (!res.errors) {
	                errors.push(this.createError(wasArray ? 'array.excludes' : 'array.excludesSingle', { pos: i, value: item }, { key: state.key, path: localState.path }, options));
	                errored = true;
	
	                if (options.abortEarly) {
	                    return errors;
	                }
	
	                break;
	            }
	        }
	
	        if (errored) {
	            continue;
	        }
	
	        // Ordered
	        if (this._inner.ordereds.length) {
	            if (ordereds.length > 0) {
	                const ordered = ordereds.shift();
	                res = ordered._validate(item, localState, options);
	                if (!res.errors) {
	                    if (ordered._flags.strip) {
	                        internals.fastSplice(items, i);
	                        --i;
	                        --il;
	                    }
	                    else if (!this._flags.sparse && res.value === undefined) {
	                        errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));
	
	                        if (options.abortEarly) {
	                            return errors;
	                        }
	
	                        continue;
	                    }
	                    else {
	                        items[i] = res.value;
	                    }
	                }
	                else {
	                    errors.push(this.createError('array.ordered', { pos: i, reason: res.errors, value: item }, { key: state.key, path: localState.path }, options));
	                    if (options.abortEarly) {
	                        return errors;
	                    }
	                }
	                continue;
	            }
	            else if (!this._inner.items.length) {
	                errors.push(this.createError('array.orderedLength', { pos: i, limit: this._inner.ordereds.length }, { key: state.key, path: localState.path }, options));
	                if (options.abortEarly) {
	                    return errors;
	                }
	                continue;
	            }
	        }
	
	        // Requireds
	
	        const requiredChecks = [];
	        let jl = requireds.length;
	        for (let j = 0; j < jl; ++j) {
	            res = requiredChecks[j] = requireds[j]._validate(item, localState, options);
	            if (!res.errors) {
	                items[i] = res.value;
	                isValid = true;
	                internals.fastSplice(requireds, j);
	                --j;
	                --jl;
	
	                if (!this._flags.sparse && res.value === undefined) {
	                    errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));
	
	                    if (options.abortEarly) {
	                        return errors;
	                    }
	                }
	
	                break;
	            }
	        }
	
	        if (isValid) {
	            continue;
	        }
	
	        // Inclusions
	
	        const stripUnknown = options.stripUnknown
	            ? (options.stripUnknown === true ? true : !!options.stripUnknown.arrays)
	            : false;
	
	        jl = inclusions.length;
	        for (let j = 0; j < jl; ++j) {
	            const inclusion = inclusions[j];
	
	            // Avoid re-running requireds that already didn't match in the previous loop
	            const previousCheck = requireds.indexOf(inclusion);
	            if (previousCheck !== -1) {
	                res = requiredChecks[previousCheck];
	            }
	            else {
	                res = inclusion._validate(item, localState, options);
	
	                if (!res.errors) {
	                    if (inclusion._flags.strip) {
	                        internals.fastSplice(items, i);
	                        --i;
	                        --il;
	                    }
	                    else if (!this._flags.sparse && res.value === undefined) {
	                        errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));
	                        errored = true;
	                    }
	                    else {
	                        items[i] = res.value;
	                    }
	                    isValid = true;
	                    break;
	                }
	            }
	
	            // Return the actual error if only one inclusion defined
	            if (jl === 1) {
	                if (stripUnknown) {
	                    internals.fastSplice(items, i);
	                    --i;
	                    --il;
	                    isValid = true;
	                    break;
	                }
	
	                errors.push(this.createError(wasArray ? 'array.includesOne' : 'array.includesOneSingle', { pos: i, reason: res.errors, value: item }, { key: state.key, path: localState.path }, options));
	                errored = true;
	
	                if (options.abortEarly) {
	                    return errors;
	                }
	
	                break;
	            }
	        }
	
	        if (errored) {
	            continue;
	        }
	
	        if (this._inner.inclusions.length && !isValid) {
	            if (stripUnknown) {
	                internals.fastSplice(items, i);
	                --i;
	                --il;
	                continue;
	            }
	
	            errors.push(this.createError(wasArray ? 'array.includes' : 'array.includesSingle', { pos: i, value: item }, { key: state.key, path: localState.path }, options));
	
	            if (options.abortEarly) {
	                return errors;
	            }
	        }
	    }
	
	    if (requireds.length) {
	        internals.fillMissedErrors.call(this, errors, requireds, state, options);
	    }
	
	    if (ordereds.length) {
	        internals.fillOrderedErrors.call(this, errors, ordereds, state, options);
	    }
	
	    return errors.length ? errors : null;
	};
	
	
	internals.fillMissedErrors = function (errors, requireds, state, options) {
	
	    const knownMisses = [];
	    let unknownMisses = 0;
	    for (let i = 0; i < requireds.length; ++i) {
	        const label = Hoek.reach(requireds[i], '_settings.language.label');
	        if (label) {
	            knownMisses.push(label);
	        }
	        else {
	            ++unknownMisses;
	        }
	    }
	
	    if (knownMisses.length) {
	        if (unknownMisses) {
	            errors.push(this.createError('array.includesRequiredBoth', { knownMisses: knownMisses, unknownMisses: unknownMisses }, { key: state.key, path: state.path }, options));
	        }
	        else {
	            errors.push(this.createError('array.includesRequiredKnowns', { knownMisses: knownMisses }, { key: state.key, path: state.path }, options));
	        }
	    }
	    else {
	        errors.push(this.createError('array.includesRequiredUnknowns', { unknownMisses: unknownMisses }, { key: state.key, path: state.path }, options));
	    }
	};
	
	
	internals.fillOrderedErrors = function (errors, ordereds, state, options) {
	
	    const requiredOrdereds = [];
	
	    for (let i = 0; i < ordereds.length; ++i) {
	        const presence = Hoek.reach(ordereds[i], '_flags.presence');
	        if (presence === 'required') {
	            requiredOrdereds.push(ordereds[i]);
	        }
	    }
	
	    if (requiredOrdereds.length) {
	        internals.fillMissedErrors.call(this, errors, requiredOrdereds, state, options);
	    }
	};
	
	internals.Array.prototype.describe = function () {
	
	    const description = Any.prototype.describe.call(this);
	
	    if (this._inner.ordereds.length) {
	        description.orderedItems = [];
	
	        for (let i = 0; i < this._inner.ordereds.length; ++i) {
	            description.orderedItems.push(this._inner.ordereds[i].describe());
	        }
	    }
	
	    if (this._inner.items.length) {
	        description.items = [];
	
	        for (let i = 0; i < this._inner.items.length; ++i) {
	            description.items.push(this._inner.items[i].describe());
	        }
	    }
	
	    return description;
	};
	
	
	internals.Array.prototype.items = function () {
	
	    const obj = this.clone();
	
	    Hoek.flatten(Array.prototype.slice.call(arguments)).forEach((type, index) => {
	
	        try {
	            type = Cast.schema(type);
	        }
	        catch (castErr) {
	            if (castErr.hasOwnProperty('path')) {
	                castErr.path = index + '.' + castErr.path;
	            }
	            else {
	                castErr.path = index;
	            }
	            castErr.message = castErr.message + '(' + castErr.path + ')';
	            throw castErr;
	        }
	
	        obj._inner.items.push(type);
	
	        if (type._flags.presence === 'required') {
	            obj._inner.requireds.push(type);
	        }
	        else if (type._flags.presence === 'forbidden') {
	            obj._inner.exclusions.push(type.optional());
	        }
	        else {
	            obj._inner.inclusions.push(type);
	        }
	    });
	
	    return obj;
	};
	
	
	internals.Array.prototype.ordered = function () {
	
	    const obj = this.clone();
	
	    Hoek.flatten(Array.prototype.slice.call(arguments)).forEach((type, index) => {
	
	        try {
	            type = Cast.schema(type);
	        }
	        catch (castErr) {
	            if (castErr.hasOwnProperty('path')) {
	                castErr.path = index + '.' + castErr.path;
	            }
	            else {
	                castErr.path = index;
	            }
	            castErr.message = castErr.message + '(' + castErr.path + ')';
	            throw castErr;
	        }
	        obj._inner.ordereds.push(type);
	    });
	
	    return obj;
	};
	
	
	internals.Array.prototype.min = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('min', limit, (value, state, options) => {
	
	        if (value.length >= limit) {
	            return null;
	        }
	
	        return this.createError('array.min', { limit, value }, state, options);
	    });
	};
	
	
	internals.Array.prototype.max = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('max', limit, (value, state, options) => {
	
	        if (value.length <= limit) {
	            return null;
	        }
	
	        return this.createError('array.max', { limit, value }, state, options);
	    });
	};
	
	
	internals.Array.prototype.length = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('length', limit, (value, state, options) => {
	
	        if (value.length === limit) {
	            return null;
	        }
	
	        return this.createError('array.length', { limit, value }, state, options);
	    });
	};
	
	
	internals.Array.prototype.unique = function () {
	
	    return this._test('unique', undefined, (value, state, options) => {
	
	        const found = {
	            string: {},
	            number: {},
	            undefined: {},
	            boolean: {},
	            object: [],
	            function: []
	        };
	
	        for (let i = 0; i < value.length; ++i) {
	            const item = value[i];
	            const type = typeof item;
	            const records = found[type];
	
	            // All available types are supported, so it's not possible to reach 100% coverage without ignoring this line.
	            // I still want to keep the test for future js versions with new types (eg. Symbol).
	            if (/* $lab:coverage:off$ */ records /* $lab:coverage:on$ */) {
	                if (Array.isArray(records)) {
	                    for (let j = 0; j < records.length; ++j) {
	                        if (Hoek.deepEqual(records[j], item)) {
	                            return this.createError('array.unique', { pos: i, value: item }, state, options);
	                        }
	                    }
	
	                    records.push(item);
	                }
	                else {
	                    if (records[item]) {
	                        return this.createError('array.unique', { pos: i, value: item }, state, options);
	                    }
	
	                    records[item] = true;
	                }
	            }
	        }
	
	        return null;
	    });
	};
	
	
	internals.Array.prototype.sparse = function (enabled) {
	
	    const obj = this.clone();
	    obj._flags.sparse = enabled === undefined ? true : !!enabled;
	    return obj;
	};
	
	
	internals.Array.prototype.single = function (enabled) {
	
	    const obj = this.clone();
	    obj._flags.single = enabled === undefined ? true : !!enabled;
	    return obj;
	};
	
	
	module.exports = new internals.Array();


/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Any = __webpack_require__(2);
	const Hoek = __webpack_require__(1);
	
	
	// Declare internals
	
	const internals = {};
	
	
	internals.Binary = function () {
	
	    Any.call(this);
	    this._type = 'binary';
	};
	
	Hoek.inherits(internals.Binary, Any);
	
	
	internals.Binary.prototype._base = function (value, state, options) {
	
	    const result = {
	        value
	    };
	
	    if (typeof value === 'string' &&
	        options.convert) {
	
	        try {
	            const converted = new Buffer(value, this._flags.encoding);
	            result.value = converted;
	        }
	        catch (e) { }
	    }
	
	    result.errors = Buffer.isBuffer(result.value) ? null : this.createError('binary.base', null, state, options);
	    return result;
	};
	
	
	internals.Binary.prototype.encoding = function (encoding) {
	
	    Hoek.assert(Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);
	
	    const obj = this.clone();
	    obj._flags.encoding = encoding;
	    return obj;
	};
	
	
	internals.Binary.prototype.min = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('min', limit, (value, state, options) => {
	
	        if (value.length >= limit) {
	            return null;
	        }
	
	        return this.createError('binary.min', { limit, value }, state, options);
	    });
	};
	
	
	internals.Binary.prototype.max = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('max', limit, (value, state, options) => {
	
	        if (value.length <= limit) {
	            return null;
	        }
	
	        return this.createError('binary.max', { limit, value }, state, options);
	    });
	};
	
	
	internals.Binary.prototype.length = function (limit) {
	
	    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');
	
	    return this._test('length', limit, (value, state, options) => {
	
	        if (value.length === limit) {
	            return null;
	        }
	
	        return this.createError('binary.length', { limit, value }, state, options);
	    });
	};
	
	
	module.exports = new internals.Binary();


/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Hoek = __webpack_require__(1);
	const Language = __webpack_require__(147);
	
	
	// Declare internals
	
	const internals = {};
	
	internals.stringify = function (value, wrapArrays) {
	
	    const type = typeof value;
	
	    if (value === null) {
	        return 'null';
	    }
	
	    if (type === 'string') {
	        return value;
	    }
	
	    if (value instanceof internals.Err || type === 'function') {
	        return value.toString();
	    }
	
	    if (type === 'object') {
	        if (Array.isArray(value)) {
	            let partial = '';
	
	            for (let i = 0; i < value.length; ++i) {
	                partial = partial + (partial.length ? ', ' : '') + internals.stringify(value[i], wrapArrays);
	            }
	
	            return wrapArrays ? '[' + partial + ']' : partial;
	        }
	
	        return value.toString();
	    }
	
	    return JSON.stringify(value);
	};
	
	internals.Err = function (type, context, state, options) {
	
	    this.isJoi = true;
	    this.type = type;
	    this.context = context || {};
	    this.context.key = state.key;
	    this.path = state.path;
	    this.options = options;
	};
	
	
	internals.Err.prototype.toString = function () {
	
	    const localized = this.options.language;
	
	    if (localized.label) {
	        this.context.key = localized.label;
	    }
	    else if (this.context.key === '' || this.context.key === null) {
	        this.context.key = localized.root || Language.errors.root;
	    }
	
	    let format = Hoek.reach(localized, this.type) || Hoek.reach(Language.errors, this.type);
	    const hasKey = /\{\{\!?key\}\}/.test(format);
	    const skipKey = format.length > 2 && format[0] === '!' && format[1] === '!';
	
	    if (skipKey) {
	        format = format.slice(2);
	    }
	
	    if (!hasKey && !skipKey) {
	        format = (Hoek.reach(localized, 'key') || Hoek.reach(Language.errors, 'key')) + format;
	    }
	
	    let wrapArrays = Hoek.reach(localized, 'messages.wrapArrays');
	    if (typeof wrapArrays !== 'boolean') {
	        wrapArrays = Language.errors.messages.wrapArrays;
	    }
	
	    const message = format.replace(/\{\{(\!?)([^}]+)\}\}/g, ($0, isSecure, name) => {
	
	        const value = Hoek.reach(this.context, name);
	        const normalized = internals.stringify(value, wrapArrays);
	        return (isSecure ? Hoek.escapeHtml(normalized) : normalized);
	    });
	
	    return message;
	};
	
	
	exports.create = function (type, context, state, options) {
	
	    return new internals.Err(type, context, state, options);
	};
	
	
	exports.process = function (errors, object) {
	
	    if (!errors || !errors.length) {
	        return null;
	    }
	
	    // Construct error
	
	    let message = '';
	    const details = [];
	
	    const processErrors = function (localErrors, parent) {
	
	        for (let i = 0; i < localErrors.length; ++i) {
	            const item = localErrors[i];
	
	            if (item.options.error) {
	                return item.options.error;
	            }
	
	            let itemMessage;
	            if (parent === undefined) {
	                itemMessage = item.toString();
	                message = message + (message ? '. ' : '') + itemMessage;
	            }
	
	            // Do not push intermediate errors, we're only interested in leafs
	
	            if (item.context.reason && item.context.reason.length) {
	                const override = processErrors(item.context.reason, item.path);
	                if (override) {
	                    return override;
	                }
	            }
	            else {
	                details.push({
	                    message: itemMessage || item.toString(),
	                    path: internals.getPath(item),
	                    type: item.type,
	                    context: item.context
	                });
	            }
	        }
	    };
	
	    const override = processErrors(errors);
	    if (override) {
	        return override;
	    }
	
	    const error = new Error(message);
	    error.isJoi = true;
	    error.name = 'ValidationError';
	    error.details = details;
	    error._object = object;
	    error.annotate = internals.annotate;
	    return error;
	};
	
	
	internals.getPath = function (item) {
	
	    return item.path || item.context.key;
	};
	
	
	// Inspired by json-stringify-safe
	internals.safeStringify = function (obj, spaces) {
	
	    return JSON.stringify(obj, internals.serializer(), spaces);
	};
	
	internals.serializer = function () {
	
	    const keys = [];
	    const stack = [];
	
	    const cycleReplacer = (key, value) => {
	
	        if (stack[0] === value) {
	            return '[Circular ~]';
	        }
	
	        return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
	    };
	
	    return function (key, value) {
	
	        if (stack.length > 0) {
	            const thisPos = stack.indexOf(this);
	            if (~thisPos) {
	                stack.length = thisPos + 1;
	                keys.length = thisPos + 1;
	                keys[thisPos] = key;
	            }
	            else {
	                stack.push(this);
	                keys.push(key);
	            }
	
	            if (~stack.indexOf(value)) {
	                value = cycleReplacer.call(this, key, value);
	            }
	        }
	        else {
	            stack.push(value);
	        }
	
	        if (Array.isArray(value) && value.placeholders) {
	            const placeholders = value.placeholders;
	            const arrWithPlaceholders = [];
	            for (let i = 0; i < value.length; ++i) {
	                if (placeholders[i]) {
	                    arrWithPlaceholders.push(placeholders[i]);
	                }
	                arrWithPlaceholders.push(value[i]);
	            }
	
	            value = arrWithPlaceholders;
	        }
	
	        if (value === Infinity || value === -Infinity || Number.isNaN(value) ||
	            typeof value === 'function' || typeof value === 'symbol') {
	            return '[' + value.toString() + ']';
	        }
	
	        return value;
	    };
	};
	
	
	internals.annotate = function () {
	
	    if (typeof this._object !== 'object') {
	        return this.details[0].message;
	    }
	
	    const obj = Hoek.clone(this._object || {});
	
	    const lookup = {};
	    for (let i = this.details.length - 1; i >= 0; --i) {        // Reverse order to process deepest child first
	        const pos = this.details.length - i;
	        const error = this.details[i];
	        const path = error.path.split('.');
	        let ref = obj;
	        for (let j = 0; j < path.length && ref; ++j) {
	            const seg = path[j];
	            if (j + 1 < path.length) {
	                ref = ref[seg];
	            }
	            else {
	                const value = ref[seg];
	                if (Array.isArray(ref)) {
	                    const arrayLabel = '_$idx$_' + (i + 1) + '_$end$_';
	                    if (!ref.placeholders) {
	                        ref.placeholders = {};
	                    }
	
	                    if (ref.placeholders[seg]) {
	                        ref.placeholders[seg] = ref.placeholders[seg].replace('_$end$_', ', ' + (i + 1) + '_$end$_');
	                    }
	                    else {
	                        ref.placeholders[seg] = arrayLabel;
	                    }
	                }
	                else {
	                    if (value !== undefined) {
	                        delete ref[seg];
	                        const objectLabel = seg + '_$key$_' + pos + '_$end$_';
	                        ref[objectLabel] = value;
	                        lookup[error.path] = objectLabel;
	                    }
	                    else if (lookup[error.path]) {
	                        const replacement = lookup[error.path];
	                        const appended = replacement.replace('_$end$_', ', ' + pos + '_$end$_');
	                        ref[appended] = ref[replacement];
	                        lookup[error.path] = appended;
	                        delete ref[replacement];
	                    }
	                    else {
	                        ref['_$miss$_' + seg + '|' + pos + '_$end$_'] = '__missing__';
	                    }
	                }
	            }
	        }
	    }
	
	    const replacers = {
	        key: /_\$key\$_([, \d]+)_\$end\$_\"/g,
	        missing: /\"_\$miss\$_([^\|]+)\|(\d+)_\$end\$_\"\: \"__missing__\"/g,
	        arrayIndex: /\s*\"_\$idx\$_([, \d]+)_\$end\$_\",?\n(.*)/g,
	        specials: /"\[(NaN|Symbol.*|-?Infinity|function.*|\(.*)\]"/g
	    };
	
	    let message = internals.safeStringify(obj, 2)
	        .replace(replacers.key, ($0, $1) => '" \u001b[31m[' + $1 + ']\u001b[0m')
	        .replace(replacers.missing, ($0, $1, $2) => '\u001b[41m"' + $1 + '"\u001b[0m\u001b[31m [' + $2 + ']: -- missing --\u001b[0m')
	        .replace(replacers.arrayIndex, ($0, $1, $2) => '\n' + $2 + ' \u001b[31m[' + $1 + ']\u001b[0m')
	        .replace(replacers.specials, ($0, $1) => $1);
	
	    message = message + '\n\u001b[31m';
	
	    for (let i = 0; i < this.details.length; ++i) {
	        message = message + '\n[' + (i + 1) + '] ' + this.details[i].message;
	    }
	
	    message = message + '\u001b[0m';
	
	    return message;
	};


/***/ },
/* 147 */
/***/ function(module, exports) {

	'use strict';
	
	// Load modules
	
	
	// Declare internals
	
	const internals = {};
	
	
	exports.errors = {
	    root: 'value',
	    key: '"{{!key}}" ',
	    messages: {
	        wrapArrays: true
	    },
	    any: {
	        unknown: 'is not allowed',
	        invalid: 'contains an invalid value',
	        empty: 'is not allowed to be empty',
	        required: 'is required',
	        allowOnly: 'must be one of {{valids}}',
	        default: 'threw an error when running default method'
	    },
	    alternatives: {
	        base: 'not matching any of the allowed alternatives'
	    },
	    array: {
	        base: 'must be an array',
	        includes: 'at position {{pos}} does not match any of the allowed types',
	        includesSingle: 'single value of "{{!key}}" does not match any of the allowed types',
	        includesOne: 'at position {{pos}} fails because {{reason}}',
	        includesOneSingle: 'single value of "{{!key}}" fails because {{reason}}',
	        includesRequiredUnknowns: 'does not contain {{unknownMisses}} required value(s)',
	        includesRequiredKnowns: 'does not contain {{knownMisses}}',
	        includesRequiredBoth: 'does not contain {{knownMisses}} and {{unknownMisses}} other required value(s)',
	        excludes: 'at position {{pos}} contains an excluded value',
	        excludesSingle: 'single value of "{{!key}}" contains an excluded value',
	        min: 'must contain at least {{limit}} items',
	        max: 'must contain less than or equal to {{limit}} items',
	        length: 'must contain {{limit}} items',
	        ordered: 'at position {{pos}} fails because {{reason}}',
	        orderedLength: 'at position {{pos}} fails because array must contain at most {{limit}} items',
	        sparse: 'must not be a sparse array',
	        unique: 'position {{pos}} contains a duplicate value'
	    },
	    boolean: {
	        base: 'must be a boolean'
	    },
	    binary: {
	        base: 'must be a buffer or a string',
	        min: 'must be at least {{limit}} bytes',
	        max: 'must be less than or equal to {{limit}} bytes',
	        length: 'must be {{limit}} bytes'
	    },
	    date: {
	        base: 'must be a number of milliseconds or valid date string',
	        strict: 'must be a valid date',
	        min: 'must be larger than or equal to "{{limit}}"',
	        max: 'must be less than or equal to "{{limit}}"',
	        isoDate: 'must be a valid ISO 8601 date',
	        timestamp: {
	            javascript: 'must be a valid timestamp or number of milliseconds',
	            unix: 'must be a valid timestamp or number of seconds'
	        },
	        ref: 'references "{{ref}}" which is not a date'
	    },
	    function: {
	        base: 'must be a Function',
	        arity: 'must have an arity of {{n}}',
	        minArity: 'must have an arity greater or equal to {{n}}',
	        maxArity: 'must have an arity lesser or equal to {{n}}'
	    },
	    lazy: {
	        base: '!!schema error: lazy schema must be set',
	        schema: '!!schema error: lazy schema function must return a schema'
	    },
	    object: {
	        base: 'must be an object',
	        child: 'child "{{!key}}" fails because {{reason}}',
	        min: 'must have at least {{limit}} children',
	        max: 'must have less than or equal to {{limit}} children',
	        length: 'must have {{limit}} children',
	        allowUnknown: 'is not allowed',
	        with: 'missing required peer "{{peer}}"',
	        without: 'conflict with forbidden peer "{{peer}}"',
	        missing: 'must contain at least one of {{peers}}',
	        xor: 'contains a conflict between exclusive peers {{peers}}',
	        or: 'must contain at least one of {{peers}}',
	        and: 'contains {{present}} without its required peers {{missing}}',
	        nand: '!!"{{main}}" must not exist simultaneously with {{peers}}',
	        assert: '!!"{{ref}}" validation failed because "{{ref}}" failed to {{message}}',
	        rename: {
	            multiple: 'cannot rename child "{{from}}" because multiple renames are disabled and another key was already renamed to "{{to}}"',
	            override: 'cannot rename child "{{from}}" because override is disabled and target "{{to}}" exists'
	        },
	        type: 'must be an instance of "{{type}}"'
	    },
	    number: {
	        base: 'must be a number',
	        min: 'must be larger than or equal to {{limit}}',
	        max: 'must be less than or equal to {{limit}}',
	        less: 'must be less than {{limit}}',
	        greater: 'must be greater than {{limit}}',
	        float: 'must be a float or double',
	        integer: 'must be an integer',
	        negative: 'must be a negative number',
	        positive: 'must be a positive number',
	        precision: 'must have no more than {{limit}} decimal places',
	        ref: 'references "{{ref}}" which is not a number',
	        multiple: 'must be a multiple of {{multiple}}'
	    },
	    string: {
	        base: 'must be a string',
	        min: 'length must be at least {{limit}} characters long',
	        max: 'length must be less than or equal to {{limit}} characters long',
	        length: 'length must be {{limit}} characters long',
	        alphanum: 'must only contain alpha-numeric characters',
	        token: 'must only contain alpha-numeric and underscore characters',
	        regex: {
	            base: 'with value "{{!value}}" fails to match the required pattern: {{pattern}}',
	            name: 'with value "{{!value}}" fails to match the {{name}} pattern'
	        },
	        email: 'must be a valid email',
	        uri: 'must be a valid uri',
	        uriCustomScheme: 'must be a valid uri with a scheme matching the {{scheme}} pattern',
	        isoDate: 'must be a valid ISO 8601 date',
	        guid: 'must be a valid GUID',
	        hex: 'must only contain hexadecimal characters',
	        hostname: 'must be a valid hostname',
	        lowercase: 'must only contain lowercase characters',
	        uppercase: 'must only contain uppercase characters',
	        trim: 'must not have leading or trailing whitespace',
	        creditCard: 'must be a credit card',
	        ref: 'references "{{ref}}" which is not a number',
	        ip: 'must be a valid ip address with a {{cidr}} CIDR',
	        ipVersion: 'must be a valid ip address of one of the following versions {{version}} with a {{cidr}} CIDR'
	    }
	};


/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Any = __webpack_require__(2);
	const Hoek = __webpack_require__(1);
	
	
	// Declare internals
	
	const internals = {};
	
	
	internals.Lazy = function () {
	
	    Any.call(this);
	    this._type = 'lazy';
	};
	
	Hoek.inherits(internals.Lazy, Any);
	
	internals.Lazy.prototype._base = function (value, state, options) {
	
	    const result = { value };
	    const lazy = this._flags.lazy;
	
	    if (!lazy) {
	        result.errors = this.createError('lazy.base', null, state, options);
	        return result;
	    }
	
	    const schema = lazy();
	
	    if (!(schema instanceof Any)) {
	        result.errors = this.createError('lazy.schema', null, state, options);
	        return result;
	    }
	
	    return schema._validate(value, state, options);
	};
	
	internals.Lazy.prototype.set = function (fn) {
	
	    Hoek.assert(typeof fn === 'function', 'You must provide a function as first argument');
	
	    const obj = this.clone();
	    obj._flags.lazy = fn;
	    return obj;
	};
	
	module.exports = new internals.Lazy();


/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Joi = __webpack_require__(65);
	
	
	// Declare internals
	
	const internals = {};
	
	exports.options = Joi.object({
	    abortEarly: Joi.boolean(),
	    convert: Joi.boolean(),
	    allowUnknown: Joi.boolean(),
	    skipFunctions: Joi.boolean(),
	    stripUnknown: [Joi.boolean(), Joi.object({ arrays: Joi.boolean(), objects: Joi.boolean() }).or('arrays', 'objects')],
	    language: Joi.object(),
	    presence: Joi.string().only('required', 'optional', 'forbidden', 'ignore'),
	    raw: Joi.boolean(),
	    context: Joi.object(),
	    strip: Joi.boolean(),
	    noDefaults: Joi.boolean(),
	    error: Joi.object()
	}).strict();


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const RFC3986 = __webpack_require__(69);
	
	
	// Declare internals
	
	const internals = {
	    Ip: {
	        cidrs: {
	            required: '\\/(?:' + RFC3986.cidr + ')',
	            optional: '(?:\\/(?:' + RFC3986.cidr + '))?',
	            forbidden: ''
	        },
	        versions: {
	            ipv4: RFC3986.IPv4address,
	            ipv6: RFC3986.IPv6address,
	            ipvfuture: RFC3986.IPvFuture
	        }
	    }
	};
	
	
	internals.Ip.createIpRegex = function (versions, cidr) {
	
	    let regex;
	    for (let i = 0; i < versions.length; ++i) {
	        const version = versions[i];
	        if (!regex) {
	            regex = '^(?:' + internals.Ip.versions[version];
	        }
	        regex = regex + '|' + internals.Ip.versions[version];
	    }
	
	    return new RegExp(regex + ')' + internals.Ip.cidrs[cidr] + '$');
	};
	
	module.exports = internals.Ip;


/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load Modules
	
	const RFC3986 = __webpack_require__(69);
	
	
	// Declare internals
	
	const internals = {
	    Uri: {
	        createUriRegex: function (optionalScheme, allowRelative) {
	
	            let scheme = RFC3986.scheme;
	
	            // If we were passed a scheme, use it instead of the generic one
	            if (optionalScheme) {
	
	                // Have to put this in a non-capturing group to handle the OR statements
	                scheme = '(?:' + optionalScheme + ')';
	            }
	
	            const withScheme = '(?:' + scheme + ':' + RFC3986.hierPart + ')';
	            const prefix = allowRelative ? '(?:' + withScheme + '|' + RFC3986.relativeRef + ')' : withScheme;
	
	            /**
	             * URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
	             *
	             * OR
	             *
	             * relative-ref = relative-part [ "?" query ] [ "#" fragment ]
	             */
	            return new RegExp('^' + prefix + '(?:\\?' + RFC3986.query + ')?' + '(?:#' + RFC3986.fragment + ')?$');
	        }
	    }
	};
	
	
	module.exports = internals.Uri;


/***/ },
/* 152 */
/***/ function(module, exports) {

	module.exports = {
		"_args": [
			[
				"nodemailer-stub-transport@^1.0.0",
				"/Users/sericaia/Documents/git/authzero/auth0-user-invite-extension"
			]
		],
		"_from": "nodemailer-stub-transport@>=1.0.0 <2.0.0",
		"_id": "nodemailer-stub-transport@1.0.0",
		"_inCache": true,
		"_installable": true,
		"_location": "/nodemailer-stub-transport",
		"_nodeVersion": "0.12.0",
		"_npmUser": {
			"email": "andris@node.ee",
			"name": "andris"
		},
		"_npmVersion": "2.5.1",
		"_phantomChildren": {},
		"_requested": {
			"name": "nodemailer-stub-transport",
			"raw": "nodemailer-stub-transport@^1.0.0",
			"rawSpec": "^1.0.0",
			"scope": null,
			"spec": ">=1.0.0 <2.0.0",
			"type": "range"
		},
		"_requiredBy": [
			"#DEV:/"
		],
		"_resolved": "https://registry.npmjs.org/nodemailer-stub-transport/-/nodemailer-stub-transport-1.0.0.tgz",
		"_shasum": "abd30ddb9f65e4479679a034e067fede277119ac",
		"_shrinkwrap": null,
		"_spec": "nodemailer-stub-transport@^1.0.0",
		"_where": "/Users/sericaia/Documents/git/authzero/auth0-user-invite-extension",
		"author": {
			"name": "Andris Reinman"
		},
		"bugs": {
			"url": "https://github.com/andris9/nodemailer-stub-transport/issues"
		},
		"dependencies": {},
		"description": "Stub transport for Nodemailer",
		"devDependencies": {
			"chai": "~2.2.0",
			"grunt": "~0.4.5",
			"grunt-contrib-jshint": "~0.11.1",
			"grunt-mocha-test": "~0.12.7",
			"sinon": "^1.14.1"
		},
		"directories": {},
		"dist": {
			"shasum": "abd30ddb9f65e4479679a034e067fede277119ac",
			"tarball": "https://registry.npmjs.org/nodemailer-stub-transport/-/nodemailer-stub-transport-1.0.0.tgz"
		},
		"gitHead": "777f87428e7d3a6d7c1bdf420efb0952f74cc80a",
		"homepage": "http://github.com/andris9/nodemailer-stub-transport",
		"keywords": [
			"Stub",
			"Nodemailer"
		],
		"license": "MIT",
		"main": "src/stub-transport.js",
		"maintainers": [
			{
				"email": "andris@node.ee",
				"name": "andris"
			}
		],
		"name": "nodemailer-stub-transport",
		"optionalDependencies": {},
		"readme": "ERROR: No README data found!",
		"repository": {
			"type": "git",
			"url": "git://github.com/andris9/nodemailer-stub-transport.git"
		},
		"scripts": {
			"test": "grunt"
		},
		"version": "1.0.0"
	};

/***/ },
/* 153 */
/***/ function(module, exports) {

	module.exports = {
		"title": "Invite Only Extension",
		"name": "auth0-user-invite-extension",
		"version": "1.0.0",
		"author": "auth0",
		"description": "This extension gives Auth0 customers the possibility to invite users to their connections.",
		"type": "application",
		"logoUrl": "https://cdn.auth0.com/extensions/auth0-user-invite-extension/assets/logo.svg",
		"initialUrlPath": "/login",
		"uninstallConfirmMessage": "Do you really want to uninstall this extension? Doing so will stop you from being able to invite users to your connections.",
		"repository": "https://github.com/auth0-extensions/auth0-user-invite-extension",
		"keywords": [
			"auth0",
			"extension"
		],
		"auth0": {
			"createClient": true,
			"onUninstallPath": "/.extensions/on-uninstall",
			"scopes": "read:connections read:users create:users update:users"
		},
		"secrets": {}
	};

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	const LRU        = __webpack_require__(75);
	const _          = __webpack_require__(21);
	const lru_params = [ 'max', 'maxAge', 'length', 'dispose', 'stale' ];
	
	module.exports = function (options) {
	  const cache      = new LRU(_.pick(options, lru_params));
	  const load       = options.load;
	  const hash       = options.hash;
	  const bypass     = options.bypass;
	  const itemMaxAge = options.itemMaxAge;
	  const loading    = new Map();
	
	  if (options.disable) {
	    return load;
	  }
	
	  const result = function () {
	    const args       = _.toArray(arguments);
	    const parameters = args.slice(0, -1);
	    const callback   = args.slice(-1).pop();
	    const self       = this;
	
	    var key;
	
	    if (bypass && bypass.apply(self, parameters)) {
	      return load.apply(self, args);
	    }
	
	    if (parameters.length === 0 && !hash) {
	      //the load function only receives callback.
	      key = '_';
	    } else {
	      key = hash.apply(self, parameters);
	    }
	
	    var fromCache = cache.get(key);
	
	    if (fromCache) {
	      return callback.apply(null, [null].concat(fromCache));
	    }
	
	    if (!loading.get(key)) {
	      loading.set(key, []);
	
	      load.apply(self, parameters.concat(function (err) {
	        const args = _.toArray(arguments);
	
	        //we store the result only if the load didn't fail.
	        if (!err) {
	          const result = args.slice(1);
	          if (itemMaxAge) {
	            cache.set(key, result, itemMaxAge.apply(self, parameters.concat(result)));
	          } else {
	            cache.set(key, result);
	          }
	        }
	
	        //immediately call every other callback waiting
	        loading.get(key).forEach(function (callback) {
	          callback.apply(null, args);
	        });
	
	        loading.delete(key);
	        /////////
	
	        callback.apply(null, args);
	      }));
	    } else {
	      loading.get(key).push(callback);
	    }
	  };
	
	  result.keys = cache.keys.bind(cache);
	
	  return result;
	};
	
	
	module.exports.sync = function (options) {
	  const cache = new LRU(_.pick(options, lru_params));
	  const load = options.load;
	  const hash = options.hash;
	  const disable = options.disable;
	  const bypass = options.bypass;
	  const self = this;
	  const itemMaxAge = options.itemMaxAge;
	
	  if (disable) {
	    return load;
	  }
	
	  const result = function () {
	    var args = _.toArray(arguments);
	
	    if (bypass && bypass.apply(self, arguments)) {
	      return load.apply(self, arguments);
	    }
	
	    var key = hash.apply(self, args);
	
	    var fromCache = cache.get(key);
	
	    if (fromCache) {
	      return fromCache;
	    }
	
	    const result = load.apply(self, args);
	    if (itemMaxAge) {
	      cache.set(key, result, itemMaxAge.apply(self, args.concat([ result ])));
	    } else {
	      cache.set(key, result);
	    }
	
	    return result;
	  };
	
	  result.keys = cache.keys.bind(cache);
	
	  return result;
	};


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var packageData = __webpack_require__(152);
	var EventEmitter = __webpack_require__(164).EventEmitter;
	var util = __webpack_require__(77);
	
	module.exports = function(options) {
	    return new StubTransport(options);
	};
	
	function StubTransport(options) {
	    EventEmitter.call(this);
	    this.options = options || {};
	    this.name = 'Stub';
	    this.version = packageData.version;
	}
	util.inherits(StubTransport, EventEmitter);
	
	StubTransport.prototype.send = function(mail, callback) {
	
	    if (this.options.error) {
	        setImmediate(function() {
	            callback(new Error(this.options.error));
	        }.bind(this));
	        return;
	    }
	
	    var message = mail.message.createReadStream();
	    var chunks = [];
	    var chunklen = 0;
	    var envelope = mail.data.envelope || mail.message.getEnvelope();
	
	    this._log('info', 'envelope', JSON.stringify(envelope));
	    this.emit('envelope', envelope);
	
	    message.on('data', function(chunk) {
	        chunks.push(chunk);
	        chunklen += chunk.length;
	
	        this._log('verbose', 'message', chunk.toString());
	        this.emit('data', chunk.toString());
	    }.bind(this));
	
	    message.on('end', function() {
	        setImmediate(function() {
	            var messageId = (mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
	            var response = Buffer.concat(chunks, chunklen);
	            var info = {
	                envelope: mail.data.envelope || mail.message.getEnvelope(),
	                messageId: messageId,
	                response: response
	            };
	            this._log('info', 'end', 'Processed <%s> (%sB)', messageId, response.length);
	            this.emit('end', info);
	            callback(null, info);
	        }.bind(this));
	    }.bind(this));
	};
	
	/**
	 * Log emitter
	 * @param {String} level Log level
	 * @param {String} type Optional type of the log message
	 * @param {String} message Message to log
	 */
	StubTransport.prototype._log = function( /* level, type, message */ ) {
	    var args = Array.prototype.slice.call(arguments);
	    var level = (args.shift() || 'INFO').toUpperCase();
	    var type = (args.shift() || '');
	    var message = util.format.apply(util, args);
	
	    this.emit('log', {
	        name: packageData.name,
	        version: packageData.version,
	        level: level,
	        type: type,
	        message: message
	    });
	};

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Load modules
	
	const Hoek = __webpack_require__(1);
	
	
	// Declare internals
	
	const internals = {};
	
	
	exports = module.exports = internals.Topo = function () {
	
	    this._items = [];
	    this.nodes = [];
	};
	
	
	internals.Topo.prototype.add = function (nodes, options) {
	
	    options = options || {};
	
	    // Validate rules
	
	    const before = [].concat(options.before || []);
	    const after = [].concat(options.after || []);
	    const group = options.group || '?';
	    const sort = options.sort || 0;                   // Used for merging only
	
	    Hoek.assert(before.indexOf(group) === -1, 'Item cannot come before itself:', group);
	    Hoek.assert(before.indexOf('?') === -1, 'Item cannot come before unassociated items');
	    Hoek.assert(after.indexOf(group) === -1, 'Item cannot come after itself:', group);
	    Hoek.assert(after.indexOf('?') === -1, 'Item cannot come after unassociated items');
	
	    ([].concat(nodes)).forEach((node, i) => {
	
	        const item = {
	            seq: this._items.length,
	            sort: sort,
	            before: before,
	            after: after,
	            group: group,
	            node: node
	        };
	
	        this._items.push(item);
	    });
	
	    // Insert event
	
	    const error = this._sort();
	    Hoek.assert(!error, 'item', (group !== '?' ? 'added into group ' + group : ''), 'created a dependencies error');
	
	    return this.nodes;
	};
	
	
	internals.Topo.prototype.merge = function (others) {
	
	    others = [].concat(others);
	    for (let i = 0; i < others.length; ++i) {
	        const other = others[i];
	        if (other) {
	            for (let j = 0; j < other._items.length; ++j) {
	                const item = Hoek.shallow(other._items[j]);
	                this._items.push(item);
	            }
	        }
	    }
	
	    // Sort items
	
	    this._items.sort(internals.mergeSort);
	    for (let i = 0; i < this._items.length; ++i) {
	        this._items[i].seq = i;
	    }
	
	    const error = this._sort();
	    Hoek.assert(!error, 'merge created a dependencies error');
	
	    return this.nodes;
	};
	
	
	internals.mergeSort = function (a, b) {
	
	    return a.sort === b.sort ? 0 : (a.sort < b.sort ? -1 : 1);
	};
	
	
	internals.Topo.prototype._sort = function () {
	
	    // Construct graph
	
	    const graph = {};
	    const graphAfters = Object.create(null); // A prototype can bungle lookups w/ false positives
	    const groups = Object.create(null);
	
	    for (let i = 0; i < this._items.length; ++i) {
	        const item = this._items[i];
	        const seq = item.seq;                         // Unique across all items
	        const group = item.group;
	
	        // Determine Groups
	
	        groups[group] = groups[group] || [];
	        groups[group].push(seq);
	
	        // Build intermediary graph using 'before'
	
	        graph[seq] = item.before;
	
	        // Build second intermediary graph with 'after'
	
	        const after = item.after;
	        for (let j = 0; j < after.length; ++j) {
	            graphAfters[after[j]] = (graphAfters[after[j]] || []).concat(seq);
	        }
	    }
	
	    // Expand intermediary graph
	
	    let graphNodes = Object.keys(graph);
	    for (let i = 0; i < graphNodes.length; ++i) {
	        const node = graphNodes[i];
	        const expandedGroups = [];
	
	        const graphNodeItems = Object.keys(graph[node]);
	        for (let j = 0; j < graphNodeItems.length; ++j) {
	            const group = graph[node][graphNodeItems[j]];
	            groups[group] = groups[group] || [];
	
	            for (let k = 0; k < groups[group].length; ++k) {
	                expandedGroups.push(groups[group][k]);
	            }
	        }
	        graph[node] = expandedGroups;
	    }
	
	    // Merge intermediary graph using graphAfters into final graph
	
	    const afterNodes = Object.keys(graphAfters);
	    for (let i = 0; i < afterNodes.length; ++i) {
	        const group = afterNodes[i];
	
	        if (groups[group]) {
	            for (let j = 0; j < groups[group].length; ++j) {
	                const node = groups[group][j];
	                graph[node] = graph[node].concat(graphAfters[group]);
	            }
	        }
	    }
	
	    // Compile ancestors
	
	    let children;
	    const ancestors = {};
	    graphNodes = Object.keys(graph);
	    for (let i = 0; i < graphNodes.length; ++i) {
	        const node = graphNodes[i];
	        children = graph[node];
	
	        for (let j = 0; j < children.length; ++j) {
	            ancestors[children[j]] = (ancestors[children[j]] || []).concat(node);
	        }
	    }
	
	    // Topo sort
	
	    const visited = {};
	    const sorted = [];
	
	    for (let i = 0; i < this._items.length; ++i) {
	        let next = i;
	
	        if (ancestors[i]) {
	            next = null;
	            for (let j = 0; j < this._items.length; ++j) {
	                if (visited[j] === true) {
	                    continue;
	                }
	
	                if (!ancestors[j]) {
	                    ancestors[j] = [];
	                }
	
	                const shouldSeeCount = ancestors[j].length;
	                let seenCount = 0;
	                for (let k = 0; k < shouldSeeCount; ++k) {
	                    if (sorted.indexOf(ancestors[j][k]) >= 0) {
	                        ++seenCount;
	                    }
	                }
	
	                if (seenCount === shouldSeeCount) {
	                    next = j;
	                    break;
	                }
	            }
	        }
	
	        if (next !== null) {
	            next = next.toString();         // Normalize to string TODO: replace with seq
	            visited[next] = true;
	            sorted.push(next);
	        }
	    }
	
	    if (sorted.length !== this._items.length) {
	        return new Error('Invalid dependencies');
	    }
	
	    const seqIndex = {};
	    for (let i = 0; i < this._items.length; ++i) {
	        const item = this._items[i];
	        seqIndex[item.seq] = item;
	    }
	
	    const sortedNodes = [];
	    this._items = sorted.map((value) => {
	
	        const sortedItem = seqIndex[value];
	        sortedNodes.push(sortedItem.node);
	        return sortedItem;
	    });
	
	    this.nodes = sortedNodes;
	};


/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	var rb = __webpack_require__(47).randomBytes;
	module.exports = function() {
	  return rb(16);
	};


/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php
	
	// Unique ID creation requires a high quality random # generator.  We feature
	// detect to determine the best RNG source, normalizing to a function that
	// returns 128-bits of randomness, since that's what's usually required
	var _rng = __webpack_require__(157);
	
	// Maps for number <-> hex string conversion
	var _byteToHex = [];
	var _hexToByte = {};
	for (var i = 0; i < 256; i++) {
	  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	  _hexToByte[_byteToHex[i]] = i;
	}
	
	// **`parse()` - Parse a UUID into it's component bytes**
	function parse(s, buf, offset) {
	  var i = (buf && offset) || 0, ii = 0;
	
	  buf = buf || [];
	  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	    if (ii < 16) { // Don't overflow!
	      buf[i + ii++] = _hexToByte[oct];
	    }
	  });
	
	  // Zero out remaining bytes if string was short
	  while (ii < 16) {
	    buf[i + ii++] = 0;
	  }
	
	  return buf;
	}
	
	// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	function unparse(buf, offset) {
	  var i = offset || 0, bth = _byteToHex;
	  return  bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}
	
	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html
	
	// random #'s we need to init node and clockseq
	var _seedBytes = _rng();
	
	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];
	
	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;
	
	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;
	
	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];
	
	  options = options || {};
	
	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;
	
	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();
	
	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;
	
	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
	
	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }
	
	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }
	
	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }
	
	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;
	
	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;
	
	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;
	
	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;
	
	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;
	
	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;
	
	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;
	
	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; n++) {
	    b[i + n] = node[n];
	  }
	
	  return buf ? buf : unparse(b);
	}
	
	// **`v4()` - Generate random UUID**
	
	// See https://github.com/broofa/node-uuid for API details
	function v4(options, buf, offset) {
	  // Deprecated - 'format' argument, as supported in v1.2
	  var i = buf && offset || 0;
	
	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};
	
	  var rnds = options.random || (options.rng || _rng)();
	
	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;
	
	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ii++) {
	      buf[i + ii] = rnds[ii];
	    }
	  }
	
	  return buf || unparse(rnds);
	}
	
	// Export public API
	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;
	uuid.parse = parse;
	uuid.unparse = unparse;
	
	module.exports = uuid;


/***/ },
/* 159 */
/***/ function(module, exports) {

	module.exports = require("auth0");

/***/ },
/* 160 */
/***/ function(module, exports) {

	module.exports = require("auth0@2.0.0");

/***/ },
/* 161 */
/***/ function(module, exports) {

	module.exports = require("csv");

/***/ },
/* 162 */
/***/ function(module, exports) {

	module.exports = require("dns");

/***/ },
/* 163 */
/***/ function(module, exports) {

	module.exports = require("each-async");

/***/ },
/* 164 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ },
/* 165 */
/***/ function(module, exports) {

	module.exports = require("express-jwt");

/***/ },
/* 166 */
/***/ function(module, exports) {

	module.exports = require("jade");

/***/ },
/* 167 */
/***/ function(module, exports) {

	module.exports = require("moment");

/***/ },
/* 168 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 169 */
/***/ function(module, exports) {

	module.exports = require("ms");

/***/ },
/* 170 */
/***/ function(module, exports) {

	module.exports = require("net");

/***/ },
/* 171 */
/***/ function(module, exports) {

	module.exports = require("nodemailer");

/***/ },
/* 172 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 173 */
/***/ function(module, exports) {

	module.exports = require("request-promise");

/***/ },
/* 174 */
/***/ function(module, exports) {

	module.exports = require("superagent");

/***/ },
/* 175 */
/***/ function(module, exports) {

	module.exports = require("webtask-tools");

/***/ },
/* 176 */
/***/ function(module, exports) {

	module.exports = require("winston");

/***/ }
/******/ ]);