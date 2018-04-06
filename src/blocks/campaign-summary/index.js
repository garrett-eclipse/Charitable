/**
 * Block dependencies
 */
import icon from './icon';
import CharitableCampaignSummaryBlock from './block';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

// import { getCurrentPostType } from '../../store/selectors';
// import { getCurrentPostType } from '../../store/selectors';

/**
 * Register block
 */
registerBlockType( 'charitable/campaign-summary', {
    title : __( 'Campaign Summary' ),

    category : 'widgets',

    icon: icon,

    keywords: [
        __( 'Fundraisers' ),
        __( 'Charitable' ),
        __( 'Donation' )
    ],
    
    edit: CharitableCampaignSummaryBlock,

    save() {
        return null;
    }
} );