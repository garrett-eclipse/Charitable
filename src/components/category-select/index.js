/**
 * External dependencies
 */
import { stringify } from 'querystringify';
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
const { withSelect } = wp.data;
const { TreeSelect } = wp.components;

const getCampaignOptions = ( campaigns ) => {
	if ( campaigns.length === 0 ) {
		return {};
	}
	
	return campaigns.map( ( campaign ) => {
		return {
			label: campaign.title.rendered,
			value: campaign.id
		};
	} );
}

function CategorySelect( { label, noOptionLabel, categories, selectedCategory, onChange } ) {
	const termsTree = buildTermsTree( get( categories, 'data', {} ) );
	return (
		<TreeSelect
			{ ...{ label, noOptionLabel, onChange } }
			tree={ termsTree }
			selectedId={ selectedCategory }
		/>
	);
}

export default withSelect( ( select ) => {
	const query = stringify( {
		per_page: 100,
		_fields: [ 'id', 'name', 'parent' ],
	} );
	return {
		categories: select( 'core' ).getEntityRecords( 'term', 'campaignCategories', query ),
	};
} )( CategorySelect );

