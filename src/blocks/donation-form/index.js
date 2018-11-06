import CampaignSelect from './../../components/campaign-select/index.js';
import icon from './icon';

const { __ } = wp.i18n;

const {
    registerBlockType,
    BlockDescription
} = wp.blocks;

const {
    InspectorControls
} = wp.editor

const {
    SelectControl,
    ServerSideRender
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
        const orderBy = 'recent';

        return [
            <InspectorControls key="inspector"
                description={ __( 'Configure' ) }
                >
                <CampaignSelect
                    key="campaign-select"
                    label={ __( 'Campaign' ) }
                    selectedOption={ props.attributes.campaign }
                    onChange={ setCampaign }
                />
            </InspectorControls>,
            <ServerSideRender
                block="charitable/donation-form"
                attributes={ props.attributes }
            />
        ];
    },

    save: function() {
        return null;
    },
});