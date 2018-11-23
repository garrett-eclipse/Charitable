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

/**
 * The campaigns block settings area in Edit mode.
 */
export class SettingsEditor extends Component {
	
	/**
	 * Construtor.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			display_option: 'all',
			display_option_settings_open: false,
		}

		// this.updateDisplay = this.updateDisplay.bind( this );
		// this.closeMenu     = this.closeMenu.bind( this );
		this.toggleIncludeInactive   = this.toggleIncludeInactive.bind( this );
		this.updateDisplayOption     = this.updateDisplayOption.bind( this );
		this.getCurrentDisplayOption = this.getCurrentDisplayOption.bind( this );
		this.getCurrentView          = this.getCurrentView.bind( this );
	}

	/**
	 * When the component is mounted, set the display_option.
	 */
	componentDidMount() {
		const { attributes } = this.props;
		const { campaigns, categories, creator } = attributes;
		
		let display_option = 'all';

		if ( campaigns.length ) {
			display_option = 'specific';
		} else {
			if ( categories.length || creator.length ) {
				display_option = 'filter';
			}
		}

		this.setState( {
			display_option: display_option,
		} );
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
	 * Update the state of display_option.
	 */
	updateDisplayOption( option ) {
		const options = [ 'all', 'filter', 'specific' ]

		if ( options.includes( option ) ) {
			this.setState( {
				display_option: option,
				display_option_settings_open: true,
			} );
		}
	}

	/**
	 * Get the title for the current display option.
	 *
	 * @return string
	 */
	getCurrentDisplayOption() {
		let currentDisplayOption = null;

		switch ( this.state.display_option ) {
			case 'all' :
				currentDisplayOption = __( 'All active campaigns', 'charitable' );
				break;

			case 'filter' :
				currentDisplayOption = __( 'Filtered campaigns', 'charitable' );
				break;

			case 'specific' :
				currentDisplayOption = __( 'Specific campaigns', 'charitable' );
				break;
		}

		return currentDisplayOption;
	}

	/**
	 * Return the appropriate view to display.
	 *
	 * @return Component
	 */
	getCurrentView() {
		let settingsView = null;

		if ( !! this.state.display_option_settings_open ) {
			
			switch ( this.state.display_option ) {
				case 'all' :
					settingsView = <DisplayOptions
						attributes={ attributes }
						title={ __( 'Filter campaigns', 'charitable' ) }
						selected_display_option={ ( this.state.display_option ) }
						update_display_option_callback={ this.updateDisplayOption }
					/>
					break;

				case 'filter' :
					settingsView = <DisplayOptions
						attributes={ attributes }
						title={ __( 'Filter campaigns', 'charitable' ) }
						selected_display_option={ ( this.state.display_option ) }
						update_display_option_callback={ this.updateDisplayOption }
					/>
					break;

				case 'specific' :
					settingsView = <DisplayOptions
						attributes={ attributes }
						title={ __( 'Filter campaigns', 'charitable' ) }
						selected_display_option={ ( this.state.display_option ) }
						update_display_option_callback={ this.updateDisplayOption }
					/>
					break;
			}
		} else {
			settingsView = <DisplayOptions
				attributes={ attributes }
				title={ __( 'Filter campaigns', 'charitable' ) }
				selected_display_option={ ( this.state.display_option ) }
				update_display_option_callback={ this.updateDisplayOption }
			/>
		}

		return settingsView;
			
	}

	/**
	 * Render the settings.
	 */
	render() {
		const { attributes, setAttributes } = this.props;
		const { categories, includeInactive, campaigns, campaignsToExclude, creator, columns, displayOption } = attributes;

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

		let settingsView = null;

		if ( !! this.state.display_option_settings_open ) {
			switch ( this.state.display_option ) {
				case 'all' :
					currentDisplayOption = __( 'All active campaigns', 'charitable' );
					break;
	
				case 'filter' :
					currentDisplayOption = __( 'Filtered campaigns', 'charitable' );
					break;
	
				case 'specific' :
					currentDisplayOption = __( 'Specific campaigns', 'charitable' );
					break;
			}
		} else {
			settingsView = <DisplayOptions
				attributes={ attributes }
				title={ __( 'Filter campaigns', 'charitable' ) }
				selected_display_option={ ( this.state.display_option ) }
				update_display_option_callback={ this.updateDisplayOption }
			/>
		}

		return (
			<div class="charitable-block-settings charitable-block-settings-campaigns">
				<div className="charitable-block-settings-heading">
					<h4 className="charitable-block-settings-title">{ icon } { __( 'Campaigns', 'charitable' ) }</h4>
				</div>
				<div className="charitable-block-settings-campaigns-subheading">
					<p><strong>{ __( 'Currently showing:', 'charitable' ) }</strong>&nbsp;{ this.getCurrentDisplayOption() }</p>
				</div>
				{ settingsView }
				{/* <Filter title={ __( 'Category', 'charitable' ) } enabled={ openFilters.includes( 'categories' ) }>
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
						columns={ columns }
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
					
				</Filter> */}
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

class DisplayOptions extends Component {

	/**
	 * Constructor.
	 */
	constructor( props ) {
		super( props )
	}

	/**
	 * Render the display options.
	 */
	render() {
		const { attributes, title, selected_display_option, update_display_option_callback } = this.props;

		let header = title.length ? <p className="charitable-block-settings-campaigns--display-options-header"><strong>{ title }</strong></p> : '';

		return (
			<div className="charitable-block-settings-campaigns--display-options-wrapper">
				{ header }
				<ul className="charitable-block-settings-campaigns--display-options">
					<li className={ 'all' === selected_display_option ? 'active-option' : '' }  onClick={ () => update_display_option_callback( 'all' ) }>
						{ 'all' === selected_display_option ? <Dashicon icon="yes" /> : '' }
						{ __( 'Show all campaigns', 'charitable' ) }
						<button onClick={ () => update_display_option_callback( 'all' ) } className="charitable-block-settings-campaigns--display-options-button" type="button">
							<Dashicon icon="arrow-right-alt2" />
						</button>
					</li>
					<li className={ 'filter' === selected_display_option ? 'active-option' : '' }  onClick={ () => update_display_option_callback( 'filter' ) }>
						{ 'filter' === selected_display_option ? <Dashicon icon="yes" /> : '' }
						{ __( 'Filter by category, tag or campaign creator', 'charitable' ) }
						<button onClick={ () => update_display_option_callback( 'filter' ) } className="charitable-block-settings-campaigns--display-options-button" type="button">
							<Dashicon icon="arrow-right-alt2" />
						</button>
					</li>
					<li className={ 'specific' === selected_display_option ? 'active-option' : '' }  onClick={ () => update_display_option_callback( 'specific' ) }>
					{ 'specific' === selected_display_option ? <Dashicon icon="yes" /> : '' }
						{ __( 'Choose specific campaigns', 'charitable' ) }
						<button onClick={ () => update_display_option_callback( 'specific' ) } className="charitable-block-settings-campaigns--display-options-button" type="button">
							<Dashicon icon="arrow-right-alt2" />
						</button>
					</li>
				</ul>
			</div>
		);
	}
}