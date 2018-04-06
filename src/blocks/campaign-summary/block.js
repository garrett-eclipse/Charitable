/**
 * Block dependencies
 */
import CampaignSelect from './../../components/campaign-select/index.js';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Component } = wp.element;

const {
    InspectorControls
} = wp.blocks;

const {
    PanelBody,
    PanelRow,
    withAPIData,
    SelectControl,
    ToggleControl,
    RangeControl
} = wp.components;

const { findDOMNode } = wp.element;

const { Store } = wp.editor;
const { getCurrentPostType } = Store;

class CharitableCampaignSummaryBlock extends Component {
	constructor() {
		super( ...arguments );

        // this.toggleMasonryLayout = this.toggleMasonryLayout.bind( this );
        // this.toggleResponsiveLayout = this.toggleResponsiveLayout.bind( this );
    }

    // toggleMasonryLayout() {
	// 	const { masonryLayout } = this.props.attributes;
	// 	const { setAttributes } = this.props;

	// 	setAttributes( { masonryLayout: ! masonryLayout } );
    // }
    
    // toggleResponsiveLayout() {
	// 	const { responsiveLayout } = this.props.attributes;
	// 	const { setAttributes } = this.props;

	// 	setAttributes( { responsiveLayout: ! responsiveLayout } );
    // }    

    render() {
		const { attributes, isSelected, setAttributes } = this.props;
        const { campaign, columns } = attributes;

        const inspectorControls = isSelected && (
            <InspectorControls key="inspector" description={ __( 'Configure' ) } >
                <CampaignSelect
                    key="campaign-select"
                    label={ __( 'Campaign' ) }
                    selectedOption={ attributes.campaign }
                    onChange={ ( value ) => props.setAttributes( { campaign: value } ) }
                />
                <PanelBody title={ getCurrentPostType( this.state ) }>
                    <PanelRow>
                        <RangeControl
                            key="columns-select"
                            label={ __( 'Columns' ) }
                            value={ columns }
                            min="1"
                            max="4"
                            onChange={ ( value ) => setAttributes( { columns: value } ) }
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        );
        
        return [
            inspectorControls,
            <p key="charitable-campaign-summary">
                { __( 'CAMPAIGN Summary' ) }
            </p>
        ];
    }
}

export default CharitableCampaignSummaryBlock;