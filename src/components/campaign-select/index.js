/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component,findDOMNode, forwardRef, createRef } = wp.element;
const { apiFetch } = wp;
const { Dashicon, TabbableContainer, NavigableMenu } = wp.components;

/**
 * Campaign data cache.
 * Reduces the number of API calls and makes UI smoother and faster.
 */
const CAMPAIGN_DATA = {};

/**
 * Refs.
 */
const REFS = {		
	search_field : createRef(),
	search_results : createRef(),
	selected_results : createRef(),
};

/**
 * Check whether a campaign has a thumbnail.
 *
 * @return boolean
 */
const hasCampaignThumbnail = ( campaign ) => {
	return campaign.hasOwnProperty( '_embedded' ) && campaign._embedded.hasOwnProperty( 'wp:featuredmedia' );
}

/**
 * Get the thumbnail for a given campaign.
 *
 * @return string
 */
const getCampaignThumbnail = ( campaign, size = 'thumbnail', width = 30, height = 30 ) => {
	if ( hasCampaignThumbnail( campaign ) ) {
		return (
			<img src={ campaign._embedded['wp:featuredmedia'][0].media_details.sizes[size].source_url } width={ width } height={ height } />
		)
	} else {
		return '';
	}
}

/**
 * Display a list of campaigns with checkboxes and a search filter.
 */
export class CampaignSelect extends Component {

	/**
	 * Constructor.
	 */
	constructor( props ) {
		super( props );
		
		this.state = {
			selected_campaigns: props.selected_campaigns || []
		}

		this.addOrRemoveCampaign = this.addOrRemoveCampaign.bind( this );
	}

	/**
	 * Add or remove a campaign.
	 *
	 * @param id int Campaign ID.
	 */
	addOrRemoveCampaign( id ) {
		let selected_campaigns = this.state.selected_campaigns;

		// Add the campaign
		if ( ! selected_campaigns.includes( id ) ) {
			if ( !! this.props.multiple ) {
				selected_campaigns.push( id );
			} else {
				selected_campaigns = [ id ];
			}
		} else {
			selected_campaigns = selected_campaigns.filter( campaign => campaign !== id );
		}

		this.setState( {
			selected_campaigns: selected_campaigns
		} );

		this.props.update_campaign_setting_callback( selected_campaigns );
	}
	
	/**
	 * Render the list of campaigns and the search input.
	 */
	render() {
		const { label, columns, campaign_active_status } = this.props;

		let fieldLabel = label ? <label>{ label }</label> : null;

		return (
			<div className="charitable-campaigns-field">
				{ fieldLabel }
				<CampaignSearchField
					add_or_remove_campaign_callback={ ( campaign ) => this.addOrRemoveCampaign( campaign ) }
					selected_campaigns={ this.state.selected_campaigns }
					campaign_active_status={ campaign_active_status }
				/>
				<CampaignSelectedResults
					selected_campaigns={ this.state.selected_campaigns }
					add_or_remove_campaign_callback={ ( campaign ) => this.addOrRemoveCampaign( campaign ) }
					columns={ columns }
					campaign_active_status={ campaign_active_status }
				/>
			</div>
		)
	}
}

/**
 * Search for specific campaigns.
 */
class CampaignSearchField extends Component {
	
	/**
	 * Constructor.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			search_text: '',
			dropdown_open: false,
		};

		this.handleKeyDown       = this.handleKeyDown.bind( this );
		this.updateSearchResults = this.updateSearchResults.bind( this );
		this.isDropdownOpen      = this.isDropdownOpen.bind( this );

		REFS.search_results = createRef();
	}

	/**
	 * Update state to reflect if dropdown is open.
	 */
	isDropdownOpen( isOpen ) {
		this.setState( {
			dropdown_open: !! isOpen,
		} );
	}

	/**
	 * Update search results.
	 */
	updateSearchResults( evt ) {
		this.setState( {
			search_text: evt.target.value
		} );
	}
	
	/**
	 * Handle key strokes.
	 *
	 * When a down arrow key is pressed, shift focus to first search result.
	 */
	handleKeyDown( evt ) {
		if ( 'ArrowDown' === evt.key ) {
			evt.stopPropagation();
			
			const results = findDOMNode( REFS.search_results.current );

			if ( results ) {
				results.firstElementChild.focus();
			}
		}
	}
	
	/**
	 * Render the campaign search UI.
	 */
	render() {
		const divClass = 'charitable-campaigns-list-card__search-wrapper';

		return (
			<div className={ divClass + ( this.state.dropdown_open ? ' ' + divClass + '--with-results' : '' ) }>
				<div className="charitable-campaigns-list-card__input-wrapper">
					<Dashicon icon="search" />
					<input type="search"
						className="charitable-campaigns-list-card__search"
						value={ this.state.search_text }
						placeholder={ this.props.search_placeholder }
						tabIndex="0"
						onKeyDown={ this.handleKeyDown }
						onChange={ this.updateSearchResults }
						ref={ REFS.search_field }
					/>
				</div>
				<CampaignSearchResults
					search_string={ this.state.search_text }
					add_or_remove_campaign_callback={ this.props.add_or_remove_campaign_callback }
					selected_campaigns={ this.props.selected_campaigns }
					is_dropdown_open_callback={ this.isDropdownOpen }
					campaign_active_status={ this.props.campaign_active_status }
				/>
			</div>
		);
	}
	 
}

