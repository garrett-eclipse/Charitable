import CampaignSelect from './../../components/campaign-select/index.js';
import icon from './icon';

const { __ } = wp.i18n;
const {
    registerBlockType,
    InspectorControls,
    BlockDescription,
} = wp.blocks;
const {
    withAPIData,
    SelectControl
} = wp.components;

registerBlockType( 'charitable/donation-form', {
    title : __( 'Donation Form' ),

    category : 'widgets',

    icon: icon,

    keywords: [
        __( 'Donate' ),
        __( 'Charitable' ),
    ],
    
    edit:  props => {
        const setCampaign = ( campaign ) => props.setAttributes( { campaign: campaign } );

        return [
            props.isSelected && (
                <InspectorControls key="inspector"
                    description={ __( 'Configure' ) }
                    >
                    <CampaignSelect
                        key="campaign-select"
                        label={ __( 'Campaign' ) }
                        selectedOption={ props.attributes.campaign }
                        onChange={ setCampaign }
                    />
                </InspectorControls>
            ),
            <p key="donation-form">
                { __( 'DONATION FORM' ) }
            </p>
        ];
    },

    save: function() {
        return null;
    },
});