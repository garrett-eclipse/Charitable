/**
 * Block dependencies
 */
import CampaignSelect from './../../components/campaign-select/index.js';
import { CampaignCategorySelect } from './../../components/category-select/index.js';

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
	RangeControl
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

		this.toggleMasonryLayout = this.toggleMasonryLayout.bind( this );
		this.toggleResponsiveLayout = this.toggleResponsiveLayout.bind( this );
		this.getInspectorControls = this.getInspectorControls.bind( this );
		this.getToolbarControls = this.getToolbarControls.bind( this );
		this.getSettingsEditor = this.getSettingsEditor.bind( this );
		this.getPreview = this.getPreview.bind( this );
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
				{/* <CampaignCategorySelect
					key="category-select"
					label={ __( 'Category', 'charitable' ) }
					noOptionLabel={ __( 'All', 'charitable' ) }
					selectedCategory={ category }
					onChange={ ( value ) => setAttributes( { category: '' !== value ? value : undefined } ) }
				/> */}
				<RangeControl
					key="number-control"
					label={ __( 'Number of campaigns', 'charitable' ) }
					value={ number }
					onChange={ ( value ) => setAttributes( { number: value } ) }
					min="-1"
					max="999"
				/>
				{/* <CampaignSelect
					key="campaign-select"
					label={ __( 'Campaigns', 'charitable' ) }
					withOptions={ [
						{
							label: __( 'All Campaigns', 'charitable' ),
							value: 'all',
						}
					] }
					selectedOption={ campaigns }
					onChange={ ( value ) => setAttributes( { campaigns: value } ) }
					multiple
				/> */}
				<PanelBody title={ __( 'Display Settings', 'charitable' ) }>
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
			<div class="charitable-block-campaigns">
				<CampaignCategorySelect { ...this.props } 
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
		// const { attributes, isSelected, setAttributes } = this.props;
		// const { category, number, campaigns, orderBy, order, columns, masonryLayout, responsiveLayout } = attributes;
		
		return [
			this.getInspectorControls(),
			// this.getPreview(),
			this.getSettingsEditor()
		];
	}
}

export default CharitableCampaignsBlock;