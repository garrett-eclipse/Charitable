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
				array( 'wp-blocks', 'wp-element', 'selectWoo' )
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
			if ( ! function_exists( 'charitable_template_donation_form' ) ) {
				require_once( charitable()->get_path( 'includes' ) . 'public/charitable-template-functions.php' );
			}

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
	}

endif;
