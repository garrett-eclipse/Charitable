/**
 * External dependencies
 */
import { unescape as unescapeString, repeat, flatMap, compact } from 'lodash';

const {  InspectorControls } = wp.blocks;
const { SelectControl } = InspectorControls;
const { withAPIData } = wp.components;

function CampaignSelect( { label, campaigns, selectedCampaign, onChange } ) {
	const options = campaigns.map( ( campaign ) => {
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

const applyWithAPIData = withAPIData( () => {
	const query = stringify( {
		per_page: 100,
		_fields: [ 'id', 'name', 'parent' ],
	} );
	return {
		campaigns: `/wp/v2/campaigns?${ query }`,
	};
} );

export default applyWithAPIData( CampaignSelect );
