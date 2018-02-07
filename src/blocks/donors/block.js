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
    InspectorControls,
    BlockDescription,
} = wp.blocks;

const {
    PanelBody,
    PanelRow,
    withAPIData 
} = wp.components;

const {
    SelectControl,
    ToggleControl,
    RangeControl
} = InspectorControls;

class CharitableDonorsBlock extends Component {
	constructor() {
		super( ...arguments );

        this.toggleDisplayDonorName = this.toggleDisplayDonorName.bind( this );
        this.toggleDisplayDonorAmount = this.toggleDisplayDonorAmount.bind( this );
        this.toggleDisplayDonorLocation = this.toggleDisplayDonorLocation.bind( this );
        this.toggleDisplayDonorAvatar = this.toggleDisplayDonorAvatar.bind( this );
        this.toggleDistinctDonors = this.toggleDistinctDonors.bind( this );
    }

    toggleDisplayDonorName() {
		const { displayDonorName } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayDonorName: ! displayDonorName } );
    }
    
    toggleDisplayDonorLocation() {
		const { displayDonorLocation } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayDonorLocation: ! displayDonorLocation } );
    }
    
    toggleDisplayDonorAvatar() {
		const { displayDonorAvatar } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayDonorAvatar: ! displayDonorAvatar } );
    }
    
    toggleDisplayDonorAmount() {
		const { displayDonorAmount } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayDonorAmount: ! displayDonorAmount } );
    }
    
    toggleDistinctDonors() {
		const { distinctDonors } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { distinctDonors: ! distinctDonors } );
    }

    render() {
		const { attributes, focus, setAttributes } = this.props;
        const { number, orderBy, campaign, distinctDonors, orientation, displayDonorAmount, displayDonorName, displayDonorLocation, displayDonorAvatar } = attributes;
        
        const inspectorControls = focus && (
            <InspectorControls key="inspector" description={ __( 'Configure' ) }>
                <RangeControl
                    key="number-control"
                    label={ __( 'Number of donors' ) }
                    value={ number }
                    onChange={ ( value ) => setAttributes( { number: value } ) }
                    min="-1"
                    max="999"
                />
                <CampaignSelect
                    key="campaign-select"
                    label={ __( 'Campaign' ) }
                    withOptions={ [
                        {
                            label: __( 'All Campaigns' ),
                            value: 'all',
                        }
                    ] }
                    selectedOption={ campaign }
                    onChange={ ( value ) => this.props.setAttributes( { campaign: value } ) }
                />
                <SelectControl
                    key="orderby-select"
                    label={ __( 'Order by' ) }
                    value={ orderBy }
                    options={ [
                        {
                            label: __( 'Most recent' ),
                            value: 'recent',
                        },
                        {
                            label: __( 'Amount donated' ),
                            value: 'amount',
                        },
                    ] }
                    onChange={ ( value ) => setAttributes( { orderBy: value } ) }
                />
                <ToggleControl
                    key="distinct-donors-toggle"
                    label={ __( 'Only show unique donors' ) }
                    checked={ distinctDonors }
                    onChange={ this.toggleDistinctDonors }
                />
                <PanelBody title={ __( 'Display Settings' ) }>
                    <PanelRow>
                        <SelectControl
                            key="orientation-select"
                            label={ __( 'Orientation' ) }
                            value={ orientation }
                            options={ [
                                {
                                    label: __( 'Vertical' ),
                                    value: 'vertical',
                                },
                                {
                                    label: __( 'Horizontal' ),
                                    value: 'horizontal',
                                },
                            ] }
                            onChange={ ( value ) => setAttributes( { orientation: value } ) }
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={ __( 'Display the name of the donor' ) }
                            checked={ displayDonorName }
                            onChange={ this.toggleDisplayDonorName }
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={ __( 'Display the amount donated by the donor' ) }
                            checked={ displayDonorAmount }
                            onChange={ this.toggleDisplayDonorAmount }
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={ __( 'Display the location of the donor' ) }
                            checked={ displayDonorLocation }
                            onChange={ this.toggleDisplayDonorLocation }
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={ __( 'Display the avatar of the donor' ) }
                            checked={ displayDonorAvatar }
                            onChange={ this.toggleDisplayDonorAvatar }
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        );
        
        return [
            inspectorControls,
            <p>
                { __( 'DONORS' ) }
            </p>
        ];
    }
}

export default CharitableDonorsBlock;