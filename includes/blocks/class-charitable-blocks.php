<?php
/**
 * Integrate Charitable into the Gutenberg post editor experience.
 *
 * @package   Charitable/Classes/Charitable_Blocks
 * @author    Eric Daams
 * @copyright Copyright (c) 2018, Studio 164a
 * @license   http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since     1.6.0
 * @version   1.6.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'Charitable_Blocks' ) ) :

	/**
	 * Charitable_Blocks
	 *
	 * @since 1.6.0
	 */
	class Charitable_Blocks {

		/**
		 * Create class object.
		 *
		 * @since 1.6.0
		 */
		public function __construct() {
			add_filter( 'charitable_default_campaign_fields', array( $this, 'change_campaign_fields_settings' ) );
			add_filter( 'charitable_default_campaign_sections', array( $this, 'add_extra_campaign_settings_sections' ) );
			// add_filter( 'charitable_campaign_meta_boxes', array( $this, 'setup_block_editor_meta_boxes' ), 9999 );
			add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );

			$this->register_blocks();
		}

		/**
		 * Enqueue block editor assets for Gutenberg integration.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		public function enqueue_block_editor_assets() {
			charitable()->registry()->get( 'assets' )->setup_assets();

			wp_enqueue_style( 'select2' );
			wp_enqueue_script(
				'charitable-blocks',
				charitable()->get_path( 'assets', false ) . 'js/charitable-blocks.js',
				array( 'wp-blocks', 'wp-element', 'selectWoo' ),
				charitable()->get_version()
			);
		}

		/**
		 * Register Gutenberg blocks.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		public function register_blocks() {
			register_block_type( 'charitable/donation-form', array(
				'attributes' => array(
					'campaign' => array(
						'type' => 'string',
					),
				),
				'render_callback' => array( $this, 'render_donation_form' ),
			) );

			register_block_type( 'charitable/donors', array(
				'attributes' => array(
					'number' => array(
						'type'    => 'number',
						'default' => 10,
					),
					'campaign' => array(
						'type' => 'string',
					),
					'orderBy' => array(
						'type'    => 'string',
						'default' => 'recent',
					),
					'distinctDonors' => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'orientation' => array(
						'type'    => 'string',
						'default' => 'horizontal',
					),
					'displayDonorAmount' => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'displayDonorAvatar' => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'displayDonorName' => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'displayDonorLocation' => array(
						'type'    => 'boolean',
						'default' => false,
					),
				),
				'render_callback' => array( $this, 'render_donors' ),
			) );

			register_block_type( 'charitable/campaigns', array(
				'attributes' => array(
					'category' => array(
						'type'    => 'string',
						'default' => '',
					),
					'order' => array(
						'type'    => 'string',
						'default' => 'DESC',
					),
					'orderBy' => array(
						'type'    => 'string',
						'default' => 'post_date',
					),
					'number' => array(
						'type'    => 'number',
						'default' => 10,
					),
					'columns' => array(
						'type'    => 'number',
						'default' => 2,
					),
					'masonryLayout' => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'responsiveLayout' => array(
						'type'    => 'boolean',
						'default' => true,
					),
				),
				'render_callback' => array( $this, 'render_campaigns' ),
			) );

			register_block_type( 'charitable/campaign-summary', array(
				'attributes' => array(
					'campaign' => array(
						'type' => 'string',
					),
				),
				'render_callback' => array( $this, 'render_campaign_summary' ),
			) );
		}

		/**
		 * Render the donation form.
		 *
		 * @since  1.6.0
		 *
		 * @param  array $attributes The block attributes.
		 *
		 * @return string Returns the donation form content.
		 */
		public function render_donation_form( $attributes ) {
			ob_start();

			charitable_template_donation_form( $attributes['campaign'] );

			return ob_get_clean();
		}

		/**
		 * Render the donors block.
		 *
		 * @since  1.6.0
		 *
		 * @param  array $attributes The block attributes.
		 *
		 * @return string Returns the donors block content.
		 */
		public function render_donors( $attributes ) {
			return Charitable_Donors_Shortcode::display( array(
				'number'          => $attributes['number'],
				'campaign'        => $attributes['campaign'],
				'orderby'         => $attributes['orderBy'],
				'distinct_donors' => $attributes['distinctDonors'],
				'orientation'     => $attributes['orientation'],
				'show_amount'     => $attributes['displayDonorAmount'],
				'show_avatar'     => $attributes['displayDonorAvatar'],
				'show_name'       => $attributes['displayDonorName'],
				'show_location'   => $attributes['displayDonorLocation'],
			) );
		}

		/**
		 * Display the campaigns block.
		 *
		 * @since  1.6.0
		 *
		 * @param  array $attributes The block attributes.
		 *
		 * @return string Returns the campaigns block content.
		 */
		public function render_campaigns( $attributes ) {
			// echo '<pre>';
			// var_dump( $attributes );
			// echo '</pre>';
			return Charitable_Campaigns_Shortcode::display( array(
				'number'     => $attributes['number'],
				'category'   => $attributes['category'],
				'orderby'    => $attributes['orderBy'],
				'order'      => $attributes['order'],
				'columns'    => $attributes['columns'],
				'masonry'    => $attributes['masonryLayout'],
				'responsive' => $attributes['responsiveLayout'],
			) );
		}

		/**
		 * Render the campaign summary block.
		 *
		 * @since  1.6.0
		 *
		 * @param  array $attributes The block attributes.
		 *
		 * @return string Returns the campaigns block content.
		 */
		public function render_campaign_summary( $attributes ) {
			ob_start();

			charitable_template_campaign_summary( charitable_get_campaign( $attributes['campaign'] ) );

			return ob_get_clean();
		}

		/**
		 * Add additional sections for the Campaign Settings meta box in the Gutenberg editor.
		 *
		 * @since  1.6.0
		 *
		 * @param  array $sections The full array of sections for all forms, including defaults.
		 * @return array
		 */
		public function add_extra_campaign_settings_sections( $sections ) {
			$sections['admin'] = array_merge(
				array(
					'campaign-general-settings' => __( 'General', 'charitable' ),
				),
				$sections['admin']
			);

			return $sections;
		}

		/**
		 * Change the settings of the Goal & End Date fields to place them inside the 'campaign-general-settings' block.
		 *
		 * @since  1.6.0
		 *
		 * @param  array $fields The multi-dimensional array of keys in $key => $args format.
		 * @return array
		 */
		public function change_campaign_fields_settings( $fields ) {
			$fields['goal']['admin_form'] = array_merge(
				$fields['goal']['admin_form'],
				array(
					'section'     => 'campaign-general-settings',
					'placeholder' => '&#8734;',
					'type'        => 'text',
				)
			);

			unset( $fields['goal']['admin_form']['view'] );

			$fields['end_date']['admin_form'] = array_merge(
				$fields['end_date']['admin_form'],
				array(
					'section' => 'campaign-general-settings',
				)
			);

			// unset( $fields['end_date']['admin_form']['view'] );

			error_log( var_export( $fields, true ) );

			return $fields;
		}

		/**
		 * Set up the campaign meta boxes in the block editor.
		 *
		 * @since  1.6.0
		 *
		 * @param  array $meta_boxes The meta boxes.
		 * @return array
		 */
		public function setup_block_editor_meta_boxes( $meta_boxes ) {
			$side_boxes = array(
				'campaign-goal',
				'campaign-end-date',
			);

			foreach ( $meta_boxes as $key => $box ) {
				if ( in_array( $box['id'], $side_boxes ) ) {
					$meta_boxes[ $key ]['section'] = 'side';
				}
			}

			return $meta_boxes;
		}
	}

endif;
