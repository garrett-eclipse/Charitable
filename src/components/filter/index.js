/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { Dashicon } = wp.components;

/**
 * Display a filter section.
 *
 * The filter shows a checkbox along with the filter title, and when
 * checked, the filter shows the filter settings.
 */
export class Filter extends Component {

	/**
	 * Constructor.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			enabled: props.enabled,
		}
	}

	/**
	 * Render the filter.
	 */
	render() {

		/**
		 * Toggle filter.
		 */
		const toggleFilter = () => {
			
			this.setState( {
				enabled: ! this.state.enabled,
			} );
		}

		const filterStyles = {};
		let icon = 'arrow-up-alt2';

		if ( ! this.state.enabled ) {
			filterStyles.display = 'none';

			icon = 'arrow-down-alt2';
		}

		return (
			<div className={ 'charitable-block-settings-filter' + ( this.state.enabled ? ' is-opened' : '' ) }>
				<div className="charitable-block-settings-filter-toggle">
					<h3 className="charitable-block-settings-filter-header">
						{ this.props.title }
						<button onClick={ toggleFilter } className="charitable-block-settings-filter-toggle__accordion-button" type="button">
							<Dashicon icon={ icon } />
						</button>
					</h3>
				</div>
				<div className="charitable-block-settings-filter-settings" style={ filterStyles }>
					{ this.props.children }
				</div>
			</div>
		);
	}
}