/**
 * Display campaign search results.
 */
class CampaignSearchResults extends Component {

	/**
	 * Constructor.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			filtered: [],
			campaign_count: null,
			campaigns: [],
			query: '',
			loaded: false,
			controllers: [],
		};

		this.getQuery      = this.getQuery.bind( this );
		this.updateResults = this.updateResults.bind( this );
		
	}

	/**
	 * Fetch the first 100 campaigns into memory, for faster search.
	 *
	 * We also record how many campaigns there are, in case there are more than 100.
	 */
	componentDidMount() {
		const self = this;

		wp.apiFetch( {
			path: '/wp/v2/campaigns?_embed&per_page=100&active_status=' + this.props.campaign_active_status,
			parse: false
		} ).then( ( response ) => {
			response.json().then( ( campaigns ) => {

				self.setState( {
					campaigns: campaigns,
					loaded: true,
					campaign_count: response.headers.get( 'X-WP-Total' ),
				})

				self.updateResults();
			} )
		} );
	}

	/**
	 * Update the preview when component is updated.
	 */
	componentDidUpdate() {
		if ( this.props.search_string !== this.state.query ) {
			this.updateResults();
		}
	}

	/**
	 * Get the endpoint to run the query.
	 *
	 * @return string
	 */
	getQuery() {
		if ( ! this.props.search_string.length ) {
			return '';
		}

		return '/wp/v2/campaigns?_embed&per_page=10&search=' + this.props.search_string;
	}
	
	/**
	 * Update the search results.
	 */
	updateResults( retry = 0 ) {
		// Campaigns haven't loaded yet, so retry in 500ms.
		if ( ! this.state.loaded ) {

			// Avoid retrying forever.
			if ( retry < 25 ) {
				retry += 1;
				return window.setTimeout( this.updateResults, 500, retry );
			}

			this.setState( {
				loaded: true,
			} );
		}

		const query          = this.props.search_string;
		const queryLowercase = query.toLowerCase();
		const filtered       = this.state.campaigns.filter( ( campaign ) => {
			return campaign.title.rendered.toLowerCase().includes( queryLowercase );
		} );

		this.setState( {
			query: query,
			filtered: filtered,
		} );
	}

	/**
	 * Render.
	 */
	render() {
		if ( ! this.state.loaded || ! this.state.query.length ) {
			return null;
		}

		if ( 0 === this.state.filtered.length ) {
			return <span className="charitable-campaign-list-card__search-no-results"> { __( 'No campaigns found' ) } </span>;
		}

		// Populate the cache.
		for ( let campaign of this.state.filtered ) {
			CAMPAIGN_DATA[ campaign.id ] = campaign;
		}

		return (
			<CampaignSearchResultsDropdown
				campaigns={ this.state.filtered }
				add_or_remove_campaign_callback={ this.props.add_or_remove_campaign_callback }
				selected_campaigns={ this.props.selected_campaigns }
				is_dropdown_open_callback={ this.props.is_dropdown_open_callback }
			/>
		);
	}
}

/**
 * Render the dropdown with campaign search results.
 */
class CampaignSearchResultsDropdown extends Component {

	/**
	 * Set the state of the dropdown to open.
	 */
	componentDidMount() {
		this.props.is_dropdown_open_callback( true );
	}

	/**
	 * Set the state of the dropdown to closed.
	 */
	componentDidUnmount() {
		this.props.is_dropdown_open_callback( false );
	}

	/**
	 * Render dropdown.
	 */
	render() {
		const { campaigns, add_or_remove_campaign_callback, selected_campaigns } = this.props;

		let campaignElements = [];
		let index = 0;

		for ( let campaign of campaigns ) {
			campaignElements.push(
				<CampaignSearchResultsDropdownElement
					index= { index }
					campaign={ campaign }
					add_or_remove_campaign_callback={ add_or_remove_campaign_callback }
					selected={ selected_campaigns.includes( campaign.id ) }
				/>
			);

			index += 1;
		}

		return (
			<NavigableMenu
				className="charitable-campaigns-list-card__search-results"
				aria-label={ __( 'Campaign list', 'charitable' ) }
				ref={ REFS.search_results }
			>
				{ campaignElements }
			</NavigableMenu>
		);
	}
}

/**
 * Display an individual campaign search result.
 */
class CampaignSearchResultsDropdownElement extends Component {

	/**
	 * Constructor.
	 */
	constructor( props ) {
		super( props );

		this.handleClick   = this.handleClick.bind( this );
		this.handleKeyDown = this.handleKeyDown.bind( this );
	}

	/**
	 * Add campaign to main list and change UI to show it was added.
	 */
	handleClick() {
		this.props.add_or_remove_campaign_callback( this.props.campaign.id );
	}

