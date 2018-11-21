/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { apiFetch } = wp;
const { Dashicon } = wp.components;

/**
 * Campaign data cache.
 * Reduces the number of API calls and makes UI smoother and faster.
 */
const CAMPAIGN_DATA = {};

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
			selectedCampaigns: props.selected_campaigns || []
		}
	}

	/**
	 * Add or remove a campaign.
	 *
	 * @param id int Campaign ID.
	 */
	addOrRemoveCampaign( id ) {
		let selectedCampaigns = this.state.selectedCampaigns;

		// Add the campaign
		if ( ! selectedCampaigns.includes( id ) ) {
			if ( this.props.multiple ) {
				selectedCampaigns.push( id );
			} else {
				selectedCampaigns = [ id ];
			}
		} else {
			selectedCampaigns = selectedCampaigns.filter( campaign => campaign !== id );
		}

		this.setState( {
			selectedCampaigns: selectedCampaigns
		} );

		this.props.update_campaign_setting_callback( selectedCampaigns );
	}
	
	/**
	 * Render the list of campaigns and the search input.
	 */
	render() {
		return (
			<div className="charitable-campaigns-field">
				<CampaignSearchField
					addOrRemoveCampaignCallback={ this.addOrRemoveCampaign.bind( this ) }
					selectedCampaigns={ this.state.selectedCampaigns }
				/>
				<CampaignSelectedResults
					selectedCampaigns={ this.state.selectedCampaigns }
					addOrRemoveCampaignCallback={ this.addOrRemoveCampaign.bind( this ) }
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
			searchText: '',
			dropdownOpen: false,
		};

		this.updateSearchResults = this.updateSearchResults.bind( this );
		this.isDropdownOpen      = this.isDropdownOpen.bind( this );
	}

	/**
	 * Update state to reflect if dropdown is open.
	 */
	isDropdownOpen( isOpen ) {
		this.setState( {
			dropdownOpen: !! isOpen,
		} );
	}

	/**
	 * Update search results.
	 */
	updateSearchResults( evt ) {
		this.setState( {
			searchText: evt.target.value
		} );
	}

	/**
	 * Render the campaign search UI.
	 */
	render() {
		const divClass = 'charitable-campaigns-list-card__search-wrapper';

		return (
			<div className={ divClass + ( this.state.dropdownOpen ? ' ' + divClass + '--with-results' : '' ) }>
				<div className="charitable-campaigns-list-card__input-wrapper">
					<Dashicon icon="search" />
					<input type="search"
						className="charitable-campaigns-list-card__search"
						value={ this.state.searchText }
						placeholder={ __( 'Search for campaigns to display', 'charitable' ) }
						onChange={ this.updateSearchResults }
					/>
				</div>
				<CampaignSearchResults 
					searchString={ this.state.searchText }
					addOrRemoveCampaignCallback={ this.props.addOrRemoveCampaignCallback }
					selectedCampaigns={ this.props.selectedCampaigns }
					isDropdownOpenCallback={ this.isDropdownOpen }
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
			campaigns: [],
			query: '',
			loaded: false
		};

		this.getQuery      = this.getQuery.bind( this );
		this.updateResults = this.updateResults.bind( this );
		
	}

	/**
	 * Get the preview when component is first loaded.
	 */
	componentDidMount() {
		this.updateResults();
	}

	/**
	 * Update the preview when component is updated.
	 */
	componentDidUpdate() {
		if ( this.getQuery() !== this.state.query ) {
			this.updateResults();
		}
	}

	/**
	 * Get the endpoint to run the query.
	 *
	 * @return string
	 */
	getQuery() {
		if ( ! this.props.searchString.length ) {
			return '';
		}

		return '/wp/v2/campaigns?_embed&per_page=10&search=' + this.props.searchString;
	}
	
	/**
	 * Update the search results.
	 */
	updateResults() {
		const self = this;
		const query = this.getQuery();

		self.setState( {
			query: query,
			loaded: false
		} );

		if ( query.length ) {
			apiFetch( { path: query } ).then( campaigns => {
				// Only update the results if they are for the latest query.
				if ( query === self.getQuery() ) {
					self.setState( {
						campaigns: campaigns,
						loaded: true
					} );
				}
				
				console.log( campaigns );
			} );
		} else {
			self.setState( {
				campaigns: [],
				loaded: true
			} );
		}
	}

	/**
	 * Render.
	 */
	render() {
		if ( ! this.state.loaded || ! this.state.query.length ) {
			return null;
		}

		if ( 0 === this.state.campaigns.length ) {
			return <span className="charitable-campaign-list-card__search-no-results"> { __( 'No campaigns found' ) } </span>;
		}

		// Populate the cache.
		for ( let campaign of this.state.campaigns ) {
			CAMPAIGN_DATA[ campaign.id ] = campaign;
		}

		return <CampaignSearchResultsDropdown
			campaigns={ this.state.campaigns }
			addOrRemoveCampaignCallback={ this.props.addOrRemoveCampaignCallback }
			selectedCampaigns={ this.props.selectedCampaigns }
			isDropdownOpenCallback={ this.props.isDropdownOpenCallback }
		/>

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
		this.props.isDropdownOpenCallback( true );
	}

	/**
	 * Set the state of the dropdown to closed.
	 */
	componentDidUnmount() {
		this.props.isDropdownOpenCallback( false );
	}

	/**
	 * Render dropdown.
	 */
	render() {
		const { campaigns, addOrRemoveCampaignCallback, selectedCampaigns } = this.props;

		let campaignElements = [];

		for ( let campaign of campaigns ) {
			campaignElements.push(
				<CampaignSearchResultsDropdownElement
					campaign={campaign}
					addOrRemoveCampaignCallback={ addOrRemoveCampaignCallback }
					selected={ selectedCampaigns.includes( campaign.id ) }
				/>
			);
		}

		return (
			<div role="menu" className="charitable-campaigns-list-card__search-results" aria-orientation="vertical" aria-label={ __( 'Campaign list', 'charitable' ) }>
				<div>
					{ campaignElements }
				</div>
			</div>
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

		this.handleClick = this.handleClick.bind( this );
	}

	/**
	 * Add campaign to main list and change UI to show it was added.
	 */
	handleClick() {
		this.props.addOrRemoveCampaignCallback( this.props.campaign.id );
	}

	/**
	 * Render one result in the search results.
	 */
	render() {
		const campaign = this.props.campaign;
		let icon = this.props.selected ? <Dashicon icon="yes" /> : null;

		return (
			<div className={ 'charitable-campaigns-list-card__content' + ( this.props.selected ? ' charitable-campaigns-list-card__content--added' : '' ) } onClick={ this.handleClick }>
				<img src={ campaign._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url } width="30" height="30" />
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
		if ( ! this.props.selectedCampaigns.length ) {
			return '';
		}

		// Determine which campaigns are not already in the cache and only fetch uncached campaigns.
		let uncachedCampaigns = [];
		for( const campaignId of this.props.selectedCampaigns ) {
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
		const self = this;
		const campaignElements = [];

		for ( const campaignId of this.props.selectedCampaigns ) {

			// Skip products that aren't in the cache yet or failed to fetch.
			if ( ! CAMPAIGN_DATA.hasOwnProperty( campaignId ) ) {
				continue;
			}

			const campaignData = CAMPAIGN_DATA[ campaignId ];

			campaignElements.push(
				<li className="charitable-campaigns-list-card__item" key={ campaignData.id + '-specific-select-edit' } >
					<div className="charitable-campaigns-list-card__content">
						<img src={ campaignData._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url } />
						<span className="charitable-campaigns-list-card__content-item-name">{ campaignData.title.rendered }</span>
						<button
							type="button"
							id={ 'campaign-' + campaignData.id }
							onClick={ function() { self.props.addOrRemoveCampaign( campaignData.id ) } } >
								<Dashicon icon="no-alt" />
						</button>
					</div>
				</li>
			);
		}

		return (
			<div className={ 'charitable-campaigns-list-card__results-wrapper charitable-campaigns-list-card__results-wrapper--cols-' + this.props.columns }>
				<div role="menu" className="charitable-campaigns-list-card__results" aria-orientation="vertical" aria-label={ __( 'Selected campaigns', 'charitable' ) }>

					{ campaignElements.length > 0 && <h3>{ __( 'Selected campaigns', 'charitable' ) }</h3> }

					<ul>
						{ campaignElements }
					</ul>
				</div>
			</div>
		);
	}
}

class CampaignFeaturedImage extends Component {

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
		this.updateCampaignImageCache();
	}

	/**
	 * Update the preview when component is updated.
	 */
	componentDidUpdate() {
		if ( this.state.loaded && this.getQuery() !== this.state.query ) {
			this.updateCampaignCache();
		}
	}
}

/**
 * Fetch and build a tree of campaigns.
 */
class CampaignList extends Component {
	
	/**
	 * Constructor.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			campaigns: [],
			loaded: false,
			query: '',
		};

		this.updatePreview = this.updatePreview.bind( this );
		this.getQuery      = this.getQuery.bind( this );
	}

	/**
	 * Get the preview when component is first loaded.
	 */
	componentDidMount() {
		if ( this.getQuery() !== this.state.query ) {
			this.updatePreview();
		}
	}

	/**
	 * Update the preview when component is updated.
	 */
	componentDidUpdate() {
		if ( this.getQuery() !== this.state.query && this.state.loaded ) {
			this.updatePreview();
		}
	}

	/**
	 * Get the endpoint for the current state of the component.
	 *
	 * @return string
	 */
	getQuery() {
		const endpoint = '/wp/v2/campaigns';
		return endpoint;
	}
	
	/**
	 * Update the preview with the latest settings.
	 */
	updatePreview() {
		const self  = this;
		const query = this.getQuery();

		self.setState( {
			loaded: false,
		} );

		apiFetch( { path: query } ).then( campaigns => {
			self.setState( {
				campaigns: campaigns,
				loaded: true,
				query: query
			} );
			
			console.log( campaigns );
		} );
	}

	/**
	 * Render.
	 */
	render() {
		const { selectedCampaigns, checkboxChange } = this.props;

		if ( ! this.state.loaded ) {
			return __( 'Loading campaigns', 'charitable' );
		}

		if ( 0 === this.state.campaigns.length ) {
			return __( 'No campaigns found', 'charitable' );
		}

		const CampaignTree = ( { campaigns, parent } ) => {
			return ( campaigns.length > 0 ) && (
				<ul>
					{ campaigns.map( ( campaign ) => (
						<li key={ campaign.id } className="charitable-campaign-list-card__item">
							<label>
								<input type="checkbox"
									id={ 'campaign-' + campaign.id }
									value={ campaign.id }
									checked={ selectedCampaigns.includes( campaign.id ) }
									onChange={ ( evt ) => checkboxChange( evt.target.checked, campaign.id ) }
								/> { campaign.title.rendered }
							</label>
						</li>
					))}
				</ul>
			)
		}

		let campaignsData = this.state.campaigns;

		return (
			<div className="charitable-campaign-list-card__results">
				<CampaignTree campaigns={ campaignsData } />
			</div>
		);
	}
}