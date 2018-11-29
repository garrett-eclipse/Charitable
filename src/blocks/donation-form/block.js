import { CampaignSelect } from './../../components/campaign-select/index.js';

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
 * The main donation form block UI.
 */
export default class CharitableDonationFormBlock extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			edit_mode: ! this.props.attributes.campaign,
		};

		this.getInspectorControls = this.getInspectorControls.bind( this );
		this.getToolbarControls   = this.getToolbarControls.bind( this );
		this.getSettingsEditor    = this.getSettingsEditor.bind( this );
		this.getPreview           = this.getPreview.bind( this );
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
		const { edit_mode } = this.state;
		const { attributes, setAttributes } = this.props;
		const { campaign } = attributes;		

		const editButton = [
			{
				icon: 'edit',
				title: __( 'Edit' ),
				onClick: ! campaign ? function(){} : () => this.setState( { edit_mode: ! edit_mode } ),
				isActive: this.state.edit_mode,
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
		const self = this;
		const { attributes, setAttributes } = this.props;
		const { campaign } = attributes;

		let selected_campaigns = !! campaign ? [ campaign ] : [];
		
		return (
			<div class="charitable-block-donation-form charitable-block-settings">
				<CampaignSelect
					attributes={ attributes }
					selected_campaigns={ selected_campaigns }
					update_campaign_setting_callback={ ( campaign ) => {
						setAttributes( {
							campaign: campaign[0]
						} );

						self.setState( {
							edit_mode: ! campaign.length
						} );
					} }
					multiple={ false }
					campaign_active_status="active"
				/>
			</div>
		);
	}

	/**
	 * Get the block preview.
	 *
	 * @return Component
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
		return [
			this.getInspectorControls(),
			this.getToolbarControls(),
			this.state.edit_mode ? this.getSettingsEditor() : this.getPreview(),
		];
	}
}
