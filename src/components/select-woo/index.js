/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
const {  InspectorControls } = wp.blocks;
const { BaseControl } = InspectorControls;
const { withInstanceId } = wp.components;

function SelectWooControl( { label, help, instanceId, onChange, options = [], ...props } ) {
	const id = 'inspector-select-control-' + instanceId;
	const onChangeValue = ( event ) => onChange( event.target.value );

	// Disable reason: A select with an onchange throws a warning

	/* eslint-disable jsx-a11y/no-onchange */
	return ! isEmpty( options ) && (
		<BaseControl label={ label } id={ id } help={ help }>
			<select
				id={ id }
				className="blocks-select-control__input"
				onChange={ onChangeValue }
				aria-describedby={ !! help ? id + '__help' : undefined }
				{ ...props }
			>
				{ options.map( ( option ) =>
					<option
						key={ option.value }
						value={ option.value }
					>
						{ option.label }
					</option>
				) }
			</select>
		</BaseControl>
	);
	/* eslint-enable jsx-a11y/no-onchange */
}

export default withInstanceId( SelectControl );
