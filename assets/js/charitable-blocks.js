'use strict';

var _campaignSelect = require('./campaign-select.js');

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
            wp.element.createElement(_campaignSelect.CampaignSelect, {
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

// var el = wp.element.createElement,
//     registerBlockType = wp.blocks.registerBlockType;

// registerBlockType( 'charitable/donation-form', {
//     title: 'Donation Form',
//     icon: 'universal-access-alt',
//     category: 'widgets',

//     edit: function() {
//         return el( 'p', { style: blockStyle }, 'Hello editor.' );
//     },

//     save: function() {
//         return el( 'p', { style: blockStyle }, 'Hello saved content.' );
//     },
// } );

// console.log('hello');
//# sourceMappingURL=charitable-blocks.js.map
