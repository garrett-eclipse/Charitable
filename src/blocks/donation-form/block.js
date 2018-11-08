import CampaignSelect from './../../components/campaign-select/index.js';

/**
 * WP dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    Toolbar,
    ServerSideRender
} = wp.components;
const {
    BlockControls,
} = wp.editor;

/**
 * Display the campaign selection component.
 */
class CharitableCampaignSelect extends Component {
 
    /**
     * Render component UI.
     */
    render() {
        const setCampaign = ( campaign ) => {
            this.props.setAttributes( {
                campaign: campaign,
                edit_mode: ! campaign
            } );
        }

		return (
			<CampaignSelect
                key="campaign-select"
                label={ __( 'Campaign' ) }
                withOptions={ [
                    {
                        label: __( 'Select a campaign' ),
                        value: '',
                    }
                ] }
                selectedOption={ this.props.attributes.campaign }
                onChange={ setCampaign }
            />
		);
	}
}

/**
 * The main donation form block UI.
 */
export default class CharitableDonationFormBlock extends Component {
    constructor() {
        super( ...arguments );

        this.props.attributes.edit_mode = ! this.props.attributes.campaign;

        this.getInspectorControls = this.getInspectorControls.bind( this );
        this.getToolbarControls = this.getToolbarControls.bind( this );
        this.getSettingsEditor = this.getSettingsEditor.bind( this );
        this.getPreview = this.getPreview.bind( this );
    }

    /**
	 * Get the components for the sidebar settings area that is rendered while focused on a Donation Form block.
	 *
	 * @return Component
	 */
	getInspectorControls() {
        return '';
    }
    
    /**
	 * Get the components for the toolbar area that appears on top of the block when focused.
	 *
	 * @return Component
	 */
	getToolbarControls() {
		let props = this.props;
		const { attributes, setAttributes } = props;
		const { campaign, edit_mode } = attributes;

		const editButton = [
			{
				icon: 'edit',
				title: __( 'Edit' ),
				onClick: ! campaign ? function(){} : () => setAttributes( { edit_mode: ! edit_mode } ),
				isActive: edit_mode,
			},
		];

		return (
			<BlockControls key="controls">
				<Toolbar controls={ editButton } />
			</BlockControls>
		);
    }
    
    /**
	 * Get the block settings editor UI.
	 *
	 * @return Component
	 */
	getSettingsEditor() {
        const { attributes, setAttributes } = this.props;

        return (
            <div class="charitable-block-donation-form">
                <CharitableCampaignSelect { ...this.props } />
            </div>
		);
    }

    /**
     * Get the block preview.
     */
    getPreview() {
        return (
            <div class="charitable-block-donation-form has-preview">
                <div class="charitable-block-overlay"></div>
                <ServerSideRender
                    block="charitable/donation-form"
                    attributes={ this.props.attributes }
                />
            </div>
        );
    }
    
    /**
     * Render the block UI.
     */
    render() {
		const { attributes } = this.props;
        const { edit_mode } = attributes;
        
        return [
            this.getInspectorControls(),
            this.getToolbarControls(),
            edit_mode ? this.getSettingsEditor() : this.getPreview(),
        ];
    }
}
