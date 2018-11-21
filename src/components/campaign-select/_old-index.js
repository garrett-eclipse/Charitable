/**
 * External dependencies
 */
import { stringify } from 'querystringify';
import { concat } from 'lodash';

const { SelectControl } = wp.components;
const { withSelect } = wp.data;

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

function CampaignSelect( { label, campaigns, withOptions, selectedOption, onChange } ) {
	if ( ! campaigns ) {
		return "loading!";
	}

	const options = 'undefined' !== typeof withOptions && withOptions.length
		? concat( withOptions, ...getCampaignOptions( campaigns ) )
		: getCampaignOptions( campaigns );

	return (
		<SelectControl
			{ ...{ label, onChange, options } }
			value={ selectedOption }
		/>
	);
}

export default withSelect( ( select ) => {
	const query = stringify( {
		per_page: 100,
		_fields: [ 'id', 'title', 'parent' ],
	} );
	return {
		campaigns: select( 'core' ).getEntityRecords( 'postType', 'campaign', query ),
	};
} )( CampaignSelect );