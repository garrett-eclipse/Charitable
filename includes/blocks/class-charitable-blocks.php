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
			wp_enqueue_script(
				'charitable-blocks',
				charitable()->get_path( 'assets', false ) . 'js/charitable-blocks.js',
				array( 'wp-blocks', 'wp-element' )
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
			// register_block_type( 'core/latest-posts', array(
			// 	'attributes'      => array(
			// 		'categories'      => array(
			// 			'type' => 'string',
			// 		),
			// 		'postsToShow'     => array(
			// 			'type'    => 'number',
			// 			'default' => 5,
			// 		),
			// 		'displayPostDate' => array(
			// 			'type'    => 'boolean',
			// 			'default' => false,
			// 		),
			// 		'layout'          => array(
			// 			'type'    => 'string',
			// 			'default' => 'list',
			// 		),
			// 		'columns'         => array(
			// 			'type'    => 'number',
			// 			'default' => 3,
			// 		),
			// 		'align'           => array(
			// 			'type'    => 'string',
			// 			'default' => 'center',
			// 		),
			// 		'order'           => array(
			// 			'type'    => 'string',
			// 			'default' => 'desc',
			// 		),
			// 		'orderBy'         => array(
			// 			'type'    => 'string',
			// 			'default' => 'date',
			// 		),
			// 	),
			// 	'render_callback' => 'gutenberg_render_block_core_latest_posts',
			// ) );
			register_block_type( 'charitable/donation-form', array(
				'attributes' => array(
					'campaign' => array(
						'type' => 'string',
					),
				),
				'render_callback' => array( $this, 'render_donation_form' ),
			) );

			// echo '<pre>'; var_dump( $ret ); echo '</pre>';
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
	}

endif;
