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
		const { attributes, setAttributes } = this.props;
		const options = [ 'all', 'filter', 'specific' ]

		if ( options.includes( option ) ) {
			this.setState( {
				display_option: option,
				display_option_settings_open: true,
			} );

			switch ( option ) {
				case 'all' :
					setAttributes( {
						categories: [],
						campaigns: [],
						creator: '',
						includeInactive: false,
					} );
					break;

				case 'filter' :
					setAttributes( {
						campaigns: [],
					} );
					break;

				case 'specific' :
					setAttributes( {
						categories: [],
						campaignsToExclude: [],
						creator: '',
						includeInactive: true,
					} );
					break;
			}
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
						setAttributes={ setAttributes }
						attributes={ attributes }
						update_include_inactive_callback={ this.toggleIncludeInactive }
					/>
					break;

				case 'filter' :
					settingsView = <FilterSettingsView
						setAttributes={ setAttributes }
						attributes={ attributes }
						update_include_inactive_callback={ this.toggleIncludeInactive }
					/>
					break;

				case 'specific' :
					settingsView = <SpecificSettingsView
						setAttributes={ setAttributes }
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
					<h2 className="charitable-block-settings-title">{ icon } { __( 'Campaigns', 'charitable' ) }</h2>
				</div>
				<div className="charitable-block-settings-campaigns-subheading">
					<p><strong>{ __( 'Currently showing:', 'charitable' ) }</strong>&nbsp;{ this.getCurrentDisplayOption() }</p>
				</div>
				{ returnLink }
				{ this.getCurrentView() }
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
		const { title, selected_display_option, update_display_option_callback } = this.props;

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
					search_placeholder={ __( 'Search for campaigns to display', 'charitable' ) }
					selected_campaigns={ campaigns }
					update_campaign_setting_callback={ ( value ) => setAttributes( { campaigns: value } ) }
					multiple={ true }
					columns={ columns }
					campaign_active_status=""
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
				<ToggleControl
					label={ __( 'Include inactive campaigns', 'charitable' ) }
					checked={ !! includeInactive }
					onChange={ update_include_inactive_callback }
				/>
				<CampaignSelect 
					attributes={ attributes }
					label={ __( 'Campaigns to exclude', 'charitable' ) }
					search_placeholder={ __( 'Search for campaigns to exclude', 'charitable' ) }
					selected_campaigns={ campaignsToExclude }
					update_campaign_setting_callback={ ( value ) => setAttributes( { campaignsToExclude: value } ) }
					multiple="true"
					campaign_active_status=""
				/>
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
		const { attributes, setAttributes, update_include_inactive_callback } = this.props;
		const { categories, campaignsToExclude, includeInactive, campaigns, columns } = attributes;

		return (
			<div className="charitable-block-settings-view charitable-block-settings-view--filter">
				<ToggleControl
					label={ __( 'Include inactive campaigns', 'charitable' ) }
					checked={ !! includeInactive }
					onChange={ update_include_inactive_callback }
				/>
				<Filter title={ __( 'Category', 'charitable' ) } enabled={ false }>
					<CampaignCategorySelect 
						attributes={ attributes }
						label={ __( 'Filter by category', 'charitable' ) }
						selected_categories={ categories }
						update_category_setting_callback={ ( value ) => setAttributes( { categories: value } ) }
					/>
				</Filter>
				{/* <CampaignCategorySelect 
					attributes={ attributes }
					label={ __( 'Filter by category', 'charitable' ) }
					selected_categories={ categories }
					update_category_setting_callback={ ( value ) => setAttributes( { categories: value } ) }
				/> */}
				<Filter title={ __( 'Exclude Campaigns', 'charitable' ) } enabled={ false }>
					<CampaignSelect
						attributes={ attributes }
						label={ __( 'Campaigns to exclude', 'charitable' ) }
						search_placeholder={ __( 'Search for campaigns to exclude', 'charitable' ) }
						selected_campaigns={ campaignsToExclude }
						update_campaign_setting_callback={ ( value ) => setAttributes( { campaignsToExclude: value } ) }
						multiple={ true }
						columns={ columns }
						campaign_active_status=""
					/>
				</Filter>
			</div>
		);
	}
}