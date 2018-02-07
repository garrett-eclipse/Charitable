/**
 * External dependencies
 */
import { stringify } from 'querystringify';
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
const { buildTermsTree } = wp.utils;
const { withAPIData } = wp.components;
const { TermTreeSelect } = wp.blocks;

const getCampaignOptions = ( campaigns ) => {
	if ( campaigns.data.length === 0 ) {
		return {};
	}
	
	return campaigns.data.map( ( campaign ) => {
		return {
			label: campaign.title.rendered,
			value: campaign.id
		};
	} );
}

function CategorySelect( { label, noOptionLabel, categories, selectedCategory, onChange } ) {
	const termsTree = buildTermsTree( get( categories, 'data', {} ) );
	return (
		<TermTreeSelect
			{ ...{ label, noOptionLabel, onChange, termsTree } }
			selectedTerm={ selectedCategory }
		/>
	);
}

export default withAPIData( () => {
	const query = stringify( {
		per_page: 100,
		_fields: [ 'id', 'name', 'parent' ],
	} );
	return {
		categories: `/wp/v2/campaignCategories?${ query }`,
	};
} )( CategorySelect );

