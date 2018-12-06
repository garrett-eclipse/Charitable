/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { apiFetch } = wp;

/**
 * Display a list of campaign categories with checkboxes, counts and a search filter.
 */
export class CampaignCategorySelect extends Component {
	
	/**
	 * Constructor.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			selectedCategories: props.selected_categories,
			firstLoad: true,
		}

		this.checkboxChange  = this.checkboxChange.bind( this );
		//this.accordionToggle = this.accordionToggle.bind( this );
		//this.filterResults   = this.filterResults.bind( this );
		this.setFirstLoad    = this.setFirstLoad.bind( this );
	}

	/**
	 * Handle checkbox toggle.
	 *
	 * @param Checked? boolean checked
	 * @param Categories array categories
	 */
	checkboxChange( checked, categories ) {
		let selectedCategories = this.state.selectedCategories;

		selectedCategories = selectedCategories.filter( category => ! categories.includes( category ) );

		if ( checked ) {
			selectedCategories.push( ...categories );
		}

		this.setState( {
			selectedCategories: selectedCategories
		} );

		this.props.update_category_setting_callback( selectedCategories );
	}

	/**
	 * Update firstLoad state.
	 *
	 * @param Booolean loaded
	 */
	setFirstLoad( loaded ) {
		this.setState( {
			firstLoad: !! loaded
		} );
	}

	/**
	 * Render the list of categories and the search input.
	 */
	render() {
		let label = null;

		if ( this.props.label.length ) {
			label = <label>{ this.props.label }</label>;
		}
		
		return (
			<div className="charitable-campaign-categories-list">
				{ label }
				<CampaignCategoryList
					selectedCategories={ this.state.selectedCategories }
					checkboxChange={ this.checkboxChange }
					firstLoad={ this.state.firstLoad }
					setFirstLoad={ this.setFirstLoad }
				/>
			</div>
		)
	}
}

/**
 * Fetch and build a tree of campaign categories.
 */
class CampaignCategoryList extends Component {
	
	/**
	 * Constructor.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			categories: [],
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
		const endpoint = '/wp/v2/campaignCategories';
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

		apiFetch( { path: query } ).then( categories => {
			self.setState( {
				categories: categories,
				loaded: true,
				query: query
			} );
		} );
	}

	/**
	 * Render.
	 */
	render() {
		const { selectedCategories, checkboxChange } = this.props;

		if ( ! this.state.loaded ) {
			return __( 'Loading categories', 'charitable' );
		}

		if ( 0 === this.state.categories.length ) {
			return __( 'No categories found', 'charitable' );
		}

		const handleCategoriesToCheck = ( evt, parent, categories ) => {
			let slugs = getCategoryChildren( parent, categories ).map( category => {
				return category.slug;
			} );

			slugs.push( parent.slug );

			checkboxChange( evt.target.checked, slugs );
		}

		const getCategoryChildren = ( parent, categories ) => {
			let children = [];

			categories.filter( ( category ) => category.parent === parent.id ).forEach( function( category ) {
				children.push( category );
				children.push( ...getCategoryChildren( category, categories ) );
			} );

			return children;
		};

		const CategoryTree = ( { categories, parent } ) => {
			let filteredCategories = categories;

			return ( filteredCategories.length > 0 ) && (
				<ul>
					{ filteredCategories.map( ( category ) => (
						<li key={ category.id } className="charitable-category-list-card__item">
							<label>
								<input type="checkbox"
									id={ 'campaign-category-' + category.slug }
									value={ category.slug }
									checked={ selectedCategories.includes( category.slug ) }
									onChange={ ( evt ) => handleCategoriesToCheck( evt, category, categories ) }
								/> { category.name }
								<span className="charitable-category-list-card__taxonomy-count">{ category.count }</span>
							</label>
						</li>
					))}
				</ul>
			)
		}

		let categoriesData = this.state.categories;

		return (
			<div className="charitable-category-list-card__results">
				<CategoryTree categories={ categoriesData } parent={ 0 } />
			</div>
		);
	}
}