/**
 * Block dependencies
 */
import icon from './icon';
import CharitableCampaignsBlock from './block';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Register block
 */
registerBlockType( 'charitable/campaigns', {
    /**
     * The block title.
     */
    title : __( 'Campaigns', 'charitable' ),

    /**
     * Block description.
     */
    description: __( 'Display a list or grid of campaigns.', 'charitable' ),

    /**
     * Type of block. This controls where it will be found in the block UI.
     */
    category : 'widgets',

    /**
     * Block icon.
     */
    icon: icon,

    /**
     * Keywords used to find the block.
     */
    keywords: [
        __( 'Fundraisers' ),
        __( 'Charitable' ),
        __( 'Donation' )
    ],

    /**
     * Block attributes.
     */
    attributes: {
        /**
         * The category of campaigns to show.
         */
        categories : {
            type : 'array',
            default : [],
            items : {
                type: 'string',
            },
        },

        /**
         * Whether to hide inactive campaigns.
         */
        includeInactive: {
            type: 'boolean',
            default: false,
        },

        /**
         * Specific campaigns to show.
         */
        campaigns: {
            type: 'array',
            default: [],
            items : {
                type: 'number',
            },
        },

        /**
         * Specific campaigns to exclude.
         */
        campaignsToExclude: {
            type: 'array',
            default: [],
            items : {
                type: 'number',
            },
        },
        
        /**
         * A campaign creator whose campaigns will be shown.
         */
        creator: {
            type: 'string',
            default: '',
        },

        /**
         * Whether to show the campaigns in ascending or descending order.
         */
        order : {
            type    : 'string',
            default : 'DESC',
        },
        
        /**
         * The criteria to order campaigns by.
         */
        orderBy : {
            type    : 'string',
            default : 'post_date',
        },

        /**
         * The number of campaigns to show.
         */
        number : {
            type    : 'number',
            default : 10,
        },

        /**
         * The number of columns to show.
         */
        columns : {
            type    : 'number',
            default : 2,
        },

        /**
         * Whether to use the masonry layout.
         */
        masonryLayout : {
            type    : 'boolean',
            default : false,
        },

        /**
         * Whether to use a responsive layout.
         */
        responsiveLayout : {
            type    : 'boolean',
            default : true,
        },

        /**
		 * Whether the block is in edit or preview mode.
		 */
		editMode: {
			type: 'boolean',
			default: false,
        },
    },

    /**
     * Define the block UI.
     */
    edit: props => {
        return <CharitableCampaignsBlock { ... props } />
    },

    /**
     * How the block is saved to the database.
     */
    save() {
        return null;
    }
} );