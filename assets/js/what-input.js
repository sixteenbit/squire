/**
 * what-input - A global utility for tracking the current input method (mouse, keyboard or touch).
 * @version v5.2.9
 * @link https://github.com/ten1seven/what-input
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("whatInput", [], factory);
	else if(typeof exports === 'object')
		exports["whatInput"] = factory();
	else
		root["whatInput"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = function () {
	  /*
	   * bail out if there is no document or window
	   * (i.e. in a node/non-DOM environment)
	   *
	   * Return a stubbed API instead
	   */
	  if (typeof document === 'undefined' || typeof window === 'undefined') {
	    return {
	      // always return "initial" because no interaction will ever be detected
	      ask: function ask() {
	        return 'initial';
	      },

	      // always return null
	      element: function element() {
	        return null;
	      },

	      // no-op
	      ignoreKeys: function ignoreKeys() {},

	      // no-op
	      specificKeys: function specificKeys() {},

	      // no-op
	      registerOnChange: function registerOnChange() {},

	      // no-op
	      unRegisterOnChange: function unRegisterOnChange() {}
	    };
	  }

	  /*
	   * variables
	   */

	  // cache document.documentElement
	  var docElem = document.documentElement;

	  // currently focused dom element
	  var currentElement = null;

	  // last used input type
	  var currentInput = 'initial';

	  // last used input intent
	  var currentIntent = currentInput;

	  // UNIX timestamp of current event
	  var currentTimestamp = Date.now();

	  // check for a `data-whatpersist` attribute on either the `html` or `body` elements, defaults to `true`
	  var shouldPersist = 'false';

	  // form input types
	  var formInputs = ['button', 'input', 'select', 'textarea'];

	  // empty array for holding callback functions
	  var functionList = [];

	  // list of modifier keys commonly used with the mouse and
	  // can be safely ignored to prevent false keyboard detection
	  var ignoreMap = [16, // shift
	  17, // control
	  18, // alt
	  91, // Windows key / left Apple cmd
	  93 // Windows menu / right Apple cmd
	  ];

	  var specificMap = [];

	  // mapping of events to input types
	  var inputMap = {
	    keydown: 'keyboard',
	    keyup: 'keyboard',
	    mousedown: 'mouse',
	    mousemove: 'mouse',
	    MSPointerDown: 'pointer',
	    MSPointerMove: 'pointer',
	    pointerdown: 'pointer',
	    pointermove: 'pointer',
	    touchstart: 'touch',
	    touchend: 'touch'

	    // boolean: true if the page is being scrolled
	  };var isScrolling = false;

	  // store current mouse position
	  var mousePos = {
	    x: null,
	    y: null

	    // map of IE 10 pointer events
	  };var pointerMap = {
	    2: 'touch',
	    3: 'touch', // treat pen like touch
	    4: 'mouse'

	    // check support for passive event listeners
	  };var supportsPassive = false;

	  try {
	    var opts = Object.defineProperty({}, 'passive', {
	      get: function get() {
	        supportsPassive = true;
	      }
	    });

	    window.addEventListener('test', null, opts);
	  } catch (e) {}
	  // fail silently


	  /*
	   * set up
	   */

	  var setUp = function setUp() {
	    // add correct mouse wheel event mapping to `inputMap`
	    inputMap[detectWheel()] = 'mouse';

	    addListeners();
	  };

	  /*
	   * events
	   */

	  var addListeners = function addListeners() {
	    // `pointermove`, `MSPointerMove`, `mousemove` and mouse wheel event binding
	    // can only demonstrate potential, but not actual, interaction
	    // and are treated separately
	    var options = supportsPassive ? { passive: true } : false;

	    document.addEventListener('DOMContentLoaded', setPersist);

	    // pointer events (mouse, pen, touch)
	    if (window.PointerEvent) {
	      window.addEventListener('pointerdown', setInput);
	      window.addEventListener('pointermove', setIntent);
	    } else if (window.MSPointerEvent) {
	      window.addEventListener('MSPointerDown', setInput);
	      window.addEventListener('MSPointerMove', setIntent);
	    } else {
	      // mouse events
	      window.addEventListener('mousedown', setInput);
	      window.addEventListener('mousemove', setIntent);

	      // touch events
	      if ('ontouchstart' in window) {
	        window.addEventListener('touchstart', setInput, options);
	        window.addEventListener('touchend', setInput);
	      }
	    }

	    // mouse wheel
	    window.addEventListener(detectWheel(), setIntent, options);

	    // keyboard events
	    window.addEventListener('keydown', setInput);
	    window.addEventListener('keyup', setInput);

	    // focus events
	    window.addEventListener('focusin', setElement);
	    window.addEventListener('focusout', clearElement);
	  };

	  // checks if input persistence should happen and
	  // get saved state from session storage if true (defaults to `false`)
	  var setPersist = function setPersist() {
	    shouldPersist = !(docElem.getAttribute('data-whatpersist') || document.body.getAttribute('data-whatpersist') === 'false');

	    if (shouldPersist) {
	      // check for session variables and use if available
	      try {
	        if (window.sessionStorage.getItem('what-input')) {
	          currentInput = window.sessionStorage.getItem('what-input');
	        }

	        if (window.sessionStorage.getItem('what-intent')) {
	          currentIntent = window.sessionStorage.getItem('what-intent');
	        }
	      } catch (e) {
	        // fail silently
	      }
	    }

	    // always run these so at least `initial` state is set
	    doUpdate('input');
	    doUpdate('intent');
	  };

	  // checks conditions before updating new input
	  var setInput = function setInput(event) {
	    var eventKey = event.which;
	    var value = inputMap[event.type];

	    if (value === 'pointer') {
	      value = pointerType(event);
	    }

	    var ignoreMatch = !specificMap.length && ignoreMap.indexOf(eventKey) === -1;

	    var specificMatch = specificMap.length && specificMap.indexOf(eventKey) !== -1;

	    var shouldUpdate = value === 'keyboard' && eventKey && (ignoreMatch || specificMatch) || value === 'mouse' || value === 'touch';

	    // prevent touch detection from being overridden by event execution order
	    if (validateTouch(value)) {
	      shouldUpdate = false;
	    }

	    if (shouldUpdate && currentInput !== value) {
	      currentInput = value;

	      persistInput('input', currentInput);
	      doUpdate('input');
	    }

	    if (shouldUpdate && currentIntent !== value) {
	      // preserve intent for keyboard interaction with form fields
	      var activeElem = document.activeElement;
	      var notFormInput = activeElem && activeElem.nodeName && (formInputs.indexOf(activeElem.nodeName.toLowerCase()) === -1 || activeElem.nodeName.toLowerCase() === 'button' && !checkClosest(activeElem, 'form'));

	      if (notFormInput) {
	        currentIntent = value;

	        persistInput('intent', currentIntent);
	        doUpdate('intent');
	      }
	    }
	  };

	  // updates the doc and `inputTypes` array with new input
	  var doUpdate = function doUpdate(which) {
	    docElem.setAttribute('data-what' + which, which === 'input' ? currentInput : currentIntent);

	    fireFunctions(which);
	  };

	  // updates input intent for `mousemove` and `pointermove`
	  var setIntent = function setIntent(event) {
	    var value = inputMap[event.type];

	    if (value === 'pointer') {
	      value = pointerType(event);
	    }

	    // test to see if `mousemove` happened relative to the screen to detect scrolling versus mousemove
	    detectScrolling(event);

	    // only execute if scrolling isn't happening
	    if ((!isScrolling && !validateTouch(value) || isScrolling && event.type === 'wheel' || event.type === 'mousewheel' || event.type === 'DOMMouseScroll') && currentIntent !== value) {
	      currentIntent = value;

	      persistInput('intent', currentIntent);
	      doUpdate('intent');
	    }
	  };

	  var setElement = function setElement(event) {
	    if (!event.target.nodeName) {
	      // If nodeName is undefined, clear the element
	      // This can happen if click inside an <svg> element.
	      clearElement();
	      return;
	    }

	    currentElement = event.target.nodeName.toLowerCase();
	    docElem.setAttribute('data-whatelement', currentElement);

	    if (event.target.classList && event.target.classList.length) {
	      docElem.setAttribute('data-whatclasses', event.target.classList.toString().replace(' ', ','));
	    }
	  };

	  var clearElement = function clearElement() {
	    currentElement = null;

	    docElem.removeAttribute('data-whatelement');
	    docElem.removeAttribute('data-whatclasses');
	  };

	  var persistInput = function persistInput(which, value) {
	    if (shouldPersist) {
	      try {
	        window.sessionStorage.setItem('what-' + which, value);
	      } catch (e) {
	        // fail silently
	      }
	    }
	  };

	  /*
	   * utilities
	   */

	  var pointerType = function pointerType(event) {
	    if (typeof event.pointerType === 'number') {
	      return pointerMap[event.pointerType];
	    } else {
	      // treat pen like touch
	      return event.pointerType === 'pen' ? 'touch' : event.pointerType;
	    }
	  };

	  // prevent touch detection from being overridden by event execution order
	  var validateTouch = function validateTouch(value) {
	    var timestamp = Date.now();

	    var touchIsValid = value === 'mouse' && currentInput === 'touch' && timestamp - currentTimestamp < 200;

	    currentTimestamp = timestamp;

	    return touchIsValid;
	  };

	  // detect version of mouse wheel event to use
	  // via https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
	  var detectWheel = function detectWheel() {
	    var wheelType = null;

	    // Modern browsers support "wheel"
	    if ('onwheel' in document.createElement('div')) {
	      wheelType = 'wheel';
	    } else {
	      // Webkit and IE support at least "mousewheel"
	      // or assume that remaining browsers are older Firefox
	      wheelType = document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
	    }

	    return wheelType;
	  };

	  // runs callback functions
	  var fireFunctions = function fireFunctions(type) {
	    for (var i = 0, len = functionList.length; i < len; i++) {
	      if (functionList[i].type === type) {
	        functionList[i].fn.call(undefined, type === 'input' ? currentInput : currentIntent);
	      }
	    }
	  };

	  // finds matching element in an object
	  var objPos = function objPos(match) {
	    for (var i = 0, len = functionList.length; i < len; i++) {
	      if (functionList[i].fn === match) {
	        return i;
	      }
	    }
	  };

	  var detectScrolling = function detectScrolling(event) {
	    if (mousePos.x !== event.screenX || mousePos.y !== event.screenY) {
	      isScrolling = false;

	      mousePos.x = event.screenX;
	      mousePos.y = event.screenY;
	    } else {
	      isScrolling = true;
	    }
	  };

	  // manual version of `closest()`
	  var checkClosest = function checkClosest(elem, tag) {
	    var ElementPrototype = window.Element.prototype;

	    if (!ElementPrototype.matches) {
	      ElementPrototype.matches = ElementPrototype.msMatchesSelector || ElementPrototype.webkitMatchesSelector;
	    }

	    if (!ElementPrototype.closest) {
	      do {
	        if (elem.matches(tag)) {
	          return elem;
	        }

	        elem = elem.parentElement || elem.parentNode;
	      } while (elem !== null && elem.nodeType === 1);

	      return null;
	    } else {
	      return elem.closest(tag);
	    }
	  };

	  /*
	   * init
	   */

	  // don't start script unless browser cuts the mustard
	  // (also passes if polyfills are used)
	  if ('addEventListener' in window && Array.prototype.indexOf) {
	    setUp();
	  }

	  /*
	   * api
	   */

	  return {
	    // returns string: the current input type
	    // opt: 'intent'|'input'
	    // 'input' (default): returns the same value as the `data-whatinput` attribute
	    // 'intent': includes `data-whatintent` value if it's different than `data-whatinput`
	    ask: function ask(opt) {
	      return opt === 'intent' ? currentIntent : currentInput;
	    },

	    // returns string: the currently focused element or null
	    element: function element() {
	      return currentElement;
	    },

	    // overwrites ignored keys with provided array
	    ignoreKeys: function ignoreKeys(arr) {
	      ignoreMap = arr;
	    },

	    // overwrites specific char keys to update on
	    specificKeys: function specificKeys(arr) {
	      specificMap = arr;
	    },

	    // attach functions to input and intent "events"
	    // funct: function to fire on change
	    // eventType: 'input'|'intent'
	    registerOnChange: function registerOnChange(fn, eventType) {
	      functionList.push({
	        fn: fn,
	        type: eventType || 'input'
	      });
	    },

	    unRegisterOnChange: function unRegisterOnChange(fn) {
	      var position = objPos(fn);

	      if (position || position === 0) {
	        functionList.splice(position, 1);
	      }
	    },

	    clearStorage: function clearStorage() {
	      window.sessionStorage.clear();
	    }
	  };
	}();

