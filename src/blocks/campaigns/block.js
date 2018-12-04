/**
 * Block dependencies
 */
import icon from './icon';
import { SettingsEditor } from './settings-editor.js';
import { CampaignSelect } from './../../components/campaign-select/index.js';
import { CampaignCategorySelect } from './../../components/category-select/index.js';
import { Filter } from './../../components/filter/index.js';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	Toolbar,
	ServerSideRender,
	PanelBody,
	PanelRow,
	SelectControl,
	ToggleControl,
	RangeControl,
	Dashicon
} = wp.components;
const {
	InspectorControls,
	BlockControls
} = wp.editor;

/**
 * The campaigns block UI.
 */
class CharitableCampaignsBlock extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			edit_mode: false,
		};

		this.updateEditMode         = this.updateEditMode.bind( this );
		this.toggleMasonryLayout    = this.toggleMasonryLayout.bind( this );
		this.toggleResponsiveLayout = this.toggleResponsiveLayout.bind( this );
		this.getInspectorControls   = this.getInspectorControls.bind( this );
		this.getToolbarControls     = this.getToolbarControls.bind( this );
		this.getSettingsEditor      = this.getSettingsEditor.bind( this );
		this.getPreview             = this.getPreview.bind( this );
	}

	/**
	 * Update edit mode in state.
	 */
	updateEditMode() {
		this.setState( {
			edit_mode: ! this.state.edit_mode
		} );
	}
	
	/**
	 * Turn the masonry layout on/off.
	 */
	toggleMasonryLayout() {
		const { masonryLayout } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { masonryLayout: ! masonryLayout } );
	}

	/**
	 * Turn responsive mode on/off.
	 */
	toggleResponsiveLayout() {
		const { responsiveLayout } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { responsiveLayout: ! responsiveLayout } );
	}    

	/**
	 * Get the components for the sidebar settings area that is rendered while focused on a Donation Form block.
	 *
	 * @return Component
	 */
	getInspectorControls() {
		const { attributes, setAttributes } = this.props;
        const { number, orderBy, order, columns, masonryLayout, responsiveLayout } = attributes;

		return (
			<InspectorControls
				key="inspector"
				description={ __( 'Configure', 'charitable' ) } >
				<PanelBody title={ __( 'Display Settings', 'charitable' ) }>
					<PanelRow>
						<SelectControl
							key="orderby-select"
							label={ __( 'Order by', 'charitable' ) }
							value={ orderBy }
							options={ [
								{
									label: __( 'Date created (newest to oldest)', 'charitable' ),
									value: 'post_date/DESC',
								},
								{
									label: __( 'Date created (oldest to newest)', 'charitable' ),
									value: 'post_date/ASC',
								},
								{
									label: __( 'Amount donated', 'charitable' ),
									value: 'popular/DESC',
								},
								{
									label: __( 'Time left (least first)', 'charitable' ),
									value: 'ending/DESC',
								},
								{
									label: __( 'Time left (longest first)', 'charitable' ),
									value: 'ending/ASC',
								}
							] }
							onChange={ ( value ) => {
								const [ newOrderBy, newOrder ] = value.split( '/' );
								if ( newOrder !== order ) {
									setAttributes( { order: newOrder } );
								}
								if ( newOrderBy !== orderBy ) {
									setAttributes( { orderBy: newOrderBy } );
								}
							} }
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl
							key="number-control"
							label={ __( 'Number of campaigns', 'charitable' ) }
							value={ number }
							onChange={ ( value ) => setAttributes( { number: value } ) }
							min="-1"
							max="999"
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl
							key="columns-select"
							label={ __( 'Columns', 'charitable' ) }
							value={ columns }
							min="1"
							max="4"
							onChange={ ( value ) => setAttributes( { columns: value } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Masonry layout', 'charitable' ) }
							checked={ masonryLayout }
							onChange={ this.toggleMasonryLayout }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Responsive layout', 'charitable' ) }
							checked={ responsiveLayout }
							onChange={ this.toggleResponsiveLayout }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		);
	}

	/**
	 * Get the components for the toolbar area that appears on top of the block when focused.
	 *
	 * @return Component
	 */
	getToolbarControls() {
		const editButton = [
			{
				icon: 'filter',
				title: __( 'Filter Campaigns', 'charitable' ),
				onClick: this.updateEditMode,
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
		return (
			<SettingsEditor { ...this.props } />
		);
	}

	/**
	 * Get the block preview.
	 *
	 * @return Component
	 */
	getPreview() {
		return (
			<div class="charitable-block-campaigns has-preview">
				<ServerSideRender
					block="charitable/campaigns"
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
			this.state.edit_mode ? this.getSettingsEditor() : this.getPreview()
		];
	}
}

export default CharitableCampaignsBlock;