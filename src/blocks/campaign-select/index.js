/**
 * External dependencies
 */
import { stringify } from 'querystringify';
// import { unescape as unescapeString, repeat, flatMap, compact } from 'lodash';

const {  InspectorControls } = wp.blocks;
const { SelectControl } = InspectorControls;
const { withAPIData } = wp.components;

function CampaignSelect( { label, campaigns, selectedCampaign, onChange } ) {
	if ( campaigns.isLoading ) {
		return;
	}
	
	console.log(campaigns);
	const options = campaigns.data.map( ( campaign ) => {
        return {
            label: campaign.name,
            value: campaign.id
        };
    } );

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
		_fields: [ 'id', 'name', 'parent' ],
	} );
	return {
		campaigns: `/wp/v2/campaigns?${ query }`,
	};
} )( CampaignSelect );

// export default applyWithAPIData( CampaignSelect );
