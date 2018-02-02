import CampaignSelect from './../campaign-select/index.js';
import icon from './icon';

const { __ } = wp.i18n;
const {
    registerBlockType,
    InspectorControls,
    BlockDescription,
} = wp.blocks;
const { withAPIData } = wp.components;
const {
    SelectControl
} = InspectorControls;

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
            !! props.focus && (
                <InspectorControls key="inspector"
                    description={ __( 'Configure' ) }
                    >
                    <CampaignSelect
                        key="campaign-select"
                        label={ __( 'Campaign' ) }
                        selectedCampaign={ props.attributes.campaign }
                        onChange={ setCampaign }
                    />
                </InspectorControls>
            ),
            <p>
                { __( 'DONATION FORM' ) }
            </p>
        ];
    },

    save: function() {
        return null;
    },
});