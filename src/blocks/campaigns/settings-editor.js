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
		this.toggleIncludeInactive      = this.toggleIncludeInactive.bind( this );
		this.closeDisplayOptionSettings = this.closeDisplayOptionSettings.bind( this );
		this.updateDisplayOption        = this.updateDisplayOption.bind( this );
		this.getCurrentDisplayOption    = this.getCurrentDisplayOption.bind( this );
		this.getCurrentView             = this.getCurrentView.bind( this );
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
	 * Close the display option settings view.
	 */
	closeDisplayOptionSettings() {
		this.setState( {
			display_option_settings_open: false,
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
		const { attributes, setAttributes } = this.props;

		let settingsView = null;

		if ( !! this.state.display_option_settings_open ) {
			
			switch ( this.state.display_option ) {
				case 'all' :
					settingsView = <AllSettingsView
						attributes={ attributes }
						update_include_inactive_callback={ this.toggleIncludeInactive }
					/>
					break;

				case 'filter' :
					settingsView = <FilterSettingsView
						attributes={ attributes }
						update_include_inactive_callback={ this.toggleIncludeInactive }
					/>
					break;

				case 'specific' :
					settingsView = <SpecificSettingsView
						attributes={ attributes }
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

		let returnLink = null;

		if ( !! this.state.display_option_settings_open ) {
			returnLink = (
				<div className="charitable-block-settings-breadcrumbs">
					<a href="#" onClick={ this.closeDisplayOptionSettings }>
						{ __( 'Display different campaigns', 'charitable' ) }
					</a>
				</div>
			);
		}

		return (
			<div class="charitable-block-settings charitable-block-settings-campaigns">
				<div className="charitable-block-settings-heading">
					<h4 className="charitable-block-settings-title">{ icon } { __( 'Campaigns', 'charitable' ) }</h4>
				</div>
				<div className="charitable-block-settings-campaigns-subheading">
					<p><strong>{ __( 'Currently showing:', 'charitable' ) }</strong>&nbsp;{ this.getCurrentDisplayOption() }</p>
				</div>
				{ returnLink }
				{ this.getCurrentView() }
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

/**
 * List all display options.
 */
class DisplayOptions extends Component {

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
					<DisplayOption
						selected_display_option={ selected_display_option }
						update_display_option_callback={ update_display_option_callback }
						option="all"
						label={ __( 'Show all campaigns', 'charitable' ) }
					/>
					<DisplayOption
						selected_display_option={ selected_display_option }
						update_display_option_callback={ update_display_option_callback }
						option="filter"
						label={ __( 'Filter by category, tag or campaign creator', 'charitable' ) }
					/>
					<DisplayOption
						selected_display_option={ selected_display_option }
						update_display_option_callback={ update_display_option_callback }
						option="specific"
						label={ __( 'Choose specific campaigns', 'charitable' ) }
					/>
				</ul>
			</div>
		);
	}
}

/**
 * Display a single display option row.
 */
class DisplayOption extends Component {

	/**
	 * Render the display options.
	 */
	render() {
		const { option, label, selected_display_option, update_display_option_callback } = this.props;

		return (
			<li className={ option === selected_display_option ? 'active-option' : '' }  onClick={ () => update_display_option_callback( option ) }>
				{ option === selected_display_option ? <Dashicon icon="yes" /> : '' }
				{ label }
				<button onClick={ () => update_display_option_callback( option ) } className="charitable-block-settings-campaigns--display-options-button" type="button">
					<Dashicon icon="admin-generic" />
				</button>
			</li>
		);
	}
}

/**
 * Specific campaign settings view.
 */
class SpecificSettingsView extends Component {
	
	/**
	 * Render the view.
	 */
	render() {
		const { attributes, setAttributes } = this.props;
		const { campaigns, columns }        = attributes;

		return (
			<div className="charitable-block-settings-view charitable-block-settings-view--specific">
				<CampaignSelect 
					attributes={ attributes }
					label={ __( 'Choose campaigns', 'charitable' ) }
					selected_campaigns={ campaigns }
					update_campaign_setting_callback={ ( value ) => setAttributes( { campaigns: value } ) }
					multiple={ true }
					columns={ columns }
				/>
			</div>
		);
	}
}

/**
 * All campaigns settings view.
 */
class AllSettingsView extends Component {
	
	/**
	 * Render the view.
	 */
	render() {
		const { attributes, setAttributes, update_include_inactive_callback } = this.props;
		const { campaignsToExclude, includeInactive } = attributes;
		
		return (
			<div className="charitable-block-settings-view charitable-block-settings-view--all">
				{/* <Filter title={ __( 'Status', 'charitable' ) } enabled={ !! includeInactive }> */}
					<ToggleControl
						label={ __( 'Include inactive campaigns', 'charitable' ) }
						checked={ !! includeInactive }
						onChange={ update_include_inactive_callback }
					/>
				{/* </Filter>
				<Filter title={ __( 'Exclude campaigns', 'charitable' ) } enabled={ campaignsToExclude.length > 0 }> */}
					<CampaignSelect 
						attributes={ attributes }
						label={ __( 'Campaigns to exclude', 'charitable' ) }
						selected_campaigns={ campaignsToExclude }
						update_campaign_setting_callback={ ( value ) => setAttributes( { campaignsToExclude: value } ) }
						multiple="true"
					/>
				{/* </Filter> */}
			</div>
		);
	}
}

/**
 * Filtered campaigns settings view.
 */
class FilterSettingsView extends Component {
	
	/**
	 * Render the view.
	 */
	render() {
		const { attributes, setAttributes } = this.props;
		const { campaigns, columns }        = attributes;

		return (
			<div className="charitable-block-settings-view charitable-block-settings-view--filter">
				<CampaignSelect 
					attributes={ attributes }
					selected_campaigns={ campaigns }
					update_campaign_setting_callback={ ( value ) => setAttributes( { campaigns: value } ) }
					multiple={ true }
					columns={ columns }
				/>
			</div>
		);
	}
}