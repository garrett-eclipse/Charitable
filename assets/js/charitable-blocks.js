/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__donation_form___ = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__campaign_select_index_js__ = __webpack_require__(3);


var __ = wp.i18n.__;
var _wp$blocks = wp.blocks,
    registerBlockType = _wp$blocks.registerBlockType,
    InspectorControls = _wp$blocks.InspectorControls,
    BlockDescription = _wp$blocks.BlockDescription;
var withAPIData = wp.components.withAPIData;
var SelectControl = InspectorControls.SelectControl;


var blockIcon = wp.element.createElement(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', width: '20px', height: '20px', viewBox: '0 0 20 20' },
    wp.element.createElement('path', { d: 'M22.634 4.583h-10.914c-0.32 0-0.651 0.749-0.966 0.777-3.394-3.971-6.44-1.634-6.44-1.634l1.84 3.897c-1.48 1.097-2.623 4.486-3.246 4.486h-2.011c-0.48 0-0.891 0.566-0.891 1.040v6.051c0 0.48 0.411 0.434 0.891 0.434h2.326c0.806 1.88 2.131 3.423 3.783 4.389l-0.526 2.794c-0.114 0.571 0.263 1.183 0.834 1.291l4.046 0.823c0.571 0.109 1.12-0.377 1.234-0.949l0.509-2.709h8.137l0.509 2.72c0.114 0.571 0.663 1.006 1.234 0.891l4.046-0.76c0.571-0.114 0.949-0.651 0.834-1.223l-0.52-2.68c2.783-1.611 4.657-4.606 4.657-8.051v-0.777c0.006-5.16-4.2-10.811-9.366-10.811zM8.217 14.629c-0.949 0-1.72-0.771-1.72-1.72 0-0.954 0.771-1.72 1.72-1.72s1.72 0.771 1.72 1.72-0.771 1.72-1.72 1.72zM20.714 10.229h-7.531v-1.88h7.531v1.88z'
    })
);

registerBlockType('charitable/donation-form', {
    title: __('Donation Form'),

    category: 'widgets',

    icon: blockIcon,

    keywords: [__('Donate'), __('Charitable')],

    edit: function edit(props) {
        var onChangeCampaign = function onChangeCampaign() {
            props.setAttributes({ campaign: !props.attributes.campaign });
        };

        return [!!props.focus && wp.element.createElement(
            InspectorControls,
            { key: 'inspector',
                description: __('Configure')
            },
            wp.element.createElement(__WEBPACK_IMPORTED_MODULE_0__campaign_select_index_js__["a" /* default */], {
                key: 'campaign-select',
                label: __('Campaign'),
                selectedCampaign: props.attributes.campaign,
                onChange: onChangeCampaign
            })
        ), wp.element.createElement(
            'p',
            null,
            __('DONATION FORM')
        )];
    },

    save: function save() {
        return null;
    }
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_querystringify__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_querystringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_querystringify__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * External dependencies
 */

// import { unescape as unescapeString, repeat, flatMap, compact } from 'lodash';

var InspectorControls = wp.blocks.InspectorControls;
var SelectControl = InspectorControls.SelectControl;
var withAPIData = wp.components.withAPIData;


function CampaignSelect(_ref) {
	var label = _ref.label,
	    campaigns = _ref.campaigns,
	    selectedCampaign = _ref.selectedCampaign,
	    onChange = _ref.onChange;

	if (campaigns.isLoading) {
		return;
	}

	console.log(campaigns);
	var options = campaigns.data.map(function (campaign) {
		return {
			label: campaign.name,
			value: campaign.id
		};
	});

	return wp.element.createElement(SelectControl, _extends({ label: label, onChange: onChange, options: options }, {
		value: selectedCampaign
	}));
}

/* harmony default export */ __webpack_exports__["a"] = (withAPIData(function () {
	var query = Object(__WEBPACK_IMPORTED_MODULE_0_querystringify__["stringify"])({
		per_page: 100,
		_fields: ['id', 'name', 'parent']
	});
	return {
		campaigns: '/wp/v2/campaigns?' + query
	};
})(CampaignSelect));

// export default applyWithAPIData( CampaignSelect );

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (;
    part = parser.exec(query);
    result[decode(part[1])] = decode(part[2])
  );

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ })
/******/ ]);