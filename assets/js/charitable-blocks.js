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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_querystringify__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_querystringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_querystringify__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * External dependencies
 */


var InspectorControls = wp.blocks.InspectorControls;
var SelectControl = InspectorControls.SelectControl;
var withAPIData = wp.components.withAPIData;


var getCampaignOptions = function getCampaignOptions(campaigns) {
	if (campaigns.data.length === 0) {
		return {};
	}

	return campaigns.data.map(function (campaign) {
		return {
			label: campaign.title.rendered,
			value: campaign.id
		};
	});
};

function CampaignSelect(_ref) {
	var label = _ref.label,
	    campaigns = _ref.campaigns,
	    selectedCampaign = _ref.selectedCampaign,
	    onChange = _ref.onChange;

	if (!campaigns.data) {
		return "loading!";
	}

	var options = getCampaignOptions(campaigns);

	return wp.element.createElement(SelectControl, _extends({ label: label, onChange: onChange, options: options }, {
		value: selectedCampaign
	}));
}

/* harmony default export */ __webpack_exports__["a"] = (withAPIData(function () {
	var query = Object(__WEBPACK_IMPORTED_MODULE_0_querystringify__["stringify"])({
		per_page: 100,
		_fields: ['id', 'title', 'parent']
	});
	return {
		campaigns: '/wp/v2/campaigns?' + query
	};
})(CampaignSelect));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__donation_form___ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__donors___ = __webpack_require__(6);
/**
 * Load blocks.
 */



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__campaign_select_index_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__icon__ = __webpack_require__(5);



var __ = wp.i18n.__;
var _wp$blocks = wp.blocks,
    registerBlockType = _wp$blocks.registerBlockType,
    InspectorControls = _wp$blocks.InspectorControls,
    BlockDescription = _wp$blocks.BlockDescription;
var withAPIData = wp.components.withAPIData;
var SelectControl = InspectorControls.SelectControl;


