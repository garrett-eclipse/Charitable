/**
 * External dependencies
 */
import { stringify } from 'querystringify';

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

function CampaignSelect( { label, campaigns, selectedCampaign, onChange } ) {
	if ( ! campaigns.data ) {
		return "loading!";
	}

	const options = getCampaignOptions( campaigns );
	
	return (
		<SelectControl
			{ ...{ label, onChange, options } }
			value={ selectedCampaign }
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