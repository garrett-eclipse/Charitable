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
    title : __( 'Campaigns' ),

    category : 'widgets',

    icon: icon,

    keywords: [
        __( 'Fundraisers' ),
        __( 'Charitable' ),
        __( 'Donation' )
    ],
    
    edit: CharitableCampaignsBlock,

    save() {
        return null;
    }
} );