registerBlockType('charitable/donation-form', {
    title: __('Donation Form'),

    category: 'widgets',

    icon: __WEBPACK_IMPORTED_MODULE_1__icon__["a" /* default */],

    keywords: [__('Donate'), __('Charitable')],

    edit: function edit(props) {
        var setCampaign = function setCampaign(campaign) {
            return props.setAttributes({ campaign: campaign });
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
                onChange: setCampaign
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


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var icon = wp.element.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: "20px", height: "20px", viewBox: "0 0 20 20" },
    wp.element.createElement("path", { d: "M17.69,2.31V5.69H2.31V2.31H17.69M20,0H0V8H20V0Z" }),
    wp.element.createElement("path", { d: "M17.69,8.31v3.38H2.31V8.31H17.69M20,6H0v8H20V6Z" }),
    wp.element.createElement("path", { d: "M17.69,14.31v3.38H2.31V14.31H17.69M20,12H0v8H20V12Z" })
);

/* harmony default export */ __webpack_exports__["a"] = (icon);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__icon__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__block__ = __webpack_require__(8);
/**
 * Block dependencies
 */



/**
 * Internal block libraries
 */
var __ = wp.i18n.__;
var registerBlockType = wp.blocks.registerBlockType;

/**
 * Register block
 */

registerBlockType('charitable/donors', {
    title: __('Donors'),

    category: 'widgets',

    icon: __WEBPACK_IMPORTED_MODULE_0__icon__["a" /* default */],

    keywords: [__('Donator'), __('Charitable'), __('Backer')],

    edit: __WEBPACK_IMPORTED_MODULE_1__block__["a" /* default */],

    save: function save() {
        return wp.element.createElement(
            'p',
            null,
            __('DONORS')
        );
    }
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var icon = wp.element.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: "20px", height: "20px", viewBox: "0 0 20 20" },
    wp.element.createElement("path", { d: "M0,0V20H20V0ZM10,3A3,3,0,1,1,7,6,3,3,0,0,1,10,3Zm5,14H5V12.89A2.89,2.89,0,0,1,7.89,10h4.22A2.89,2.89,0,0,1,15,12.89Z" })
);

/* harmony default export */ __webpack_exports__["a"] = (icon);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__campaign_select_index_js__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Block dependencies
 */


/**
 * WordPress dependencies
 */
var __ = wp.i18n.__;
var Component = wp.element.Component;
var _wp$blocks = wp.blocks,
    InspectorControls = _wp$blocks.InspectorControls,
    BlockDescription = _wp$blocks.BlockDescription;
var _wp$components = wp.components,
    PanelBody = _wp$components.PanelBody,
    PanelRow = _wp$components.PanelRow,
    withAPIData = _wp$components.withAPIData;
var SelectControl = InspectorControls.SelectControl,
    ToggleControl = InspectorControls.ToggleControl,
    RangeControl = InspectorControls.RangeControl;

var CharitableDonorsBlock = function (_Component) {
    _inherits(CharitableDonorsBlock, _Component);

    function CharitableDonorsBlock() {
        _classCallCheck(this, CharitableDonorsBlock);

        var _this = _possibleConstructorReturn(this, (CharitableDonorsBlock.__proto__ || Object.getPrototypeOf(CharitableDonorsBlock)).apply(this, arguments));

        _this.toggleDisplayDonorName = _this.toggleDisplayDonorName.bind(_this);
        _this.toggleDisplayDonorLocation = _this.toggleDisplayDonorLocation.bind(_this);
        _this.toggleDisplayDonorAvatar = _this.toggleDisplayDonorAvatar.bind(_this);
        return _this;
    }

    _createClass(CharitableDonorsBlock, [{
        key: 'toggleDisplayDonorName',
        value: function toggleDisplayDonorName() {
            var displayDonorName = this.props.attributes.displayDonorName;
            var setAttributes = this.props.setAttributes;


            setAttributes({ displayDonorName: !displayDonorName });
        }
    }, {
        key: 'toggleDisplayDonorLocation',
        value: function toggleDisplayDonorLocation() {
            var displayDonorLocation = this.props.attributes.displayDonorLocation;
            var setAttributes = this.props.setAttributes;


            setAttributes({ displayDonorLocation: !displayDonorLocation });
        }
    }, {
        key: 'toggleDisplayDonorAvatar',
        value: function toggleDisplayDonorAvatar() {
            var displayDonorAvatar = this.props.attributes.displayDonorAvatar;
            var setAttributes = this.props.setAttributes;


            setAttributes({ displayDonorAvatar: !displayDonorAvatar });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var setCampaign = function setCampaign(campaign) {
                return _this2.props.setAttributes({ campaign: campaign });
            };
            var _props = this.props,
                attributes = _props.attributes,
                focus = _props.focus,
                setAttributes = _props.setAttributes;
            var number = attributes.number,
                orderBy = attributes.orderBy,
                campaign = attributes.campaign,
                displayDonorName = attributes.displayDonorName,
                displayDonorLocation = attributes.displayDonorLocation,
                displayDonorAvatar = attributes.displayDonorAvatar;


            var inspectorControls = focus && wp.element.createElement(
                InspectorControls,
                { key: 'inspector', description: __('Configure') },
                wp.element.createElement(
                    PanelBody,
                    { title: __('Filter & Sort') },
                    wp.element.createElement(
                        PanelRow,
                        null,
                        wp.element.createElement(RangeControl, {
                            key: 'filter-panel-number-control',
                            label: __('Number of donors'),
                            value: number,
                            onChange: function onChange(value) {
                                return setAttributes({ number: value });
                            },
                            min: '-1',
                            max: '999'
                        })
                    ),
                    wp.element.createElement(
                        PanelRow,
                        null,
                        wp.element.createElement(__WEBPACK_IMPORTED_MODULE_0__campaign_select_index_js__["a" /* default */], {
                            key: 'filter-panel-campaign-select',
                            label: __('Campaign'),
                            selectedCampaign: campaign,
                            onChange: setCampaign
                        })
                    ),
                    wp.element.createElement(
                        PanelRow,
                        null,
                        wp.element.createElement(SelectControl, {
                            key: 'filter-panel-orderby-select',
                            label: __('Order by'),
                            value: orderBy,
                            options: [{
                                label: __('Most recent'),
                                value: 'recent'
                            }, {
                                label: __('Amount donated'),
                                value: 'amount'
                            }],
                            onChange: function onChange(value) {
                                return setAttributes({ orderBy: value });
                            }
                        })
                    )
                ),
                wp.element.createElement(
                    PanelBody,
                    { title: __('Display Settings') },
                    wp.element.createElement(
                        PanelRow,
                        null,
                        wp.element.createElement(ToggleControl, {
                            label: __('Display the name of the donor'),
                            checked: displayDonorName,
                            onChange: this.toggleDisplayDonorName
                        })
                    ),
                    wp.element.createElement(
                        PanelRow,
                        null,
                        wp.element.createElement(ToggleControl, {
                            label: __('Display the location of the donor'),
                            checked: displayDonorLocation,
                            onChange: this.toggleDisplayDonorLocation
                        })
                    ),
                    wp.element.createElement(
                        PanelRow,
                        null,
                        wp.element.createElement(ToggleControl, {
                            label: __('Display the avatar of the donor'),
                            checked: displayDonorAvatar,
                            onChange: this.toggleDisplayDonorAvatar
                        })
                    )
                )
            );

            return [inspectorControls, wp.element.createElement(
                'p',
                null,
                __('DONORS')
            )];
        }
    }]);

    return CharitableDonorsBlock;
}(Component);

/* harmony default export */ __webpack_exports__["a"] = (CharitableDonorsBlock);

/***/ })
/******/ ]);