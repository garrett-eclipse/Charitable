/**
 * Block dependencies
 */
import CampaignSelect from './../../components/campaign-select/index.js';
import CampaignCategorySelect from './../../components/category-select/index.js';

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

const { findDOMNode } = wp.element;

class CharitableCampaignsBlock extends Component {
	constructor() {
		super( ...arguments );

        this.toggleMasonryLayout = this.toggleMasonryLayout.bind( this );
        this.toggleResponsiveLayout = this.toggleResponsiveLayout.bind( this );
    }

    toggleMasonryLayout() {
		const { masonryLayout } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { masonryLayout: ! masonryLayout } );
    }
    
    toggleResponsiveLayout() {
		const { responsiveLayout } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { responsiveLayout: ! responsiveLayout } );
    }    

    render() {
		const { attributes, focus, setAttributes } = this.props;
        const { category, number, campaigns, orderBy, order, columns, masonryLayout, responsiveLayout } = attributes;
        
        const inspectorControls = focus && (
            <InspectorControls key="inspector" description={ __( 'Configure' ) } >
                <SelectControl
                    key="orderby-select"
                    label={ __( 'Order by' ) }
                    value={ orderBy }
                    options={ [
                        {
                            label: __( 'Date created (newest to oldest)' ),
                            value: 'post_date/DESC',
                        },
                        {
                            label: __( 'Date created (oldest to newest)' ),
                            value: 'post_date/ASC',
                        },
                        {
                            label: __( 'Amount donated' ),
                            value: 'popular/DESC',
                        },
                        {
                            label: __( 'Time left (least first)' ),
                            value: 'ending/DESC',
                        },
                        {
                            label: __( 'Time left (longest first)' ),
                            value: 'ending/ASC',
                        }
                    ] }                    
                    onChange={ ( value ) => {
                        const [ newOrderBy, newOrder ] = value.split( '/' );
                        if ( newOrder !== order ) {
                            setAttributes( { order: newOrder } );
                        }
                        if ( newOrderBy !== orderBy ) {
                            setAttributes( { orderBy: newOrderBy } );
                        }
                    } }
                />
                <CampaignCategorySelect
                    key="category-select"
                    label={ __( 'Category' ) }
                    noOptionLabel={ __( 'All' ) }
                    selectedCategory={ category }
                    onChange={ ( value ) => setAttributes( { category: '' !== value ? value : undefined } ) }
                />
                <RangeControl
                    key="number-control"
                    label={ __( 'Number of campaigns' ) }
                    value={ number }
                    onChange={ ( value ) => setAttributes( { number: value } ) }
                    min="-1"
                    max="999"
                />
                <CampaignSelect
                    key="campaign-select"
                    label={ __( 'Campaigns' ) }
                    withOptions={ [
                        {
                            label: __( 'All Campaigns' ),
                            value: 'all',
                        }
                    ] }
                    selectedOption={ campaigns }
                    onChange={  }
                    multiple
                />
                <PanelBody title={ __( 'Display Settings' ) }>
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
                    <PanelRow>
                        <ToggleControl
                            label={ __( 'Masonry layout' ) }
                            checked={ masonryLayout }
                            onChange={ this.toggleMasonryLayout }
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={ __( 'Responsive layout' ) }
                            checked={ responsiveLayout }
                            onChange={ this.toggleResponsiveLayout }
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        );
        
        return [
            inspectorControls,
            <p key="charitable-campaigns">
                { __( 'CAMPAIGNS' ) }
            </p>
        ];
    }
}

export default CharitableCampaignsBlock;