	/**
	 * Respond to keyboard events on dropdown elements.
	 */
	handleKeyDown( evt ) {
		if ( 'Enter' === evt.key ) {
			this.props.add_or_remove_campaign_callback( this.props.campaign.id );
		}
	}

	/**
	 * Render one result in the search results.
	 */
	render() {
		const campaign = this.props.campaign;
		let icon = this.props.selected ? <Dashicon icon="yes" /> : null;

		const getCardClass = ( campaign ) => {
			let cardClass = 'charitable-campaigns-list-card__content';

			if ( this.props.selected ) {
				cardClass += ' charitable-campaigns-list-card__content--added';
			}
			
			if ( hasCampaignThumbnail( campaign ) ) {
				cardClass += ' charitable-campaigns-list-card__content--has-thumbnail';
			}
			return cardClass;
		}
		
		let isDefault = this.props.index === 0 ? isDefault : '';
		
		return (
			<div className={ getCardClass( campaign ) } onClick={ this.handleClick } onKeyDown={ this.handleKeyDown } isDefault tabIndex={ this.props.index } >
				{ getCampaignThumbnail( campaign ) }
				<span className="charitable-campaigns-list-card__content-item-name">{ campaign.title.rendered }</span>
				{ icon }
			</div>
		);
	}
}

/**
 * Display selected campaigns.
 */
class CampaignSelectedResults extends Component {

	/**
	 * Constructor
	 */
	constructor( props ) {
		super( props );

		this.state = {
			query: '',
			loaded: false,
		};

		this.getQuery            = this.getQuery.bind( this );
		this.updateCampaignCache = this.updateCampaignCache.bind( this );
	}
	
	/**
	 * Get the preview when component is first loaded.
	 */
	componentDidMount() {
		this.updateCampaignCache();
	}

	/**
	 * Update the preview when component is updated.
	 */
	componentDidUpdate() {
		if ( this.state.loaded && this.getQuery() !== this.state.query ) {
			this.updateCampaignCache();
		}
	}

	/**
	 * Get the endpoint for the current state of the component.
	 */
	getQuery() {
		if ( ! this.props.selected_campaigns.length ) {
			return '';
		}

		// Determine which campaigns are not already in the cache and only fetch uncached campaigns.
		let uncachedCampaigns = [];
		for( const campaignId of this.props.selected_campaigns ) {
			if ( ! CAMPAIGN_DATA.hasOwnProperty( campaignId ) ) {
				uncachedCampaigns.push( campaignId );
			}
		}

		return uncachedCampaigns.length ? '/wp/v2/campaigns?_embed&include=' + uncachedCampaigns.join( ',' ) : '';
	}

	/**
	 * Add newly fetched campaigns to the cache.
	 */
	updateCampaignCache() {
		const self = this;
		const query = this.getQuery();

		self.setState( {
			query: query,
			loaded: false,
		} );

		// Add new campaigns to cache.
		if ( query.length ) {
			apiFetch( { path: query } ).then( campaigns => {
				if ( campaigns.length ) {
					for ( const campaign of campaigns ) {
						CAMPAIGN_DATA[ campaign.id ] = campaign;
					}
				}
				
				console.log( campaigns );

				self.setState( {
					loaded: true,
				} );
			} );
		}
	}

	/**
	 * Render.
	 */
	render() {
		const { selected_campaigns, add_or_remove_campaign_callback } = this.props;
		const campaignElements = [];

		for ( const campaignId of selected_campaigns ) {

			// Skip products that aren't in the cache yet or failed to fetch.
			if ( ! CAMPAIGN_DATA.hasOwnProperty( campaignId ) ) {
				continue;
			}

			const campaignData = CAMPAIGN_DATA[ campaignId ];

			campaignElements.push(
				<li className="charitable-campaigns-list-card__item campaign" key={ campaignData.id + '-specific-select-edit' } >
					<div className="charitable-campaigns-list-card__content">
						{ getCampaignThumbnail( campaignData ) }
						<span className="charitable-campaigns-list-card__content-item-name">{ campaignData.title.rendered }</span>
						<button
							type="button"
							id={ 'campaign-' + campaignData.id }
							onClick={ function() { add_or_remove_campaign_callback( campaignData.id ) } } >
								<Dashicon icon="no-alt" />
						</button>
					</div>
				</li>
			);
		}

		let header    = null;
		let campaigns = null;

		if ( selected_campaigns.length > 0 ) {
			campaigns = <ul className="charitable-campaigns-list-card__selected-results-list">{ campaignElements.length ? campaignElements : __( 'Loading...', 'charitable' ) }</ul>

			if ( 1 === selected_campaigns.length ) {
				header = <h4>{ __( 'Selected campaign', 'charitable' ) }</h4>
			} else {
				header = <h4>{ __( 'Selected campaigns', 'charitable' ) }</h4>
			}
		}

		return (
			<div className="charitable-campaigns-list-card__selected-results-wrapper">
				<div role="menu" className="charitable-campaigns-list-card__selected-results" aria-orientation="vertical" aria-label={ __( 'Selected campaigns', 'charitable' ) }>
					{ header }
					{ campaigns }
				</div>
			</div>
		);
	}
}
