/**
 * Block dependencies
 */
import icon from './icon';
import CharitableDonorsBlock from './block';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Register block
 */
registerBlockType( 'charitable/donors', {
    title : __( 'Donors' ),

    category : 'widgets',

    icon: icon,

    keywords: [
        __( 'Donations' ),
        __( 'Charitable' ),
        __( 'Backer' )
    ],
    
    edit: CharitableDonorsBlock,

    save: () => {
        return (
            <p>
                { __( 'DONORS' ) }
            </p>
        );
    }
});