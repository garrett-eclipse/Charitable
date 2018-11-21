/**
 * Block dependencies
 */
import icon from './icon';
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
 * The campaigns block settings area in Edit mode.
 */
class CampaignsBlockSettingsEditor extends Component {
	
	/**
	 * Construtor.
	 */
	constructor( props ) {
		super( props );
		// this.state = {
		// }
		// this.updateDisplay = this.updateDisplay.bind( this );
		// this.closeMenu     = this.closeMenu.bind( this );
		this.toggleIncludeInactive = this.toggleIncludeInactive.bind( this );
	}

	/**
	 * Toggle the includeInactive setting.
	 */
	toggleIncludeInactive() {
		const { attributes, setAttributes } = this.props;
		const { includeInactive } = attributes;

		setAttributes( { includeInactive: ! includeInactive } );
	}
	
	/**
	 * Render the settings.
	 */
	render() {
		const { attributes, setAttributes } = this.props;
		const { categories, includeInactive, campaigns, campaignsToExclude, creator } = attributes;

		const getOpenFilters = () => {
			let openFilters = [];

			if ( categories.length > 0 ) {
				openFilters.push( 'categories' );
			}

			if ( !! includeInactive ) {
				openFilters.push( 'status' );
			}
			
			if ( campaigns.length > 0 || campaignsToExclude.length > 0 ) {
				openFilters.push( 'campaigns' );
			}
			
			if ( creator !== '' ) {
				openFilters.push( 'creator' );
			}

			return openFilters;
		};
		
		const openFilters = getOpenFilters();

		return (
			<div class="charitable-block-settings charitable-block-settings-campaigns">
				<div className="charitable-block-settings-heading">
					<h4 className="charitable-block-settings-title">{ icon } { __( 'Campaigns', 'charitable' ) }</h4>
				</div>
				<h5>{ __( 'Filters', 'charitable' ) }</h5>
				<Filter title={ __( 'Category', 'charitable' ) } enabled={ openFilters.includes( 'categories' ) }>
					<CampaignCategorySelect 
						attributes={ attributes }
						selected_categories={ categories }
						update_category_setting_callback={ ( value ) => setAttributes( { categories: value } ) }
					/>
				</Filter>
				<Filter title={ __( 'Status', 'charitable' ) } enabled={ openFilters.includes( 'status' ) }>
					<ToggleControl
						label={ __( 'Include inactive campaigns', 'charitable' ) }
						checked={ !! includeInactive }
						onChange={ this.toggleIncludeInactive }
					/>
				</Filter>
				<Filter title={ __( 'Specific Campaigns', 'charitable' ) } enabled={ openFilters.includes( 'campaigns' ) }>
					<h5>{ __( 'Campaigns to Include:', 'charitable' ) }</h5>
					<CampaignSelect 
						attributes={ attributes }
						selected_campaigns={ campaigns }
						update_campaign_setting_callback={ ( value ) => setAttributes( { campaigns: value } ) }
						multiple="true"
					/>
					<h5>{ __( 'Campaigns to Exclude:', 'charitable' ) }</h5>
					<CampaignSelect 
						attributes={ attributes }
						selected_campaigns={ campaignsToExclude }
						update_campaign_setting_callback={ ( value ) => setAttributes( { campaignsToExclude: value } ) }
						multiple="true"
					/>
				</Filter>
				<Filter title={ __( 'Creator', 'charitable' ) } enabled={ openFilters.includes( 'creator' ) }>
					
				</Filter>
					{/* <PanelRow>
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
					</PanelRow> */}
			</div>
		);
	}
}

/**
 * The campaigns block UI.
 */
class CharitableCampaignsBlock extends Component {
	constructor() {
		super( ...arguments );

		this.toggleMasonryLayout    = this.toggleMasonryLayout.bind( this );
		this.toggleResponsiveLayout = this.toggleResponsiveLayout.bind( this );
		this.getInspectorControls   = this.getInspectorControls.bind( this );
		this.getToolbarControls     = this.getToolbarControls.bind( this );
		this.getSettingsEditor      = this.getSettingsEditor.bind( this );
		this.getPreview             = this.getPreview.bind( this );
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
		let props = this.props;
		const { attributes, setAttributes } = props;
		const { editMode } = attributes;

		const editButton = [
			{
				icon: 'filter',
				title: __( 'Filter Campaigns', 'charitable' ),
				onClick: () => setAttributes( { editMode: ! editMode } ),
				isActive: editMode,
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
			<CampaignsBlockSettingsEditor { ...this.props } />
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
		const { attributes } = this.props;
		const { editMode } = attributes;
		
		return [
			this.getInspectorControls(),
			this.getToolbarControls(),
			editMode ? this.getSettingsEditor() : this.getPreview()
		];
	}
}

export default CharitableCampaignsBlock;