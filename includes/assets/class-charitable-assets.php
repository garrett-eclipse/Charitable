<?php
/**
 * Responsible for loading Charitable JS and CSS assets.
 *
 * @package   Charitable/Classes/Charitable_Assets
 * @author    Eric Daams
 * @copyright Copyright (c) 2018, Studio 164a
 * @license   http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since     1.6.0
 * @version   1.6.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'Charitable_Assets' ) ) :

	/**
	 * Charitable_Assets
	 *
	 * @since 1.6.0
	 */
	class Charitable_Assets {

		/**
		 * Whether the setup process has been run.
		 *
		 * @since 1.6.0
		 *
		 * @var   boolean
		 */
		private $setup;

		/**
		 * Whether debugging is enabled.
		 *
		 * @since 1.6.0
		 *
		 * @var   boolean
		 */
		private $debugging_enabled;

		/**
		 * Suffix to attach to scripts/styles.
		 *
		 * @since 1.6.0
		 *
		 * @var   string
		 */
		private $suffix;

		/**
		 * Version to attach to scripts/styles.
		 *
		 * @since 1.6.0
		 *
		 * @var   string
		 */
		private $version;

		/**
		 * URI of assets directory.
		 *
		 * @since 1.6.0
		 *
		 * @var   string
		 */
		private $assets_dir;

		/**
		 * Create class object.
		 *
		 * @since 1.6.0
		 */
		public function __construct() {
			$this->setup             = false;
			$this->debugging_enabled = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG;
			$this->suffix            = $this->debugging_enabled ? '' : '.min';
			$this->version           = $this->debugging_enabled ? '' : charitable()->get_version();
			$this->assets_dir        = charitable()->get_path( 'assets', false );

			add_action( 'wp_enqueue_scripts', array( $this, 'setup_assets' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'setup_admin_assets' ) );
		}

		/**
		 * Set up assets.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		public function setup_assets() {
			if ( $this->setup ) {
				return;
			}

			$this->setup_global_styles();
			$this->setup_global_scripts();

			if ( ! is_admin() ) {
				$this->setup_frontend_styles();
				$this->setup_frontend_scripts();
			}

			$this->setup = true;
		}

		/**
		 * Set up admin assets.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		public function setup_admin_assets() {
			$this->setup_admin_styles();
			$this->setup_admin_scripts();
		}

		/**
		 * Set up styles used both on the frontend and admin.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		private function setup_global_styles() {
			$stylesheets = array(
				'select2' => array(
					'src'     => 'css/charitable-select2' . $this->suffix . '.css',
					'deps'    => array(),
					'version' => $this->version,
				),
			);

			array_walk( $stylesheets, array( $this, 'register_stylesheet' ) );
		}

		/**
		 * Set up scripts used both on the frontend and admin.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		private function setup_global_scripts() {
			$scripts = array(
				'accounting' => array(
					'src'     => 'js/libraries/accounting' . $this->suffix . '.js',
					'deps'    => array( 'jquery-core' ),
					'version' => '0.4.2',
				),
				'selectWoo' => array(
					'src'     => 'js/libraries/selectWoo/selectWoo.full' . $this->suffix . '.js',
					'deps'    => array( 'jquery-core' ),
					'version' => '1.0.1',
				),
			);

			array_walk( $scripts, array( $this, 'register_script' ) );
		}

		/**
		 * Set up styles used only on the frontend.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		private function setup_frontend_styles() {
			$stylesheets = array(
				'charitable-styles' => array(
					'src'     => 'css/charitable' . $this->suffix . '.css',
					'deps'    => array(),
					'version' => $this->version,
				),
				'charitable-datepicker' => array(
					'src'     => 'css/charitable-datepicker' . $this->suffix . '.css',
					'deps'    => array(),
					'version' => $this->version,
				),
				'charitable-plup-styles' => array(
					'src'     => 'css/charitable-plupload-fields' . $this->suffix . '.css',
					'deps'    => array(),
					'version' => $version,
				),
			);

			if ( 'modal' == charitable_get_option( 'donation_form_display', 'separate_page' ) ) {
				$stylesheets['lean-modal-css'] = array(
					'src'     => 'css/modal' . $this->suffix . '.css',
					'deps'    => array(),
					'version' => $this->version,
				);
			}

			array_walk( $stylesheets, array( $this, 'register_stylesheet' ) );

			wp_enqueue_style( 'charitable-styles' );
		}

		/**
		 * Set up scripts used only on the frontend.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		private function setup_frontend_scripts() {
			$scripts = array(
				'charitable-script' => array(
					'src'     => 'js/charitable' . $this->suffix . '.js',
					'deps'    => wp_script_is( 'charitable-sessions', 'enqueued' )
						? array( 'charitable-sessions', 'accounting', 'jquery-core' )
						: array( 'accounting', 'jquery-core' ),
					'version' => $this->version,
				),
				'charitable-credit-card' => array(
					'src'     => 'js/charitable-credit-card' . $this->suffix . '.js',
					'deps'    => array( 'charitable-script' ),
					'version' => $this->version,
				),
				'charitable-plup-fields' => array(
					'src'     => 'js/charitable-plupload-fields' . $this->suffix . '.js',
					'deps'    => array( 'jquery-ui-sortable', 'wp-ajax-response', 'plupload-all' ),
					'version' => $version,
				),
			);

			if ( 'modal' == charitable_get_option( 'donation_form_display', 'separate_page' ) ) {
				$scripts['lean-modal'] = array(
					'src'     => 'js/libraries/leanModal' . $this->suffix . '.js',
					'deps'    => array( 'jquery-core' ),
					'version' => $this->version,
				);
			}

			array_walk( $scripts, array( $this, 'register_script' ) );

			wp_localize_script( 'charitable-script', 'CHARITABLE_VARS', $this->get_frontend_vars() );
			wp_localize_script( 'charitable-plup-fields', 'CHARITABLE_UPLOAD_VARS', $this->get_plupload_vars() );
		}

		/**
		 * Set up styles used only in the admin.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		private function setup_admin_styles() {
			$stylesheets = array(
				'charitable-admin-menu' => array(
					'src'     => 'css/charitable-admin-menu' . $this->suffix . '.css',
					'deps'    => array(),
					'version' => $this->version,
				),
				'charitable-admin-pages' => array(
					'src'     => 'css/charitable-admin-pages' . $this->suffix . '.css',
					'deps'    => array(),
					'version' => $this->version,
				),
				'charitable-admin' => array(
					'src'     => 'css/charitable-admin' . $this->suffix . '.css',
					'deps'    => array(),
					'version' => $this->version,
				),
			);

			array_walk( $stylesheets, array( $this, 'register_stylesheet' ) );

			wp_enqueue_style( 'charitable-admin-menu' );

			if ( charitable()->registry()->get( 'admin' )->is_charitable_screen() ) {
				wp_enqueue_style( 'charitable-admin' );
			}
		}

		/**
		 * Set up scripts used only in the admin.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		private function setup_admin_scripts() {
			$admin = charitable()->registry()->get( 'admin' );

			$scripts = array(
				'charitable-admin-notice' => array(
					'src'     => 'js/charitable-admin-notice' . $this->suffix . '.js',
					'deps'    => array( 'jquery-core' ),
					'version' => $this->version,
				),
				'charitable-admin-media' => array(
					'src'     => 'js/charitable-admin-media' . $this->suffix . '.js',
					'deps'    => array( 'jquery-core' ),
					'version' => $this->version,
				),
			);

			if ( $admin->is_charitable_screen() ) {
				$scripts = array_merge( $scripts, array(
					'charitable-admin' => array(
						'src'     => 'js/charitable-admin' . $this->suffix . '.js',
						'deps'    => $admin->is_screen( 'donation' )
							? array( 'jquery-ui-datepicker', 'jquery-ui-tabs', 'jquery-ui-sortable', 'accounting' )
							: array( 'jquery-ui-datepicker', 'jquery-ui-tabs', 'jquery-ui-sortable' ),
						'version' => $this->version,
					),
				) );
			}

			array_walk( $scripts, array( $this, 'register_script' ) );

			if ( $admin->is_charitable_screen() ) {
				wp_enqueue_script( 'charitable-admin' );
				wp_localize_script( 'charitable-admin', 'CHARITABLE', $this->get_admin_vars() );
			}
		}

		/**
		 * Register a script.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		private function register_script( $args, $handle ) {
			wp_register_script( $handle, $this->assets_dir . $args['src'], $args['deps'], $args['version'] );
		}

		/**
		 * Register a stylesheet.
		 *
		 * @since  1.6.0
		 *
		 * @return void
		 */
		private function register_stylesheet( $args, $handle ) {
			wp_register_style( $handle, $this->assets_dir . $args['src'], $args['deps'], $args['version'] );
		}

		/**
		 * Return the localized vars for the frontend script.
		 *
		 * @since  1.6.0
		 *
		 * @return array
		 */
		private function get_frontend_vars() {
			$currency   = charitable_get_currency_helper();
			$minimum    = charitable_get_minimum_donation_amount();
			$amount_msg = $minimum > 0
				? sprintf( __( 'You must donate at least %s.', 'charitable' ), charitable_format_money( $minimum ) )
				: sprintf( __( 'You must donate more than %s.', 'charitable' ), charitable_format_money( $minimum ) );

			/**
			 * Filter the Javascript vars array.
			 *
			 * @since 1.0.0
			 *
			 * @param array $vars The set of vars.
			 */
			return apply_filters( 'charitable_javascript_vars', array(
				'ajaxurl'                      => admin_url( 'admin-ajax.php' ),
				'loading_gif'                  => $assets_dir . '/images/charitable-loading.gif',
				'currency_format_num_decimals' => esc_attr( $currency->get_decimals() ),
				'currency_format_decimal_sep'  => esc_attr( $currency->get_decimal_separator() ),
				'currency_format_thousand_sep' => esc_attr( $currency->get_thousands_separator() ),
				'currency_format'              => esc_attr( $currency->get_accounting_js_format() ), // For accounting.js.
				'minimum_donation'             => $minimum,
				'error_invalid_amount'         => $amount_msg,
				'error_required_fields'        => __( 'Please fill out all required fields.', 'charitable' ),
				'error_unknown'                => __( 'Your donation could not be processed. Please reload the page and try again.', 'charitable' ),
				'error_invalid_cc_number'      => __( 'The credit card passed is not valid.', 'charitable' ),
				'error_invalid_cc_expiry'      => __( 'The credit card expiry date is not valid.', 'charitable' ),
			) );
		}

		/**
		 * The vars used for picture fields.
		 *
		 * @since  1.6.0
		 *
		 * @return array
		 */
		private function get_plupload_vars() {
			return array(
				'remove_image'            => _x( 'Remove', 'remove image button text', 'charitable' ),
				'max_file_uploads_single' => __( 'You can only upload %d file', 'charitable' ),
				'max_file_uploads_plural' => __( 'You can only upload a maximum of %d files', 'charitable' ),
				'max_file_size'           => __( '%1$s exceeds the max upload size of %2$s', 'charitable' ),
				'upload_problem'          => __( '%s failed to upload. Please try again.', 'charitable' ),
			);
		}

		/**
		 * The vars used in the admin.
		 *
		 * @since  1.6.0
		 *
		 * @return array
		 */
		private function get_admin_vars() {
			$vars = array(
				'suggested_amount_description_placeholder' => __( 'Optional Description', 'charitable' ),
				'suggested_amount_placeholder'             => __( 'Amount', 'charitable' ),
			);

			if ( charitable()->registry()->get( 'admin' )->is_screen( 'donation' ) ) {
				$currency = charitable_get_currency_helper();
				$vars     = array_merge( $vars, array(
					'currency_format_num_decimals' => esc_attr( $currency->get_decimals() ),
					'currency_format_decimal_sep'  => esc_attr( $currency->get_decimal_separator() ),
					'currency_format_thousand_sep' => esc_attr( $currency->get_thousands_separator() ),
					'currency_format'              => esc_attr( $currency->get_accounting_js_format() ),
				) );
			}

			/**
			 * Filter the admin Javascript vars.
			 *
			 * @since 1.0.0
			 *
			 * @param array $vars The vars.
			 */
			return apply_filters( 'charitable_localized_javascript_vars', $vars );
		}
	}

endif;
