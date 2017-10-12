var el = wp.element.createElement,
    registerBlockType = wp.blocks.registerBlockType,

registerBlockType( 'charitable/donation-form', {
    title: 'Donation Form',
    icon: 'universal-access-alt',
    category: 'widgets',

    edit: function() {
        return el( 'p', { style: blockStyle }, 'Hello editor.' );
    },

    save: function() {
        return el( 'p', { style: blockStyle }, 'Hello saved content.' );
    },
} );