/***/ })
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ3aGF0LWlucHV0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogd2hhdC1pbnB1dCAtIEEgZ2xvYmFsIHV0aWxpdHkgZm9yIHRyYWNraW5nIHRoZSBjdXJyZW50IGlucHV0IG1ldGhvZCAobW91c2UsIGtleWJvYXJkIG9yIHRvdWNoKS5cbiAqIEB2ZXJzaW9uIHY1LjIuOVxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3RlbjFzZXZlbi93aGF0LWlucHV0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJ3aGF0SW5wdXRcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wid2hhdElucHV0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIndoYXRJbnB1dFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG5cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG5cblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHQgIC8qXG5cdCAgICogYmFpbCBvdXQgaWYgdGhlcmUgaXMgbm8gZG9jdW1lbnQgb3Igd2luZG93XG5cdCAgICogKGkuZS4gaW4gYSBub2RlL25vbi1ET00gZW52aXJvbm1lbnQpXG5cdCAgICpcblx0ICAgKiBSZXR1cm4gYSBzdHViYmVkIEFQSSBpbnN0ZWFkXG5cdCAgICovXG5cdCAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgIC8vIGFsd2F5cyByZXR1cm4gXCJpbml0aWFsXCIgYmVjYXVzZSBubyBpbnRlcmFjdGlvbiB3aWxsIGV2ZXIgYmUgZGV0ZWN0ZWRcblx0ICAgICAgYXNrOiBmdW5jdGlvbiBhc2soKSB7XG5cdCAgICAgICAgcmV0dXJuICdpbml0aWFsJztcblx0ICAgICAgfSxcblxuXHQgICAgICAvLyBhbHdheXMgcmV0dXJuIG51bGxcblx0ICAgICAgZWxlbWVudDogZnVuY3Rpb24gZWxlbWVudCgpIHtcblx0ICAgICAgICByZXR1cm4gbnVsbDtcblx0ICAgICAgfSxcblxuXHQgICAgICAvLyBuby1vcFxuXHQgICAgICBpZ25vcmVLZXlzOiBmdW5jdGlvbiBpZ25vcmVLZXlzKCkge30sXG5cblx0ICAgICAgLy8gbm8tb3Bcblx0ICAgICAgc3BlY2lmaWNLZXlzOiBmdW5jdGlvbiBzcGVjaWZpY0tleXMoKSB7fSxcblxuXHQgICAgICAvLyBuby1vcFxuXHQgICAgICByZWdpc3Rlck9uQ2hhbmdlOiBmdW5jdGlvbiByZWdpc3Rlck9uQ2hhbmdlKCkge30sXG5cblx0ICAgICAgLy8gbm8tb3Bcblx0ICAgICAgdW5SZWdpc3Rlck9uQ2hhbmdlOiBmdW5jdGlvbiB1blJlZ2lzdGVyT25DaGFuZ2UoKSB7fVxuXHQgICAgfTtcblx0ICB9XG5cblx0ICAvKlxuXHQgICAqIHZhcmlhYmxlc1xuXHQgICAqL1xuXG5cdCAgLy8gY2FjaGUgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG5cdCAgdmFyIGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cblx0ICAvLyBjdXJyZW50bHkgZm9jdXNlZCBkb20gZWxlbWVudFxuXHQgIHZhciBjdXJyZW50RWxlbWVudCA9IG51bGw7XG5cblx0ICAvLyBsYXN0IHVzZWQgaW5wdXQgdHlwZVxuXHQgIHZhciBjdXJyZW50SW5wdXQgPSAnaW5pdGlhbCc7XG5cblx0ICAvLyBsYXN0IHVzZWQgaW5wdXQgaW50ZW50XG5cdCAgdmFyIGN1cnJlbnRJbnRlbnQgPSBjdXJyZW50SW5wdXQ7XG5cblx0ICAvLyBVTklYIHRpbWVzdGFtcCBvZiBjdXJyZW50IGV2ZW50XG5cdCAgdmFyIGN1cnJlbnRUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG5cdCAgLy8gY2hlY2sgZm9yIGEgYGRhdGEtd2hhdHBlcnNpc3RgIGF0dHJpYnV0ZSBvbiBlaXRoZXIgdGhlIGBodG1sYCBvciBgYm9keWAgZWxlbWVudHMsIGRlZmF1bHRzIHRvIGB0cnVlYFxuXHQgIHZhciBzaG91bGRQZXJzaXN0ID0gJ2ZhbHNlJztcblxuXHQgIC8vIGZvcm0gaW5wdXQgdHlwZXNcblx0ICB2YXIgZm9ybUlucHV0cyA9IFsnYnV0dG9uJywgJ2lucHV0JywgJ3NlbGVjdCcsICd0ZXh0YXJlYSddO1xuXG5cdCAgLy8gZW1wdHkgYXJyYXkgZm9yIGhvbGRpbmcgY2FsbGJhY2sgZnVuY3Rpb25zXG5cdCAgdmFyIGZ1bmN0aW9uTGlzdCA9IFtdO1xuXG5cdCAgLy8gbGlzdCBvZiBtb2RpZmllciBrZXlzIGNvbW1vbmx5IHVzZWQgd2l0aCB0aGUgbW91c2UgYW5kXG5cdCAgLy8gY2FuIGJlIHNhZmVseSBpZ25vcmVkIHRvIHByZXZlbnQgZmFsc2Uga2V5Ym9hcmQgZGV0ZWN0aW9uXG5cdCAgdmFyIGlnbm9yZU1hcCA9IFsxNiwgLy8gc2hpZnRcblx0ICAxNywgLy8gY29udHJvbFxuXHQgIDE4LCAvLyBhbHRcblx0ICA5MSwgLy8gV2luZG93cyBrZXkgLyBsZWZ0IEFwcGxlIGNtZFxuXHQgIDkzIC8vIFdpbmRvd3MgbWVudSAvIHJpZ2h0IEFwcGxlIGNtZFxuXHQgIF07XG5cblx0ICB2YXIgc3BlY2lmaWNNYXAgPSBbXTtcblxuXHQgIC8vIG1hcHBpbmcgb2YgZXZlbnRzIHRvIGlucHV0IHR5cGVzXG5cdCAgdmFyIGlucHV0TWFwID0ge1xuXHQgICAga2V5ZG93bjogJ2tleWJvYXJkJyxcblx0ICAgIGtleXVwOiAna2V5Ym9hcmQnLFxuXHQgICAgbW91c2Vkb3duOiAnbW91c2UnLFxuXHQgICAgbW91c2Vtb3ZlOiAnbW91c2UnLFxuXHQgICAgTVNQb2ludGVyRG93bjogJ3BvaW50ZXInLFxuXHQgICAgTVNQb2ludGVyTW92ZTogJ3BvaW50ZXInLFxuXHQgICAgcG9pbnRlcmRvd246ICdwb2ludGVyJyxcblx0ICAgIHBvaW50ZXJtb3ZlOiAncG9pbnRlcicsXG5cdCAgICB0b3VjaHN0YXJ0OiAndG91Y2gnLFxuXHQgICAgdG91Y2hlbmQ6ICd0b3VjaCdcblxuXHQgICAgLy8gYm9vbGVhbjogdHJ1ZSBpZiB0aGUgcGFnZSBpcyBiZWluZyBzY3JvbGxlZFxuXHQgIH07dmFyIGlzU2Nyb2xsaW5nID0gZmFsc2U7XG5cblx0ICAvLyBzdG9yZSBjdXJyZW50IG1vdXNlIHBvc2l0aW9uXG5cdCAgdmFyIG1vdXNlUG9zID0ge1xuXHQgICAgeDogbnVsbCxcblx0ICAgIHk6IG51bGxcblxuXHQgICAgLy8gbWFwIG9mIElFIDEwIHBvaW50ZXIgZXZlbnRzXG5cdCAgfTt2YXIgcG9pbnRlck1hcCA9IHtcblx0ICAgIDI6ICd0b3VjaCcsXG5cdCAgICAzOiAndG91Y2gnLCAvLyB0cmVhdCBwZW4gbGlrZSB0b3VjaFxuXHQgICAgNDogJ21vdXNlJ1xuXG5cdCAgICAvLyBjaGVjayBzdXBwb3J0IGZvciBwYXNzaXZlIGV2ZW50IGxpc3RlbmVyc1xuXHQgIH07dmFyIHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xuXG5cdCAgdHJ5IHtcblx0ICAgIHZhciBvcHRzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcblx0ICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICAgICAgc3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cblx0ICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0JywgbnVsbCwgb3B0cyk7XG5cdCAgfSBjYXRjaCAoZSkge31cblx0ICAvLyBmYWlsIHNpbGVudGx5XG5cblxuXHQgIC8qXG5cdCAgICogc2V0IHVwXG5cdCAgICovXG5cblx0ICB2YXIgc2V0VXAgPSBmdW5jdGlvbiBzZXRVcCgpIHtcblx0ICAgIC8vIGFkZCBjb3JyZWN0IG1vdXNlIHdoZWVsIGV2ZW50IG1hcHBpbmcgdG8gYGlucHV0TWFwYFxuXHQgICAgaW5wdXRNYXBbZGV0ZWN0V2hlZWwoKV0gPSAnbW91c2UnO1xuXG5cdCAgICBhZGRMaXN0ZW5lcnMoKTtcblx0ICB9O1xuXG5cdCAgLypcblx0ICAgKiBldmVudHNcblx0ICAgKi9cblxuXHQgIHZhciBhZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XG5cdCAgICAvLyBgcG9pbnRlcm1vdmVgLCBgTVNQb2ludGVyTW92ZWAsIGBtb3VzZW1vdmVgIGFuZCBtb3VzZSB3aGVlbCBldmVudCBiaW5kaW5nXG5cdCAgICAvLyBjYW4gb25seSBkZW1vbnN0cmF0ZSBwb3RlbnRpYWwsIGJ1dCBub3QgYWN0dWFsLCBpbnRlcmFjdGlvblxuXHQgICAgLy8gYW5kIGFyZSB0cmVhdGVkIHNlcGFyYXRlbHlcblx0ICAgIHZhciBvcHRpb25zID0gc3VwcG9ydHNQYXNzaXZlID8geyBwYXNzaXZlOiB0cnVlIH0gOiBmYWxzZTtcblxuXHQgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHNldFBlcnNpc3QpO1xuXG5cdCAgICAvLyBwb2ludGVyIGV2ZW50cyAobW91c2UsIHBlbiwgdG91Y2gpXG5cdCAgICBpZiAod2luZG93LlBvaW50ZXJFdmVudCkge1xuXHQgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBzZXRJbnB1dCk7XG5cdCAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHNldEludGVudCk7XG5cdCAgICB9IGVsc2UgaWYgKHdpbmRvdy5NU1BvaW50ZXJFdmVudCkge1xuXHQgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignTVNQb2ludGVyRG93bicsIHNldElucHV0KTtcblx0ICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ01TUG9pbnRlck1vdmUnLCBzZXRJbnRlbnQpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gbW91c2UgZXZlbnRzXG5cdCAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzZXRJbnB1dCk7XG5cdCAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBzZXRJbnRlbnQpO1xuXG5cdCAgICAgIC8vIHRvdWNoIGV2ZW50c1xuXHQgICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XG5cdCAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzZXRJbnB1dCwgb3B0aW9ucyk7XG5cdCAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgc2V0SW5wdXQpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIC8vIG1vdXNlIHdoZWVsXG5cdCAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihkZXRlY3RXaGVlbCgpLCBzZXRJbnRlbnQsIG9wdGlvbnMpO1xuXG5cdCAgICAvLyBrZXlib2FyZCBldmVudHNcblx0ICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2V0SW5wdXQpO1xuXHQgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgc2V0SW5wdXQpO1xuXG5cdCAgICAvLyBmb2N1cyBldmVudHNcblx0ICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgc2V0RWxlbWVudCk7XG5cdCAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCBjbGVhckVsZW1lbnQpO1xuXHQgIH07XG5cblx0ICAvLyBjaGVja3MgaWYgaW5wdXQgcGVyc2lzdGVuY2Ugc2hvdWxkIGhhcHBlbiBhbmRcblx0ICAvLyBnZXQgc2F2ZWQgc3RhdGUgZnJvbSBzZXNzaW9uIHN0b3JhZ2UgaWYgdHJ1ZSAoZGVmYXVsdHMgdG8gYGZhbHNlYClcblx0ICB2YXIgc2V0UGVyc2lzdCA9IGZ1bmN0aW9uIHNldFBlcnNpc3QoKSB7XG5cdCAgICBzaG91bGRQZXJzaXN0ID0gIShkb2NFbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS13aGF0cGVyc2lzdCcpIHx8IGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXdoYXRwZXJzaXN0JykgPT09ICdmYWxzZScpO1xuXG5cdCAgICBpZiAoc2hvdWxkUGVyc2lzdCkge1xuXHQgICAgICAvLyBjaGVjayBmb3Igc2Vzc2lvbiB2YXJpYWJsZXMgYW5kIHVzZSBpZiBhdmFpbGFibGVcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICBpZiAod2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3doYXQtaW5wdXQnKSkge1xuXHQgICAgICAgICAgY3VycmVudElucHV0ID0gd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3doYXQtaW5wdXQnKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAod2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3doYXQtaW50ZW50JykpIHtcblx0ICAgICAgICAgIGN1cnJlbnRJbnRlbnQgPSB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnd2hhdC1pbnRlbnQnKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgICAvLyBmYWlsIHNpbGVudGx5XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgLy8gYWx3YXlzIHJ1biB0aGVzZSBzbyBhdCBsZWFzdCBgaW5pdGlhbGAgc3RhdGUgaXMgc2V0XG5cdCAgICBkb1VwZGF0ZSgnaW5wdXQnKTtcblx0ICAgIGRvVXBkYXRlKCdpbnRlbnQnKTtcblx0ICB9O1xuXG5cdCAgLy8gY2hlY2tzIGNvbmRpdGlvbnMgYmVmb3JlIHVwZGF0aW5nIG5ldyBpbnB1dFxuXHQgIHZhciBzZXRJbnB1dCA9IGZ1bmN0aW9uIHNldElucHV0KGV2ZW50KSB7XG5cdCAgICB2YXIgZXZlbnRLZXkgPSBldmVudC53aGljaDtcblx0ICAgIHZhciB2YWx1ZSA9IGlucHV0TWFwW2V2ZW50LnR5cGVdO1xuXG5cdCAgICBpZiAodmFsdWUgPT09ICdwb2ludGVyJykge1xuXHQgICAgICB2YWx1ZSA9IHBvaW50ZXJUeXBlKGV2ZW50KTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGlnbm9yZU1hdGNoID0gIXNwZWNpZmljTWFwLmxlbmd0aCAmJiBpZ25vcmVNYXAuaW5kZXhPZihldmVudEtleSkgPT09IC0xO1xuXG5cdCAgICB2YXIgc3BlY2lmaWNNYXRjaCA9IHNwZWNpZmljTWFwLmxlbmd0aCAmJiBzcGVjaWZpY01hcC5pbmRleE9mKGV2ZW50S2V5KSAhPT0gLTE7XG5cblx0ICAgIHZhciBzaG91bGRVcGRhdGUgPSB2YWx1ZSA9PT0gJ2tleWJvYXJkJyAmJiBldmVudEtleSAmJiAoaWdub3JlTWF0Y2ggfHwgc3BlY2lmaWNNYXRjaCkgfHwgdmFsdWUgPT09ICdtb3VzZScgfHwgdmFsdWUgPT09ICd0b3VjaCc7XG5cblx0ICAgIC8vIHByZXZlbnQgdG91Y2ggZGV0ZWN0aW9uIGZyb20gYmVpbmcgb3ZlcnJpZGRlbiBieSBldmVudCBleGVjdXRpb24gb3JkZXJcblx0ICAgIGlmICh2YWxpZGF0ZVRvdWNoKHZhbHVlKSkge1xuXHQgICAgICBzaG91bGRVcGRhdGUgPSBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNob3VsZFVwZGF0ZSAmJiBjdXJyZW50SW5wdXQgIT09IHZhbHVlKSB7XG5cdCAgICAgIGN1cnJlbnRJbnB1dCA9IHZhbHVlO1xuXG5cdCAgICAgIHBlcnNpc3RJbnB1dCgnaW5wdXQnLCBjdXJyZW50SW5wdXQpO1xuXHQgICAgICBkb1VwZGF0ZSgnaW5wdXQnKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNob3VsZFVwZGF0ZSAmJiBjdXJyZW50SW50ZW50ICE9PSB2YWx1ZSkge1xuXHQgICAgICAvLyBwcmVzZXJ2ZSBpbnRlbnQgZm9yIGtleWJvYXJkIGludGVyYWN0aW9uIHdpdGggZm9ybSBmaWVsZHNcblx0ICAgICAgdmFyIGFjdGl2ZUVsZW0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHQgICAgICB2YXIgbm90Rm9ybUlucHV0ID0gYWN0aXZlRWxlbSAmJiBhY3RpdmVFbGVtLm5vZGVOYW1lICYmIChmb3JtSW5wdXRzLmluZGV4T2YoYWN0aXZlRWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSA9PT0gLTEgfHwgYWN0aXZlRWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYnV0dG9uJyAmJiAhY2hlY2tDbG9zZXN0KGFjdGl2ZUVsZW0sICdmb3JtJykpO1xuXG5cdCAgICAgIGlmIChub3RGb3JtSW5wdXQpIHtcblx0ICAgICAgICBjdXJyZW50SW50ZW50ID0gdmFsdWU7XG5cblx0ICAgICAgICBwZXJzaXN0SW5wdXQoJ2ludGVudCcsIGN1cnJlbnRJbnRlbnQpO1xuXHQgICAgICAgIGRvVXBkYXRlKCdpbnRlbnQnKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH07XG5cblx0ICAvLyB1cGRhdGVzIHRoZSBkb2MgYW5kIGBpbnB1dFR5cGVzYCBhcnJheSB3aXRoIG5ldyBpbnB1dFxuXHQgIHZhciBkb1VwZGF0ZSA9IGZ1bmN0aW9uIGRvVXBkYXRlKHdoaWNoKSB7XG5cdCAgICBkb2NFbGVtLnNldEF0dHJpYnV0ZSgnZGF0YS13aGF0JyArIHdoaWNoLCB3aGljaCA9PT0gJ2lucHV0JyA/IGN1cnJlbnRJbnB1dCA6IGN1cnJlbnRJbnRlbnQpO1xuXG5cdCAgICBmaXJlRnVuY3Rpb25zKHdoaWNoKTtcblx0ICB9O1xuXG5cdCAgLy8gdXBkYXRlcyBpbnB1dCBpbnRlbnQgZm9yIGBtb3VzZW1vdmVgIGFuZCBgcG9pbnRlcm1vdmVgXG5cdCAgdmFyIHNldEludGVudCA9IGZ1bmN0aW9uIHNldEludGVudChldmVudCkge1xuXHQgICAgdmFyIHZhbHVlID0gaW5wdXRNYXBbZXZlbnQudHlwZV07XG5cblx0ICAgIGlmICh2YWx1ZSA9PT0gJ3BvaW50ZXInKSB7XG5cdCAgICAgIHZhbHVlID0gcG9pbnRlclR5cGUoZXZlbnQpO1xuXHQgICAgfVxuXG5cdCAgICAvLyB0ZXN0IHRvIHNlZSBpZiBgbW91c2Vtb3ZlYCBoYXBwZW5lZCByZWxhdGl2ZSB0byB0aGUgc2NyZWVuIHRvIGRldGVjdCBzY3JvbGxpbmcgdmVyc3VzIG1vdXNlbW92ZVxuXHQgICAgZGV0ZWN0U2Nyb2xsaW5nKGV2ZW50KTtcblxuXHQgICAgLy8gb25seSBleGVjdXRlIGlmIHNjcm9sbGluZyBpc24ndCBoYXBwZW5pbmdcblx0ICAgIGlmICgoIWlzU2Nyb2xsaW5nICYmICF2YWxpZGF0ZVRvdWNoKHZhbHVlKSB8fCBpc1Njcm9sbGluZyAmJiBldmVudC50eXBlID09PSAnd2hlZWwnIHx8IGV2ZW50LnR5cGUgPT09ICdtb3VzZXdoZWVsJyB8fCBldmVudC50eXBlID09PSAnRE9NTW91c2VTY3JvbGwnKSAmJiBjdXJyZW50SW50ZW50ICE9PSB2YWx1ZSkge1xuXHQgICAgICBjdXJyZW50SW50ZW50ID0gdmFsdWU7XG5cblx0ICAgICAgcGVyc2lzdElucHV0KCdpbnRlbnQnLCBjdXJyZW50SW50ZW50KTtcblx0ICAgICAgZG9VcGRhdGUoJ2ludGVudCcpO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICB2YXIgc2V0RWxlbWVudCA9IGZ1bmN0aW9uIHNldEVsZW1lbnQoZXZlbnQpIHtcblx0ICAgIGlmICghZXZlbnQudGFyZ2V0Lm5vZGVOYW1lKSB7XG5cdCAgICAgIC8vIElmIG5vZGVOYW1lIGlzIHVuZGVmaW5lZCwgY2xlYXIgdGhlIGVsZW1lbnRcblx0ICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIGlmIGNsaWNrIGluc2lkZSBhbiA8c3ZnPiBlbGVtZW50LlxuXHQgICAgICBjbGVhckVsZW1lbnQoKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBjdXJyZW50RWxlbWVudCA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgZG9jRWxlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2hhdGVsZW1lbnQnLCBjdXJyZW50RWxlbWVudCk7XG5cblx0ICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0ICYmIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QubGVuZ3RoKSB7XG5cdCAgICAgIGRvY0VsZW0uc2V0QXR0cmlidXRlKCdkYXRhLXdoYXRjbGFzc2VzJywgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC50b1N0cmluZygpLnJlcGxhY2UoJyAnLCAnLCcpKTtcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgdmFyIGNsZWFyRWxlbWVudCA9IGZ1bmN0aW9uIGNsZWFyRWxlbWVudCgpIHtcblx0ICAgIGN1cnJlbnRFbGVtZW50ID0gbnVsbDtcblxuXHQgICAgZG9jRWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtd2hhdGVsZW1lbnQnKTtcblx0ICAgIGRvY0VsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXdoYXRjbGFzc2VzJyk7XG5cdCAgfTtcblxuXHQgIHZhciBwZXJzaXN0SW5wdXQgPSBmdW5jdGlvbiBwZXJzaXN0SW5wdXQod2hpY2gsIHZhbHVlKSB7XG5cdCAgICBpZiAoc2hvdWxkUGVyc2lzdCkge1xuXHQgICAgICB0cnkge1xuXHQgICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCd3aGF0LScgKyB3aGljaCwgdmFsdWUpO1xuXHQgICAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgICAgLy8gZmFpbCBzaWxlbnRseVxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIC8qXG5cdCAgICogdXRpbGl0aWVzXG5cdCAgICovXG5cblx0ICB2YXIgcG9pbnRlclR5cGUgPSBmdW5jdGlvbiBwb2ludGVyVHlwZShldmVudCkge1xuXHQgICAgaWYgKHR5cGVvZiBldmVudC5wb2ludGVyVHlwZSA9PT0gJ251bWJlcicpIHtcblx0ICAgICAgcmV0dXJuIHBvaW50ZXJNYXBbZXZlbnQucG9pbnRlclR5cGVdO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gdHJlYXQgcGVuIGxpa2UgdG91Y2hcblx0ICAgICAgcmV0dXJuIGV2ZW50LnBvaW50ZXJUeXBlID09PSAncGVuJyA/ICd0b3VjaCcgOiBldmVudC5wb2ludGVyVHlwZTtcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgLy8gcHJldmVudCB0b3VjaCBkZXRlY3Rpb24gZnJvbSBiZWluZyBvdmVycmlkZGVuIGJ5IGV2ZW50IGV4ZWN1dGlvbiBvcmRlclxuXHQgIHZhciB2YWxpZGF0ZVRvdWNoID0gZnVuY3Rpb24gdmFsaWRhdGVUb3VjaCh2YWx1ZSkge1xuXHQgICAgdmFyIHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG5cblx0ICAgIHZhciB0b3VjaElzVmFsaWQgPSB2YWx1ZSA9PT0gJ21vdXNlJyAmJiBjdXJyZW50SW5wdXQgPT09ICd0b3VjaCcgJiYgdGltZXN0YW1wIC0gY3VycmVudFRpbWVzdGFtcCA8IDIwMDtcblxuXHQgICAgY3VycmVudFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcblxuXHQgICAgcmV0dXJuIHRvdWNoSXNWYWxpZDtcblx0ICB9O1xuXG5cdCAgLy8gZGV0ZWN0IHZlcnNpb24gb2YgbW91c2Ugd2hlZWwgZXZlbnQgdG8gdXNlXG5cdCAgLy8gdmlhIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3doZWVsX2V2ZW50XG5cdCAgdmFyIGRldGVjdFdoZWVsID0gZnVuY3Rpb24gZGV0ZWN0V2hlZWwoKSB7XG5cdCAgICB2YXIgd2hlZWxUeXBlID0gbnVsbDtcblxuXHQgICAgLy8gTW9kZXJuIGJyb3dzZXJzIHN1cHBvcnQgXCJ3aGVlbFwiXG5cdCAgICBpZiAoJ29ud2hlZWwnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKSB7XG5cdCAgICAgIHdoZWVsVHlwZSA9ICd3aGVlbCc7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAvLyBXZWJraXQgYW5kIElFIHN1cHBvcnQgYXQgbGVhc3QgXCJtb3VzZXdoZWVsXCJcblx0ICAgICAgLy8gb3IgYXNzdW1lIHRoYXQgcmVtYWluaW5nIGJyb3dzZXJzIGFyZSBvbGRlciBGaXJlZm94XG5cdCAgICAgIHdoZWVsVHlwZSA9IGRvY3VtZW50Lm9ubW91c2V3aGVlbCAhPT0gdW5kZWZpbmVkID8gJ21vdXNld2hlZWwnIDogJ0RPTU1vdXNlU2Nyb2xsJztcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHdoZWVsVHlwZTtcblx0ICB9O1xuXG5cdCAgLy8gcnVucyBjYWxsYmFjayBmdW5jdGlvbnNcblx0ICB2YXIgZmlyZUZ1bmN0aW9ucyA9IGZ1bmN0aW9uIGZpcmVGdW5jdGlvbnModHlwZSkge1xuXHQgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGZ1bmN0aW9uTGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICBpZiAoZnVuY3Rpb25MaXN0W2ldLnR5cGUgPT09IHR5cGUpIHtcblx0ICAgICAgICBmdW5jdGlvbkxpc3RbaV0uZm4uY2FsbCh1bmRlZmluZWQsIHR5cGUgPT09ICdpbnB1dCcgPyBjdXJyZW50SW5wdXQgOiBjdXJyZW50SW50ZW50KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH07XG5cblx0ICAvLyBmaW5kcyBtYXRjaGluZyBlbGVtZW50IGluIGFuIG9iamVjdFxuXHQgIHZhciBvYmpQb3MgPSBmdW5jdGlvbiBvYmpQb3MobWF0Y2gpIHtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmdW5jdGlvbkxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgaWYgKGZ1bmN0aW9uTGlzdFtpXS5mbiA9PT0gbWF0Y2gpIHtcblx0ICAgICAgICByZXR1cm4gaTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH07XG5cblx0ICB2YXIgZGV0ZWN0U2Nyb2xsaW5nID0gZnVuY3Rpb24gZGV0ZWN0U2Nyb2xsaW5nKGV2ZW50KSB7XG5cdCAgICBpZiAobW91c2VQb3MueCAhPT0gZXZlbnQuc2NyZWVuWCB8fCBtb3VzZVBvcy55ICE9PSBldmVudC5zY3JlZW5ZKSB7XG5cdCAgICAgIGlzU2Nyb2xsaW5nID0gZmFsc2U7XG5cblx0ICAgICAgbW91c2VQb3MueCA9IGV2ZW50LnNjcmVlblg7XG5cdCAgICAgIG1vdXNlUG9zLnkgPSBldmVudC5zY3JlZW5ZO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaXNTY3JvbGxpbmcgPSB0cnVlO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICAvLyBtYW51YWwgdmVyc2lvbiBvZiBgY2xvc2VzdCgpYFxuXHQgIHZhciBjaGVja0Nsb3Nlc3QgPSBmdW5jdGlvbiBjaGVja0Nsb3Nlc3QoZWxlbSwgdGFnKSB7XG5cdCAgICB2YXIgRWxlbWVudFByb3RvdHlwZSA9IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZTtcblxuXHQgICAgaWYgKCFFbGVtZW50UHJvdG90eXBlLm1hdGNoZXMpIHtcblx0ICAgICAgRWxlbWVudFByb3RvdHlwZS5tYXRjaGVzID0gRWxlbWVudFByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50UHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3Rvcjtcblx0ICAgIH1cblxuXHQgICAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmNsb3Nlc3QpIHtcblx0ICAgICAgZG8ge1xuXHQgICAgICAgIGlmIChlbGVtLm1hdGNoZXModGFnKSkge1xuXHQgICAgICAgICAgcmV0dXJuIGVsZW07XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgZWxlbSA9IGVsZW0ucGFyZW50RWxlbWVudCB8fCBlbGVtLnBhcmVudE5vZGU7XG5cdCAgICAgIH0gd2hpbGUgKGVsZW0gIT09IG51bGwgJiYgZWxlbS5ub2RlVHlwZSA9PT0gMSk7XG5cblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gZWxlbS5jbG9zZXN0KHRhZyk7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIC8qXG5cdCAgICogaW5pdFxuXHQgICAqL1xuXG5cdCAgLy8gZG9uJ3Qgc3RhcnQgc2NyaXB0IHVubGVzcyBicm93c2VyIGN1dHMgdGhlIG11c3RhcmRcblx0ICAvLyAoYWxzbyBwYXNzZXMgaWYgcG9seWZpbGxzIGFyZSB1c2VkKVxuXHQgIGlmICgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93ICYmIEFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG5cdCAgICBzZXRVcCgpO1xuXHQgIH1cblxuXHQgIC8qXG5cdCAgICogYXBpXG5cdCAgICovXG5cblx0ICByZXR1cm4ge1xuXHQgICAgLy8gcmV0dXJucyBzdHJpbmc6IHRoZSBjdXJyZW50IGlucHV0IHR5cGVcblx0ICAgIC8vIG9wdDogJ2ludGVudCd8J2lucHV0J1xuXHQgICAgLy8gJ2lucHV0JyAoZGVmYXVsdCk6IHJldHVybnMgdGhlIHNhbWUgdmFsdWUgYXMgdGhlIGBkYXRhLXdoYXRpbnB1dGAgYXR0cmlidXRlXG5cdCAgICAvLyAnaW50ZW50JzogaW5jbHVkZXMgYGRhdGEtd2hhdGludGVudGAgdmFsdWUgaWYgaXQncyBkaWZmZXJlbnQgdGhhbiBgZGF0YS13aGF0aW5wdXRgXG5cdCAgICBhc2s6IGZ1bmN0aW9uIGFzayhvcHQpIHtcblx0ICAgICAgcmV0dXJuIG9wdCA9PT0gJ2ludGVudCcgPyBjdXJyZW50SW50ZW50IDogY3VycmVudElucHV0O1xuXHQgICAgfSxcblxuXHQgICAgLy8gcmV0dXJucyBzdHJpbmc6IHRoZSBjdXJyZW50bHkgZm9jdXNlZCBlbGVtZW50IG9yIG51bGxcblx0ICAgIGVsZW1lbnQ6IGZ1bmN0aW9uIGVsZW1lbnQoKSB7XG5cdCAgICAgIHJldHVybiBjdXJyZW50RWxlbWVudDtcblx0ICAgIH0sXG5cblx0ICAgIC8vIG92ZXJ3cml0ZXMgaWdub3JlZCBrZXlzIHdpdGggcHJvdmlkZWQgYXJyYXlcblx0ICAgIGlnbm9yZUtleXM6IGZ1bmN0aW9uIGlnbm9yZUtleXMoYXJyKSB7XG5cdCAgICAgIGlnbm9yZU1hcCA9IGFycjtcblx0ICAgIH0sXG5cblx0ICAgIC8vIG92ZXJ3cml0ZXMgc3BlY2lmaWMgY2hhciBrZXlzIHRvIHVwZGF0ZSBvblxuXHQgICAgc3BlY2lmaWNLZXlzOiBmdW5jdGlvbiBzcGVjaWZpY0tleXMoYXJyKSB7XG5cdCAgICAgIHNwZWNpZmljTWFwID0gYXJyO1xuXHQgICAgfSxcblxuXHQgICAgLy8gYXR0YWNoIGZ1bmN0aW9ucyB0byBpbnB1dCBhbmQgaW50ZW50IFwiZXZlbnRzXCJcblx0ICAgIC8vIGZ1bmN0OiBmdW5jdGlvbiB0byBmaXJlIG9uIGNoYW5nZVxuXHQgICAgLy8gZXZlbnRUeXBlOiAnaW5wdXQnfCdpbnRlbnQnXG5cdCAgICByZWdpc3Rlck9uQ2hhbmdlOiBmdW5jdGlvbiByZWdpc3Rlck9uQ2hhbmdlKGZuLCBldmVudFR5cGUpIHtcblx0ICAgICAgZnVuY3Rpb25MaXN0LnB1c2goe1xuXHQgICAgICAgIGZuOiBmbixcblx0ICAgICAgICB0eXBlOiBldmVudFR5cGUgfHwgJ2lucHV0J1xuXHQgICAgICB9KTtcblx0ICAgIH0sXG5cblx0ICAgIHVuUmVnaXN0ZXJPbkNoYW5nZTogZnVuY3Rpb24gdW5SZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XG5cdCAgICAgIHZhciBwb3NpdGlvbiA9IG9ialBvcyhmbik7XG5cblx0ICAgICAgaWYgKHBvc2l0aW9uIHx8IHBvc2l0aW9uID09PSAwKSB7XG5cdCAgICAgICAgZnVuY3Rpb25MaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG5cdCAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIGNsZWFyU3RvcmFnZTogZnVuY3Rpb24gY2xlYXJTdG9yYWdlKCkge1xuXHQgICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuY2xlYXIoKTtcblx0ICAgIH1cblx0ICB9O1xuXHR9KCk7XG5cbi8qKiovIH0pXG4vKioqKioqLyBdKVxufSk7XG47Il0sImZpbGUiOiJ3aGF0LWlucHV0LmpzIn0=
