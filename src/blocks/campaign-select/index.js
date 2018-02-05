/**
 * External dependencies
 */
import { stringify } from 'querystringify';
import { flatMap, compact, concat } from 'lodash';

const {  InspectorControls } = wp.blocks;
const { SelectControl } = InspectorControls;
const { withAPIData } = wp.components;

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

function CampaignSelect( { label, campaigns, withOptions, selectedOption, onChange } ) {
	if ( ! campaigns.data ) {
		return "loading!";
	}

	const options = withOptions.length 
		? concat( withOptions, ...getCampaignOptions( campaigns ) )
		: getCampaignOptions( campaigns );

	return (
		<SelectControl
			{ ...{ label, onChange, options } }
			value={ selectedOption }
		/>
	);
}

export default withAPIData( () => {
	const query = stringify( {
		per_page: 100,
		_fields: [ 'id', 'title', 'parent' ],
	} );
	return {
		campaigns: `/wp/v2/campaigns?${ query }`,
	};
} )( CampaignSelect );